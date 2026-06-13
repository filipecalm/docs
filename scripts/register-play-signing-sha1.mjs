import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { JWT } from "../functions/node_modules/google-auth-library/build/src/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = "com.filipecalm.mobile";
const appId = "1:350085617861:android:178dc61eeec12e2645f8ac";
const keyPath = join(root, "service-account.json");

function findApksigner() {
  const sdk =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    join(process.env.LOCALAPPDATA || "", "Android", "Sdk");
  const toolsDir = join(sdk, "build-tools");
  if (!existsSync(toolsDir)) return null;
  const versions = readdirSync(toolsDir).sort().reverse();
  for (const v of versions) {
    const bin =
      process.platform === "win32"
        ? join(toolsDir, v, "apksigner.bat")
        : join(toolsDir, v, "apksigner");
    if (existsSync(bin)) return bin;
  }
  return null;
}

async function playToken() {
  const key = JSON.parse(readFileSync(keyPath, "utf8"));
  const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });
  const { access_token } = await client.authorize();
  if (!access_token) throw new Error("Play API: sem access token");
  return access_token;
}

async function latestProductionVersionCode(token) {
  const editRes = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${pkg}/edits`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    }
  );
  const edit = await editRes.json();
  if (!editRes.ok) throw new Error(`Play edits: ${JSON.stringify(edit)}`);
  const editId = edit.id;
  try {
    const tracksRes = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${pkg}/edits/${editId}/tracks`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const tracks = await tracksRes.json();
    if (!tracksRes.ok) throw new Error(`Play tracks: ${JSON.stringify(tracks)}`);
    const production = tracks.tracks?.find((t) => t.track === "production");
    const codes = production?.releases?.flatMap((r) => r.versionCodes || []) || [];
    const numeric = codes.map((c) => Number(c)).filter((n) => Number.isFinite(n));
    if (!numeric.length) throw new Error("Sem versionCode em production");
    return Math.max(...numeric);
  } finally {
    await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${pkg}/edits/${editId}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    ).catch(() => {});
  }
}

async function universalDownloadId(token, versionCode) {
  const res = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${pkg}/generatedApks/${versionCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const body = await res.json();
  if (!res.ok) throw new Error(`generatedApks: ${JSON.stringify(body)}`);
  const downloadId = body.generatedApks?.[0]?.generatedUniversalApk?.downloadId;
  if (!downloadId) throw new Error("generatedUniversalApk.downloadId em falta");
  return downloadId;
}

async function downloadUniversalApk(token, versionCode, downloadId, dest) {
  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${pkg}/generatedApks/${versionCode}/downloads/${encodeURIComponent(downloadId)}:download?alt=media`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`download APK: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1_000_000) {
    throw new Error(`download APK: ficheiro demasiado pequeno (${buf.length} bytes)`);
  }
  writeFileSync(dest, buf);
}

function sha1FromApk(apkPath, apksigner) {
  const out = spawnSync(apksigner, ["verify", "--print-certs", apkPath], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (out.status !== 0) {
    const detail = [out.stderr, out.stdout].filter(Boolean).join("\n").trim();
    throw new Error(detail || `apksigner exit ${out.status}`);
  }
  const match = out.stdout.match(/certificate SHA-1 digest: ([a-f0-9]+)/i);
  if (!match) throw new Error("SHA-1 nao encontrado em apksigner --print-certs");
  const hex = match[1].toLowerCase();
  return hex.match(/.{1,2}/g).join(":").toUpperCase();
}

function registerSha1(sha1Colon) {
  const r = spawnSync("firebase", ["apps:android:sha:create", appId, sha1Colon], {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });
  if (r.status !== 0 && !/already exists|ja exist/i.test(r.stderr + r.stdout)) {
    throw new Error(r.stderr || r.stdout || "firebase apps:android:sha:create falhou");
  }
}

function refreshGoogleServices() {
  const r = spawnSync("npm", ["run", "google:setup-android"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function main() {
  const apksigner = await findApksigner();
  if (!apksigner) {
    console.error("apksigner nao encontrado. Define ANDROID_HOME com build-tools.");
    process.exit(1);
  }

  const token = await playToken();
  const versionCode = await latestProductionVersionCode(token);
  console.log(`Play production versionCode: ${versionCode}`);

  const downloadId = await universalDownloadId(token, versionCode);
  const tmpApk = join(root, "scripts", "_play-signing-tmp.apk");
  try {
    console.log("A descarregar APK universal assinado pela Play...");
    await downloadUniversalApk(token, versionCode, downloadId, tmpApk);
    const sha1 = sha1FromApk(tmpApk, apksigner);
    console.log(`SHA-1 (App signing / Play Store): ${sha1}`);
    console.log("A registar no Firebase...");
    registerSha1(sha1);
    refreshGoogleServices();
    console.log("\nPronto. Faz novo build e publica na Play (google-services.json entrou no repo).");
  } finally {
    try {
      unlinkSync(tmpApk);
    } catch {
      /* ignore */
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
