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

### Gateways

| Canal | Solução | Motivo |
|---|---|---|
| Web / checkout externo | **Stripe Checkout** | BRL, API madura, Customer Portal, webhooks |
| Google Play / App Store | **RevenueCat** | Obrigatório para IAP; unifica entitlement |
| PIX (fase 2) | Stripe PIX ou **Mercado Pago** | Preferência de pagamento no BR |

Stripe + RevenueCat cobre web + mobile com uma fonte de verdade de entitlement.

### Arquivos no repositório

Repositório [car_maintenance](https://github.com/filipecalm/car_maintenance):

| Arquivo | Função |
|---|---|
| `web/pricing.html` | Página de preços (WebView ou hospedagem) |
| `scripts/stripe-checkout/server.js` | API: checkout, portal de cancelamento, webhook → Appwrite |
| `scripts/stripe-checkout/package.json` | Dependências do servidor |
| `lib/models/subscription_plan.dart` | Definição de planos, limites e price IDs Stripe |
| `lib/services/subscription_service.dart` | Enforcement de limites + chamada ao checkout |

### Fluxo de checkout

```
Usuário clica "Assinar" (pricing.html)
  → POST /create-checkout-session (server.js)
  → Redirect Stripe Checkout (locale pt-BR)
  → Pagamento OK → webhook checkout.session.completed
  → Grava tier no Appwrite
  → App sincroniza entitlement local
```

### Deploy do backend

```bash
cd scripts/stripe-checkout
npm install
STRIPE_SECRET_KEY=sk_... \
STRIPE_WEBHOOK_SECRET=whsec_... \
APPWRITE_ENDPOINT=... \
APPWRITE_PROJECT_ID=... \
APPWRITE_API_KEY=... \
APPWRITE_DATABASE_ID=... \
node server.js
```

### Configuração Stripe

1. Criar Products/Prices no Stripe Dashboard:
   - `price_BASIC_MONTHLY` — R$ 12,90/mês
   - `price_BASIC_ANNUAL` — R$ 99/ano
   - `price_PREMIUM_MONTHLY` — R$ 24,90/mês
   - `price_PREMIUM_ANNUAL` — R$ 199/ano
2. Apontar webhook para `POST /webhook`
3. Em `web/pricing.html`, alterar `CHECKOUT_API` para a URL do servidor
4. No app, configurar endpoint via `SubscriptionService.setCheckoutEndpoint()`

### Price IDs no código

Definidos em `lib/models/subscription_plan.dart`:

- Básico mensal: `price_BASIC_MONTHLY`
- Básico anual: `price_BASIC_ANNUAL`
- Premium mensal: `price_PREMIUM_MONTHLY`
- Premium anual: `price_PREMIUM_ANNUAL`

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

1. [ ] Criar produtos e prices no Stripe
2. [ ] Deploy de `scripts/stripe-checkout/server.js`
3. [ ] Collection `subscriptions` no Appwrite
4. [ ] Registrar `SubscriptionService` no GetX (`main.dart`)
5. [ ] Bloquear ações nos controllers/telas com `canAddCar()` etc.
6. [ ] Tela de upgrade (WebView → `web/pricing.html` ou `url_launcher`)
7. [ ] RevenueCat ao publicar na Play Store / App Store
8. [ ] Fluxo de intercept no cancelamento (Customer Portal + tela no app)

---

## Riscos e premissas

- R$ 10k/mês é meta agressiva para nicho consumer BR; gargalo tende a ser aquisição e conversão, não tabela de preços.
- Conversão abaixo de 2% exige repensar: subir Premium para R$ 29,90 e focar multi-carro, ou pivot B2B (oficinas).
- App Store / Play Store exigem IAP nativo para assinaturas in-app — Stripe sozinho não basta dentro do app mobile.

---

*Última atualização: junho/2026*
