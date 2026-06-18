# Trilho — Backlog (Etapa 5)

Issues derivadas da [análise de produto](./product-analysis.md). Cada item: prioridade P0/P1/P2 e critério de aceite mensurável.

---

## Fase 1 — Quick wins (0–30 dias)

### TRILHO-001 — Categorias no lançamento

**Prioridade:** P0  
**Fase:** 1

**Descrição:** Adicionar seleção de categoria ao registrar receita/despesa em `app/Register`. Persistir em Firestore (campo `category` já existe em `types/data.ts`). Permitir filtrar por categoria em `MonthlyTransactions` e `Home`.

**Critério de aceite:**

- [ ] Usuário escolhe categoria ao criar lançamento
- [ ] Categoria aparece no histórico e na lista mensal
- [ ] ≥ 5 categorias padrão + opção “Outros”
- [ ] Lançamentos antigos sem categoria exibem “Sem categoria” sem quebrar

---

### TRILHO-002 — Orçamento mensal na Home

**Prioridade:** P0  
**Fase:** 1

**Descrição:** Permitir definir teto de gastos do mês. Exibir barra de progresso na Home (gastos do mês / orçamento). Armazenar em Firestore (`users/{uid}/budget` ou subcoleção).

**Critério de aceite:**

- [ ] Usuário define orçamento mensal em Profile ou modal na Home
- [ ] Barra visual atualiza ao adicionar despesas
- [ ] Cor muda ao atingir 80% e 100% (warning/danger)
- [ ] Valor “ainda pode gastar” visível na Home

---

### TRILHO-003 — Lembretes de contas a pagar

**Prioridade:** P0  
**Fase:** 1

**Descrição:** Cadastro de contas recorrentes (nome, valor, dia de vencimento). Notificação local via `expo-notifications` no dia configurado.

**Critério de aceite:**

- [ ] CRUD de lembretes na UI (nova tela ou seção em Profile)
- [ ] Permissão de notificação solicitada no primeiro lembrete
- [ ] Notificação dispara no dia/hora configurados (testado em device)
- [ ] README atualizado — item “Alertas e Lembretes” deixa de ser promessa vazia

---

### TRILHO-004 — Alinhar README e copy da Play Store

**Prioridade:** P0  
**Fase:** 1

**Descrição:** Atualizar `README.md` e textos de listing para refletir apenas features implementadas. Remover ou marcar como “em breve” itens inexistentes (orçamentos avançados, alertas até TRILHO-003 shippar).

**Critério de aceite:**

- [ ] README lista só features reais ou roadmap explícito
- [ ] `app.json` description coerente com produto
- [ ] Feature graphic / copy não promete Open Finance

---

### TRILHO-005 — Firebase Analytics e funil básico

**Prioridade:** P1  
**Fase:** 1

**Descrição:** Instrumentar eventos: `sign_up`, `first_transaction`, `budget_set`, `reminder_created`, `session_day_7`. Baseline para medir retenção.

**Critério de aceite:**

- [ ] Eventos aparecem no Firebase Console em build de preview
- [ ] Funil instalado documentado em comentário ou doc interno
- [ ] Sem PII em parâmetros de evento

---

### TRILHO-006 — Decisão AdMob

**Prioridade:** P2  
**Fase:** 1

**Descrição:** Ativar banner no free (`Home`) ou remover código comentado e dependência futura. Documentar decisão em `decisions.md` do trillho ou aqui.

**Critério de aceite:**

- [ ] Banner ativo em free OU código removido sem dead code
- [ ] Decisão registrada com rationale

---

## Fase 2 — Crescimento (30–90 dias)

### TRILHO-007 — Paywall Trilho Pro

**Prioridade:** P1  
**Fase:** 2

