# AutoLog — Modelo de Monetização

Documento de referência para planos, precificação, metas de faturamento, pagamentos e retenção.

**Meta de receita:** R$ 10.000/mês (MRR)

---

## Contexto do produto

| Dimensão | Descrição |
|---|---|
| **App** | AutoLog — controle de manutenção veicular (Flutter, offline-first, sync Appwrite opcional) |
| **Público** | Donos de carro no Brasil (25–55 anos), famílias com 2+ veículos, entusiastas que querem evitar reparo caro |
| **Valor entregue** | Evita esquecimento de revisões (motor R$ 5k+, freios R$ 2k+), centraliza gastos, lembretes por km/dias, histórico para revenda |
| **Princípio** | Plano gratuito que entrega demais elimina o motivo de upgrade. O free prova valor; o pago remove fricção. |

---

## Estrutura de planos

### Gratuito — R$ 0

| Recurso | Limite | Motivo do limite |
|---|---|---|
| Veículos | 1 | Família com 2 carros = gatilho #1 de upgrade |
| Manutenções | 5 | Cobre óleo + freios + pneus; uso real estoura rápido |
| Alertas visuais (km + dias) | ✅ | Core do produto — gera confiança |
| Lembretes locais | ✅ | Prova que funciona |
| Histórico de gastos | 3 meses | Gráfico aparece, histórico some = frustração controlada |
| Foto da nota fiscal | ❌ | Feature tangível e desejável |
| Sincronização na nuvem | ❌ | Exclusivo Premium |
| Exportação PDF/CSV | ❌ | Exclusivo Premium |

### Básico — R$ 12,90/mês ou R$ 99/ano

Para motorista individual ou casal com 2 carros.

- Até 2 veículos
- Manutenções ilimitadas
- Lembretes completos
- Histórico e gráficos de gastos completos
- Foto da nota fiscal

**Por que maximiza conversão:** preço abaixo de R$ 15 (barreira psicológica BR), resolve ~80% dos casos de uso real.

### Premium — R$ 24,90/mês ou R$ 199/ano

Para famílias, quem troca de celular ou quer backup total.

- Veículos ilimitados
- Tudo do Básico
- Sincronização na nuvem (Appwrite)
- Backup automático entre dispositivos
- Fotos ilimitadas de notas
- Exportação PDF e CSV
- Suporte prioritário

**Por que maximiza conversão:** ancora o Básico como "escolha inteligente" e captura quem usa sync ou tem frota leve.

---

## Precificação (valor entregue, não custo)

| Plano | Mensal | Anual | Equivalente/mês | Desconto anual |
|---|---|---|---|---|
| Gratuito | R$ 0 | — | — | — |
| Básico | R$ 12,90 | R$ 99 | R$ 8,25 | −36% |
| Premium | R$ 24,90 | R$ 199 | R$ 16,58 | −36% |

### Justificativa por valor

- Troca de óleo esquecida → motor fundido → **R$ 5.000+**
- AutoLog Premium por 1 ano → **R$ 199** → ROI de 25× se evitar **um** erro grave
- Básico ≈ 1 café por semana; Premium ≈ 1/3 do custo de uma revisão básica

Anual com −36% aumenta LTV e reduz churn (compromisso psicológico).

---

## Cálculo para R$ 10.000/mês

### Mix recomendado: 74% Básico / 26% Premium

```
(463 × R$ 12,90) + (162 × R$ 24,90) = R$ 10.006/mês
```

| Plano | Pagantes | Receita mensal |
|---|---|---|
| Básico | 463 | R$ 5.973 |
| Premium | 162 | R$ 4.034 |
| **Total** | **625** | **~R$ 10.000** |

### Usuários free necessários (por taxa de conversão)

| Taxa free → pago | Usuários free |
|---|---|
| 2% | ~31.250 |
| 3% | ~20.833 |
| 5% | ~12.500 |

Com 3% de conversão e churn mensal de 5%, é preciso ~**1.100 novos pagantes/ano** para repor cancelamentos.

### Cenário alternativo (mais Premium)

```
(350 × R$ 12,90) + (220 × R$ 24,90) = R$ 9.993/mês
```

570 pagantes, mix 61/39 — viável se sync for posicionado como feature principal.

---

## Integração de pagamento

### Google Play Store + Stripe

**Correção:** dá para usar Stripe num app na Play Store — o que a política do Google restringe é cobrar **dentro do app**, por **billing próprio**, por **recursos digitais** (assinatura, desbloqueio de features) **sem** passar pelo Google Play Billing.

O que costuma funcionar (e provavelmente é o que você já faz no outro app):

