# Stripe Checkout + Webhook — Guia de Configuração

Runbook técnico, **independente de stack**, para integrar **Stripe Checkout** (pagamento externo) com **webhook** no backend. Aplica-se a apps **Flutter**, **Expo/React Native**, **web** ou qualquer cliente que abra uma URL de checkout no browser.

Para planos, preços e estratégia de monetização de um produto específico, ver documentação de produto à parte — este guia cobre **somente** a configuração Stripe e o fluxo servidor ↔ cliente.

---

## Visão geral da arquitetura

```
┌─────────────┐     POST /create-checkout-session      ┌──────────────────┐
│   Cliente   │ ─────────────────────────────────────► │     Backend      │
│ (app / web) │                                        │ (API + webhook)  │
└──────┬──────┘                                        └────────┬─────────┘
       │                                                        │
       │  URL da sessão (checkout.stripe.com/...)               │ sk_ (secret key)
       ▼                                                        ▼
┌─────────────┐     pagamento concluído              ┌──────────────────┐
│   Browser   │ ───────────────────────────────────► │      Stripe      │
│ Custom Tab  │                                      └────────┬─────────┘
│ url_launcher│                                               │
└──────┬──────┘                                               │ POST webhook
       │ success_url / deep link                              │ (eventos assinados)
       ▼                                                      ▼
┌─────────────┐     GET /subscription/status         ┌──────────────────┐
│   Cliente   │ ◄───────────────────────────────────── │     Backend      │
│  (resume)   │     tier / entitlement atualizado      │ grava entitlement│
└─────────────┘                                        └──────────────────┘
```

**Princípios:**

1. O **cliente nunca** usa a secret key (`sk_`). Só o backend cria sessões de checkout e valida webhooks.
2. O **entitlement** (plano ativo, premium, etc.) vive no **backend** (ou banco sincronizado por webhook). O app **consulta** o servidor — não confia só no redirect de sucesso.
3. **Test** e **Live** são ambientes **separados** na Stripe: chaves, price IDs e webhooks não se misturam.

---

## Escopo dos secrets

| Secret | Formato | Escopo | Onde usar |
|--------|---------|--------|-----------|
| **Secret key** | `sk_test_...` / `sk_live_...` | **Uma por conta Stripe** (mesma key para checkout + webhook no mesmo modo) | Backend que chama a API Stripe (criar sessão, portal, consultar subscription) |
| **Publishable key** | `pk_test_...` / `pk_live_...` | Conta + modo | Opcional no cliente se usar Stripe.js / Elements; **Checkout hospedado** muitas vezes não precisa no app |
| **Webhook signing secret** | `whsec_...` | **Um por endpoint de webhook** | **Somente** o handler do webhook que recebe POST da Stripe |
| **Price IDs** | `price_...` | Por produto/preço, **diferentes em test vs live** | Backend (mapeamento price → plano) e/ou cliente (se enviar price ID na requisição) |

**Regras importantes:**

- `sk_` é **compartilhada** entre rotas de checkout e webhook **no mesmo backend/modo**, mas **nunca** vai para o app mobile ou frontend público.
- `whsec_` é **por URL de webhook**. Criou outro endpoint, regenerou o secret ou duplicou ambiente → copie o **novo** `whsec_` e atualize **só** a function/serviço que trata esse POST.
- Nunca commitar `.env` com valores reais.

---

## Stripe Dashboard — produtos, preços e webhook

Ordem recomendada: **backend deployável** → **produtos/prices** → **webhook** → **variáveis de ambiente** → **price IDs no código** → **URL da API no cliente** → **teste ponta a ponta**.

### 1. Modo Test vs Live

