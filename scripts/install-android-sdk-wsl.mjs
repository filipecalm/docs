import { spawnSync } from "child_process";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shPath = join(root, "scripts", "install-android-sdk-wsl.sh");

function wslExe() {
  return join(process.env.SystemRoot || "C:\\Windows", "System32", "wsl.exe");
}

function wslpathWinToUnix(winPath) {
  const wsl = wslExe();
  if (!fs.existsSync(wsl) || !winPath) return null;
  const distro = process.env.WSL_DISTRO;
  const prefix = distro ? ["-d", distro] : [];
  for (const p of [winPath, winPath.replace(/\\/g, "/")]) {
    const r = spawnSync(wsl, [...prefix, "wslpath", "-a", p], { encoding: "utf8" });
    const out = r.stdout?.trim();
    if (r.status === 0 && out?.startsWith("/")) return out;
  }
  return null;
}

if (!fs.existsSync(shPath)) {
  console.error("Falta scripts/install-android-sdk-wsl.sh");
  process.exit(1);
}

if (process.platform === "win32") {
  const wsl = wslExe();
  if (!fs.existsSync(wsl)) {
    console.error("wsl.exe nao encontrado. Instala WSL ou corre o bootstrap dentro do Ubuntu (npm run local:bootstrap no WSL).");
    process.exit(1);
  }
  const shUnix = wslpathWinToUnix(shPath);
  if (!shUnix) {
    console.error("wslpath falhou para o script.");
    process.exit(1);
  }
  const distro = process.env.WSL_DISTRO;
  const args = distro
    ? [wsl, "-d", distro, "bash", "--noprofile", "--norc", shUnix]
    : [wsl, "bash", "--noprofile", "--norc", shUnix];
  const r = spawnSync(args[0], args.slice(1), { stdio: "inherit" });
  process.exit(r.status === null ? 1 : r.status);
}

if (process.platform !== "linux") {
  console.error(
    "[install-android-sdk-wsl] Nesta maquina usa Android Studio / sdkmanager manualmente (script orientado a Linux/WSL)."
  );
  process.exit(1);
}

const r = spawnSync("bash", ["--noprofile", "--norc", shPath], {
  stdio: "inherit",
  cwd: root,
});
process.exit(r.status === null ? 1 : r.status);
