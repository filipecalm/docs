# Memory Game — Issues no GitHub

Backlog sincronizado com o repositório [filipecalm/memory-game-monorepo](https://github.com/filipecalm/memory-game-monorepo).

| Campo | Valor |
|-------|-------|
| **Criadas em** | 2026-06-19 |
| **Total** | 17 issues (#1–#17) |
| **Labels** | `fase-1`, `fase-2`, `fase-3`, `P0`, `P1`, `P2`, + labels por área |
| **Board** | [Issues abertas](https://github.com/filipecalm/memory-game-monorepo/issues) |

## Índice rápido

| ID | GitHub | Título | Prioridade | Fase |
|----|--------|--------|------------|------|
| MEM-001 | [#1](https://github.com/filipecalm/memory-game-monorepo/issues/1) | Remover copy de teste no fluxo de pagamento | P0 | 1 |
| MEM-002 | [#2](https://github.com/filipecalm/memory-game-monorepo/issues/2) | Corrigir acesso ao jogo web pós-compra sem login obrigatório | P0 | 1 |
| MEM-003 | [#3](https://github.com/filipecalm/memory-game-monorepo/issues/3) | Política de privacidade completa (LGPD) | P0 | 1 |
| MEM-004 | [#4](https://github.com/filipecalm/memory-game-monorepo/issues/4) | Link/QR compartilhável para presenteado | P0 | 1 |
| MEM-005 | [#5](https://github.com/filipecalm/memory-game-monorepo/issues/5) | Biblioteca "Meus jogos" via magic link | P0 | 1 |
| MEM-006 | [#6](https://github.com/filipecalm/memory-game-monorepo/issues/6) | Documento de decisão: Stripe vs Play Billing no Android | P0 | 1 |
| MEM-007 | [#7](https://github.com/filipecalm/memory-game-monorepo/issues/7) | Timer e contador de jogadas no app mobile | P1 | 2 |
| MEM-008 | [#8](https://github.com/filipecalm/memory-game-monorepo/issues/8) | Mensagem surpresa no modal de vitória (custom) | P1 | 2 |
| MEM-009 | [#9](https://github.com/filipecalm/memory-game-monorepo/issues/9) | Tier Custom Básico — 6 fotos / R$ 9,90 | P1 | 2 |
| MEM-010 | [#10](https://github.com/filipecalm/memory-game-monorepo/issues/10) | IAP Remover anúncios (Play Billing) | P1 | 2 |
| MEM-011 | [#11](https://github.com/filipecalm/memory-game-monorepo/issues/11) | Modo 2 jogadores local | P1 | 2 |
| MEM-012 | [#12](https://github.com/filipecalm/memory-game-monorepo/issues/12) | ASO — assets Play Store com foco em presente personalizado | P1 | 2 |
| MEM-013 | [#13](https://github.com/filipecalm/memory-game-monorepo/issues/13) | Pacote Custom Plus (mensagem por carta + música) | P2 | 3 |
| MEM-014 | [#14](https://github.com/filipecalm/memory-game-monorepo/issues/14) | Plano Família — assinatura mensal | P2 | 3 |
| MEM-015 | [#15](https://github.com/filipecalm/memory-game-monorepo/issues/15) | APK standalone opcional pós-custom | P2 | 3 |
| MEM-016 | [#16](https://github.com/filipecalm/memory-game-monorepo/issues/16) | Tema sazonal rotativo | P2 | 3 |
| MEM-017 | [#17](https://github.com/filipecalm/memory-game-monorepo/issues/17) | Piloto B2B — landing e orçamento | P2 | 3 |

## Dependências entre issues

```
MEM-006 (Stripe vs Play Billing) ──► MEM-010 (IAP remover ads), MEM-014 (Plano Família)

MEM-002 (web sem login) ──┬──► MEM-004 (link/QR para presenteado)
                          └──► MEM-005 (Meus jogos)

MEM-004 (link compartilhável) ──► MEM-008 (mensagem surpresa na vitória)

MEM-009 (tier Básico) ──► MEM-013 (Custom Plus)

MEM-015 (APK standalone) ── depende de pipeline EAS existente + UX pós-upload
```

## Filtros úteis no GitHub

- Fase 1 (P0 imediato): `label:fase-1 label:P0`
- Monetização: `label:monetization`
- Compliance: `label:compliance`
- Growth: `label:marketing`

## Recriar issues

Script: `memory_game/back/scripts/create-github-backlog-issues.mjs` — **não rodar de novo** sem fechar issues duplicadas.

Mapeamento JSON: [github-issues.json](./github-issues.json)
