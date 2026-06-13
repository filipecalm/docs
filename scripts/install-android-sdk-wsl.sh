#!/usr/bin/env bash
set -eo pipefail
SDK="${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}"
BT="$SDK/build-tools/36.0.0"
if [ -x "$BT/aapt" ] && [ -x "$BT/aapt2" ] && [ -x "$BT/d8" ]; then
  echo "[install-android-sdk-wsl] Ja existe: $BT"
  exit 0
fi
mkdir -p "$SDK/cmdline-tools"
if ! command -v unzip >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    echo "[install-android-sdk-wsl] A instalar curl e unzip (sudo apt-get)..."
    sudo apt-get update -qq && sudo apt-get install -y curl unzip
  else
    echo "[install-android-sdk-wsl] Falta curl ou unzip. Instala-os no teu gestor de pacotes."
    exit 1
  fi
fi
CL_VER=11076708
ZIP="commandlinetools-linux-${CL_VER}_latest.zip"
DL="/tmp/$ZIP"
SM="$SDK/cmdline-tools/latest/bin/sdkmanager"
if [ ! -x "$SM" ]; then
  echo "[install-android-sdk-wsl] A descarregar $ZIP ..."
  curl -fSL -o "$DL" "https://dl.google.com/android/repository/$ZIP"
  rm -rf "$SDK/cmdline-tools/cmdline-tools" "$SDK/cmdline-tools/latest"
  unzip -q "$DL" -d "$SDK/cmdline-tools"
  mv "$SDK/cmdline-tools/cmdline-tools" "$SDK/cmdline-tools/latest"
fi
JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}"
export JAVA_HOME
if [ ! -x "$JAVA_HOME/bin/java" ]; then
  for d in /usr/lib/jvm/java-21-openjdk-amd64 /usr/lib/jvm/java-17-openjdk-amd64 /usr/lib/jvm/java-11-openjdk-amd64; do
    if [ -x "$d/bin/java" ]; then JAVA_HOME="$d"; export JAVA_HOME; break; fi
  done
fi
if [ ! -x "$JAVA_HOME/bin/java" ] && command -v apt-get >/dev/null 2>&1; then
  echo "[install-android-sdk-wsl] A instalar openjdk-17-jdk (sudo apt-get)..."
  sudo apt-get update -qq && sudo apt-get install -y openjdk-17-jdk
  JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
  export JAVA_HOME
fi
if [ ! -x "$JAVA_HOME/bin/java" ]; then
  echo "[install-android-sdk-wsl] Sem JDK. Corre: sudo apt-get install -y openjdk-17-jdk"
  exit 1
fi
export ANDROID_SDK_ROOT="$SDK"
export ANDROID_HOME="$SDK"
LIC_LOG=/tmp/dietos-sdkmanager-licenses.log
echo "[install-android-sdk-wsl] Licencas Android (1-3 min, saida em $LIC_LOG)..."
set +o pipefail
yes | "$SM" --sdk_root="$SDK" --licenses >"$LIC_LOG" 2>&1 || true
set -o pipefail
echo "[install-android-sdk-wsl] Licencas aceites."
PKG_LOG=/tmp/dietos-sdkmanager-packages.log
echo "[install-android-sdk-wsl] Pacotes SDK + NDK (varios minutos, saida em $PKG_LOG)..."
set +o pipefail
if ! yes | "$SM" --sdk_root="$SDK" "platform-tools" "build-tools;36.0.0" "platforms;android-36" "ndk;27.1.12297006" >"$PKG_LOG" 2>&1; then
  set -o pipefail
  echo "[install-android-sdk-wsl] sdkmanager packages falhou. Ultimas linhas:"
  tail -40 "$PKG_LOG"
  exit 1
fi
set -o pipefail
echo "[install-android-sdk-wsl] Pacotes instalados."
if [ ! -x "$BT/aapt2" ]; then
  echo "[install-android-sdk-wsl] sdkmanager nao instalou build-tools;36.0.0. Tenta:"
  echo "  yes | \"$SM\" --sdk_root=\"$SDK\" --uninstall \"build-tools;36.0.0\""
  echo "  yes | \"$SM\" --sdk_root=\"$SDK\" \"build-tools;36.0.0\""
  exit 1
fi
echo "[install-android-sdk-wsl] Concluido. Usa: export ANDROID_HOME=$SDK"
