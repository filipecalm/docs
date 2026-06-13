const fs = require('fs');
const path = require('path');
const { readExpectedProjectId } = require('./adminCli.cjs');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const LOCAL_EXPORTS_DIR = path.join(__dirname, '..', '..', 'local', 'patient-diet-exports');

function usage() {
  console.error(`
Gera dieta via Gemini e grava em Firestore (diets + patients).

Uso:
  node scripts/backfill-patient-diet-from-ai.cjs --uid <patient_uid> --diet-id <diet_doc_id>
  node scripts/backfill-patient-diet-from-ai.cjs --uid <uid> --diet-id <id> --dry-run

Exports locais (gitignored): local/patient-diet-exports/

Requer GEMINI_API_KEY (functions/.env, ambiente, ou Secret Manager).
Firestore: token do firebase login (firebase-tools.json).
`);
}

function parseArgs(argv) {
  const opts = {
    uid: '',
    dietId: '',
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--uid') opts.uid = argv[++i] || opts.uid;
    else if (a === '--diet-id') opts.dietId = argv[++i] || opts.dietId;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--help' || a === '-h') {
      usage();
      process.exit(0);
    }
  }
  return opts;
}

function getFirebaseCliAccessToken() {
  const cfgPath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.config', 'configstore', 'firebase-tools.json');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const token = cfg.tokens?.access_token;
  if (!token) {
    throw new Error('Sem access_token. Corre: firebase login');
  }
  return token;
}

function decodeValue(v) {
  if (!v || typeof v !== 'object') return v;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.nullValue !== undefined) return null;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.arrayValue) return (v.arrayValue.values || []).map(decodeValue);
  if (v.mapValue) return decodeFields(v.mapValue.fields || {});
  return v;
}

function decodeFields(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields || {})) out[k] = decodeValue(v);
  return out;
}

function encodeValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map((item) => encodeValue(item)) } };
  }
  if (typeof value === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(value)) fields[k] = encodeValue(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function encodeDocument(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = encodeValue(v);
  return { fields };
}

function firestoreBase(projectId) {
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

async function firestoreGet(token, projectId, collection, id) {
  const url = `${firestoreBase(projectId)}/${collection}/${id}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore GET ${collection}/${id}: ${res.status} ${await res.text()}`);
  const doc = await res.json();
  return decodeFields(doc.fields);
}

async function firestorePatch(token, projectId, collection, id, data) {
  const mask = Object.keys(data).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const url = `${firestoreBase(projectId)}/${collection}/${id}?${mask}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(encodeDocument(data)),
  });
  if (!res.ok) throw new Error(`Firestore PATCH ${collection}/${id}: ${res.status} ${await res.text()}`);
}

async function firestoreSet(token, projectId, collection, id, data) {
  const url = `${firestoreBase(projectId)}/${collection}/${id}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(encodeDocument(data)),
  });
  if (!res.ok) throw new Error(`Firestore SET ${collection}/${id}: ${res.status} ${await res.text()}`);
}

function payloadFromDietDoc(diet, uid, userName) {
  return {
    patient_id: uid,
    name: diet.nome || userName || '',
    weight: String(diet.peso || ''),
    height: String(diet.altura || ''),
    age: String(diet.idade || ''),
    clinical_history: diet.clinical_history || '',
    gender: diet.sexo || '',
    objective: diet.objetivo || '',
    level: diet.level || '',
    routine: diet.routine || '',
    fasting_glucose: diet.fasting_glucose || '',
    blood_pressure: diet.blood_pressure || '',
    hba1c: diet.hba1c || '',
    ldl: diet.ldl || '',
    hdl: diet.hdl || '',
    triglycerides: diet.triglycerides || '',
    tsh: diet.tsh || '',
    vitamin_d: diet.vitamin_d || '',
    meal_count: diet.meal_count || '',
    workout_time: diet.workout_time || '',
    dietary_preferences: diet.dietary_preferences || [],
    allergies: diet.allergies || [],
    intolerances: diet.intolerances || [],
    avoided_foods: diet.avoided_foods || [],
    adjustmentPrompt: diet.adjustmentPrompt || '',
    parentPlanId: diet.parentPlanId || null,
    language: 'pt',
  };
}

