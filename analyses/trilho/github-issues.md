# Trilho — Issues no GitHub

Backlog sincronizado com o repositório [filipecalm/trillho](https://github.com/filipecalm/trillho).

| Campo | Valor |
|-------|-------|
| **Criadas em** | 2026-06-18 |
| **Total** | 23 issues (#8–#30) |
| **Labels** | `fase-1`, `fase-2`, `fase-3`, `P0`, `P1`, `P2`, + labels por área |
| **Board** | [Issues abertas](https://github.com/filipecalm/trillho/issues) |

## Índice rápido

| ID | GitHub | Título | Prioridade | Fase |
|----|--------|--------|------------|------|
| TRILHO-001 | [#8](https://github.com/filipecalm/trillho/issues/8) | Categorias no lançamento e no histórico | P0 | 1 |
| TRILHO-002 | [#9](https://github.com/filipecalm/trillho/issues/9) | Orçamento mensal com barra de progresso na Home | P0 | 1 |
| TRILHO-003 | [#10](https://github.com/filipecalm/trillho/issues/10) | Lembretes de contas a pagar | P0 | 1 |
| TRILHO-004 | [#11](https://github.com/filipecalm/trillho/issues/11) | Alinhar README e listing da Play Store | P0 | 1 |
| TRILHO-005 | [#12](https://github.com/filipecalm/trillho/issues/12) | Firebase Analytics + eventos do funil | P0 | 1 |
| TRILHO-006 | [#13](https://github.com/filipecalm/trillho/issues/13) | Decisão explícita sobre AdMob | P1 | 1 |
| TRILHO-007 | [#14](https://github.com/filipecalm/trillho/issues/14) | Onboarding de 3 telas | P1 | 1 |
| TRILHO-008 | [#15](https://github.com/filipecalm/trillho/issues/15) | Trilho Pro — paywall e assinatura | P1 | 2 |
| TRILHO-009 | [#16](https://github.com/filipecalm/trillho/issues/16) | Orçamento por categoria (premium) | P1 | 2 |
| TRILHO-010 | [#17](https://github.com/filipecalm/trillho/issues/17) | Gráfico de gastos por categoria | P1 | 2 |
| TRILHO-011 | [#18](https://github.com/filipecalm/trillho/issues/18) | TodoList → Listas de compras com teto | P1 | 2 |
| TRILHO-012 | [#19](https://github.com/filipecalm/trillho/issues/19) | Modo Trilho — streak diário | P1 | 2 |
| TRILHO-013 | [#20](https://github.com/filipecalm/trillho/issues/20) | Cache Firestore com React Query | P1 | 2 |
| TRILHO-014 | [#21](https://github.com/filipecalm/trillho/issues/21) | Export CSV do mês | P2 | 2 |
| TRILHO-015 | [#22](https://github.com/filipecalm/trillho/issues/22) | ASO e screenshots reais na Play Store | P1 | 2 |
| TRILHO-016 | [#23](https://github.com/filipecalm/trillho/issues/23) | Open Finance via parceiro | P2 | 3 |
| TRILHO-017 | [#24](https://github.com/filipecalm/trillho/issues/24) | Relatórios avançados e comparativo anual | P2 | 3 |
| TRILHO-018 | [#25](https://github.com/filipecalm/trillho/issues/25) | Widget Android — lançamento rápido | P2 | 3 |
| TRILHO-019 | [#26](https://github.com/filipecalm/trillho/issues/26) | Plano Família (até 3 perfis) | P2 | 3 |
| TRILHO-020 | [#27](https://github.com/filipecalm/trillho/issues/27) | IA para categorização automática | P2 | 3 |
| TRILHO-021 | [#28](https://github.com/filipecalm/trillho/issues/28) | Substituir moment por date-fns | P2 | tech-debt |
| TRILHO-022 | [#29](https://github.com/filipecalm/trillho/issues/29) | Testes unitários dos cálculos financeiros | P2 | tech-debt |
| TRILHO-023 | [#30](https://github.com/filipecalm/trillho/issues/30) | Remover tela Signature placeholder | P2 | tech-debt |

## Dependências entre issues

```
TRILHO-001 (categorias) ──┬──► TRILHO-009 (orçamento/categoria Pro)
                          ├──► TRILHO-010 (gráficos)
                          └──► TRILHO-020 (IA categorização)

TRILHO-002 (orçamento mensal) ──► TRILHO-009

TRILHO-005 (analytics) ──► TRILHO-007, TRILHO-012 (métricas de ativação/retention)

TRILHO-008 (paywall) ──┬──► TRILHO-009, TRILHO-014, TRILHO-017
                       └──► TRILHO-023 (substituir Signature)

TRILHO-016 (Open Finance) ── bloqueado até MRR base > R$ 3k
```

## Filtros úteis no GitHub

- Fase 1: `label:fase-1`
- P0 imediato: `label:P0`
- Monetização: `label:monetization`
- Tech debt: `label:tech-debt`

## Recriar issues

Script usado na criação inicial: `trillho/scripts/create-github-backlog-issues.mjs` (idempotência não garantida — não rodar de novo sem fechar issues duplicadas).

Mapeamento JSON: [github-issues.json](./github-issues.json)
