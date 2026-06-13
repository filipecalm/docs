import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const clientId = process.argv[2]?.trim();
if (!clientId) {
  console.error("Uso: node scripts/set-google-web-client-id.mjs WEB_CLIENT_ID.apps.googleusercontent.com");
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "app.json");
const app = JSON.parse(fs.readFileSync(appPath, "utf8"));

if (!/\.apps\.googleusercontent\.com$/.test(clientId)) {
  console.error("ID invalido. Esperado: XXXX.apps.googleusercontent.com");
  process.exit(1);
}

app.expo.extra = app.expo.extra ?? {};
app.expo.extra.googleWebClientId = clientId;

fs.writeFileSync(appPath, `${JSON.stringify(app, null, 2)}\n`, "utf8");
console.log("+ app.json → expo.extra.googleWebClientId");
