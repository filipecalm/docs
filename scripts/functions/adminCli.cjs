const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function readExpectedProjectId() {
  try {
    const firebasercPath = path.join(__dirname, '..', '..', '.firebaserc');
    const firebaserc = JSON.parse(fs.readFileSync(firebasercPath, 'utf8'));
    return firebaserc.projects?.default || 'minha-dieta-67b3f';
  } catch {
    return 'minha-dieta-67b3f';
  }
}

function findServiceAccountPath() {
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (fromEnv && fs.existsSync(fromEnv)) {
    return fromEnv;
  }

  const candidates = [
    path.join(__dirname, '..', '..', 'service-account.json'),
    path.join(__dirname, '..', 'service-account.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function printWrongProjectHelp(foundProjectId, expectedProjectId) {
  console.error('service-account.json é do projeto errado.');
  console.error('  Encontrado:', foundProjectId);
  console.error('  Esperado: ', expectedProjectId, '(app DietOS / .firebaserc)');
  console.error('');
  console.error(
    `Firebase Console → ${expectedProjectId} → Project settings → Service accounts → Generate new private key`
  );
  console.error('Substitui D:\\Projetos\\DietOS\\service-account.json pelo ficheiro descarregado.');
}

function initAdmin() {
  const expectedProjectId = readExpectedProjectId();

  if (admin.apps.length) {
    return {
      admin,
      projectId: admin.app().options.projectId,
      keyPath: findServiceAccountPath(),
      expectedProjectId,
    };
  }

  const keyPath = findServiceAccountPath();
  if (keyPath) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    const projectId = serviceAccount.project_id;
    if (!projectId) {
      console.error('service-account.json sem project_id.');
      process.exit(1);
    }
    if (projectId !== expectedProjectId) {
      printWrongProjectHelp(projectId, expectedProjectId);
      process.exit(1);
    }
    const expectedEmailSuffix = `@${expectedProjectId}.iam.gserviceaccount.com`;
    if (!serviceAccount.client_email?.endsWith(expectedEmailSuffix)) {
      console.error('service-account.json inconsistente (chave de outro projeto).');
      console.error('  project_id:  ', projectId);
      console.error('  client_email:', serviceAccount.client_email || '(vazio)');
      console.error('');
      console.error(
        'Não edites project_id à mão. Gera nova chave em Firebase Console → minha-dieta-67b3f → Service accounts.'
      );
      console.error('O client_email tem de terminar em @minha-dieta-67b3f.iam.gserviceaccount.com');
      process.exit(1);
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
    return { admin, projectId, keyPath, expectedProjectId };
  }

  admin.initializeApp({ projectId: expectedProjectId });
  return { admin, projectId: expectedProjectId, keyPath: null, expectedProjectId };
}

function isCredentialError(err) {
  const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
  const message =
    err && typeof err === 'object' && 'message' in err ? String(err.message) : String(err);
  return (
    code === 'app/invalid-credential' ||
    /Could not load the default credentials/i.test(message) ||
    /invalid_grant/i.test(message)
  );
}

function isIdentityToolkitDisabled(err) {
  const message =
    err && typeof err === 'object' && 'message' in err ? String(err.message) : String(err);
  return (
    /Identity Toolkit API has not been used/i.test(message) ||
    (/identitytoolkit\.googleapis\.com/i.test(message) &&
      /SERVICE_DISABLED|accessNotConfigured/i.test(message))
  );
}

function isServiceAccountPermissionError(err) {
  const message =
    err && typeof err === 'object' && 'message' in err ? String(err.message) : String(err);
  return (
    /USER_PROJECT_DENIED/i.test(message) ||
    /serviceusage\.serviceUsageConsumer/i.test(message) ||
    /does not have required permission to use project/i.test(message)
  );
}

function printServiceAccountPermissionHelp(expectedProjectId) {
  console.error('');
  console.error('A conta de serviço não tem permissão neste projeto (ou a chave é de outro projeto).');
  console.error('');
  console.error('1. Gera chave NOVA (não edites project_id no JSON):');
  console.error(
    `   Firebase Console → ${expectedProjectId} → Project settings → Service accounts → Generate new private key`
  );
  console.error('2. client_email deve ser algo como:');
  console.error(`   firebase-adminsdk-xxxxx@${expectedProjectId}.iam.gserviceaccount.com`);
  console.error('3. Substitui service-account.json na raiz do repo.');
}

function printIdentityToolkitHelp(projectId) {
  const url = projectId
    ? `https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=${projectId}`
    : 'https://console.developers.google.com/apis/library/identitytoolkit.googleapis.com';
  console.error('');
  console.error('Identity Toolkit API desativada neste projeto.');
  console.error('Ativa aqui e espera ~1 min:', url);
}

function handleCliError(err, projectId, usageFn, expectedProjectId) {
  if (isCredentialError(err)) {
    console.error('Sem credenciais Admin SDK válidas.');
    console.error('');
    usageFn();
    process.exit(1);
  }
  if (isServiceAccountPermissionError(err)) {
    printServiceAccountPermissionHelp(expectedProjectId || projectId);
    process.exit(1);
  }
  if (isIdentityToolkitDisabled(err)) {
    printIdentityToolkitHelp(projectId);
    process.exit(1);
  }
  throw err;
}

module.exports = {
  readExpectedProjectId,
  initAdmin,
  isCredentialError,
  isIdentityToolkitDisabled,
  isServiceAccountPermissionError,
  printIdentityToolkitHelp,
  printServiceAccountPermissionHelp,
  handleCliError,
};
