# AutoLog — Monetização

Documentação de planos, precificação, pagamentos e retenção do app **AutoLog** (repositório [car_maintenance](../../../car_maintenance)).

| Campo | Valor |
|-------|-------|
| **Produto** | AutoLog — controle de manutenção veicular |
| **Stack** | Flutter, offline-first, sync Appwrite opcional |
| **Meta de receita** | R$ 10.000/mês (MRR) |
| **Data** | junho/2026 |
| **Prompt origem** | [Monetizador do App](../../prompts-curated/desenvolvimento/app-development.md#4-o-monetizador-do-app) |

## Documentos

| Arquivo | Conteúdo |
|---------|----------|
| [monetizacao.md](./monetizacao.md) | Planos, preços, meta R$ 10k/mês, Stripe, upgrade e retenção |

## Arquivos relacionados no código

Repositório [car_maintenance](https://github.com/filipecalm/car_maintenance):

| Arquivo | Função |
|---------|--------|
| `web/pricing.html` | Página de preços |
| `scripts/stripe-checkout/` | Servidor de checkout |
| `lib/models/subscription_plan.dart` | Planos e limites |
| `lib/services/subscription_service.dart` | Enforcement e checkout |
