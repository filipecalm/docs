const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

const FOLDER_ID = '1QL9bsifFZrC5xXLwQZ6R18VGkZ7Rkyfy';
const DOWNLOADS = 'C:\\Users\\filip\\Downloads';
const TOKEN_PATH = path.join(__dirname, 'drive-token.json');
const SA_PATH = 'd:\\Projetos\\pc-api-4658683592737644820-228-842c9061a201.json';
const OAUTH_PATH =
  'd:\\Projetos\\client_secret_412413496046-3s8agbmu9f9av79r9nslopa0d9bcot4v.apps.googleusercontent.com.json';

const FILES_TO_UPLOAD = [
  'Filipe_Almeida_Desenvolvedor_React_Native.docx',
  'Filipe_Carneiro_Almeida_Desenvolvedor_React_Native.docx',
  'Filipe_Almeida_Desenvolvedor_React_Native_Spread_ATS.docx',
];

async function listFolder(drive) {
  const meta = await drive.files.get({
    fileId: FOLDER_ID,
    fields: 'id,name,mimeType',
    supportsAllDrives: true,
  });
  console.log('FOLDER', meta.data.name);

  const list = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id,name,mimeType,modifiedTime)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return list.data.files || [];
}

async function upsertFile(drive, localPath, existingByName) {
  const name = path.basename(localPath);
  const media = {
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    body: fs.createReadStream(localPath),
  };

  const existing = existingByName.get(name);
  if (existing) {
    const res = await drive.files.update({
      fileId: existing.id,
      media,
      fields: 'id,name,modifiedTime',
      supportsAllDrives: true,
    });
    console.log('UPDATED', res.data.name, res.data.id);
    return res.data;
  }

  const res = await drive.files.create({
    requestBody: {
      name,
      parents: [FOLDER_ID],
    },
    media,
    fields: 'id,name,modifiedTime',
    supportsAllDrives: true,
  });
  console.log('CREATED', res.data.name, res.data.id);
  return res.data;
}

async function uploadAll(auth) {
  const drive = google.drive({ version: 'v3', auth });
  const existing = await listFolder(drive);
  console.log(
    'EXISTING',
    existing.map((f) => f.name).join(' | ') || '(empty)'
  );
  const byName = new Map(existing.map((f) => [f.name, f]));

  for (const fileName of FILES_TO_UPLOAD) {
    const localPath = path.join(DOWNLOADS, fileName);
    if (!fs.existsSync(localPath)) {
      console.log('MISSING_LOCAL', localPath);
      continue;
    }
    await upsertFile(drive, localPath, byName);
  }

  const after = await listFolder(drive);
  console.log('DONE');
  for (const f of after) {
    console.log('-', f.name, f.modifiedTime);
  }
}

async function tryServiceAccount() {
  const key = JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
  console.log('SA_EMAIL', key.client_email);
  console.log('SA_PROJECT', key.project_id);
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  await auth.authorize();
  await uploadAll(auth);
}

function loadOAuthClient() {
  const raw = JSON.parse(fs.readFileSync(OAUTH_PATH, 'utf8'));
  const cfg = raw.installed || raw.web;
  return new google.auth.OAuth2(
    cfg.client_id,
    cfg.client_secret,
    'http://127.0.0.1:53682/oauth2callback'
  );
}

async function tryOAuth() {
  const oauth2 = loadOAuthClient();
  if (fs.existsSync(TOKEN_PATH)) {
    oauth2.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')));
    await uploadAll(oauth2);
    return;
  }

  const scopes = ['https://www.googleapis.com/auth/drive'];
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const u = new URL(req.url, 'http://127.0.0.1:53682');
        if (u.pathname !== '/oauth2callback') {
          res.writeHead(404);
          res.end();
          return;
        }
        const codeParam = u.searchParams.get('code');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          '<h1>Autorizado. Pode fechar esta aba e voltar ao terminal.</h1>'
        );
        server.close();
        resolve(codeParam);
      } catch (err) {
        reject(err);
      }
    });
    server.listen(53682, '127.0.0.1', () => {
      console.log('OPEN_BROWSER');
      console.log(authUrl);
      const { exec } = require('child_process');
      exec(`start "" "${authUrl}"`);
    });
    setTimeout(() => {
      server.close();
      reject(new Error('OAuth timeout (3 min)'));
    }, 180000);
  });

  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('TOKEN_SAVED', TOKEN_PATH);
  await uploadAll(oauth2);
}

async function main() {
  const mode = process.argv[2] || 'auto';
  if (mode === 'sa') {
    await tryServiceAccount();
    return;
  }
  if (mode === 'oauth') {
    await tryOAuth();
    return;
  }
  try {
    console.log('TRY_SA');
    await tryServiceAccount();
  } catch (e) {
    console.log('SA_FAIL', e.code || '', e.message);
    console.log('TRY_OAUTH');
    await tryOAuth();
  }
}

main().catch((e) => {
  console.error('FATAL', e.code || '', e.message);
  process.exit(1);
});
