import { spawnSync } from "child_process";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function exitCode(r) {
  if (r.error) {
    console.error(r.error);
    return 1;
  }
  return r.status === null ? 1 : r.status;
}

function devLog(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
}

function warnIfWslWindowsMount(projectPath) {
  const p = String(projectPath || "");
  if (!p.startsWith("/mnt/")) return;
  console.error(
    "[eas-android-local] Caminho sob /mnt/ (disco Windows via WSL): I/O muito lento; Gradle/EAS local falham ou recebem SIGTERM com frequencia."
  );
  console.error(
    "[eas-android-local] Copia o repo para o disco Linux do WSL (ex.: git clone ... ~/DietOS) e corre npm run local a partir dali.\n"
  );
}

function printAbortAndHookLegend() {
  console.error(
    "[eas-android-local] SIGTERM / [ABORT]: Ctrl+C, fecho do terminal, suspensao do PC, ou OOM (RAM cheia — Gradle+NDK comem muitos GB; nao uses GRADLE_USER_HOME em tmpfs /tmp no WSL)."
  );
  console.error(
    "[eas-android-local] Erros ON_BUILD_* / package.json nao existe em .../build: ruido depois do kill; ignora. O erro util e o [RUN_GRADLEW] acima.\n"
  );
}

function wslExe() {
  const sr = process.env.SystemRoot || "C:\\Windows";
  return join(sr, "System32", "wsl.exe");
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

function getWslUnixPath(winRoot) {
  const wsl = wslExe();
  if (!fs.existsSync(wsl)) {
    return { path: null, diag: "wsl.exe nao encontrado em System32." };
  }
  const out = wslpathWinToUnix(winRoot);
  if (out) return { path: out, diag: "" };
  const distro = process.env.WSL_DISTRO;
  const prefix = distro ? ["-d", distro] : [];
  const r0 = spawnSync(wsl, [...prefix, "wslpath", "-a", winRoot], {
    encoding: "utf8",
  });
  const lastErr = [r0.stderr, r0.stdout].filter(Boolean).join(" ").trim();
  const list = spawnSync(wsl, ["-l", "-q"], { encoding: "utf8" });
  const distros = list.stdout?.trim() || "(nenhuma listada)";
  const diag = [
    lastErr && `wslpath: ${lastErr}`,
    `wsl -l -q: ${distros}`,
    "Se nao tiveres distro: PowerShell admin -> wsl --install -d Ubuntu",
    "Opcional: define WSL_DISTRO=NomeDaDistro se o default falhar.",
  ]
    .filter(Boolean)
    .join("\n");
  return { path: null, diag };
}

function resolveWindowsAndroidSdkPath() {
  const cands = [];
  const ah = process.env.ANDROID_HOME;
  const ar = process.env.ANDROID_SDK_ROOT;
  if (ah) cands.push(ah);
  if (ar) cands.push(ar);
  const la = process.env.LOCALAPPDATA;
  if (la) cands.push(join(la, "Android", "Sdk"));
  for (const c of cands) {
    if (!c) continue;
    if (fs.existsSync(join(c, "platform-tools", "adb.exe"))) return c;
  }
  for (const c of cands) {
    if (c && fs.existsSync(c)) return c;
  }
  return null;
}

function probeWslLinuxAndroidSdk() {
  const wsl = wslExe();
  if (!fs.existsSync(wsl)) return null;
  const distro = process.env.WSL_DISTRO;
  const prefix = distro ? ["-d", distro] : [];
  const inner = [
    "find_sdk() {",
    '  for b in "${ANDROID_HOME:-}" "${ANDROID_SDK_ROOT:-}" "$HOME/Android/Sdk" /opt/android-sdk /usr/lib/android-sdk; do',
    '    [ -z "$b" ] && continue',
    '    case "$b" in /mnt/*) continue;; esac',
    '    [ -d "$b" ] || continue',
    '    for d in $(ls -1vr "$b/build-tools" 2>/dev/null); do',
    '      t="$b/build-tools/$d"',
    '      if [ -x "$t/aapt" ] && [ -x "$t/aapt2" ] && [ -x "$t/d8" ] && [ -x "$t/zipalign" ]; then',
    '        printf "%s\\n" "$b" && return 0',
    "      fi",
    "    done",
    "  done",
    "  return 1",
    "}",
    "find_sdk",
  ].join(" ");
  const r = spawnSync(wsl, [...prefix, "bash", "--noprofile", "--norc", "-lc", inner], {
    encoding: "utf8",
  });
  const p = r.stdout?.trim().split("\n")[0];
  if (r.status === 0 && p?.startsWith("/")) return p;
  return null;
}

function bashEnsureJavaHome() {
  return (
    'if [ -z "${JAVA_HOME:-}" ] && [ -x /usr/libexec/java_home ]; then export JAVA_HOME="$(/usr/libexec/java_home 2>/dev/null)"; fi; ' +
    'if [ -z "${JAVA_HOME:-}" ]; then for d in /usr/lib/jvm/java-21-openjdk-amd64 /usr/lib/jvm/java-17-openjdk-amd64 /usr/lib/jvm/java-11-openjdk-amd64 /usr/lib/jvm/default-java; do if [ -d "$d" ]; then export JAVA_HOME="$d"; break; fi; done; fi; ' +
    'if [ -z "${JAVA_HOME:-}" ] && [ -x /usr/bin/java ]; then _j=$(readlink -f /usr/bin/java 2>/dev/null); case "$_j" in /mnt/c/*|*.exe|"") _j=;; esac; [ -n "${_j:-}" ] && export JAVA_HOME="$(dirname "$(dirname "$_j")")"; fi; ' +
    'if [ -z "${JAVA_HOME:-}" ] && command -v java >/dev/null 2>&1; then _j=$(readlink -f "$(command -v java)" 2>/dev/null); case "$_j" in /mnt/c/*|*.exe|"") _j=;; esac; [ -n "${_j:-}" ] && export JAVA_HOME="$(dirname "$(dirname "$_j")")"; fi; ' +
    'if [ -n "${JAVA_HOME:-}" ]; then export PATH="$JAVA_HOME/bin:$PATH"; fi'
  );
}

function bashEnsureAndroidHome() {
  return (
    'if [ -n "${ANDROID_HOME:-}" ] && [ -d "$ANDROID_HOME" ]; then ' +
    'case "$ANDROID_HOME" in /mnt/*) echo "[eas-android-local] ANDROID_HOME nao pode ser o SDK Windows (/mnt/...). Instala SDK Linux: npm run local:bootstrap"; exit 1;; esac; ' +
    'export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"; ' +
    'elif [ -n "${ANDROID_SDK_ROOT:-}" ] && [ -d "$ANDROID_SDK_ROOT" ]; then ' +
    'case "$ANDROID_SDK_ROOT" in /mnt/*) echo "[eas-android-local] ANDROID_SDK_ROOT nao pode ser /mnt/..."; exit 1;; esac; ' +
    'export ANDROID_HOME="$ANDROID_SDK_ROOT"; ' +
    'elif [ -d "$HOME/Android/Sdk" ]; then export ANDROID_HOME="$HOME/Android/Sdk"; export ANDROID_SDK_ROOT="$HOME/Android/Sdk"; ' +
    'elif [ -d /usr/lib/android-sdk ]; then export ANDROID_HOME=/usr/lib/android-sdk; export ANDROID_SDK_ROOT=/usr/lib/android-sdk; ' +
    'else echo "[eas-android-local] Sem Android SDK. Exporta ANDROID_HOME ou: npm run local:bootstrap (WSL) / instala em ~/Android/Sdk"; exit 1; fi'
  );
}

function runEasLocalInWsl(unixPath) {
  warnIfWslWindowsMount(unixPath);
  printAbortAndHookLegend();
  const wsl = wslExe();
  const scriptWin = join(root, "scripts", "eas-android-local-wsl.sh");
  if (!fs.existsSync(scriptWin)) {
    console.error("[eas-android-local] Falta scripts/eas-android-local-wsl.sh");
    return { status: 1 };
  }
  const sdkUnix = probeWslLinuxAndroidSdk();
  if (!sdkUnix) {
    const winSdk = resolveWindowsAndroidSdkPath();
    console.error(
      "[eas-android-local] No WSL nao ha Android SDK Linux com build-tools (aapt/aapt2/d8/zipalign em build-tools/*).\n" +
        "O SDK em %LOCALAPPDATA%\\Android\\Sdk e so Windows; o EAS --local executa Linux dentro do WSL.\n\n" +
        "No PowerShell (pasta do repo): npm run local:bootstrap\n" +
        "No Ubuntu (WSL): se faltar, sdkmanager install build-tools;36.0.0 (ou a versao que tiveres).\n\n" +
        "Build na cloud (sem WSL/NDK local): npm run build:android\n" +
        (winSdk
          ? "\n(SDK Windows existe; continua a servir no Android Studio.)\n"
          : "")
    );
    return { status: 1 };
  }
  const base = unixPath.replace(/\/+$/, "");
  const scriptUnix = `${base}/scripts/eas-android-local-wsl.sh`;
  const distro = process.env.WSL_DISTRO;
  const args = distro
    ? [
        wsl,
        "-d",
        distro,
        "bash",
        "--noprofile",
        "--norc",
        scriptUnix,
        unixPath,
        sdkUnix,
      ]
    : [wsl, "bash", "--noprofile", "--norc", scriptUnix, unixPath, sdkUnix];
  return spawnSync(args[0], args.slice(1), {
    stdio: "inherit",
    cwd: root,
  });
}

function guessJavaHomeWindows() {
  if (process.env.JAVA_HOME) {
    const je = join(process.env.JAVA_HOME, "bin", "java.exe");
    if (fs.existsSync(je)) return process.env.JAVA_HOME;
  }
  const cands = [];
  const pf = process.env.ProgramFiles;
  if (pf) cands.push(join(pf, "Android", "Android Studio", "jbr"));
  const la = process.env.LOCALAPPDATA;
  if (la) cands.push(join(la, "Programs", "Android", "Android Studio", "jbr"));
  for (const c of cands) {
    if (fs.existsSync(join(c, "bin", "java.exe"))) return c;
  }
  return null;
}

function runGradleBundleWindows() {
  console.error(
    "\n*** Gradle no Windows (sem EAS local): o .aab pode estar assinado com uma chave diferente da upload key da Google Play. Nao submetas a loja sem confirmar SHA1 em App integrity. ***\n"
  );
  const gradlew = join(root, "android", "gradlew.bat");
  if (!fs.existsSync(gradlew)) {
    console.error(
      "\n[WSL indisponivel] A gerar pasta android com expo prebuild (pode demorar)...\n"
    );
    const pre = spawnSync(
      "npx",
      ["expo", "prebuild", "--platform", "android"],
      { stdio: "inherit", cwd: root, shell: true }
    );
    if (pre.status !== 0) return pre;
  }
  if (!fs.existsSync(gradlew)) {
    console.error("gradlew.bat nao existe apos prebuild.");
    return { status: 1 };
  }
  if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
    const hint =
      process.env.LOCALAPPDATA &&
      `Ex.: cmd: set ANDROID_HOME=${join(process.env.LOCALAPPDATA, "Android", "Sdk")}`;
    console.error(
      "\nDefine ANDROID_HOME (ou ANDROID_SDK_ROOT) para o SDK Android.\n" +
        (hint ? `${hint}\n` : "")
    );
    return { status: 1 };
  }
  console.error(
    "\nA compilar bundleRelease com Gradle (assinatura: ver build.gradle / credentials.json).\n" +
      "AAB esperado em android/app/build/outputs/bundle/release/\n"
  );
  const env = { ...process.env };
  if (!env.JAVA_HOME) {
    const jh = guessJavaHomeWindows();
    if (jh) {
      env.JAVA_HOME = jh;
      env.PATH = `${join(jh, "bin")};${env.PATH || ""}`;
      console.error(`JAVA_HOME (Android Studio jbr): ${jh}\n`);
    }
  }
  if (!env.JAVA_HOME) {
    console.error(
      "Define JAVA_HOME ou instala Android Studio (inclui JBR em Program Files\\Android\\Android Studio\\jbr).\n"
    );
    return { status: 1 };
  }
  const androidDir = join(root, "android");
  const g = spawnSync(join(androidDir, "gradlew.bat"), ["bundleRelease"], {
    stdio: "inherit",
    cwd: androidDir,
    shell: true,
    env,
  });
  if (g.status === 0) {
    const aab = join(
      root,
      "android",
      "app",
      "build",
      "outputs",
      "bundle",
      "release",
      "app-release.aab"
    );
    devLog(`\nAAB: ${aab}\n`);
    console.error(
      "\n*** Build concluido. Se vais para a Play Store, confirma o certificado (SHA1) com o esperado em Play Console > App integrity. ***\n"
    );
  }
  return g;
}

