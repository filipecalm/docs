# Scripts e Automações

## Sumário

- [Scripts npm — raiz (package.json)](#scripts-npm--raiz-packagejson)
- [Scripts npm — functions/](#scripts-npm--functions)
- [Scripts npm — tests/](#scripts-npm--tests)
- [Scripts PowerShell (scripts/)](#scripts-powershell-scripts)
- [Scripts CMD (scripts/)](#scripts-cmd-scripts)
- [Scripts Node/MJS (scripts/)](#scripts-nodemjs-scripts)
- [Scripts Shell (scripts/)](#scripts-shell-scripts)
- [Scripts CLI — functions/scripts/](#scripts-cli--functionsscripts)
- [⚠️ Observações](#️-observações)

---

## Scripts npm — raiz (package.json)

### Desenvolvimento

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm start` | Inicia Metro/Expo (`EXPO_NO_WATCHMAN=1`) | Node, Expo CLI | `npm start` |
| `npm run android` | Build e run Android nativo | Android SDK, JDK | `npm run android` |
| `npm run ios` | Build e run iOS | Xcode (macOS) | `npm run ios` |
| `npm run web` | Expo web dev server | — | `npm run web` |
| `npm run lint` | ESLint via `expo lint` | eslint-config-expo | `npm run lint` |
| `npm test` | Jest em watch mode | jest-expo | `npm test` |

### Build e deploy Android (EAS)

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm run build:android` | EAS build production (não aguarda) | eas-cli, conta Expo | `npm run build:android` |
| `npm run build:preview` | EAS build preview (APK interno) | eas-cli | `npm run build:preview` |
| `npm run deploy` | Build production + auto-submit Play Store | eas-cli, service-account.json | `npm run deploy` |
| `npm run submit:android` | Submit último build → track production | eas-cli | `npm run submit:android` |
| `npm run submit:android:beta` | Submit → track beta | eas-cli | `npm run submit:android:beta` |
| `npm run submit:android:internal` | Submit → track internal | eas-cli | `npm run submit:android:internal` |
| `npm run release:android:internal` | Build + submit internal num comando | eas-cli | `npm run release:android:internal` |
| `npm run local` | Build Android local via WSL/EAS | WSL, Android SDK Linux | `npm run local` |
| `npm run local:bootstrap` | Instala Android SDK no WSL | WSL, Ubuntu | `npm run local:bootstrap` |
| `npm run eas-build-post-install` | Hook EAS: escreve `android/local.properties` | Node | (automático no EAS) |
| `npm run wsl:services` | Garante serviço WSL ativo (admin) | PowerShell admin | `npm run wsl:services` |

### Deploy Android (PowerShell wrapper)

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm run deploy:android` | Build + submit + release notes + GitHub release | `deploy-android.ps1`, eas-cli | `npm run deploy:android` |
| `npm run deploy:android:build-only` | Só build | — | `npm run deploy:android:build-only` |
| `npm run deploy:android:submit-only` | Só submit | build prévio | `npm run deploy:android:submit-only` |
| `npm run deploy:android:beta` | Deploy track beta | — | `npm run deploy:android:beta` |
| `npm run deploy:android:internal` | Deploy track internal | — | `npm run deploy:android:internal` |

**`deploy-android.ps1` — passos:**
1. Valida `eas` e `service-account.json`
2. (Opcional) Build EAS production
3. (Opcional) Submit com track configurável
4. Gera release notes (git log ou arquivo)
5. (Opcional) Cria GitHub Release com token de `.github-token` ou `GITHUB_TOKEN`

### Variáveis de ambiente EAS

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm run eas:env:push` | Sincroniza `.env` → EAS production | eas-cli, `.env` | `npm run eas:env:push` |
| `npm run eas:env:push:preview` | Sincroniza → ambiente preview | — | `npm run eas:env:push:preview` |

**`setup-env.ps1` — passos:**
1. Lê `.env` linha a linha
2. Classifica variáveis (secret / sensitive / plaintext)
3. Executa `eas env:create --force` para cada `EXPO_PUBLIC_*`
4. Não altera secrets das Cloud Functions

### Firebase / backend

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm run build:functions` | `tsc` em `functions/` | Node 22 | `npm run build:functions` |
| `npm run deploy:functions` | Build + deploy só functions | firebase-cli | `npm run deploy:functions` |
| `npm run deploy:functions:indexes` | Deploy functions + índices Firestore | firebase-cli | `npm run deploy:functions:indexes` |
| `npm run rules` | Deploy `firestore.rules` | firebase-cli | `npm run rules` |
| `npm run test:firestore-rules` | Emuladores + testes de segurança | Java, firebase-cli | `npm run test:firestore-rules` |
| `npm run deploy:hosting` | Deploy Firebase Hosting | firebase-cli | `npm run deploy:hosting` |
| `npm run deploy:site` | Deploy site na Vercel | vercel CLI | `npm run deploy:site` |

### Utilitários

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm run assets:play-store` | Gera assets Play Store (sharp) | sharp, jimp | `npm run assets:play-store` |
| `npm run verify:user` | Verifica usuário no Firebase | service-account | `npm run verify:user user@email.com` |
| `npm run create:test-user` | Cria usuário de teste | service-account | `npm run create:test-user` |
| `npm run test:smtp` | Testa SMTP das functions | functions/.env | `npm run test:smtp` |
| `npm run reset-project` | *(arquivo ausente)* | — | — |

### Atalhos CMD (Windows)

| Comando | Script real |
|---------|-------------|
| `npm run secrets:smtp` | `scripts/set-titan-contact-secrets.cmd` |
| `npm run secrets:smtp-pass` | `scripts/set-contact-smtp-pass-only.cmd` |
| `npm run google:client-id` | `scripts/set-google-web-client-id.cmd` |
| `npm run google:sha1` | `scripts/print-android-sha1.cmd` |
| `npm run google:setup-android` | `scripts/setup-firebase-android-google.cmd` |
| `npm run google:sha1:register` | `scripts/register-google-sha1.cmd` |
| `npm run google:play-sha1` | `scripts/register-play-signing-sha1.mjs` |

---

## Scripts npm — functions/

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm run build` | Compila TypeScript → `lib/` | typescript | `cd functions && npm run build` |
| `npm run build:watch` | TypeScript watch mode | — | `npm run build:watch` |
| `npm run serve` | Build + emulador functions | firebase-cli | `npm run serve` |
| `npm run dev` | Dev server com `tsx watch` | tsx | `npm run dev` |
| `npm run deploy` | Deploy functions | firebase-cli | `npm run deploy` |
| `npm run deploy:all` | Deploy functions + indexes | firebase-cli | `npm run deploy:all` |
| `npm run backfill:patient-diet` | Backfill dietas IA → Firestore | service-account | `npm run backfill:patient-diet` |
| `npm run rules` | Deploy firestore rules | firebase-cli | `npm run rules` |
| `npm run logs` | Tail logs Cloud Functions | firebase-cli | `npm run logs` |
| `npm run lint` | Echo "No linting configured" | — | — |

---

## Scripts npm — tests/

| Comando | O que faz | Dependências | Exemplo |
|---------|-----------|--------------|---------|
| `npm test` | Roda `firestore.rules.test.cjs` | emuladores Firebase | `cd tests && npm test` |

---

## Scripts PowerShell (scripts/)

### `setup-env.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | `powershell -File scripts/setup-env.ps1 [-Environment preview]` |
| **Passos** | Lê `.env` → `eas env:create` por variável com visibilidade adequada |
| **Deps** | eas-cli, `.env` na raiz |
| **Exemplo** | `npm run eas:env:push` |

### `deploy-android.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | `powershell -File scripts/deploy-android.ps1 [-BuildOnly] [-SubmitOnly] [-Track beta]` |
| **Passos** | Valida eas + service-account → build EAS → submit → release notes → GitHub release |
| **Deps** | eas-cli, service-account.json, git |
| **Exemplo** | `npm run deploy:android:beta` |

### `ensure-wsl-services.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | `powershell -File scripts/ensure-wsl-services.ps1` |
| **Passos** | Eleva UAC (uma vez) → inicia `WslService` / `LxssManager` → startup Automatic |
| **Deps** | Windows 11, WSL instalado |
| **Exemplo** | `npm run wsl:services` |

### `set-titan-contact-secrets.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | `powershell -File scripts/set-titan-contact-secrets.ps1 -SmtpPassword "..."` |
| **Passos** | Define secrets Firebase: `CONTACT_SMTP_*`, `CONTACT_FROM_EMAIL` via `firebase functions:secrets:set` |
| **Deps** | firebase-cli, `Write-FirebaseSecretFile.ps1` |
| **Exemplo** | `npm run secrets:smtp` (via .cmd) |

### `set-contact-smtp-pass-only.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | Atualiza apenas `CONTACT_SMTP_PASS` |
| **Deps** | firebase-cli |
| **Exemplo** | `npm run secrets:smtp-pass` |

### `set-cpanel-contact-secrets.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | Variante para SMTP HostGator/cPanel (mesmo padrão que Titan) |
| **Deps** | firebase-cli |

### `set-google-web-client-id.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | `powershell -File scripts/set-google-web-client-id.ps1 -WebClientId "....apps.googleusercontent.com"` |
| **Passos** | Atualiza `app.json` via `.mjs` → propaga para EAS (production, preview, development) |
| **Deps** | eas-cli, Node |
| **Exemplo** | `npm run google:client-id` |

### `print-android-sha1.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | `powershell -File scripts/print-android-sha1.ps1` |
| **Passos** | Roda `gradlew signingReport` → filtra SHA-1 debug/release |
| **Deps** | pasta `android/` (expo prebuild) |
| **Exemplo** | `npm run google:sha1` |

### `setup-firebase-android-google.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | Configura Google Sign-In no Firebase Android |
| **Deps** | Firebase CLI, SHA-1 |
| **Exemplo** | `npm run google:setup-android` |

### `verify-user.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | Wrapper para `functions/scripts/verify-user.cjs` |
| **Exemplo** | `npm run verify:user` |

### `install-watchman.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | Instala Watchman no Windows (file watcher para Metro) |
| **Deps** | Chocolatey ou download manual |

### `Write-FirebaseSecretFile.ps1`

| Item | Detalhe |
|------|---------|
| **Comando** | Helper interno — grava valor em arquivo temp para `firebase functions:secrets:set` |
| **Uso** | Importado por scripts de secrets |

---

## Scripts CMD (scripts/)

Wrappers Windows que chamam os scripts PowerShell ou Node equivalentes:

| Arquivo | Destino |
|---------|---------|
| `set-titan-contact-secrets.cmd` | `set-titan-contact-secrets.ps1` |
| `set-contact-smtp-pass-only.cmd` | `set-contact-smtp-pass-only.ps1` |
| `set-cpanel-contact-secrets.cmd` | `set-cpanel-contact-secrets.ps1` |
| `set-google-web-client-id.cmd` | `set-google-web-client-id.ps1` |
| `print-android-sha1.cmd` | `print-android-sha1.ps1` |
| `register-google-sha1.cmd` | Registro SHA-1 no Firebase |
| `setup-firebase-android-google.cmd` | `setup-firebase-android-google.ps1` |
| `verify-user.cmd` | `verify-user.ps1` |
| `create-test-user.cmd` | `create-test-user.cjs` |
| `deploy-dietos-site.cmd` | `cd hosting && vercel --prod` |

### `deploy-dietos-site.cmd` — passos

1. Verifica `vercel` CLI instalado
2. `cd hosting`
3. `vercel --prod`

---

## Scripts Node/MJS (scripts/)

### `eas-android-local.mjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `node scripts/eas-android-local.mjs` / `npm run local` |
| **Passos** | Detecta WSL → valida path não está em `/mnt/` → roda `eas build --local` |
| **Deps** | WSL, Android SDK Linux, eas-cli |
| **Exemplo** | `npm run local` |

### `install-android-sdk-wsl.mjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `npm run local:bootstrap` |
| **Passos** | Invoca `install-android-sdk-wsl.sh` dentro do WSL |
| **Deps** | WSL, Ubuntu |

### `write-android-sdk-dir.mjs`

| Item | Detalhe |
|------|---------|
| **Comando** | Hook `eas-build-post-install` |
| **Passos** | Resolve `ANDROID_HOME` → escreve `android/local.properties` com `sdk.dir` |
| **Deps** | Android SDK no ambiente de build |

### `generate-play-store-assets.mjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `npm run assets:play-store` |
| **Passos** | Usa sharp para gerar ícone 512px, feature graphic, screenshots em `assets/play-store/` |
| **Deps** | sharp, `assets/images/logo.png` |

### `register-play-signing-sha1.mjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `npm run google:play-sha1` |
| **Passos** | Obtém SHA-1 do app signing key via Play API → registra no Firebase |
| **Deps** | service-account.json, Android SDK (apksigner) |

### `set-google-web-client-id.mjs`

| Item | Detalhe |
|------|---------|
| **Comando** | Chamado por `set-google-web-client-id.ps1` |
| **Passos** | Atualiza `app.json` → `extra.googleWebClientId` e plugin Google Sign-In |

### `fix-icon-padding.mjs`

| Item | Detalhe |
|------|---------|
| **Comando** | Utilitário de ajuste de ícone (padding) |
| **Deps** | sharp/jimp |

---

## Scripts Shell (scripts/)

### `install-android-sdk-wsl.sh`

| Item | Detalhe |
|------|---------|
| **Comando** | Executado via `install-android-sdk-wsl.mjs` |
| **Passos** | Instala cmdline-tools, platforms, build-tools no WSL (`~/Android/Sdk`) |
| **Deps** | Ubuntu no WSL, curl, unzip |

### `eas-android-local-wsl.sh`

| Item | Detalhe |
|------|---------|
| **Comando** | Helper shell para build local dentro do WSL |
| **Deps** | eas-cli, Android SDK |

---

## Scripts CLI — functions/scripts/

### `adminCli.cjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `node functions/scripts/adminCli.cjs <comando>` |
| **Passos** | Inicializa Firebase Admin com service-account → operações administrativas |
| **Deps** | service-account.json do projeto `minha-dieta-67b3f` |

### `create-test-user.cjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `npm run create:test-user` |
| **Passos** | Cria usuário Auth + documento Firestore para testes |
| **Deps** | service-account.json |

### `verify-user.cjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `npm run verify:user <email>` |
| **Passos** | Lista dados do usuário (Auth + Firestore) |
| **Deps** | service-account.json |

### `test-smtp.cjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `npm run test:smtp` |
| **Passos** | Envia e-mail de teste via config SMTP de `functions/.env` |
| **Deps** | functions/.env com credenciais SMTP |

### `backfill-patient-diet-from-ai.cjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `cd functions && npm run backfill:patient-diet` |
| **Passos** | Migra/backfill dietas geradas por IA para estrutura Firestore atual |
| **Deps** | service-account, build functions |

### `apply-diet-json-to-firestore.cjs`

| Item | Detalhe |
|------|---------|
| **Comando** | `node functions/scripts/apply-diet-json-to-firestore.cjs` |
| **Passos** | Importa JSON de dieta para documento Firestore |
| **Deps** | service-account |

---

## ⚠️ Observações

- Não existe **Makefile** no repositório.
- `npm run reset-project` referencia `scripts/reset-project.js` que **não existe**.
- `functions/package.json` → `lint` é um no-op (`echo "No linting configured"`).
- Maioria dos scripts de secrets/deploy assume ambiente **Windows** (PowerShell/CMD); builds locais Android dependem de **WSL**.
- Scripts `.cmd` são wrappers finos — a lógica real está em `.ps1` ou `.mjs`.
