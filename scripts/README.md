# Scripts DietOS

Espelho dos scripts de automação do repositório [DietOS](../DietOS). Os arquivos aqui são **cópia de referência** — a versão executável fica em `DietOS/scripts/` e `DietOS/functions/scripts/`.

## Sumário

- [Mapa npm → script](#mapa-npm--script)
- [PowerShell](#powershell)
- [Node / MJS](#node--mjs)
- [Shell (bash)](#shell-bash)
- [CMD (wrappers Windows)](#cmd-wrappers-windows)
- [Functions (CLI backend)](#functions-cli-backend)
- [Observações](#observações)

---

## Mapa npm → script

| Comando npm | Script | Plataforma |
|-------------|--------|------------|
| `npm run local` | `eas-android-local.mjs` | Windows + WSL |
| `npm run local:bootstrap` | `install-android-sdk-wsl.mjs` → `install-android-sdk-wsl.sh` | WSL |
| `npm run eas-build-post-install` | `write-android-sdk-dir.mjs` | EAS / Linux |
| `npm run wsl:services` | `ensure-wsl-services.ps1` | Windows (admin) |
| `npm run deploy:android` | `deploy-android.ps1` | Windows |
| `npm run deploy:android:build-only` | `deploy-android.ps1 -BuildOnly` | Windows |
| `npm run deploy:android:submit-only` | `deploy-android.ps1 -SubmitOnly` | Windows |
| `npm run deploy:android:beta` | `deploy-android.ps1 -Track beta` | Windows |
| `npm run deploy:android:internal` | `deploy-android.ps1 -Track internal` | Windows |
| `npm run eas:env:push` | `setup-env.ps1` | Windows |
| `npm run eas:env:push:preview` | `setup-env.ps1 -Environment preview` | Windows |
| `npm run assets:play-store` | `generate-play-store-assets.mjs` | Node |
| `npm run secrets:smtp` | `set-titan-contact-secrets.cmd` | Windows |
| `npm run secrets:smtp-pass` | `set-contact-smtp-pass-only.cmd` | Windows |
| `npm run google:client-id` | `set-google-web-client-id.cmd` | Windows |
| `npm run google:sha1` | `print-android-sha1.cmd` | Windows |
| `npm run google:setup-android` | `setup-firebase-android-google.cmd` | Windows |
| `npm run google:sha1:register` | `register-google-sha1.cmd` | Windows |
| `npm run google:play-sha1` | `register-play-signing-sha1.mjs` | Node |
| `npm run verify:user` | `functions/verify-user.cjs` | Node |
| `npm run create:test-user` | `functions/create-test-user.cjs` | Node |
| `npm run test:smtp` | `functions/test-smtp.cjs` | Node |
| `npm run deploy:site` | `deploy-dietos-site.cmd` | Windows |
| `cd functions && npm run backfill:patient-diet` | `functions/backfill-patient-diet-from-ai.cjs` | Node |

---

## PowerShell

### `deploy-android.ps1`

Orquestra build EAS, submit na Play Store, release notes e GitHub Release.

| Parâmetro | Efeito |
|-----------|--------|
| `-BuildOnly` | Só roda `eas build` production |
| `-SubmitOnly` | Só submit (exige build prévio) |
| `-Track` | `production` (default), `beta`, `internal` |
| `-ReleaseNotesPtBR` / `-ReleaseNotesEnUS` | Texto fixo para a Play Store |
| `-ReleaseNotesFile` | Arquivo com notas |
| `-NoGitHubRelease` | Pula criação de release no GitHub |

**Passos:** valida `eas` e `service-account.json` → build EAS (opcional) → submit com track → monta release notes (git log ou editor) → cria GitHub Release (token em `.github-token` ou `GITHUB_TOKEN`).

**Deps:** eas-cli, git, `service-account.json`, `app.json`.

---

### `setup-env.ps1`

Sincroniza variáveis de `.env` para o EAS (ambiente production ou preview).

| Parâmetro | Default |
|-----------|---------|
| `-Environment` | `production` |
| `-EnvFile` | `.env` |

**Passos:** lê `.env` linha a linha → classifica visibilidade (`secret`, `sensitive`, `plaintext`) → executa `eas env:create --force` para cada variável.

**Variáveis conhecidas:** `EXPO_PUBLIC_*`, `GEMINI_API_KEY`, `API_KEY`, `EAS_BUILD_NO_EXPO_GO_WARNING`.

**Nota:** não altera secrets das Cloud Functions — backend usa `functions/.env` + deploy separado.

---

### `ensure-wsl-services.ps1`

Garante que serviços WSL (`WslService`, `LxssManager`) estão com startup `Automatic` e em execução.

**Passos:** pede UAC uma vez → eleva para admin → configura e inicia serviços.

**Deps:** Windows 11 (ou versão com WSL), WSL instalado.

---

### `set-titan-contact-secrets.ps1`

Define secrets Firebase para SMTP Titan (formulário de contato).

| Parâmetro | Default |
|-----------|---------|
| `-SmtpPassword` | *(obrigatório)* |
| `-SmtpHost` | `smtp.titan.email` |
| `-SmtpPort` | `465` |
| `-SmtpUser` / `-FromEmail` | `admin@dietos.com.br` |

**Secrets criados:** `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASS`, `CONTACT_FROM_EMAIL`.

**Deps:** firebase-cli, `Write-FirebaseSecretFile.ps1`. Após rodar: `npm run deploy:functions`.

---

### `set-contact-smtp-pass-only.ps1`

Atualiza apenas o secret `CONTACT_SMTP_PASS` sem reconfigurar host/porta/usuário.

**Deps:** firebase-cli, `Write-FirebaseSecretFile.ps1`.

---

### `set-cpanel-contact-secrets.ps1`

Mesmo padrão do Titan, mas com defaults para SMTP HostGator/cPanel.

**Deps:** firebase-cli, `Write-FirebaseSecretFile.ps1`.

---

### `set-google-web-client-id.ps1`

Propaga o Google Web Client ID para `app.json` e EAS.

| Parâmetro | Descrição |
|-----------|-----------|
| `-WebClientId` | ID OAuth `....apps.googleusercontent.com` |

**Passos:** chama `set-google-web-client-id.mjs` → sincroniza para ambientes EAS (production, preview, development).

**Deps:** eas-cli, Node.

---

### `print-android-sha1.ps1`

Extrai SHA-1 de assinatura debug/release via `gradlew signingReport`.

**Deps:** pasta `android/` (requer `expo prebuild` ou build nativo prévio).

---

### `setup-firebase-android-google.ps1`

Registra SHA-1(s) no app Android do Firebase para Google Sign-In.

| Parâmetro | Default |
|-----------|---------|
| `-Sha1` | SHA-1 debug conhecido |
| `-PackageName` | `com.filipecalm.mobile` |
| `-AppName` | `DietOS` |

**Passos:** valida SHA-1 → usa Firebase CLI (JSON) → adiciona fingerprint ao app Android.

**Deps:** firebase-cli, projeto Firebase configurado.

---

### `verify-user.ps1`

Wrapper fino que delega para `functions/scripts/verify-user.cjs`.

---

### `install-watchman.ps1`

Instala Watchman no Windows (file watcher para Metro/Expo).

**Deps:** Chocolatey ou download manual.

---

### `Write-FirebaseSecretFile.ps1`

Helper interno — grava valor em arquivo temporário para `firebase functions:secrets:set --data-file`. Importado pelos scripts de secrets SMTP.

---

## Node / MJS

### `eas-android-local.mjs`

Build Android local via EAS dentro do WSL.

**Passos:** detecta WSL → converte path Windows → Unix → avisa se repo está em `/mnt/` (I/O lento) → executa `eas build --local --platform android` no WSL.

**Deps:** WSL, Ubuntu, Android SDK Linux (`npm run local:bootstrap`), eas-cli.

**Dica:** clone o repo em `~/DietOS` no disco Linux do WSL, não em `/mnt/d/...`.

---

### `install-android-sdk-wsl.mjs`

Entry point Windows que invoca `install-android-sdk-wsl.sh` dentro do WSL.

**Deps:** WSL, `wsl.exe`, script shell correspondente.

---

### `write-android-sdk-dir.mjs`

Hook `eas-build-post-install` — escreve `android/local.properties` com `sdk.dir`.

**Passos:** resolve `ANDROID_HOME` / `ANDROID_SDK_ROOT` → valida que não aponta para `/mnt/` → grava `sdk.dir` escapado.

**Deps:** Android SDK no ambiente de build. Skip automático se `EAS_BUILD_PLATFORM=ios` ou sem pasta `android/`.

---

### `generate-play-store-assets.mjs`

Gera assets da Play Store com sharp.

**Saída:** `assets/play-store/` — ícone 512px, feature graphic 1024×500, screenshots phone/tablet.

**Entrada:** `assets/images/logo.png`, `assets/images/icon.png`.

**Deps:** sharp (devDependency).

---

### `fix-icon-padding.mjs`

Ajusta padding dos ícones do app — trim automático + resize com margem sobre fundo `#0F232C`.

**Entrada/saída:** `assets/images/icon.png`, `adaptive-icon.png`, etc.

**Deps:** sharp.

---

### `register-play-signing-sha1.mjs`

Obtém SHA-1 da chave de app signing via Play Developer API e registra no Firebase.

**Passos:** autentica com `service-account.json` → busca último AAB/APK em production → extrai certificado com `apksigner` → registra SHA-1 no Firebase.

**Deps:** `service-account.json` (escopo Play API), Android SDK (`apksigner`), `google-auth-library`.

---

### `set-google-web-client-id.mjs`

Atualiza `app.json` → `extra.googleWebClientId` e configura plugin Google Sign-In. Chamado por `set-google-web-client-id.ps1`.

---

## Shell (bash)

### `install-android-sdk-wsl.sh`

Instala Android SDK no WSL em `~/Android/Sdk`.

**Passos:** baixa cmdline-tools → instala platforms, build-tools, platform-tools → configura variáveis de ambiente.

**Deps:** Ubuntu no WSL, curl, unzip, Java.

---

### `eas-android-local-wsl.sh`

Helper shell executado dentro do WSL durante build local — prepara ambiente e roda EAS build.

**Deps:** eas-cli, Android SDK Linux, repo no filesystem Linux (não `/mnt/`).

---

## CMD (wrappers Windows)

Wrappers finos que chamam PowerShell ou Node com parâmetros padrão. Úteis no `package.json` e duplo-clique.

| Arquivo | Destino |
|---------|---------|
| `set-titan-contact-secrets.cmd` | `set-titan-contact-secrets.ps1` |
| `set-contact-smtp-pass-only.cmd` | `set-contact-smtp-pass-only.ps1` |
| `set-cpanel-contact-secrets.cmd` | `set-cpanel-contact-secrets.ps1` |
| `set-google-web-client-id.cmd` | `set-google-web-client-id.ps1` |
| `print-android-sha1.cmd` | `print-android-sha1.ps1` |
| `register-google-sha1.cmd` | Registro manual de SHA-1 no Firebase |
| `setup-firebase-android-google.cmd` | `setup-firebase-android-google.ps1` |
| `verify-user.cmd` | `verify-user.ps1` → `functions/verify-user.cjs` |
| `create-test-user.cmd` | `functions/create-test-user.cjs` |
| `deploy-dietos-site.cmd` | `cd hosting && vercel --prod` |

### `deploy-dietos-site.cmd`

1. Verifica se `vercel` CLI está instalado
2. Entra em `hosting/`
3. Executa `vercel --prod`

**Deps:** Vercel CLI, projeto linkado em `hosting/`.

---

## Functions (CLI backend)

Scripts em `functions/` operam com Firebase Admin SDK. Requerem `service-account.json` do projeto `minha-dieta-67b3f` (ou `GOOGLE_APPLICATION_CREDENTIALS`).

### `adminCli.cjs`

CLI administrativo genérico — inicializa Firebase Admin e expõe operações de manutenção.

**Uso:** `node functions/scripts/adminCli.cjs <comando>`

---

### `create-test-user.cjs`

Cria usuário de teste no Firebase Auth + documento inicial no Firestore.

**Uso:** `npm run create:test-user`

---

### `verify-user.cjs`

Lista dados de um usuário (Auth + Firestore) pelo e-mail.

**Uso:** `npm run verify:user user@email.com`

---

### `test-smtp.cjs`

Envia e-mail de teste usando credenciais SMTP de `functions/.env`.

**Uso:** `npm run test:smtp`

**Deps:** `functions/.env` com `CONTACT_SMTP_*` configurados.

---

### `backfill-patient-diet-from-ai.cjs`

Migra/backfill dietas geradas por IA para a estrutura Firestore atual.

**Uso:** `cd functions && npm run backfill:patient-diet`

**Deps:** functions compiladas, service-account.

---

### `apply-diet-json-to-firestore.cjs`

Importa JSON de dieta para documento Firestore de um paciente.

**Uso:** `node functions/scripts/apply-diet-json-to-firestore.cjs`

**Deps:** service-account, JSON de dieta válido.

---

## Observações

- Esta pasta é **documentação + espelho** — scripts devem ser executados a partir da raiz do repositório DietOS, não daqui.
- `npm run reset-project` referencia `scripts/reset-project.js`, que **não existe** no DietOS.
- Maioria dos scripts assume **Windows** (PowerShell/CMD); builds Android locais dependem de **WSL** com SDK Linux.
- Arquivos `.cmd` são wrappers — a lógica real está nos `.ps1` ou `.mjs` correspondentes.
- Documentação ampliada de npm scripts e fluxos: [scripts.md](../scripts.md).
