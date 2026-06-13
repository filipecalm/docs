const fs = require('fs');
const path = require('path');
const { readExpectedProjectId } = require('./adminCli.cjs');

const LOCAL_EXPORTS_DIR = path.join(__dirname, '..', '..', 'local', 'patient-diet-exports');

function usage() {
  console.error(`
Grava resposta da IA (JSON) em diets/ + patients/ no Firestore.

Uso:
  node scripts/apply-diet-json-to-firestore.cjs --file <json> --uid <patient_uid> --diet-id <diet_doc_id> [--level "..."] [--name "..."]

JSON em: local/patient-diet-exports/  (gitignored)

Opcional no JSON:
  "_meta": { "patientUid", "dietId", "level", "patientName" }
`);
}

function parseArgs(argv) {
  const opts = { file: '', uid: '', dietId: '', level: '', name: '' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file') opts.file = argv[++i] || '';
    else if (a === '--uid') opts.uid = argv[++i] || '';
    else if (a === '--diet-id') opts.dietId = argv[++i] || '';
    else if (a === '--level') opts.level = argv[++i] || '';
    else if (a === '--name') opts.name = argv[++i] || '';
    else if (a === '--help' || a === '-h') {
      usage();
      process.exit(0);
    }
  }
  return opts;
}

function resolveFilePath(fileArg) {
  if (!fileArg) return '';
  if (path.isAbsolute(fileArg)) return fileArg;
  const fromCwd = path.resolve(process.cwd(), fileArg);
  if (fs.existsSync(fromCwd)) return fromCwd;
  const fromExports = path.join(LOCAL_EXPORTS_DIR, fileArg);
  if (fs.existsSync(fromExports)) return fromExports;
  return fromCwd;
}

function getFirebaseCliAccessToken() {
  const cfgPath = path.join(
    process.env.USERPROFILE || process.env.HOME || '',
    '.config',
    'configstore',
    'firebase-tools.json'
  );
  const token = JSON.parse(fs.readFileSync(cfgPath, 'utf8')).tokens?.access_token;
  if (!token) throw new Error('Sem firebase login. Corre: firebase login');
  return token;
}

function encodeValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map((v) => encodeValue(v)) } };
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

