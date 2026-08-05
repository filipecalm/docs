# Billing — Stripe (web) vs Google Play (app)

**Status:** Estratégia A em produção (2026-06-19) · Issue [#6](https://github.com/filipecalm/memory-game-monorepo/issues/6)

Contexto de negócio e planos: [product-analysis.md § Etapa 4](../product-analysis.md#etapa-4--modelo-de-monetização).

---

## Decisão v1 (Estratégia A)

| Canal | Custom (Básico / Plus) | Remover anúncios |
|-------|------------------------|------------------|
| **Site** | Stripe | — |
| **App Android** | Abre `memoria.almeidatech.online/criar` | Play Billing (`remove_ads`) |

**Motivo:** [Política Google Play](https://support.google.com/googleplay/android-developer/answer/10281818) exige Play Billing para conteúdo digital consumido no app. Jogo custom com fotos é conteúdo digital — Stripe **dentro** do fluxo nativo viola a política.

**Implementação:**

- `app/screens/Menu`, `Create`, `MyGames` → `openCreatorWeb()`
- `POST /api/stripe/checkout` com `platform: mobile` → **400** + URL do site
- Upload e “Meus jogos” no app funcionam para quem comprou no site

**Descartado:** Stripe só no app; produto físico como workaround.

**Futuro v2 (opcional):** produtos Play (`custom_game_basic`, etc.) + `POST /games/purchase/verify` com `purchaseToken`; substituir `openCreatorWeb` por fluxo nativo.

---

## Preços Stripe (web)

Configurar no [Stripe Dashboard → Products](https://dashboard.stripe.com/products) e no Vercel (back):

| Plano | Preço | Env |
|-------|-------|-----|
| Básico (6 fotos) | R$ 9,90 único | `STRIPE_PRICE_ID_BASIC` |
| Plus (12 fotos + extras) | R$ 27,90 único | `STRIPE_PRICE_ID_PLUS` |

Webhook produção: `https://memory-game-monorepo-back.vercel.app/api/webhook` · evento `checkout.session.completed` · `STRIPE_WEBHOOK_SECRET` no Vercel.

Teste: https://memoria.almeidatech.online/criar

---

## Taxas (estimativa)

| Canal | Taxa aproximada |
|-------|-----------------|
| Stripe | ~3,99% + R$ 0,40 |
| Google Play (&lt; US$ 1M/ano) | 15% |
| Google Play (padrão) | 30% |

---

## IAP `remove_ads` (Play Console)

Único IAP do app. **Product ID:** `remove_ads` — idêntico no código (`app/.env`, `app/src/constants/iap.ts`).

### Pré-requisitos

1. [Monetization setup](https://play.google.com/console/developers/app/monetization-setup) — perfil de pagamentos completo  
2. [In-app products](https://play.google.com/console/developers/app/in-app-products) → **Create product**

| Campo | Valor |
|-------|--------|
| Product ID | `remove_ads` |
| Nome | Remover anúncios |
| Descrição | Remove banners e intersticiais nos temas grátis. Compra única, mesma conta Google. |
| Tipo | One-time (não consumível) |
| Preço | ~R$ 4,90 |
| Status | **Active** |

3. IARC / Data safety: compras in-app = Sim  
4. Build publicado em faixa da Play (Internal testing mínimo) — IAP **não** funciona com sideload debug

### Testar

1. [License testing](https://play.google.com/console/developers/app/license-testing) — Gmail do testador  
2. Instalar via opt-in do teste interno  
3. Menu → Remover anúncios → Restaurar compras após reinstalar  

| Erro | Causa provável |
|------|----------------|
| Item não encontrado | ID ≠ `remove_ads` ou produto não Active |
| Compra indisponível | App não instalado via Play |
| Conta errada | Gmail fora de License testers |

### Build

```bash
cd app
eas build --profile production --platform android
eas submit --profile internal --platform android
```

Código: `app/context/AdsRemovedContext.tsx`

---

## Referências

- [launch-play-store.md](./launch-play-store.md) — env Vercel e checklist completo  
- Código: `app/src/utils/openCreatorWeb.ts`, `back/src/routes/stripe.ts`
