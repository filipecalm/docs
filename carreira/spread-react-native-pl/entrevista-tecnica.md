# Preparação — Entrevista técnica React Native (Spread Pl)

Objetivo: passar screening técnico de **pleno**, sem fingir sênior de native bridge.

Estude em blocos de 25–40 min. Prioridade = o que a vaga lista.

---

## Roteiro de estudo (3–4 dias)

| Dia | Foco | Critério de pronto |
|-----|------|--------------------|
| 1 | JS/TS + React + RN fundamentals | Explica render, hooks, bridge vs New Arch em 2 min |
| 2 | Estado + dados (Context, Zustand, TanStack) | Compara os 3 com exemplo do DietOS/Bíblia |
| 3 | Navigation, Reanimated, performance, APIs | Conta 1 bug real que otimizou |
| 4 | Testes, EAS/CI-CD, Stripe, live coding | Roda um teste Jest e descreve pipeline EAS |

---

## 1) JavaScript / TypeScript (base)

### Perguntas prováveis
- Diferença `var` / `let` / `const`, hoisting, temporal dead zone
- Closures e quando estouram memória em RN
- `Promise` vs `async/await`; race conditions em fetch
- Optional chaining, nullish coalescing
- Tipagem: `interface` vs `type`; generics básicos; `unknown` vs `any`

### Respostas-âncora
- Prefira `const` + imutabilidade; evite mutar estado React.
- Em TypeScript, `any` esconde bug; use `unknown` + narrowing.
- Cancelar requests (AbortController) ao desmontar tela evita setState em unmounted.

### Mini exercício
Escreva uma função tipada `fetchJson<T>(url: string, signal?: AbortSignal): Promise<T>`.

---

## 2) React (conceitos modernos)

### Perguntas
- Re-render: o que dispara? Como reduzir?
- `useEffect` deps; stale closure
- `useMemo` / `useCallback` — quando **não** usar
- Controlled vs uncontrolled
- Keys em listas

### Respostas-âncora
- Re-render ≠ re-paint nativo sempre caro, mas JS demais trava a UI thread.
- Não wrappe tudo em memo “por padrão”; meça (why-did-you-render / logs).
- Keys estáveis (id), nunca index se a lista reordena.

### Pegadinha
“Por que meu Context atualiza a árvore inteira?”  
→ Valor do Provider muda de referência a cada render. Separe contexts ou use store externo (Zustand).

---

## 3) React Native fundamentals

### Perguntas
- Bridge clássica vs **New Architecture** (Fabric + TurboModules + JSI)
- Threads: JS, UI, Shadow (conceito)
- Diferença `View` vs `ScrollView` vs `FlatList`
- Quando `FlatList` / `FlashList`
- Platform-specific code (`Platform`, `.ios.tsx` / `.android.tsx`)
- Debug: Metro, Flipper/React DevTools, Logcat, Xcode

### Resposta segura sobre New Architecture
> A New Architecture troca a bridge assíncrona por comunicação mais direta via JSI. **Fabric** é o novo renderer; **TurboModules** carrega módulos nativos sob demanda com tipagem melhor. No Expo/RN recente isso vem habilitado por padrão na maioria dos projetos. Eu uso a stack moderna nos apps publicados; não implementei TurboModule nativo do zero, mas entendo o modelo e os ganhos de startup/interops.

Se pedirem detalhe nativo: admita limite e fale do que domina (JS/TS, módulos de comunidade, EAS).

### FlatList checklist
- `keyExtractor`
- `getItemLayout` quando altura fixa
- Evitar inline functions pesadas sem necessidade
- `windowSize` / `maxToRenderPerBatch` se lista enorme
- Não colocar lista dentro de ScrollView (virtualização morre)

---

## 4) Navegação

### Conceitos
- Stack / Tabs / Drawer
- Expo Router (file-based) vs React Navigation clássico
- Tipagem de params
- Deep linking básico
- Auth gate (grupo de rotas protegidas)

### Sua história
- Trabalho: React Navigation  
- Pessoais: Expo Router (`app/`)

### Pergunta clássica
“Como protege rotas autenticadas?”  
→ Listener de auth → redireciona para login; não confiar só em esconder botão; token em storage seguro quando sensível (`SecureStore`).

---

## 5) Estado: Context vs Zustand vs TanStack Query

| Ferramenta | Serve para | Seu exemplo |
|------------|------------|-------------|
| Context | Estado de UI / sessão pouco frequente | Bíblia: theme, favorites, auth |
| Zustand | Estado cliente global simples, sem boilerplate | DietOS: `store/` |
| TanStack Query | Cache de servidor, retry, staleTime, invalidation | DietOS: fetches |

### Frase de ouro
> Context para árvore local; Zustand para estado cliente compartilhado; TanStack para **server state**. Misturar os três no mesmo papel = dor.

### Perguntas
- Quando Redux ainda faz sentido? (time grande, middleware complexo, devops de state) — você pode dizer que prefere Zustand+Query no seu tamanho de app.
- Como invalida cache após POST de assinatura? → `queryClient.invalidateQueries`

---

## 6) APIs REST / GraphQL

### REST
- Verbos, status codes, idempotência (PUT/DELETE)
- Auth: Bearer JWT; refresh token flow (conceito)
- Tratamento de 401/403/500 na camada `services/`
- Timeout, retry com backoff

### GraphQL
- Query vs Mutation; overfetching; por que usaria (flexibilidade de shape)
- Você tem formação GraphQL — fale como conhecimento; não invente produção se não usou no Home Care

### Segurança mobile
- Não hardcodar secrets no app
- HTTPS only
- Validar input; não confiar no client para autorização (backend decide)

---

## 7) Reanimated + Gesture Handler

