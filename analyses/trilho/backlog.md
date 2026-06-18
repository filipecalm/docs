# Trilho — Backlog (Etapa 5)

Roadmap derivado da [análise de produto](./product-analysis.md). Issues criadas no GitHub em **2026-06-18** — ver [github-issues.md](./github-issues.md) para índice completo.

**Repositório de código:** [filipecalm/trillho](https://github.com/filipecalm/trillho/issues)

---

## Fase 1 — Quick wins (0–30 dias)

### TRILHO-001 — Categorias no lançamento

**GitHub:** [#8](https://github.com/filipecalm/trillho/issues/8) · **Prioridade:** P0

Adicionar seleção de categoria ao registrar receita/despesa em `app/Register`. Persistir em Firestore (campo `category` já existe em `types/data.ts`). Filtrar por categoria em `MonthlyTransactions` e `Home`.

**Critério de aceite:** ≥ 5 categorias padrão + "Outros"; categoria no histórico; ≥ 70% dos novos lançamentos categorizados.

---

### TRILHO-002 — Orçamento mensal na Home

**GitHub:** [#9](https://github.com/filipecalm/trillho/issues/9) · **Prioridade:** P0

Teto de gastos do mês + barra de progresso na Home. Armazenar em Firestore.

**Critério de aceite:** barra muda cor em 80%/100%; valor "ainda pode gastar" visível.

---

### TRILHO-003 — Lembretes de contas a pagar

**GitHub:** [#10](https://github.com/filipecalm/trillho/issues/10) · **Prioridade:** P0

Contas recorrentes + `expo-notifications`. Notificação 1 dia antes e no vencimento.

---

### TRILHO-004 — Alinhar README e copy da Play Store

**GitHub:** [#11](https://github.com/filipecalm/trillho/issues/11) · **Prioridade:** P0

README e listing só com features reais ou roadmap explícito. Não prometer Open Finance.

---

### TRILHO-005 — Firebase Analytics e funil básico

**GitHub:** [#12](https://github.com/filipecalm/trillho/issues/12) · **Prioridade:** P0

Eventos: `sign_up`, `first_transaction`, `budget_set`, `reminder_created`, `session_start`. Funil install → signup → 1º lançamento → D7.

---

### TRILHO-006 — Decisão AdMob

**GitHub:** [#13](https://github.com/filipecalm/trillho/issues/13) · **Prioridade:** P1

Ativar banner no free ou remover código comentado em `Home`.

---

### TRILHO-007 — Onboarding de 3 telas

**GitHub:** [#14](https://github.com/filipecalm/trillho/issues/14) · **Prioridade:** P1

Propósito → orçamento (ou pular) → permissão de notificação. Só na primeira abertura.

---

## Fase 2 — Crescimento (30–90 dias)

### TRILHO-008 — Paywall Trilho Pro

**GitHub:** [#15](https://github.com/filipecalm/trillho/issues/15) · **Prioridade:** P1

Google Play Billing ou RevenueCat. R$ 9,90/mês · R$ 79,90/ano. Ver [monetização](./product-analysis.md#etapa-4--modelo-de-monetização).

---

### TRILHO-009 — Orçamento por categoria (premium)

**GitHub:** [#16](https://github.com/filipecalm/trillho/issues/16) · **Prioridade:** P1 · **Depende:** TRILHO-001, TRILHO-002, TRILHO-008

Free: 1 orçamento total. Pro: por categoria + alertas 80%/100%.

---

### TRILHO-010 — Gráfico de gastos por categoria

**GitHub:** [#17](https://github.com/filipecalm/trillho/issues/17) · **Prioridade:** P1

Pizza/barras do mês atual. Pro: comparativo 3/6/12 meses.

---

### TRILHO-011 — TodoList → listas de compras com orçamento

**GitHub:** [#18](https://github.com/filipecalm/trillho/issues/18) · **Prioridade:** P1

Teto de gasto por lista; item marcado vira despesa.

---

### TRILHO-012 — Modo Trilho (streak diário)

**GitHub:** [#19](https://github.com/filipecalm/trillho/issues/19) · **Prioridade:** P1

Check-in diário + contador de dias consecutivos. Meta: retenção D7 +5pp.

---

### TRILHO-013 — React Query para Firestore

**GitHub:** [#20](https://github.com/filipecalm/trillho/issues/20) · **Prioridade:** P1

`QueryClientProvider` + hooks; eliminar `getDocs` duplicados em Home/MonthlyTransactions.

---

### TRILHO-014 — Export CSV do mês

**GitHub:** [#21](https://github.com/filipecalm/trillho/issues/21) · **Prioridade:** P2

Free: mês atual. Pro: qualquer mês do histórico.

---

### TRILHO-015 — ASO e screenshots reais

**GitHub:** [#22](https://github.com/filipecalm/trillho/issues/22) · **Prioridade:** P1

≥ 4 screenshots reais; keywords "controle financeiro", "orçamento".

---

## Fase 3 — Escala (90–180 dias)

### TRILHO-016 — Open Finance (piloto)

**GitHub:** [#23](https://github.com/filipecalm/trillho/issues/23) · **Prioridade:** P2 · **Pré-requisito:** MRR > R$ 3k

Belvo/Pluggy. Consentimento LGPD. Só Pro.

---

### TRILHO-017 — Relatórios avançados (premium)

**GitHub:** [#24](https://github.com/filipecalm/trillho/issues/24) · **Prioridade:** P2

Comparativo mês a mês, tendência 12 meses, export PDF.

---

### TRILHO-018 — Widget Android

**GitHub:** [#25](https://github.com/filipecalm/trillho/issues/25) · **Prioridade:** P2

Atalho + Despesa / + Receita na home screen.

---

### TRILHO-019 — Plano Família

**GitHub:** [#26](https://github.com/filipecalm/trillho/issues/26) · **Prioridade:** P2

Até 3 perfis. R$ 19,90/mês. Após PMF do Pro.

---

### TRILHO-020 — IA para categorização automática

**GitHub:** [#27](https://github.com/filipecalm/trillho/issues/27) · **Prioridade:** P2

Sugestão de categoria pela descrição + fallback offline.

---

## Tech debt

### TRILHO-021 — Substituir moment por date-fns

**GitHub:** [#28](https://github.com/filipecalm/trillho/issues/28) · **Prioridade:** P2

---

### TRILHO-022 — Testes unitários dos cálculos financeiros

**GitHub:** [#29](https://github.com/filipecalm/trillho/issues/29) · **Prioridade:** P2

Jest nos módulos de saldo/orçamento. CI em PR.

---

### TRILHO-023 — Remover tela Signature placeholder

**GitHub:** [#30](https://github.com/filipecalm/trillho/issues/30) · **Prioridade:** P2

Substituir por paywall real ou remover deep link morto.

---

## O que evitar

| Armadilha | Motivo |
|-----------|--------|
| Open Finance antes de #8–#10 | Custo sem PMF |
| Paywall no lançamento básico | Mata aquisição |
| Replicar Mobills feature-a-feature | Sem escala nem diferenciação |
| TodoList genérico sem orçamento | Dilui posicionamento |

---

## Métricas por fase

| Fase | Métrica | Meta |
|------|---------|------|
| 1 | Retenção D7 | +5pp vs baseline |
| 1 | % lançamentos com categoria | ≥ 70% |
| 2 | Conversão free → paid | ≥ 2% |
| 2 | Retenção D30 | ≥ 15% |
| 3 | MRR base | ≥ R$ 3.000 |
