# Architecture Decision Records (inferidos)

Registros inferidos **exclusivamente** do código e configuração existentes. Não há ADRs formais no repositório.

## Sumário

- [ADR-001: Expo Router com grupos por papel](#adr-001-expo-router-com-grupos-por-papel)
- [ADR-002: Firebase como BaaS principal](#adr-002-firebase-como-baas-principal)
- [ADR-003: Express monolítico em Cloud Functions](#adr-003-express-monolítico-em-cloud-functions)
- [ADR-004: Zustand para estado compartilhado leve](#adr-004-zustand-para-estado-compartilhado-leve)
- [ADR-005: Context para autenticação e i18n](#adr-005-context-para-autenticação-e-i18n)
- [ADR-006: Axios com interceptor de token Firebase](#adr-006-axios-com-interceptor-de-token-firebase)
- [ADR-007: Gemini para geração de dietas](#adr-007-gemini-para-geração-de-dietas)
- [ADR-008: Stripe para monetização Premium](#adr-008-stripe-para-monetização-premium)
- [ADR-009: Região southamerica-east1](#adr-009-região-southamerica-east1)
- [ADR-010: EAS para builds e OTA](#adr-010-eas-para-builds-e-ota)
- [ADR-011: SecureStore para cache de perfil](#adr-011-securestore-para-cache-de-perfil)
- [ADR-012: Rate limiting por rota na API](#adr-012-rate-limiting-por-rota-na-api)
- [ADR-013: App Check parcialmente adiado](#adr-013-app-check-parcialmente-adiado)
- [ADR-014: StyleSheet + paleta fixa (sem UI library)](#adr-014-stylesheet--paleta-fixa-sem-ui-library)
- [ADR-015: Testes focados em regras de segurança](#adr-015-testes-focados-em-regras-de-segurança)
- [⚠️ Observações](#️-observações)

---

## ADR-001: Expo Router com grupos por papel

**Status:** Implementado

**Contexto:** App com dois fluxos distintos (paciente e nutricionista) e telas compartilhadas.

**Decisão:** File-based routing com grupos `(patient)`, `(professional)`, `(shared)` e `RoleRouteGuard` nos layouts de grupo.

**Evidência:** `app/(patient)/_layout.tsx`, `app/(professional)/_layout.tsx`, `utils/roleRoutes.ts`.

**Consequências:**
- URLs estáveis por papel (`/patient/home`, `/professional/home`)
- Guard centralizado evita telas duplicadas de redirecionamento

---

## ADR-002: Firebase como BaaS principal

**Status:** Implementado

**Contexto:** Auth, banco de dados, storage e hosting no mesmo ecossistema.

**Decisão:** Firebase Auth + Firestore + Storage + Hosting; cliente mobile usa SDK JS com persistência RN.

**Evidência:** `services/firebase.ts`, `firebase.json`, `.firebaserc`.

**Consequências:**
- Leitura direta Firestore no client para dados do usuário
- Regras de segurança críticas (`firestore.rules`, testes em `tests/`)

---

## ADR-003: Express monolítico em Cloud Functions

**Status:** Implementado

**Contexto:** API REST para operações sensíveis (IA, Stripe, e-mail, mensagens).

**Decisão:** Um único app Express (`createApp.ts`) montado como `onRequest` Firebase Functions v2.

**Evidência:** `functions/src/server.ts`, `functions/src/createApp.ts`, `functions/src/routes.ts`.

**Consequências:**
- Cold start mitigado com cache de instância Express
- Webhook Stripe requer rota raw antes de `express.json()`

---

## ADR-004: Zustand para estado compartilhado leve

**Status:** Implementado

**Contexto:** Estado global mínimo além de auth (paciente selecionado, subscription).

**Decisão:** Zustand em `store/patientStore.ts` e `store/subscriptionStore.ts`.

**Evidência:** Imports em `PremiumGuard`, `useSubscription`, telas de paciente.

**Consequências:**
- Menos boilerplate que Redux
- Versão RC (`^5.0.0-rc.2`) — possível instabilidade de API

**Nota:** TanStack Query está configurado (`app/_layout.tsx`) mas não é o padrão dominante para fetch de API.

---

## ADR-005: Context para autenticação e i18n

**Status:** Implementado

**Contexto:** Sessão e idioma necessários em quase todas as telas.

**Decisão:** `AuthProvider` e `LanguageProvider` como React Context.

**Evidência:** `context/auth.tsx` (663 linhas), `context/language.tsx`.

**Consequências:**
- `auth.tsx` concentra lógica de sign-in, Google, cache, Firestore
- Re-renders em árvore ampla quando `user` muda

---

## ADR-006: Axios com interceptor de token Firebase

**Status:** Implementado

**Contexto:** API backend exige JWT Firebase em `Authorization: Bearer`.

**Decisão:** Instância Axios única com interceptor request (token) e response (retry 401 em subscription).

**Evidência:** `services/api.ts`.

**Consequências:**
- Telas não gerenciam tokens manualmente
- Retry mitiga timing entre Auth e primeira chamada Premium

---

## ADR-007: Gemini para geração de dietas

**Status:** Implementado

**Contexto:** Planos alimentares personalizados a partir de dados clínicos.

**Decisão:** `@google/generative-ai` no backend; input sanitizado (`sanitizeLlmInput.ts`).

**Evidência:** `functions/src/services/CreateNutritionService.ts`, `functions/.env.example` → `GEMINI_MODEL`.

**Consequências:**
- Geração apenas server-side (chave API não exposta no client)
- Rate limit dedicado (`rateLimitNutritionAi`)

---

## ADR-008: Stripe para monetização Premium

**Status:** Implementado

**Contexto:** Recursos premium (regeneração de dieta, etc.) via assinatura.

**Decisão:** Stripe Checkout + webhooks + `@stripe/stripe-react-native` no mobile.

**Evidência:** `StripeController.ts`, `stripe.service.ts`, `app.json` plugin Stripe.

**Consequências:**
- Deep link `myapp://subscription/success` pós-checkout
- `checkPremium` middleware no backend; `PremiumGuard` no client

---

## ADR-009: Região southamerica-east1

**Status:** Implementado

**Contexto:** Latência para usuários no Brasil.

**Decisão:** Cloud Function `api` deployada em `southamerica-east1`.

**Evidência:** `functions/src/server.ts`, `app.json` → `extra.apiBaseUrl`.

---

## ADR-010: EAS para builds e OTA

**Status:** Implementado

**Contexto:** Distribuição Android via Play Store; updates sem rebuild completo.

**Decisão:** EAS Build (profiles development/preview/production) + `expo-updates` com `runtimeVersion: appVersion`.

**Evidência:** `eas.json`, `app.json` → `updates.url`, scripts `deploy-android.ps1`.

**Consequências:**
- Env vars mobile via EAS (`setup-env.ps1`)
- Builds locais dependem de WSL no Windows

---

## ADR-011: SecureStore para cache de perfil

**Status:** Implementado

**Contexto:** Acelerar boot e login com dados de perfil offline.

**Decisão:** `expo-secure-store` (native) / AsyncStorage (web) em `utils/userStorage.ts`.

**Evidência:** `loadCachedUser`, `saveCachedUser` usados em `context/auth.tsx`.

**Consequências:**
- Perfil cacheado localmente; role e nome disponíveis antes do Firestore responder
- Não substitui Firestore como fonte de verdade

---

## ADR-012: Rate limiting por rota na API

**Status:** Implementado

**Contexto:** Proteção contra abuso (IA, contato, auth, patient link).

**Decisão:** Middlewares `rateLimit*` em `functions/src/middlewares/rateLimit.ts` aplicados seletivamente em `routes.ts`.

**Evidência:** Rotas `/create`, `/auth/forgot-password`, `/contact/nutritionist`, etc.

---

## ADR-013: App Check parcialmente adiado

**Status:** Implementado com enforcement configurável; client desativado

**Contexto:** Proteção contra clientes não autorizados na API.

**Decisão:** Middleware `verifyAppCheck` no backend; código client comentado em `api.ts` e `_layout.tsx`.

**Evidência:** `APP_CHECK_ENFORCE` em `functions/.env.example`; imports comentados no mobile.

**Consequências:**
- API pode operar sem App Check no client em dev
- Reativação exigiria `EXPO_PUBLIC_APP_CHECK_DEBUG_TOKEN` e deploy com enforcement

---

## ADR-014: StyleSheet + paleta fixa (sem UI library)

**Status:** Implementado

**Contexto:** UI customizada com tema escuro DietOS.

**Decisão:** `constants/colors.ts` + `StyleSheet.create` por componente; sem NativeWind, Paper ou Tamagui.

**Evidência:** `app/_layout.tsx`, `components/PremiumGuard.tsx`, ausência dessas deps em `package.json`.

**Consequências:**
- Consistência visual depende de convenção manual
- `userInterfaceStyle: automatic` sem implementação de tema claro

---

## ADR-015: Testes focados em regras de segurança

**Status:** Implementado

**Contexto:** Pentest checklist (PT-001 a PT-008) para Firestore/Storage.

**Decisão:** Suite em `tests/firestore.rules.test.cjs` rodada via emuladores; Jest mobile sem specs.

**Evidência:** `npm run test:firestore-rules`, `tests/README.md`, `docs/PENTEST_CHECKLIST.md`.

**Consequências:**
- Cobertura forte em IDOR/role/premium nas rules
- Lógica de negócio mobile/backend sem testes unitários automatizados

---

## ⚠️ Observações

- ADRs acima são **reconstrução** a partir do código — não há pasta `docs/adr/` nem processo formal de aprovação no repositório.
- Algumas escolhas coexistem sem consolidação (ex.: React Query + Zustand + Context para estado remoto).
- `firebase-functions` na raiz do `package.json` (^4.9.0) parece residual; runtime usa apenas `functions/package.json` (^7.2.5).