async function firestorePatch(token, projectId, collection, id, data) {
  const mask = Object.keys(data)
    .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
    .join('&');
  const url = `${firestoreBase(projectId)}/${collection}/${id}?${mask}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(encodeDocument(data)),
  });
  if (!res.ok) throw new Error(`PATCH ${collection}/${id}: ${res.status} ${await res.text()}`);
}

function normalizeSupplements(items) {
  return (items || []).map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const nome = item.nome || item.name || '';
      const desc = item.descricao || item.description || '';
      return desc ? `${nome}: ${desc}` : String(nome);
    }
    return String(item);
  });
}

function normalizeMeals(meals) {
  return (meals || []).map((meal) => ({
    horario: String(meal.horario ?? ''),
    nome: String(meal.nome ?? ''),
    alimentos: (meal.alimentos || []).map(String),
    ...(meal.substituicoes?.length
      ? { substituicoes: meal.substituicoes.map(String) }
      : {}),
  }));
}

function normalizeShoppingList(items) {
  return (items || []).map((item) => ({
    item: String(item.item ?? ''),
    quantity: String(item.quantity ?? ''),
    ...(item.category ? { category: String(item.category) } : {}),
    ...(item.notes ? { notes: String(item.notes) } : {}),
  }));
}

function buildDietUpdate(ai, uid, level, now) {
  return {
    nome: ai.nome,
    sexo: ai.sexo,
    idade: String(ai.idade ?? ''),
    altura: String(ai.altura ?? ''),
    peso: String(ai.peso ?? ''),
    objetivo: ai.objetivo,
    level: level || '',
    clinical_history: ai.clinical_history || '',
    blood_pressure: ai.blood_pressure || '',
    fasting_glucose: ai.fasting_glucose || '',
    hba1c: ai.hba1c || '',
    ldl: ai.ldl || '',
    hdl: ai.hdl || '',
    triglycerides: ai.triglycerides || '',
    tsh: ai.tsh || '',
    vitamin_d: ai.vitamin_d || '',
    meal_count: String(ai.meal_count ?? ''),
    workout_time: ai.workout_time || '',
    routine: ai.routine || '',
    dietary_preferences: ai.dietary_preferences || [],
    allergies: ai.allergies || [],
    intolerances: ai.intolerances || [],
    avoided_foods: ai.avoided_foods || [],
    orientacoes: (ai.orientacoes || []).map(String),
    suplementos: normalizeSupplements(ai.suplementos),
    refeicoes: normalizeMeals(ai.refeicoes),
    shoppingList: normalizeShoppingList(ai.shoppingList),
    modifiedAt: now,
    modifiedBy: uid,
    active: true,
  };
}

function buildPatientUpdate(ai, uid, userName, level, now) {
  return {
    user_id: uid,
    patient_id: uid,
    name: userName || ai.nome,
    age: String(ai.idade ?? ''),
    gender: ai.sexo || '',
    height: String(ai.altura ?? ''),
    weight: String(ai.peso ?? ''),
    level: level || '',
    objective: ai.objetivo || '',
    clinical_history: ai.clinical_history || '',
    routine: ai.routine || '',
    dietary_preferences: ai.dietary_preferences || [],
    allergies: ai.allergies || [],
    intolerances: ai.intolerances || [],
    avoided_foods: ai.avoided_foods || [],
    meal_count: String(ai.meal_count ?? ''),
    workout_time: ai.workout_time || '',
    blood_pressure: ai.blood_pressure || '',
    fasting_glucose: ai.fasting_glucose || '',
    hba1c: ai.hba1c || '',
    ldl: ai.ldl || '',
    hdl: ai.hdl || '',
    triglycerides: ai.triglycerides || '',
    tsh: ai.tsh || '',
    vitamin_d: ai.vitamin_d || '',
    modifiedAt: now,
    modifiedBy: uid,
    active: true,
  };
}

async function main() {
  const opts = parseArgs(process.argv);
  const jsonPath = resolveFilePath(opts.file);
  if (!jsonPath || !fs.existsSync(jsonPath)) {
    usage();
    console.error('Ficheiro JSON em falta ou inválido:', opts.file || '(vazio)');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const meta = raw._meta && typeof raw._meta === 'object' ? raw._meta : {};
  const ai = { ...raw };
  delete ai._meta;

  const uid = (opts.uid || meta.patientUid || '').trim();
  const dietId = (opts.dietId || meta.dietId || '').trim();
  const level = (opts.level || meta.level || '').trim();
  const patientName = (opts.name || meta.patientName || ai.nome || '').trim();

  if (!uid || !dietId) {
    usage();
    console.error('--uid e --diet-id são obrigatórios (ou _meta no JSON).');
    process.exit(1);
  }

  const projectId = readExpectedProjectId();
  const token = getFirebaseCliAccessToken();
  const now = new Date().toISOString();

  const dietUpdate = buildDietUpdate(ai, uid, level, now);
  const patientUpdate = buildPatientUpdate(ai, uid, patientName, level, now);

  await firestorePatch(token, projectId, 'diets', dietId, dietUpdate);
  await firestorePatch(token, projectId, 'patients', uid, patientUpdate);

  console.log('OK');
  console.log(`  diets/${dietId}`);
  console.log(`    refeicoes: ${dietUpdate.refeicoes.length}`);
  console.log(`    orientacoes: ${dietUpdate.orientacoes.length}`);
  console.log(`    suplementos: ${dietUpdate.suplementos.length}`);
  console.log(`    shoppingList: ${dietUpdate.shoppingList.length}`);
  console.log(`  patients/${uid}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