function patientDocFromDiet(diet, uid, userName, now, existingCreatedAt) {
  return {
    user_id: uid,
    patient_id: uid,
    name: userName || diet.nome || '',
    age: String(diet.idade || ''),
    clinical_history: diet.clinical_history || '',
    gender: diet.sexo || '',
    height: String(diet.altura || ''),
    level: diet.level || '',
    weight: String(diet.peso || ''),
    objective: diet.objetivo || '',
    routine: diet.routine || '',
    dietary_preferences: diet.dietary_preferences || [],
    allergies: diet.allergies || [],
    intolerances: diet.intolerances || [],
    avoided_foods: diet.avoided_foods || [],
    meal_count: diet.meal_count || '',
    workout_time: diet.workout_time || '',
    blood_pressure: diet.blood_pressure || '',
    fasting_glucose: diet.fasting_glucose || '',
    hba1c: diet.hba1c || '',
    ldl: diet.ldl || '',
    hdl: diet.hdl || '',
    triglycerides: diet.triglycerides || '',
    tsh: diet.tsh || '',
    vitamin_d: diet.vitamin_d || '',
    createdAt: existingCreatedAt || now,
    modifiedAt: now,
    createdBy: uid,
    modifiedBy: uid,
    active: true,
  };
}

async function main() {
  const opts = parseArgs(process.argv);
  if (!opts.uid?.trim() || !opts.dietId?.trim()) {
    usage();
    console.error('--uid e --diet-id são obrigatórios.');
    process.exit(1);
  }
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error('GEMINI_API_KEY em falta. Ex.: firebase functions:secrets:access GEMINI_API_KEY');
    process.exit(1);
  }

  const projectId = readExpectedProjectId();
  const token = getFirebaseCliAccessToken();
  const now = new Date().toISOString();

  const [user, diet] = await Promise.all([
    firestoreGet(token, projectId, 'users', opts.uid),
    firestoreGet(token, projectId, 'diets', opts.dietId),
  ]);

  if (!user) {
    console.error('Utilizador não encontrado:', opts.uid);
    process.exit(1);
  }
  if (!diet) {
    console.error('Dieta não encontrada:', opts.dietId);
    process.exit(1);
  }
  if (diet.patient_id !== opts.uid) {
    console.error('A dieta não pertence a este patient_id.');
    process.exit(1);
  }

  const payload = payloadFromDietDoc(diet, opts.uid, user.name);
  console.log('A gerar via Gemini...', { uid: opts.uid, dietId: opts.dietId, name: payload.name });

  const { CreateNutritionService } = require('../lib/services/CreateNutritionService');
  const service = new CreateNutritionService();
  const result = await service.execute(payload);
  const data = result?.data;

  if (!data?.refeicoes?.length) {
    console.error('Resposta da IA sem refeições:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('IA OK:', {
    refeicoes: data.refeicoes.length,
    orientacoes: data.orientacoes?.length ?? 0,
    suplementos: data.suplementos?.length ?? 0,
    shoppingList: data.shoppingList?.length ?? 0,
  });

  if (opts.dryRun) {
    console.log(JSON.stringify({ data }, null, 2));
    return;
  }

  const dietUpdate = {
    refeicoes: data.refeicoes || [],
    suplementos: data.suplementos || [],
    orientacoes: data.orientacoes || [],
    shoppingList: data.shoppingList || [],
    dietary_preferences: payload.dietary_preferences,
    allergies: payload.allergies,
    intolerances: payload.intolerances,
    avoided_foods: payload.avoided_foods,
    meal_count: payload.meal_count,
    workout_time: payload.workout_time,
    routine: payload.routine,
    clinical_history: payload.clinical_history,
    blood_pressure: payload.blood_pressure,
    fasting_glucose: payload.fasting_glucose,
    hba1c: payload.hba1c,
    ldl: payload.ldl,
    hdl: payload.hdl,
    triglycerides: payload.triglycerides,
    tsh: payload.tsh,
    vitamin_d: payload.vitamin_d,
    sexo: payload.gender,
    idade: payload.age,
    altura: payload.height,
    peso: payload.weight,
    level: payload.level,
    objetivo: payload.objective,
    nome: payload.name,
    version: diet.version || 1,
    parentPlanId: payload.parentPlanId,
    adjustmentPrompt: payload.adjustmentPrompt || '',
    modifiedAt: now,
    modifiedBy: opts.uid,
    active: true,
  };

  const existingPatient = await firestoreGet(token, projectId, 'patients', opts.uid);
  const patientPayload = patientDocFromDiet(
    diet,
    opts.uid,
    user.name,
    now,
    existingPatient?.createdAt
  );

  await firestorePatch(token, projectId, 'diets', opts.dietId, dietUpdate);
  await firestoreSet(token, projectId, 'patients', opts.uid, patientPayload);

  console.log('Firestore atualizado.');
  console.log(`  diets/${opts.dietId} → active=true, refeicoes=${data.refeicoes.length}`);
  console.log(`  patients/${opts.uid} → ${existingPatient ? 'atualizado' : 'criado'}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