| Modelo | Stripe? | Play Billing? | Observação |
|---|---|---|---|
| Checkout **externo** (browser / Custom Tab) | ✅ | ❌ | Usuário paga fora do fluxo nativo; app só valida entitlement no servidor |
| Assinatura **in-app** com botão que abre Stripe **dentro** do app | ⚠️ | ❌ | Risco de rejeição — Google trata como bypass de billing |
| Assinatura via **Google Play Billing** | ❌* | ✅ | Obrigatório se vender a assinatura **dentro** do app Android |
| **Híbrido** (Play no Android + Stripe na web) | ✅ | ✅ | Comum; RevenueCat ou backend unifica o tier |

\* O pagamento passa pela Google; o dinheiro não cai direto no Stripe, mas você pode espelhar o status no backend.

**Para o AutoLog na Play Store**, caminho alinhado ao que você já conhece:

1. **Stripe Checkout** em URL externa (`Custom Tabs` / `url_launcher`) — não embutir SDK de pagamento como se fosse compra nativa.
2. **Webhook Stripe** → Appwrite (`subscriptions`) → app consulta tier ao abrir / após login sync.
3. Opcional depois: **Google Play Billing** para quem prefere pagar pela loja (mesmos planos, preços ajustados à comissão de ~15–30%).

RevenueCat **não substitui** Stripe; ele **unifica** Play Billing + App Store + (opcional) Stripe web num único entitlement. Só é necessário se quiser IAP nativo **além** do Stripe.

### Gateways

| Canal | Solução | Motivo |
|---|---|---|
| Android (checkout externo) | **Stripe Checkout** + backend | Mesmo stack dos seus outros apps; BRL, webhooks, Customer Portal |
| Android (IAP nativo, opcional) | **Google Play Billing** + RevenueCat | Quem insiste em pagar pela Play Store |
| iOS (se publicar) | App Store IAP ou link externo conforme região | Regras da Apple são mais rígidas que a Google |
| PIX (fase 2) | Stripe PIX ou **Mercado Pago** | Preferência de pagamento no BR |

### Arquivos no repositório

