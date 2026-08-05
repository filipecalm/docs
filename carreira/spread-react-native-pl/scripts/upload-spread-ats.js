const { google } = require('googleapis');
const fs = require('fs');

const key = JSON.parse(
  fs.readFileSync(
    'd:/Projetos/pc-api-4658683592737644820-228-842c9061a201.json',
    'utf8'
  )
);
const auth = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1QL9bsifFZrC5xXLwQZ6R18VGkZ7Rkyfy';
const localPath =
  'C:/Users/filip/Downloads/Filipe_Almeida_Desenvolvedor_React_Native_Spread_ATS.docx';
const targetName = 'Filipe_Almeida_Desenvolvedor_React_Native_Spread_ATS.docx';
const sourceId = '1zQWbPE7FcI287Da8b_ESvQr0lCc1ttLI';

(async () => {
  await auth.authorize();

  const list = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and trashed=false and name='${targetName}'`,
    fields: 'files(id,name)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  let fileId = list.data.files?.[0]?.id;

  if (!fileId) {
    try {
      const copied = await drive.files.copy({
        fileId: sourceId,
        requestBody: {
          name: targetName,
          parents: [FOLDER_ID],
        },
        fields: 'id,name,parents',
        supportsAllDrives: true,
      });
      fileId = copied.data.id;
      console.log('COPIED', fileId);
    } catch (e) {
      console.log('COPY_WITH_PARENT_FAIL', e.message);
      const copied = await drive.files.copy({
        fileId: sourceId,
        requestBody: { name: targetName },
        fields: 'id,name,parents',
        supportsAllDrives: true,
      });
      fileId = copied.data.id;
      console.log('COPIED_NO_PARENT', fileId, copied.data.parents);
      try {
        await drive.files.update({
          fileId,
          addParents: FOLDER_ID,
          removeParents: (copied.data.parents || []).join(','),
          supportsAllDrives: true,
          fields: 'id,parents',
        });
        console.log('REPARENTED_OK');
      } catch (e2) {
        console.log('REPARENT_FAIL', e2.message);
      }
    }
  } else {
    console.log('EXISTS', fileId);
  }

  const updated = await drive.files.update({
    fileId,
    media: {
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      body: fs.createReadStream(localPath),
    },
    fields: 'id,name,modifiedTime,webViewLink',
    supportsAllDrives: true,
  });

  console.log('UPDATED', updated.data.name);
  console.log('MODIFIED', updated.data.modifiedTime);
  console.log(
    'LINK',
    updated.data.webViewLink ||
      `https://drive.google.com/file/d/${updated.data.id}/view`
  );

  const finalList = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id,name,modifiedTime)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  console.log('FOLDER_NOW');
  for (const f of finalList.data.files || []) {
    console.log('-', f.name, f.modifiedTime || '');
  }
})().catch((e) => {
  console.error('FATAL', e.message);
  process.exit(1);
});
