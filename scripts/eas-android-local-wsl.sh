#!/usr/bin/env bash
set -eo pipefail
ROOT="${1:-}"
SDK_UNIX="${2:-}"
if [ -z "$ROOT" ] || [ ! -d "$ROOT" ]; then
  echo "[eas-android-local] WSL: pasta do projeto invalida"
  exit 1
fi
cd "$ROOT" || exit 1
if [ -n "$SDK_UNIX" ]; then
  case "$SDK_UNIX" in /mnt/*)
    echo "[eas-android-local] WSL: SDK sob /mnt e Windows; Gradle precisa de SDK Linux (ex.: ~/Android/Sdk no WSL)."
    exit 1
    ;;
  esac
fi
if [ -n "$SDK_UNIX" ] && [ -d "$SDK_UNIX" ]; then
  export ANDROID_HOME="$SDK_UNIX"
  export ANDROID_SDK_ROOT="$SDK_UNIX"
elif [ -n "${ANDROID_HOME:-}" ] && [ -d "$ANDROID_HOME" ]; then
  case "$ANDROID_HOME" in /mnt/*)
    echo "[eas-android-local] WSL: ANDROID_HOME nao pode ser /mnt/... (SDK Windows)."
    exit 1
    ;;
  esac
  export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
elif [ -d "${HOME}/Android/Sdk" ]; then
  export ANDROID_HOME="${HOME}/Android/Sdk"
  export ANDROID_SDK_ROOT="${HOME}/Android/Sdk"
else
  echo "[eas-android-local] WSL: sem ANDROID_HOME (passa SDK Linux como 2.º arg)"
  exit 1
fi
BT=""
for d in $(ls -1vr "$ANDROID_HOME/build-tools" 2>/dev/null); do
  t="$ANDROID_HOME/build-tools/$d"
  if [ -x "$t/aapt" ] && [ -x "$t/aapt2" ] && [ -x "$t/d8" ] && [ -x "$t/zipalign" ]; then
    BT=$t
    break
  fi
done
if [ -z "$BT" ]; then
  echo "[eas-android-local] WSL: nenhum build-tools valido (aapt/aapt2/d8/zipalign) em \$ANDROID_HOME/build-tools. Corre: npm run local:bootstrap (ou sdkmanager build-tools;36.0.0)"
  exit 1
fi
export PATH="${BT}:$PATH"
echo "[eas-android-local] WSL: build-tools -> $BT"
NDK27="$ANDROID_HOME/ndk/27.1.12297006"
if [ -d "$NDK27" ]; then
  export ANDROID_NDK_HOME="$NDK27"
elif [ -d "$ANDROID_HOME/ndk" ]; then
  nd=$(ls -1d "$ANDROID_HOME"/ndk/* 2>/dev/null | head -1)
  if [ -n "$nd" ] && [ -f "$nd/source.properties" ]; then
    export ANDROID_NDK_HOME="$nd"
  fi
fi
PT="$ANDROID_HOME/platform-tools"
EM="$ANDROID_HOME/emulator"
for d in "$PT" "$EM"; do
  if [ -d "$d" ]; then PATH="$d:$PATH"; fi
done
if [ -d "$ANDROID_HOME/cmdline-tools" ]; then
  for d in "$ANDROID_HOME"/cmdline-tools/*/bin; do
    if [ -d "$d" ]; then PATH="$d:$PATH"; fi
  done
fi
export PATH
if [ ! -d /usr/lib/jvm/java-17-openjdk-amd64 ] && [ -x /usr/bin/apt-get ]; then
  echo "[eas-android-local] WSL: sudo apt-get install openjdk-17-jdk"
  sudo apt-get update -qq && sudo apt-get install -y openjdk-17-jdk || true
  hash -r 2>/dev/null || true
fi
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
if [ -x "$JAVA_HOME/bin/java" ]; then
  :
elif [ -x /usr/lib/jvm/java-21-openjdk-amd64/bin/java ]; then
  JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
elif [ -x /usr/lib/jvm/java-11-openjdk-amd64/bin/java ]; then
  JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
elif [ -x /usr/lib/jvm/java-1.17.0-openjdk-amd64/bin/java ]; then
  JAVA_HOME=/usr/lib/jvm/java-1.17.0-openjdk-amd64
else
  echo "[eas-android-local] WSL: sem JDK em /usr/lib/jvm (sudo apt install -y openjdk-17-jdk)"
  ls -la /usr/lib/jvm 2>&1 || true
  exit 1
fi
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"
export EAS_BUILD_NO_EXPO_GO_WARNING=true
export NODE_ENV=production
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$HOME/.gradle}"
export CMAKE_BUILD_PARALLEL_LEVEL="${CMAKE_BUILD_PARALLEL_LEVEL:-1}"
[ -n "${GRADLE_OPTS:-}" ] || export GRADLE_OPTS="-Dorg.gradle.parallel=false -Dorg.gradle.workers.max=2"
if [ -n "${ANDROID_NDK_HOME:-}" ] && [ -d "$ANDROID_NDK_HOME" ]; then
  exec env \
    GRADLE_USER_HOME="${GRADLE_USER_HOME}" \
    CMAKE_BUILD_PARALLEL_LEVEL="${CMAKE_BUILD_PARALLEL_LEVEL}" \
    GRADLE_OPTS="${GRADLE_OPTS}" \
    JAVA_HOME="${JAVA_HOME}" \
    NODE_ENV="${NODE_ENV}" \
    ANDROID_HOME="${ANDROID_HOME}" \
    ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT}" \
    ANDROID_NDK_HOME="${ANDROID_NDK_HOME}" \
    PATH="${PATH}" \
    npx --yes eas-cli@latest build --platform android --profile production --local
else
  exec env \
    GRADLE_USER_HOME="${GRADLE_USER_HOME}" \
    CMAKE_BUILD_PARALLEL_LEVEL="${CMAKE_BUILD_PARALLEL_LEVEL}" \
    GRADLE_OPTS="${GRADLE_OPTS}" \
    JAVA_HOME="${JAVA_HOME}" \
    NODE_ENV="${NODE_ENV}" \
    ANDROID_HOME="${ANDROID_HOME}" \
    ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT}" \
    PATH="${PATH}" \
    npx --yes eas-cli@latest build --platform android --profile production --local
fi