**Descrição:** Integrar Google Play Billing ou RevenueCat. Planos Free vs Pro conforme [product-analysis.md](./product-analysis.md#estrutura-de-planos-sugestão-inicial--brl). Gates: histórico &gt; 6 meses, orçamento por categoria.

**Critério de aceite:**

- [ ] Compra e restauração funcionam em internal track
- [ ] Estado premium persiste entre sessões
- [ ] Free mantém lançamento e saldo sem bloqueio

---

### TRILHO-008 — Gráfico de gastos por categoria

**Prioridade:** P1  
**Fase:** 2

**Descrição:** Tela ou seção na Home com gráfico (pizza ou barras) do mês atual por categoria.

**Critério de aceite:**

- [ ] Gráfico renderiza com ≥ 3 categorias
- [ ] Empty state quando sem despesas no mês
- [ ] Performance aceitável com 500+ lançamentos no mês

---

### TRILHO-009 — TodoList → listas de compras com orçamento

**Prioridade:** P1  
**Fase:** 2

**Descrição:** Evoluir `TodoList` para listas de compras: teto de gasto, itens com valor estimado, converter item marcado em despesa.

**Critério de aceite:**

- [ ] Lista tem campo `budget` opcional
- [ ] Item pode virar lançamento em 1 toque
- [ ] Drawer renomeia menu para copy financeira (ex.: “Listas de compras”)

---

### TRILHO-010 — Onboarding + Modo Trilho (streak)

**Prioridade:** P1  
**Fase:** 2

**Descrição:** 3 telas de onboarding. Check-in diário opcional com contador de dias consecutivos.

**Critério de aceite:**

- [ ] Onboarding só na primeira abertura pós-install
- [ ] Streak incrementa com ≥ 1 interação financeira/dia
- [ ] Evento `onboarding_complete` no analytics

---

### TRILHO-011 — React Query para Firestore

**Prioridade:** P1  
**Fase:** 2

**Descrição:** Migrar fetches de `Home` e `MonthlyTransactions` para `@tanstack/react-query` (já em `package.json`). Cache, refetch on focus, loading states unificados.

**Critério de aceite:**

- [ ] `QueryClientProvider` no `_layout`
- [ ] Menos `useEffect` + `getDocs` duplicados
- [ ] Pull-to-refresh ou refetch automático ao voltar à tela

---

### TRILHO-012 — Orçamento por categoria (premium)

**Prioridade:** P1  
**Fase:** 2  
**Depende:** TRILHO-007, TRILHO-001, TRILHO-002

**Descrição:** Orçamento por categoria + alertas 80%/100%. Gate premium.

**Critério de aceite:**

- [ ] Free: 1 orçamento total; Pro: N categorias
- [ ] Push local ao atingir limite (Pro)
- [ ] Upgrade CTA no momento do gate

---

### TRILHO-013 — ASO e screenshots reais

**Prioridade:** P1  
**Fase:** 2

**Descrição:** Screenshots reais do app (não só mocks) na Play Store. Título/descrição otimizados para “controle financeiro”, “organizar gastos”.

**Critério de aceite:**

- [ ] ≥ 4 screenshots phone publicados
- [ ] Scripts `assets:play-store` atualizados se necessário
- [ ] Keywords documentadas

---

## Fase 3 — Escala (90–180 dias)

### TRILHO-014 — Relatórios avançados (premium)

**Prioridade:** P2  
**Fase:** 3

**Descrição:** Comparativo mês a mês, tendência 12 meses, export PDF/CSV ilimitado.

**Critério de aceite:**

- [ ] Relatório anual só para Pro
- [ ] Export CSV funciona no free (limitado a 6 meses) vs Pro (ilimitado)

---

### TRILHO-015 — Open Finance (piloto)

**Prioridade:** P2  
**Fase:** 3  
**Pré-requisito:** MRR base &gt; R$ 3k ou MAU &gt; 5k

**Descrição:** Integração via Belvo/Pluggy. Import de transações + categorização sugerida.

**Critério de aceite:**

- [ ] Consentimento LGPD explícito
- [ ] ≥ 1 banco grande (Nubank, Itaú ou Bradesco) em sandbox/prod
- [ ] Custo por usuário documentado

---

### TRILHO-016 — Widget Android

**Prioridade:** P2  
**Fase:** 3

**Descrição:** Widget com saldo do mês e atalho “+ despesa”.

**Critério de aceite:**

- [ ] Widget atualiza em &lt; 1h após lançamento
- [ ] Deep link abre `Register` com tipo Despesa

---

### TRILHO-017 — Plano Família

**Prioridade:** P2  
**Fase:** 3

**Descrição:** Até 3 perfis, orçamento compartilhado. Só após PMF do Pro.

**Critério de aceite:**

- [ ] Convite por email
- [ ] Dados isolados por membro com visão agregada opcional

---

## O que evitar (não virar issue sem revisão de produto)

| Armadilha | Motivo |
|-----------|--------|
| Open Finance antes de TRILHO-001–003 | Custo e complexidade sem PMF |
| Paywall no lançamento básico | Mata aquisição orgânica |
| Replicar Mobills feature-a-feature | Sem diferenciação nem escala |
| TodoList genérico sem orçamento | Dilui posicionamento |
| Preço &lt; R$ 5 sem volume | Não sustenta infra + suporte |

---

## Métricas por fase

| Fase | Métrica | Meta |
|------|---------|------|
| 1 | Retenção D7 | +5pp vs baseline |
| 1 | % lançamentos com categoria | ≥ 70% |
| 2 | Conversão free → paid | ≥ 2% |
| 2 | Retenção D30 | ≥ 15% |
| 3 | MRR base | ≥ R$ 3.000 |
| 3 | NPS | ≥ 30 |
