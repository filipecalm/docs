const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const secretLocal = path.join(__dirname, '..', '.secret.local');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 1) continue;
    const key = t.slice(0, i).trim();
    if (!process.env[key]) process.env[key] = t.slice(i + 1).trim();
  }
}

loadEnvFile(secretLocal);

const host = process.env.CONTACT_SMTP_HOST?.trim() || 'smtp.titan.email';
const user = process.env.CONTACT_SMTP_USER?.trim() || 'admin@dietos.com.br';
const pass = process.env.CONTACT_SMTP_PASS;
const port = Number(process.env.CONTACT_SMTP_PORT || '465');

if (!pass) {
  console.error('Cria functions/.secret.local com CONTACT_SMTP_PASS=...');
  console.error('Ver docs/hostgator-smtp-firebase.md (cPanel).');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  requireTLS: port !== 465,
  auth: { user, pass },
  tls: { minVersion: 'TLSv1.2' },
});

console.log('A testar', user, '@', host, 'porta', port);

transporter
  .verify()
  .then(() => {
    console.log('OK: SMTP aceitou o login.');
  })
  .catch((err) => {
    console.error('FALHA:', err.message);
    if (err.code === 'EAUTH') {
      console.error('');
      console.error('535 = senha errada ou utilizador deve ser o e-mail completo.');
      console.error('Confirma host/porta em cPanel -> Email Accounts -> Connect Devices.');
    }
    process.exit(1);
  });