### O que precisam ouvir
- Animações na UI thread (worklets) vs `Animated` clássico na JS thread
- `useSharedValue`, `useAnimatedStyle`, `withTiming` / `withSpring`
- Gesture Handler: gestos nativos; composição com Reanimated
- Cuidado: não acessar JS state diretamente dentro de worklet sem shared values

### Sua evidência
Dependências presentes em DietOS e Bíblia. Prepare **um** exemplo concreto (ex.: swipe, tab indicator, scroll animado). Se não lembrar o arquivo, abra o repo antes da entrevista e anote o path.

---

## 8) Clean Architecture (versão honesta)

### O que dizer
> Organizo em camadas: **UI (screens/components)** → **estado (store/context)** → **services (API, Stripe, Firebase)** → dados externos. Domínio não deve conhecer detalhe de UI. Isso segue o espírito de Clean Architecture sem dogmatismo de pastas enterprise.

### O que não dizer
“Implemento CA completa com entities, use cases e repositories em todos os projetos” — a menos que mostre código.

---

## 9) Performance

Checklist mental:
1. Listas virtualizadas
2. Imagens: tamanho certo, cache
3. Evitar JS pesado no render path
4. Memo seletivo
5. Hermes (padrão moderno)
6. Medir antes de otimizar (systrace / perf monitor)

Pergunta: “App lento ao abrir.”  
Resposta estruturada: cold start (bundle, native init, splash) → hydrate auth → fetches paralelos vs waterfall → screens não bloqueantes.

---

## 10) Testes

### Obrigatório da vaga
- Jest: unit de funções/utils/stores
- RNTL: render de componente, `fireEvent`, asserts de texto/acessibilidade

### Frase se cobrarem E2E
> Hoje cubro unit/integration com Jest. Detox/Appium é gap que sei priorizar se o time tiver pipeline E2E; em produção já opero build/submit com EAS.

### Mini prática (faça antes)
Escreva 1 teste RNTL de um botão de favoritar versículo / toggle premium mockado.

---

## 11) CI/CD mobile (seu trunfo)

Saiba desenhar no quadro:

```
PR → (lint/test opcional) → EAS Build (profile preview/production)
    → EAS Submit (Play internal/beta/production)
    → EAS Update (OTA em canal preview, quando aplicável)
```

### Conceitos
- Profiles `eas.json` (preview vs production)
- VersionCode / versionName
- Credenciais de signing (Play App Signing)
- Diferença build nativo vs OTA update (limites: nativo novo precisa build)

### Sua evidência
Scripts `deploy`, `build:android`, `submit:android` em DietOS/Bíblia.

---

## 12) Pagamentos (desejável da vaga — você tem)

### Fluxo Stripe mobile (conceito)
1. Backend cria PaymentIntent / Subscription / Checkout Session  
2. App abre Payment Sheet (`@stripe/stripe-react-native`)  
3. Stripe confirma  
4. Webhook no backend atualiza entitlement  
5. App refetch subscription state  

### Pontos de entrevista
- Nunca confiar só no client (“paguei”) — webhook é fonte da verdade
- Idempotência no webhook
- Test clocks / mode test vs live
- Google Pay: você tem flags nos plugins; diga o que de fato habilitou

---

## 13) Live coding — padrões que caem

1. **Lista + pull-to-refresh + loading/error/empty**
2. **Form controlado com validação**
3. **Hook `useDebounce`**
4. **Cache simples ou integração TanStack Query**
5. **Componente acessível** (`accessibilityLabel`)

### Como se comportar
- Clarificar requisitos em voz alta (1 min)
- Entregar versão simples primeiro
- Depois melhorar (tipagem, erro, loading)
- Não fique mudo 5 minutos

---

## 14) Soft / comportamental técnico

| Pergunta | Direção da resposta |
|----------|---------------------|
| Conflito em code review | Exemplo + o que aprendeu; dados > ego |
| Prazo apertado | Corta escopo, não qualidade crítica; comunica risco |
| Bug em produção | Repro → hotfix → postmortem curto |
| Por que Spread / remoto | Autonomia + produto + CLT; alinhar com PaixãoPorTransformação sem discurso vazio — fale de **entrega publicada** |

---

## 15) Perguntas suas no final (escolha 2)

1. Qual o maior desafio atual do app (performance, New Arch migration, qualidade)?  
2. O time usa Expo/EAS ou RN bare? Como é o pipeline de release?  
3. Cobertura esperada de testes e se há Detox?  
4. Como é o code review e pairing no time remoto?

---

## 16) Red flags (não faça)

- Inventar Detox/Appium
- “Sou expert em Fabric” sem explicar JSI
- Criticar empregador atual
- Não saber abrir o próprio app na Play Store / falar package name
- Confundir Zustand com TanStack Query

---

## 17) Cheat-sheet de 1 página (decorar)

- RN: Fabric = renderer; TurboModules = native on-demand; JSI = ponte rápida  
- Estado: Context UI · Zustand client · TanStack server  
- Listas: FlatList sempre que lista longa  
- Testes: Jest + RNTL; E2E = gap consciente  
- Release: EAS Build → Submit → Update  
- Pagamentos: Stripe sheet + webhook = truth  
- Projetos: Home Care (prod) · DietOS (Zustand/Query/Stripe) · Bíblia (Context/offline/Stripe)

---

## Simulado rápido (30 min)

Cronometre respostas faladas (não só lidas):

1. Explique New Architecture (2 min)  
2. Context vs Zustand vs Query (2 min)  
3. Conte DietOS com STAR (90 s)  
4. Desenhe pipeline EAS (2 min)  
5. Fluxo Stripe + webhook (2 min)  
6. Como testaria um botão de favorito (2 min)  

Se travar em algum, anote e revise o repo correspondente no mesmo dia.
