# Stack Tecnológica

## Sumário

- [Mobile (raiz)](#mobile-raiz)
- [Backend (functions/)](#backend-functions)
- [Testes (tests/)](#testes-tests)
- [Infraestrutura e deploy](#infraestrutura-e-deploy)
- [Integrações externas](#integrações-externas)
- [⚠️ Observações](#️-observações)

---

## Mobile (raiz)

| Categoria | Tecnologia | Versão (package.json) |
|-----------|------------|----------------------|
| Runtime | Expo SDK | ~55.0.25 |
| Framework | React | 19.2.0 |
| UI nativa | React Native | 0.83.6 |
| Roteamento | expo-router | ~55.0.15 |
| Linguagem | TypeScript | ~5.9.2 (`strict: true`) |
| HTTP client | axios | ^1.16.1 |
| Estado servidor | @tanstack/react-query | ^5.56.2 |
| Estado local | zustand | ^5.0.0-rc.2 |
| Formulários | react-hook-form + zod | ^7.53.0 / ^3.23.8 |
| Firebase client | firebase | ^11.6.0 |
| Firebase nativo | @react-native-firebase/app, app-check | ^24.0.0 |
| Auth social | @react-native-google-signin/google-signin | ^16.1.2 |
| Pagamentos | @stripe/stripe-react-native | 0.63.0 |
| Animações | react-native-reanimated | 4.2.1 |
| Gráficos | react-native-gifted-charts | ^1.4.77 |
| Notificações | expo-notifications | ~55.0.23 |
| Persistência | @react-native-async-storage/async-storage, expo-secure-store | 2.2.0 / ~55.0.14 |
| PDF | jspdf | ^4.2.1 |
| Datas | moment | ^2.30.1 |
| Toast | react-native-toast-message | ^2.2.1 |
| Lint | eslint + eslint-config-expo | ^9.0.0 / ~55.0.1 |
| Testes | jest + jest-expo | ^29.2.1 / ~55.0.18 |

**Entry point:** `expo-router/entry` (`package.json` → `main`).

**Path alias:** `@/*` → raiz do projeto (`tsconfig.json`).

---

## Backend (functions/)

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| Runtime | Node.js | 22 (engines) |
| Plataforma | firebase-functions | ^7.2.5 |
| Admin SDK | firebase-admin | ^12.1.0 |
| HTTP | express | ^4.21.1 |
| CORS | cors | ^2.8.5 |
| IA | @google/generative-ai | ^0.24.1 |
| Pagamentos | stripe | ^20.3.1 |
| E-mail | nodemailer | ^8.0.6 |
| Validação | zod | ^3.25.76 |
| Dev server | tsx | ^4.19.1 |
| TypeScript | typescript | ^4.9.5 |

**Região de deploy:** `southamerica-east1` (`functions/src/server.ts`).

**Projeto Firebase:** `minha-dieta-67b3f` (`.firebaserc`).

---

## Testes (tests/)

| Pacote | Versão | Uso |
|--------|--------|-----|
| @firebase/rules-unit-testing | ^4.0.1 | Testes de regras Firestore/Storage |
| firebase | ^11.6.0 | Cliente para emuladores |

Runner: Node.js built-in test runner (`node --test`).

---

## Infraestrutura e deploy

| Serviço | Uso |
|---------|-----|
| **Firebase** | Auth, Firestore, Storage, Hosting, Functions, App Check |
| **EAS (Expo)** | Builds Android/iOS, OTA updates, env vars, submit Play Store |
| **Vercel** | Deploy do site estático (`hosting/`) |
| **Google Play** | Distribuição Android (tracks: production, beta, internal) |
| **GitHub** | Releases opcionais via `deploy-android.ps1` |

**Build Android:** `compileSdkVersion` / `targetSdkVersion` 36 (`app.json`).

**Deep link scheme:** `myapp://` (`app.json` → `expo.scheme`).

**OTA:** `expo-updates` com `runtimeVersion.policy: appVersion`.

---

## Integrações externas

| Integração | Onde | Finalidade |
|------------|------|------------|
| Firebase Auth | Mobile + Functions | Login e-mail/senha, Google Sign-In |
| Firestore | Mobile + Functions | Perfis, pacientes, dietas, mensagens |
| Firebase Storage | Mobile (rules) | Arquivos (regras em `storage.rules`) |
| Firebase App Check | Mobile + middleware backend | Proteção de API (parcialmente desativado no client) |
| Google Gemini | `CreateNutritionService` | Geração de planos alimentares |
| Stripe | Mobile + Functions | Assinaturas Premium, checkout, webhooks |
| Google Sign-In | Mobile | OAuth via Web Client ID |
| SMTP (Titan/HostGator) | Functions | E-mail de contato, recuperação de senha |
| reCAPTCHA | `recaptchaVerify.ts` | Contato do site |
| Expo Push | `expo-notifications` | Lembretes de refeição, mensagens nutri |

---

## Variáveis de ambiente

### Mobile (`.env` → EAS via `setup-env.ps1`)

Prefixo `EXPO_PUBLIC_*`: Firebase, API URL, Stripe publishable key, Google Web Client ID, flags de dev.

Resolução de API URL (`services/apiBaseUrl.ts`):

1. `EXPO_PUBLIC_BASE_URL`
2. `EXPO_PUBLIC_API_URL`
3. `expo.extra.apiBaseUrl` em `app.json`

### Backend (`functions/.env`)

Gemini, Stripe (secret + webhook), SMTP, CORS, limites de plano gratuito, App Check enforcement. Ver `functions/.env.example`.

---

## ⚠️ Observações

- **Zustand em RC** (`^5.0.0-rc.2`) — versão release candidate, não estável.
- **TanStack Query** configurado globalmente mas usado em poucas telas; maior parte do estado de API está em Zustand + `useEffect`.
- **Prettier** não configurado no repositório.
- **Jest** configurado (`jest-expo`) mas sem arquivos `*.test.ts(x)` no app mobile.
- **TypeScript no backend** (^4.9.5) diverge da versão do mobile (~5.9.2).
- **App Check** com código presente mas comentado em `app/_layout.tsx` e `services/api.ts`.
- Expo SDK **56** é a versão estável mais recente (changelog expo.dev); o projeto está em **SDK 55**.
