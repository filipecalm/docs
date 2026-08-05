# Memória Presente — Documentação

**Memória Presente** (repositório [memory_game](../../../memory_game)) — jogo da memória com temas grátis e presentes personalizados com fotos. Nome comercial atual; pacote Android permanece `com.filipecalm.memorygame`.

| Campo | Valor |
|-------|-------|
| **Produto** | Memória Presente — temas grátis + custom Básico/Plus |
| **Mercado-alvo** | Brasil (B2C familiar); B2B eventos como adjacente |
| **Site** | https://memoria.almeidatech.online |
| **Data da análise** | 2026-06-19 |
| **Issues GitHub** | ([#1–#17](https://github.com/filipecalm/memory-game-monorepo/issues)) |
| **Prompt (análise)** | [prompt-04-analise-produto.md](../../prompts-generic/prompt-04-analise-produto.md) |

## Análise de produto (Prompt 4)

| Arquivo | Conteúdo |
|---------|----------|
| [product-analysis.md](./product-analysis.md) | Mercado, concorrência, monetização, roadmap — Etapas 1–5 |
| [backlog.md](./backlog.md) | Roadmap em formato de issues (Etapa 5) |
| [github-issues.md](./github-issues.md) | Índice das issues + dependências |
| [github-issues.json](./github-issues.json) | Mapeamento ID → número/URL |

## Operação e runbooks

Documentação operacional consolidada a partir de `memory_game/docs/` (jun/2026). **Estratégia e preços detalhados:** só em [product-analysis.md](./product-analysis.md); runbooks cobrem execução.

| Documento | Conteúdo |
|-----------|----------|
| [operations/README.md](./operations/README.md) | Índice, URLs, ordem de lançamento |
| [operations/launch-play-store.md](./operations/launch-play-store.md) | Stripe, Vercel, Supabase, Play Console, EAS |
| [operations/billing.md](./operations/billing.md) | Stripe vs Play Billing + IAP `remove_ads` |
| [operations/store-compliance.md](./operations/store-compliance.md) | Rejeição por listagem enganosa |
| [operations/apk-standalone.md](./operations/apk-standalone.md) | APK opcional pós-custom |
| [operations/game-cards-art-brief.md](./operations/game-cards-art-brief.md) | Brief das 24 cartas ilustradas |
| [operations/dev-environment.md](./operations/dev-environment.md) | Dev Windows/Docker — erros comuns |

## Resumo executivo

1. Produto **em produção** — temas grátis + custom (Básico R$ 9,90 / Plus R$ 27,90 no site) + AdMob; billing app = só `remove_ads`.
2. Concorrente BR mais próximo: **Nossas Lembranças**; diferencial é app nativo + temas grátis.
3. **Estratégia A:** compra personalizada só no site; app redireciona para web creator ([billing.md](./operations/billing.md)).
4. **P0:** funil pós-compra, compliance, copy de produção — ver [backlog.md](./backlog.md).
5. Lançamento Play: [operations/launch-play-store.md](./operations/launch-play-store.md).