if (process.platform === "win32") {
  console.error(
    "[eas-android-local] Windows: WSL + eas build --local. Se wslpath falhar, o script aborta (Gradle no Windows gerava .aab com chave errada para a Play). Opt-in: DIETOS_ALLOW_WINDOWS_GRADLE_FALLBACK=1."
  );
  console.error(
    "[eas-android-local] O build local costuma ficar varios minutos sem nova saida no terminal (deps/prebuild/gradle); isso nao e travamento.\n"
  );
  const { path: unixPath, diag } = getWslUnixPath(root);
  if (unixPath) {
    const r = runEasLocalInWsl(unixPath);
    process.exit(exitCode(r));
  }
  console.error(
    "\n[WSL] Nao foi possivel converter o caminho do projeto (wslpath falhou).\n" +
      diag +
      "\n"
  );
  if (process.env.DIETOS_ALLOW_WINDOWS_GRADLE_FALLBACK !== "1") {
    console.error(
      "[eas-android-local] Abortado: sem WSL/wslpath nao corre Gradle no Windows por defeito (evita AAB assinado com chave que a Play rejeita).\n\n" +
        "Correcao: instala WSL + distro (ex. wsl --install -d Ubuntu), garante wsl -l -v ok, opcional WSL_DISTRO=NomeDaDistro, npm run local:bootstrap no WSL para SDK Linux.\n" +
        "Ou build na cloud: npm run build:android\n\n" +
        "Se precisares mesmo do Gradle no Windows (testes, nao loja): PowerShell:\n" +
        "  $env:DIETOS_ALLOW_WINDOWS_GRADLE_FALLBACK='1'; npm run local\n"
    );
    process.exit(1);
  }
  console.error(
    "[Fallback Windows] DIETOS_ALLOW_WINDOWS_GRADLE_FALLBACK=1 — Expo prebuild + Gradle (sem Docker EAS).\n"
  );
  const r2 = runGradleBundleWindows();
  process.exit(exitCode(r2));
} else {
  warnIfWslWindowsMount(root);
  printAbortAndHookLegend();
  console.error(
    "[eas-android-local] Gradle: :react-native-reanimated:configureCMake* (NDK) pode levar 20-45+ min por ABI na 1.ª build; em /mnt/d e ainda mais. Se a CPU nao esta a 0%, esta a trabalhar."
  );
  console.error(
    "[eas-android-local] Outras fases podem ficar 5-15 min sem nova linha (npm, prebuild). So para com erro ou prompt.\n"
  );
  const inner = [
    `cd ${JSON.stringify(root)}`,
    bashEnsureJavaHome(),
    'if [ -z "$JAVA_HOME" ]; then echo "[eas-android-local] Instala JDK (ex: brew install openjdk@17) e exporta JAVA_HOME"; exit 1; fi',
    bashEnsureAndroidHome(),
    "export EAS_BUILD_NO_EXPO_GO_WARNING=true",
    'export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$HOME/.gradle}"',
    'export CMAKE_BUILD_PARALLEL_LEVEL="${CMAKE_BUILD_PARALLEL_LEVEL:-1}"',
    '[ -n "${GRADLE_OPTS:-}" ] || export GRADLE_OPTS="-Dorg.gradle.parallel=false -Dorg.gradle.workers.max=2"',
    'env GRADLE_USER_HOME="$GRADLE_USER_HOME" CMAKE_BUILD_PARALLEL_LEVEL="$CMAKE_BUILD_PARALLEL_LEVEL" GRADLE_OPTS="$GRADLE_OPTS" JAVA_HOME="$JAVA_HOME" ANDROID_HOME="$ANDROID_HOME" ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT" PATH="$PATH" npx cross-env EAS_BUILD_NO_EXPO_GO_WARNING=true eas build --platform android --profile production --local',
  ].join(" && ");
  const r = spawnSync("bash", ["-lc", inner], { stdio: "inherit", cwd: root });
  process.exit(exitCode(r));
}