No canto superior direito do [Dashboard Stripe](https://dashboard.stripe.com), alterne **Test** ou **Live**. Tudo abaixo (products, prices, webhooks, API keys) é **isolado por modo**.

Use **Test** até checkout + webhook + entitlement funcionarem; só então replique em **Live**.

### 2. Produtos e Prices

1. Menu **Product catalog** (Catálogo de produtos) → **Add product**.
2. Crie um produto por plano (ex.: Básico, Premium).
3. Em cada produto, adicione **Prices** recorrentes (mensal, anual) na moeda desejada (ex.: BRL).
4. Anote cada **`price_...`** — IDs de **test** e **live** são diferentes.

O backend (ou config do app) precisa mapear `price_...` → identificador interno do plano (ex.: `basic_monthly`, `premium_annual`).

### 3. API keys

1. Barra superior → **Developers** (Programadores) — link de texto ou ícone `</>`. Se não aparecer na sidebar da Home, use a **Search** do topo e digite `API keys`.
2. **Developers** → **API keys**.
3. Copie **Secret key** (`sk_test_...` ou `sk_live_...`) para o backend.
4. Publishable key só se o frontend precisar falar direto com Stripe (Checkout hospedado via redirect geralmente não exige).

> **Nota:** O painel lateral com API keys na Home **não** é a área de Webhooks. Webhooks ficam sempre em **Developers → Webhooks**.

### 4. Webhook — criar ou editar endpoint

1. Entre em [dashboard.stripe.com](https://dashboard.stripe.com) no modo correto (**Test** ou **Live**).
2. **Developers** → **Webhooks**.
3. **Endpoint existente:** clique nele → secção **Events** / **Listening to** → **Add events** ou **Update details** / **+ Select events**.
4. **Endpoint novo:** **Add endpoint** → **Endpoint URL**: URL pública HTTPS do teu handler (ex.: `https://api.exemplo.com/webhook/stripe` ou domain de Cloud Function / Appwrite Function — **não** URL interna de execução genérica se o teu host expõe um domain dedicado).
5. **Select events** — prefira lista explícita em vez de “Send all events”.
6. Se estiveres no separador **Selected events** e a pesquisa não encontrar um evento, muda para **All events** / **Todos os eventos**, pesquisa de novo e marca a checkbox.
7. Guarda (**Save** / **Add endpoint** / **Save destination**).

#### Eventos mínimos recomendados (assinaturas via Checkout)

| Evento | Quando dispara | Uso típico |
|--------|----------------|------------|
| `checkout.session.completed` | Checkout concluído com sucesso | Gravar subscription/customer logo após primeiro pagamento; ler `metadata` (user id, plano) |
| `customer.subscription.created` | Subscription criada | Fallback ou sync inicial |
| `customer.subscription.updated` | Upgrade, downgrade, renovação, trial → active | Atualizar tier e datas |
| `customer.subscription.deleted` | Cancelamento / fim | Rebaixar para free ou marcar cancelado |
| `invoice.payment_succeeded` | Pagamento de fatura OK | Opcional: auditoria / renovações |
| `invoice.payment_failed` | Falha de cobrança | Opcional: avisar utilizador, grace period |

Para MVP, **`checkout.session.completed`** + **`customer.subscription.updated`** + **`customer.subscription.deleted`** costumam bastar.

#### Signing secret

1. Na página do endpoint → **Signing secret** → **Reveal**.
2. Copia **`whsec_...`** para a variável de ambiente do **serviço webhook** (ex.: `STRIPE_WEBHOOK_SECRET`).
3. Se regeneraste o secret ou criaste endpoint novo, **atualiza o env e redeploy** — entregas antigas falham com 400 até lá.

Repita webhook + secret em **Test** e **Live** se usares os dois modos.

### 5. Testar entrega

- No endpoint: **Send test webhook** → escolhe `checkout.session.completed` → resposta **200**.
- Ou **Event deliveries** após pagamento teste → linha **succeeded** (não **failed**).
- **Developers → Logs** mostra chamadas **da tua API para a Stripe** (ex.: `POST /v1/checkout/sessions`) — **não** confundir com entregas **da Stripe para o teu webhook** (isso aparece no detalhe do endpoint / Event deliveries).

---

## Fluxo no cliente (checkout externo)

Modelo recomendado para **Play Store** e lojas similares quando vendes **recursos digitais** (assinatura, desbloqueio) **sem** Google Play Billing:

| Abordagem | Play Billing? | Stripe? | Observação |
|-----------|---------------|---------|------------|
| Checkout **externo** (browser / Custom Tab / `url_launcher`) | Não | Sim | Utilizador paga **fora** do fluxo nativo; app valida entitlement no servidor |
| Pagamento embutido in-app como compra nativa bypass | Não | ⚠️ | Risco de rejeição na Play Store |
| Google Play Billing in-app | Sim | Não* | Obrigatório se vender assinatura **dentro** do app Android sem sair para pagamento externo |

\* Receita passa pela Google; podes espelhar tier no teu backend via Real-time Developer Notifications ou serviços como RevenueCat.

### Sequência típica

1. Utilizador escolhe plano na app ou web.
2. Cliente chama backend: `POST /create-checkout-session` com `priceId` (e identificador do utilizador: email, uid, etc.).
3. Backend cria `Checkout Session` na Stripe e devolve `{ url: "https://checkout.stripe.com/..." }`.
4. Cliente abre URL:
   - **Flutter:** `url_launcher` ou Custom Tabs (`launchUrl`, `ChromeSafariBrowser`).
   - **Expo/React Native:** `Linking.openURL` ou `expo-web-browser` / Custom Tabs.
   - **Web:** `window.location.href = url`.
5. Stripe redireciona para `success_url` / `cancel_url` (HTTPS ou deep link, ex.: `myapp://checkout/success`).
6. App **resume** → consulta backend (`GET /subscription/status?userId=...`) — **não** assumir premium só pelo redirect.
7. Backend já foi atualizado pelo **webhook** (fonte de verdade).

### Deep links (mobile)

Regista o scheme ou App Link no manifest (Android) / Associated Domains (iOS). Exemplo de intent: `myapp://checkout/*`.

---

## Backend — variantes comuns

O contrato mínimo é o mesmo; só muda onde hospedas.

| Variante | Onde roda | Checkout API | Webhook | Notas |
|----------|-----------|--------------|---------|-------|
| **Firebase Cloud Functions** | GCP | Express montado em `functions` | Rota dedicada com **raw body** antes de `express.json()` | Secrets: `firebase functions:secrets:set` |
| **Appwrite Functions** | Appwrite Cloud | Function com domain HTTP | Function separada ou mesma com path `/webhook` | Vars no Console ou CLI; domain da function ≠ URL `/executions` |
| **Express + Vercel/Railway/Fly** | Node serverless ou container | `POST /create-checkout-session` | `POST /webhook/stripe` | Vercel: desativar body parser na rota webhook |
| **Supabase Edge Functions** | Deno | Edge function checkout | Edge function webhook | Raw body via `req.text()` |
| **AWS Lambda + API Gateway** | Lambda | API REST | Lambda com payload base64/raw | Configurar content handling |

### Rotas mínimas sugeridas

| Método | Rota | Função |
|--------|------|--------|
| `POST` | `/create-checkout-session` | Cria sessão; body: `priceId`, `customerEmail`, `userId` (metadata) |
| `POST` | `/create-portal-session` | Opcional: Customer Portal (gerir/cancelar assinatura) |
| `GET` | `/subscription/status` | Devolve tier atual para o cliente |
| `POST` | `/webhook` (ou `/webhook/stripe`) | Recebe eventos Stripe; **sem** JSON parser global no raw body |

### Webhook — requisitos de implementação

1. **Corpo bruto (raw body):** a verificação de assinatura usa o bytes exatos do POST. Se `express.json()` ou middleware equivalente parsear antes, **`constructEvent` falha** → HTTP 400.
2. **Header `Stripe-Signature`:** passar para `stripe.webhooks.constructEvent(rawBody, signature, whsec)`.
3. **Idempotência:** a Stripe pode reenviar eventos; usar `event.id` para não processar duas vezes.
4. **Resposta rápida:** responder **200** após persistir (ou enfileirar); trabalho pesado assíncrono se necessário.
5. **Metadata na Checkout Session:** incluir `userId` / `firebaseUID` / `appwriteUserId` ao criar a sessão — o webhook usa isso para gravar entitlement.

Exemplo conceitual (Node/Express):

```javascript
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // switch (event.type) { ... }
  res.json({ received: true });
});
```

Regista rotas **webhook antes** de `express.json()` global, ou isola num sub-app só com `raw`.

### Persistência do entitlement

Onde gravar depende do stack — padrão genérico:

| Campo | Exemplo |
|-------|---------|
| Identificador do utilizador | `userId`, email, uid Firebase |
| Plano / tier | `basic`, `premium`, `free` |
| Stripe customer id | `cus_...` |
| Stripe subscription id | `sub_...` |
| Status | `active`, `canceled`, `past_due` |
| Período atual | `currentPeriodEnd` |

Firestore, Postgres, Appwrite Database, Supabase — qualquer um serve; o webhook **escreve**, o cliente **lê** via API autenticada.

---

## Variáveis de ambiente (referência genérica)

| Variável | Obrigatória em | Descrição |
|----------|----------------|-----------|
| `STRIPE_SECRET_KEY` | API checkout + portal | `sk_test_...` ou `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | **Só** handler webhook | `whsec_...` do endpoint correspondente |
| `STRIPE_PUBLISHABLE_KEY` | Cliente (opcional) | `pk_test_...` / `pk_live_...` |
| `STRIPE_PRICE_ID_*` | Backend ou config | IDs por plano/ciclo, ex.: `STRIPE_PRICE_ID_MONTHLY=price_...` |
| `CHECKOUT_SUCCESS_URL` | Backend | URL ou deep link após sucesso |
| `CHECKOUT_CANCEL_URL` | Backend | URL ao cancelar |
| `PUBLIC_API_BASE_URL` | Cliente | Base da API de checkout/status |
| `DATABASE_*` / `APPWRITE_*` / `FIREBASE_*` | Backend | Credenciais do teu datastore |

Exemplo `.env` (placeholders):

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx
STRIPE_PRICE_ID_BASIC_MONTHLY=price_xxxxxxxx
STRIPE_PRICE_ID_BASIC_ANNUAL=price_xxxxxxxx
CHECKOUT_SUCCESS_URL=https://app.exemplo.com/checkout/success
CHECKOUT_CANCEL_URL=https://app.exemplo.com/checkout/cancel
PUBLIC_API_BASE_URL=https://api.exemplo.com
```

---

## Checklist de verificação

- [ ] Produtos e prices criados no modo correto (test/live)
- [ ] Price IDs reais no backend (mapa price → plano)
- [ ] Backend deployado com URL pública HTTPS
- [ ] `STRIPE_SECRET_KEY` no serviço de checkout (mesmo modo que os prices)
- [ ] Webhook endpoint registrado com URL exata do handler
- [ ] Eventos subscritos: pelo menos `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] `STRIPE_WEBHOOK_SECRET` **só** no serviço webhook, valor do **mesmo** endpoint e **mesmo** modo
- [ ] Handler usa **raw body** + `Stripe-Signature`
- [ ] Cliente abre checkout em browser externo (não SDK in-app de pagamento para digital goods na Play Store)
- [ ] `success_url` / deep link configurados
- [ ] Cliente consulta `/subscription/status` após retorno — não confia só no redirect
- [ ] Pagamento teste (cartão `4242 4242 4242 4242`) → Event delivery **succeeded** → registro no banco → app mostra plano correto
- [ ] Test e Live configurados separadamente antes de produção

---

## Troubleshooting

### HTTP 400 na verificação de assinatura (`constructEvent` failed)

| Causa provável | Correção |
|----------------|----------|
| `whsec_` errado ou desatualizado | Dashboard → endpoint → **Signing secret** → Reveal → atualizar env → redeploy |
| Secret de **Test** com eventos **Live** (ou vice-versa) | Ver `livemode` no evento; usar webhook + secret do mesmo modo |
| Endpoint duplicado | Cada URL tem o seu `whsec`; confirma qual URL a Stripe está a chamar |
| Body parseado antes da verificação | Usar raw body na rota webhook; não passar por `express.json()` global |

**Como confirmar:** Stripe → webhook → **Event deliveries** → tentativa failed → HTTP status e response body. Se a mensagem menciona signature, é quase sempre `whsec` ou raw body.

### Webhook 100% failed, mas checkout funciona

- **Developers → Logs** (API outbound) ≠ entregas inbound. Olha **Event deliveries** no endpoint.
- URL errada (404), firewall, ou function cold start timeout.
- Handler devolve 500 — vê logs do servidor (GCP, Appwrite, Vercel, etc.).

### Pagamento OK na Stripe, app continua free

- Webhook não configurado ou a falhar → entitlement nunca gravado.
- Falta `checkout.session.completed` na lista de eventos.
- Metadata (`userId`) ausente na sessão → webhook não sabe a quem associar.
- Cliente só olha redirect e não chama `/subscription/status`.
- App em test com webhook live (ou preços test com key live).

### `POST /v1/checkout/sessions` retorna 400 nos Logs

- Price ID inválido ou de outro modo (test price com `sk_live_`).
- URLs `success_url` / `cancel_url` inválidas ou não permitidas.
- Parâmetros obrigatórios em falta na criação da sessão.

### Regenerar signing secret

1. Stripe → endpoint → **Roll secret** / regenerar.
2. Copiar novo `whsec_`.
3. Atualizar env no backend.
4. Redeploy.
5. **Resend** num evento failed — deve passar a 200.

---

## Test vs Live — resumo

| Item | Test | Live |
|------|------|------|
| Secret key | `sk_test_...` | `sk_live_...` |
| Price IDs | `price_...` (test) | `price_...` (live, IDs diferentes) |
| Webhook endpoint | Separado | Separado |
| Signing secret | `whsec_...` (test) | `whsec_...` (live) |
| Cartões | `4242 4242 4242 4242`, etc. | Cartões reais |

Nunca misturar: key de test com price de live quebra sessões e webhooks de forma silenciosa ou confusa.

---

## Referências

- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Verificar assinatura webhook](https://stripe.com/docs/webhooks/signatures)
- [Testing](https://stripe.com/docs/testing)

---

*Guia genérico — junho/2026. Sem secrets reais; substituir placeholders pelos valores do teu Dashboard.*
