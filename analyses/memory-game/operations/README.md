# Memória Presente — Operação e runbooks

Documentação **operacional** do app [memory_game](../../../memory_game): lançamento, billing, loja, assets e ambiente de dev.

> **Não duplicar:** estratégia de mercado, concorrência, roadmap e monetização estão em [product-analysis.md](../product-analysis.md) e [backlog.md](../backlog.md). Aqui só o *como fazer*.

| Campo | Valor |
|-------|-------|
| **Nome comercial** | Memória Presente |
| **Título Play Store** | Memória Presente - Jogo Fotos |
| **Pacote Android** | `com.filipecalm.memorygame` |
| **Site** | https://memoria.almeidatech.online |
| **API** | https://memory-game-monorepo-back.vercel.app/api |
| **Cópia canônica no monorepo** | `memory_game/docs/` (espelho; preferir esta pasta para índice central) |

## Runbooks

| Documento | Quando usar |
|-----------|-------------|
| [launch-play-store.md](./launch-play-store.md) | Publicar ou atualizar na Play Store — env, Stripe, Supabase, EAS, listagem |
| [billing.md](./billing.md) | Decisão Stripe vs Play Billing + configurar IAP `remove_ads` |
| [store-compliance.md](./store-compliance.md) | Rejeição por listagem enganosa ou screenshots errados |
| [apk-standalone.md](./apk-standalone.md) | APK opcional pós-compra custom + suporte ao usuário |
| [game-cards-art-brief.md](./game-cards-art-brief.md) | Brief das 24 cartas ilustradas (Heróis / Princesas) |
| [dev-environment.md](./dev-environment.md) | Setup dev Windows/Docker, Metro, Prisma, erros comuns |

## Ordem recomendada (primeiro lançamento)

1. [launch-play-store.md](./launch-play-store.md) §1–3 — Stripe, Vercel, migrations  
2. [billing.md](./billing.md) — produto `remove_ads` na Play Console  
3. [launch-play-store.md](./launch-play-store.md) §4–6 — Play Console, build, submit  
4. [store-compliance.md](./store-compliance.md) — revisar antes de enviar (evita rejeição)

## O que já está no código (não refazer)

- Nome **Memória Presente** no app, site e `play-store-listing.json`
- **Estratégia A:** custom pago só no site; app abre web creator (`openCreatorWeb`)
- API rejeita `platform: mobile` no checkout Stripe (400 + `web_url`)
- Páginas `/termos`, `/politica-de-privacidade`, `/suporte`
- IAP `remove_ads` implementado no app (`REMOVE_ADS_PRODUCT_ID`)

## Arquivos-chave no monorepo

| O quê | Caminho |
|-------|---------|
| Listagem Play (texto) | `app/play-store-listing.json` |
| Env app | `app/.env`, `app/app.json` |
| Env back/front | `back/.env`, `front/.env` |
| Screenshots loja | `app/assets/store/screenshots/` |
| Política privacidade | `front/src/pages/PrivacyPolicy/index.tsx` |
