const {
  initAdmin,
  handleCliError,
  isCredentialError,
  isIdentityToolkitDisabled,
  printIdentityToolkitHelp,
} = require('./adminCli.cjs');

function usage() {
  console.error(`
Ativa manualmente a conta (emailVerified=true) no Firebase Auth.

Uso:
  node functions/scripts/verify-user.cjs <email-ou-uid>
  npm run verify:user -- user@example.com

Credenciais: service-account.json na raiz (projeto minha-dieta-67b3f, ver .firebaserc).
`);
}

async function resolveUser(auth, identifier) {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) {
    return auth.getUserByEmail(trimmed.toLowerCase());
  }
  return auth.getUser(trimmed);
}

async function main() {
  const identifier = process.argv[2];
  if (!identifier || identifier === '--help' || identifier === '-h') {
    usage();
    process.exit(identifier ? 0 : 1);
  }

  const { admin, projectId, keyPath, expectedProjectId } = initAdmin();
  if (keyPath) {
    console.log('Projeto:   ', projectId);
    console.log('Credenciais:', keyPath);
  }

  const auth = admin.auth();

  let user;
  try {
    user = await resolveUser(auth, identifier);
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
    if (code === 'auth/user-not-found') {
      console.error('Utilizador não encontrado:', identifier);
      process.exit(1);
    }
    handleCliError(err, projectId, usage, expectedProjectId);
  }

  console.log('UID:      ', user.uid);
  console.log('E-mail:   ', user.email ?? '(sem e-mail)');
  console.log('Verificado:', user.emailVerified ? 'sim' : 'não');

  if (user.emailVerified) {
    console.log('');
    console.log('Conta já estava verificada. Nada a fazer.');
    process.exit(0);
  }

  try {
    await auth.updateUser(user.uid, { emailVerified: true });
  } catch (err) {
    handleCliError(err, projectId, usage, expectedProjectId);
  }

  const updated = await auth.getUser(user.uid);
  console.log('');
  console.log('OK — conta ativada. emailVerified:', updated.emailVerified);
}

main().catch((err) => {
  if (isCredentialError(err)) {
    console.error('Sem credenciais Admin SDK válidas.');
    usage();
    process.exit(1);
  }
  if (isIdentityToolkitDisabled(err)) {
    printIdentityToolkitHelp();
    process.exit(1);
  }
  console.error('Erro:', err.message || err);
  process.exit(1);
});