Repositório [car_maintenance](https://github.com/filipecalm/car_maintenance):

| Arquivo | Função |
|---|---|
| `web/pricing.html` | Página de preços (WebView ou hospedagem) |
| `scripts/appwrite-functions/` | Appwrite Functions: checkout API + webhook Stripe → Appwrite |
| `scripts/appwrite-functions/stripe-checkout/` | Rotas: checkout, portal, status |
| `scripts/appwrite-functions/stripe-webhook/` | Webhook Stripe (raw body, assinatura) |
| `scripts/stripe-checkout/server.js` | Fallback local dev (Express, deprecated) |
| `lib/models/subscription_plan.dart` | Definição de planos, limites e price IDs Stripe |
| `lib/config/stripe_config.dart` | URL base da function `stripe-checkout` (`STRIPE_CHECKOUT_API`) |
| `lib/screens/pricing_screen.dart` | Planos + abertura do Stripe Checkout (Custom Tab) |
| `lib/services/subscription_service.dart` | Paywalls, checkout, deep link, polling do tier |

### Fluxo de checkout (Flutter → Stripe → Appwrite → app)

```
Configurações → Planos → Assinar
  → POST {checkout-function-domain}/create-checkout-session
  → Custom Tab / inAppBrowserView (Stripe Checkout)
  → success_url: autolog://checkout/success
  → webhook checkout.session.completed → tabela subscriptions (Appwrite)
  → deep link ou resume do app → GET {checkout-function-domain}/subscription/status?email=
  → SubscriptionService aplica tier local
```

### Configurar no app

1. Deploy das Appwrite Functions (`scripts/appwrite-functions/README.md`).
2. Copiar o **domain URL** da function `stripe-checkout` (Console → Functions → Domains).
3. Em `lib/config/stripe_config.dart`, substituir `checkoutApiBase` pelo domain (sem barra final).
4. Ou compilar com: `flutter run --dart-define=STRIPE_CHECKOUT_API=https://67abc123.nyc.appwrite.run`
5. Hot **restart** após mudar a URL.

Deep link Android: `autolog://checkout/*` (intent-filter no `AndroidManifest.xml`).

### Fluxo de checkout (legado HTML)

```
Usuário clica "Assinar" (pricing.html)
  → POST {checkout-function-domain}/create-checkout-session
  → Redirect Stripe Checkout (locale pt-BR)
  → Pagamento OK → webhook checkout.session.completed
  → Grava tier no Appwrite
  → App sincroniza entitlement local
```

### Deploy do backend (Appwrite Functions)

Backend roda como **Appwrite Cloud Functions** no mesmo projeto do sync (`nyc.cloud.appwrite.io`).

**Functions:**

| Function | HTTP domain | Rotas |
|---|---|---|
| `stripe-checkout` | `https://stripe-checkout.nyc.appwrite.run` | `POST /create-checkout-session`, `POST /create-portal-session`, `GET /subscription/status` |
| `stripe-webhook` | `https://stripe-webhook.nyc.appwrite.run/webhook` | `POST /webhook` |

**Variáveis de ambiente** (ambas functions, exceto webhook secret só na webhook):

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...   # só stripe-webhook
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=6a3c74e70029dbe8bb22
APPWRITE_API_KEY=...
APPWRITE_DATABASE_ID=6a3c78ed0025f5797df7
```

**Deploy via CLI:**

```bash
cd scripts/appwrite-functions
npm install
appwrite push functions
```

Ver `scripts/appwrite-functions/README.md` para checklist completo (Console, Stripe webhook, domains).

Rodar também `node scripts/appwrite-setup/setup.mjs` para garantir a table `subscriptions`.

**Fallback local:** `scripts/stripe-checkout/server.js` (Express, deprecated) — útil para dev sem deploy.

### Configuração Stripe (checklist)

Ordem recomendada: Appwrite → Stripe (produtos + webhook) → variáveis → price IDs no código → redeploy → app.

**URLs de produção (Appwrite NYC):**

| Recurso | URL |
|---|---|
| Checkout API | `https://stripe-checkout.nyc.appwrite.run` |
| Webhook Stripe | `https://stripe-webhook.nyc.appwrite.run/webhook` |

1. **Appwrite (pré-requisito)** — rodar `node scripts/appwrite-setup/setup.mjs` (table `subscriptions`). Deploy das functions (`appwrite push functions`); confirmar domains acima em Console → Functions → Domains. Detalhes em `scripts/appwrite-functions/README.md`.
2. **Products/Prices no Stripe** — criar 2 produtos (`AutoLog Básico`, `AutoLog Premium`) com 4 prices recorrentes (BRL):
   - Básico mensal R$ 12,90 · anual R$ 99
   - Premium mensal R$ 24,90 · anual R$ 199
   - Anotar cada `price_...` (test e live têm IDs diferentes). Pode ser via Dashboard **ou** Stripe API.
3. **Webhook no Stripe** — Developers → Webhooks → Add endpoint (ou API):
   - URL: `https://stripe-webhook.nyc.appwrite.run/webhook` (**não** usar `/v1/functions/.../executions`)
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copiar o **Signing secret** (`whsec_...`) — é **por endpoint**; secret antigo de outro app (ex. DietOS) **não** serve.
4. **Variáveis nas Appwrite Functions** — preencher `scripts/appwrite-functions/.env` (+ `scripts/appwrite-setup/.env` para IDs Appwrite) e rodar:
   ```bash
   cd scripts/appwrite-functions && node set-function-vars.mjs
   ```
   - `STRIPE_SECRET_KEY` → **ambas** functions
   - `STRIPE_WEBHOOK_SECRET` → **só** `stripe-webhook`
   - `APPWRITE_*` → ambas (ver tabela em [Deploy do backend](#deploy-do-backend-appwrite-functions))
5. **Price IDs no código** — IDs reais do Stripe em **dois** arquivos:
   - `lib/models/subscription_plan.dart` (`stripePriceIdMonthly` / `stripePriceIdAnnual`)
   - `scripts/appwrite-functions/shared/stripe-prices.js` (`PRICE_TO_TIER`) — o webhook usa este mapa para gravar o tier no Appwrite
6. **Redeploy das functions** — após alterar `shared/stripe-prices.js`:
   ```bash
   cd scripts/appwrite-functions && appwrite push functions
   ```
7. **Checkout URL no cliente** — `lib/config/stripe_config.dart` já aponta para `https://stripe-checkout.nyc.appwrite.run`; ou `--dart-define=STRIPE_CHECKOUT_API=...`. Opcional: `web/pricing.html` → `CHECKOUT_API` = `{checkout-domain}/create-checkout-session`
8. **Verificar**
   - Health: `curl https://stripe-checkout.nyc.appwrite.run/` → `{"ok":true,"service":"autolog-stripe-checkout"}`
   - Webhook vivo: `POST /webhook` sem header `stripe-signature` → `400 Missing stripe-signature header` (esperado)
   - Fluxo completo: pagamento teste → evento no Stripe Dashboard → registro em `subscriptions` → app consulta `GET .../subscription/status?email=`

Test mode vs live: usar chaves e price IDs do mesmo modo (test com test, live com live). Nunca commitar `.env`.

### Price IDs no código (referência — live, jun/2026)

| Plano | Produto Stripe | Mensal | Anual |
|---|---|---|---|
| Básico | `prod_Ulu25Okb3VXrud` | `price_1TmMEWCy1K0Ew08kitEiMcAQ` | `price_1TmMEWCy1K0Ew08ksoKV0skx` |
| Premium | `prod_Ulu2j3pVCGU8JP` | `price_1TmMEYCy1K0Ew08kBSkifNKh` | `price_1TmMEYCy1K0Ew08kV65ITwTV` |

Webhook endpoint live: `we_1TmMEVCy1K0Ew08kcdbK9MQm`

---

## Lógica de upgrade (free → pago)

Gatilhos no **momento da frustração**, não banner genérico.

| Momento | Mensagem | Plano sugerido |
|---|---|---|
| 6ª manutenção | "Seu carro tem mais revisões do que o plano gratuito cobre" | Básico |
| 2º carro | "Gerencie todos os veículos da família" | Básico |
| Anexar foto da nota | "Guarde comprovantes das revisões" | Básico |
| Gráfico com dados > 3 meses | Overlay borrado + CTA | Básico |
| Ativar sync | "Backup na nuvem entre dispositivos" | Premium |
| Exportar PDF/CSV | "Leve seus dados para onde quiser" | Premium |
| Alerta vermelho (80%+ urgência) | "Nunca perca uma revisão crítica" | Básico |

### Trial

7 dias Premium grátis no 1º cadastro (Stripe trial). Converte melhor que desconto percentual porque o usuário experimenta sync e backup.

### API de enforcement

`SubscriptionService` expõe:

- `canAddCar(currentCount)`
- `canAddMaintenance(currentCount)`
- `canUseCloudSync()`
- `canAttachReceipt()`
- `canExport()`
- `canViewExpenseBefore(date)`
- `blockReasonForCarLimit()`
- `blockReasonForMaintenanceLimit(count)`

---

## Retenção no cancelamento

### Passo 1 — Intercept (antes de cancelar)

Mostrar dados reais do usuário:

- "Você registrou **X manutenções** e evitou **Y alertas urgentes**"
- "Seus gastos documentados: **R$ Z**"
- "Sem sync, você perde histórico ao trocar de celular"

### Passo 2 — Ofertas escalonadas

1. **Pausar 30 dias** (Stripe pause collection)
2. **Downgrade para Básico** — metade do preço, mantém 2 carros
3. **Desconto 40% por 3 meses** — só se recusar as duas anteriores
4. **Cancelar** — sem dark patterns

Implementação via `POST /create-portal-session` → Stripe Customer Portal.

### Passo 3 — Pós-cancelamento

- Acesso até fim do período pago
- Dados locais **nunca apagados**
- E-mail D+7: win-back com alerta de manutenção pendente
- E-mail D+30: cupom `VOLTEI20` (20% off por 2 meses)

Churn acima de 8%/mês inviabiliza o modelo. Pausa de assinatura reduz cancelamento involuntário em ~15–25% em SaaS consumer.

---

## Limites por plano (referência técnica)

| Limite | Free | Básico | Premium |
|---|---|---|---|
| `maxCars` | 1 | 2 | 999 |
| `maxMaintenanceItems` | 5 | 999 | 999 |
| `cloudSync` | false | false | true |
| `receiptPhotos` | false | true | true |
| `expenseHistoryMonths` | 3 | 999 | 999 |
| `exportData` | false | false | true |
| `notifications` | true | true | true |

Fonte: `PlanLimits` em `lib/models/subscription_plan.dart`.

---

## Próximos passos de implementação

1. [x] Criar produtos e prices no Stripe (live)
2. [x] Deploy de `scripts/appwrite-functions/` (checkout + webhook) — **redeploy** após mudança em `stripe-prices.js`
3. [ ] Collection `subscriptions` no Appwrite (rodar `setup.mjs` se ainda não existir)
4. [x] Registrar `SubscriptionService` no GetX (`main.dart`)
5. [x] Bloquear ações nos controllers/telas com `canAddCar()` etc.
6. [ ] Checkout Stripe via URL externa na `PricingScreen` (Custom Tabs)
7. [ ] App buscar tier no Appwrite após pagamento (não só simulação debug)
8. [ ] (Opcional) Google Play Billing + RevenueCat para IAP nativo
9. [ ] Fluxo de intercept no cancelamento (Customer Portal + tela no app)

---

## Riscos e premissas

- R$ 10k/mês é meta agressiva para nicho consumer BR; gargalo tende a ser aquisição e conversão, não tabela de preços.
- Conversão abaixo de 2% exige repensar: subir Premium para R$ 29,90 e focar multi-carro, ou pivot B2B (oficinas).
- Play Store: Stripe via checkout **externo** + entitlement no servidor é viável; IAP nativo só é obrigatório se vender a assinatura **dentro** do fluxo in-app sem sair para pagamento externo.
- Documentação vive em `D:\Projetos\docs\analyses\autolog\` (não no repo do app).

---

*Última atualização: junho/2026*
