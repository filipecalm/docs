const {
  initAdmin,
  handleCliError,
  isCredentialError,
  isIdentityToolkitDisabled,
  printIdentityToolkitHelp,
} = require('./adminCli.cjs');

const CONTINUE_URL = 'https://dietos.com.br';
const DEFAULT_PASSWORD = 'TesteDietOS123!';

function usage() {
  console.error(`
Cria utilizador de teste (Auth + Firestore users/{uid}).

Uso:
  npm run create:test-user -- --email teste@example.com
  npm run create:test-user -- teste@example.com [senha] [nome] [patient|nutritionist]

Opções:
  --email <e-mail>       E-mail (obrigatório se não passar posicional)
  --password <senha>     Senha (default: ${DEFAULT_PASSWORD})
  --name <nome>          Nome (default: Teste DietOS)
  --role patient|nutritionist   (default: patient)
  --verified             Cria já com emailVerified=true
  --force                Apaga Auth + Firestore se o e-mail já existir
  --link-only            Só gera link de verificação (utilizador tem de existir)

Credenciais: service-account.json na raiz do repo (ver verify-user / adminCli).
`);
}

function parseArgs(argv) {
  const opts = {
    email: '',
    password: DEFAULT_PASSWORD,
    name: 'Teste DietOS',
    role: 'patient',
    verified: false,
    force: false,
    linkOnly: false,
  };

  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      return { help: true, opts };
    }
    if (arg === '--verified') {
      opts.verified = true;
      continue;
    }
    if (arg === '--force') {
      opts.force = true;
      continue;
    }
    if (arg === '--link-only') {
      opts.linkOnly = true;
      continue;
    }
    if (arg === '--email') {
      opts.email = (argv[++i] || '').trim().toLowerCase();
      continue;
    }
    if (arg === '--password') {
      opts.password = argv[++i] || DEFAULT_PASSWORD;
      continue;
    }
    if (arg === '--name') {
      opts.name = argv[++i] || opts.name;
      continue;
    }
    if (arg === '--role') {
      opts.role = (argv[++i] || 'patient').trim();
      continue;
    }
    positional.push(arg);
  }

  if (!opts.email && positional[0]) {
    opts.email = positional[0].trim().toLowerCase();
  }
  if (positional[1]) opts.password = positional[1];
  if (positional[2]) opts.name = positional[2];
  if (positional[3]) opts.role = positional[3].trim();

  if (opts.role !== 'patient' && opts.role !== 'nutritionist') {
    console.error('Role inválida:', opts.role);
    process.exit(1);
  }

  return { help: false, opts };
}

async function deleteExistingUser(admin, email, force) {
  const auth = admin.auth();
  let existing;
  try {
    existing = await auth.getUserByEmail(email);
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
    if (code === 'auth/user-not-found') {
      return;
    }
    throw err;
  }

  if (!force) {
    console.error('E-mail já existe:', email);
    console.error('Usa --force para apagar e recriar, ou --link-only para só gerar link.');
    process.exit(1);
  }

  await admin.firestore().doc(`users/${existing.uid}`).delete().catch(() => {});
  await auth.deleteUser(existing.uid);
  console.log('Utilizador anterior apagado:', existing.uid);
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help) {
    usage();
    process.exit(0);
  }

  const { opts } = parsed;
  if (!opts.email || !opts.email.includes('@')) {
    usage();
    process.exit(1);
  }

  const { admin, projectId, keyPath, expectedProjectId } = initAdmin();
  if (keyPath) {
    console.log('Projeto:   ', projectId);
    console.log('Credenciais:', keyPath);
  }

  const auth = admin.auth();
  const db = admin.firestore();

  try {
    if (opts.linkOnly) {
      const user = await auth.getUserByEmail(opts.email);
      const link = await auth.generateEmailVerificationLink(opts.email, {
        url: CONTINUE_URL,
      });
      console.log('');
      console.log('UID:      ', user.uid);
      console.log('E-mail:   ', user.email);
      console.log('Verificado:', user.emailVerified ? 'sim' : 'não');
      console.log('');
      console.log('Link de verificação:');
      console.log(link);
      return;
    }

    await deleteExistingUser(admin, opts.email, opts.force);

    const created = await auth.createUser({
      email: opts.email,
      password: opts.password,
      displayName: opts.name,
      emailVerified: opts.verified,
    });

    const now = new Date().toISOString();
    const userData = {
      id: created.uid,
      name: opts.name,
      email: opts.email,
      role: opts.role,
      createdAt: now,
      modifiedAt: null,
    };

    await db.doc(`users/${created.uid}`).set(userData);

    let verificationLink = null;
    if (!opts.verified) {
      verificationLink = await auth.generateEmailVerificationLink(opts.email, {
        url: CONTINUE_URL,
      });
    }

    console.log('');
    console.log('OK — utilizador de teste criado');
    console.log('UID:      ', created.uid);
    console.log('E-mail:   ', opts.email);
    console.log('Senha:    ', opts.password);
    console.log('Nome:     ', opts.name);
    console.log('Role:     ', opts.role);
    console.log('Verificado:', opts.verified ? 'sim' : 'não');
    console.log('');
    console.log('Login no app com e-mail + senha acima.');
    if (verificationLink) {
      console.log('');
      console.log('Link de verificação (abre no browser para testar):');
      console.log(verificationLink);
    }
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
    if (code === 'auth/email-already-exists') {
      console.error('E-mail já existe. Usa --force ou --link-only.');
      process.exit(1);
    }
    if (code === 'auth/user-not-found' && opts.linkOnly) {
      console.error('Utilizador não encontrado:', opts.email);
      process.exit(1);
    }
    handleCliError(err, projectId, usage, expectedProjectId);
  }
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
