#!/usr/bin/env node
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const REPO = "filipecalm/trillho";
const __dirname = dirname(fileURLToPath(import.meta.url));

const issues = [
  {
    id: "TRILHO-001",
    title: "Categorias no lançamento e no histórico",
    labels: ["fase-1", "P0", "feature", "core"],
    body: `## Descrição
O tipo \`Transaction\` já tem \`category?\`, mas o fluxo de registro e as telas de histórico não usam. Implementar seleção de categoria ao incluir movimentação e filtro por categoria em Home e Movimentações Financeiras.

**Doc:** [TRILHO-001](https://github.com/filipecalm/docs/blob/main/analyses/trilho/backlog.md)

## Critérios de aceite
- [ ] Usuário escolhe categoria ao registrar receita/despesa (mín. 8 categorias padrão + "Outros")
- [ ] Categoria salva no Firestore junto com o lançamento
- [ ] Histórico mensal exibe categoria em cada item
- [ ] Filtro por categoria funciona na tela de movimentações
- [ ] ≥ 70% dos novos lançamentos têm categoria (medir via Analytics após 7 dias)`,
  },
  {
    id: "TRILHO-002",
    title: "Orçamento mensal com barra de progresso na Home",
    labels: ["fase-1", "P0", "feature", "core"],
    body: `## Descrição
Definir teto de gastos do mês e mostrar na Home quanto já foi gasto vs. orçamento. Fecha o gap entre README e produto.

## Critérios de aceite
- [ ] Usuário define orçamento mensal (valor em R$) na primeira vez ou em Perfil
- [ ] Home exibe: gasto do mês / orçamento / % consumida / quanto resta
- [ ] Barra visual muda de cor ao atingir 80% e 100%
- [ ] Orçamento persiste no Firestore (\`users\` ou coleção dedicada)
- [ ] Edição do orçamento acessível em ≤ 2 toques`,
  },
  {
    id: "TRILHO-003",
    title: "Lembretes de contas a pagar",
    labels: ["fase-1", "P0", "feature", "notifications"],
    body: `## Descrição
Cadastro de contas recorrentes com data de vencimento e notificação local. README já promete isso.

## Critérios de aceite
- [ ] Tela ou seção para cadastrar conta (nome, valor, dia do vencimento, recorrência mensal)
- [ ] \`expo-notifications\` configurado (permissão no onboarding ou primeiro lembrete)
- [ ] Notificação dispara 1 dia antes e no dia do vencimento
- [ ] Lista de contas pendentes visível na Home ou tela dedicada
- [ ] Marcar como pago registra despesa opcionalmente`,
  },
  {
    id: "TRILHO-004",
    title: "Alinhar README e listing da Play Store com features reais",
    labels: ["fase-1", "P0", "docs", "marketing"],
    body: `## Descrição
README promete orçamentos e alertas que não existem. Atualizar documentação e textos da loja para refletir o que o app faz hoje — e o que as issues de categorias/orçamento/lembretes entregam.

## Critérios de aceite
- [ ] README lista apenas features implementadas (ou marcadas como "em breve")
- [ ] Descrição Play Store (\`app.json\` / Console) alinhada
- [ ] Feature graphic e screenshots não prometem Open Finance ou sync bancária
- [ ] Changelog ou seção "Roadmap" com próximas features`,
  },
  {
    id: "TRILHO-005",
    title: "Firebase Analytics + eventos do funil",
    labels: ["fase-1", "P0", "analytics", "infra"],
    body: `## Descrição
Sem métricas não dá para validar retenção D7/D30 nem conversão. Instrumentar eventos chave.

## Critérios de aceite
- [ ] Analytics configurado (Firebase ou equivalente Expo)
- [ ] Eventos: \`sign_up\`, \`first_transaction\`, \`transaction_created\`, \`budget_set\`, \`reminder_created\`, \`session_start\`
- [ ] Propriedades: \`has_category\`, \`transaction_type\`, \`days_since_install\`
- [ ] Dashboard básico no Firebase Console com funil: install → signup → 1º lançamento → D7
- [ ] Sem PII em parâmetros de evento`,
  },
  {
    id: "TRILHO-006",
    title: "Decisão explícita sobre AdMob",
    labels: ["fase-1", "P1", "monetization", "tech-debt"],
    body: `## Descrição
Código de banner comentado em \`Home\`. Ou ativa no free tier ou remove — código morto confunde.

## Critérios de aceite
- [ ] Decisão documentada (ads sim/não)
- [ ] Se sim: banner só na Home, não em fluxos de lançamento; \`devmode = false\` em produção
- [ ] Se não: remover imports e constantes comentadas
- [ ] Nenhum código AdMob comentado no repositório`,
  },
  {
    id: "TRILHO-007",
    title: "Onboarding de 3 telas",
    labels: ["fase-1", "P1", "feature", "activation"],
    body: `## Descrição
Usuário novo cai na Home vazia e sai. Guiar propósito, primeiro lançamento e permissão de notificação.

## Critérios de aceite
- [ ] 3 telas: (1) propósito "seu dinheiro no trilho", (2) definir orçamento ou pular, (3) permissão de notificação
- [ ] Exibido só na primeira abertura pós-login (\`AsyncStorage\` flag)
- [ ] Botão "Registrar primeira despesa" leva direto ao fluxo de Register
- [ ] Taxa de ativação (1º lançamento em 24h) mensurável via Analytics`,
  },
  {
    id: "TRILHO-008",
    title: "Trilho Pro — paywall e assinatura",
    labels: ["fase-2", "P1", "monetization", "premium"],
    body: `## Descrição
Implementar plano pago via Google Play Billing (ou RevenueCat). Depende de orçamento por categoria como driver de conversão.

## Critérios de aceite
- [ ] Plano mensal R$ 9,90 e anual R$ 79,90 configurados na Play Console
- [ ] Tela de planos com comparativo Free vs Pro
- [ ] Gates: histórico > 6 meses, orçamento por categoria, relatórios avançados
- [ ] Estado \`isPro\` persistido e validado via receipt
- [ ] Restaurar compra funciona após reinstall
- [ ] Deep link \`myapp://checkout/congrats\` tratado ou removido do \`app.json\``,
  },
  {
    id: "TRILHO-009",
    title: "Orçamento por categoria (premium)",
    labels: ["fase-2", "P1", "feature", "premium"],
    body: `## Descrição
Extensão do orçamento mensal: teto por categoria, disponível no Trilho Pro.

**Depende:** TRILHO-001, TRILHO-002, TRILHO-008

## Critérios de aceite
- [ ] Free: orçamento total do mês apenas
- [ ] Pro: orçamento por categoria (mín. 5 categorias)
- [ ] Alerta visual ao atingir 80%/100% por categoria
- [ ] Paywall aparece ao tentar criar 2º orçamento por categoria no free
- [ ] Conversão free → paid mensurável (meta: ≥ 2% em 60 dias)`,
  },
  {
    id: "TRILHO-010",
    title: "Gráfico de gastos por categoria",
    labels: ["fase-2", "P1", "feature", "analytics-ui"],
    body: `## Descrição
Visualização do mês atual: pizza ou barras por categoria. Depende de categorias no lançamento.

## Critérios de aceite
- [ ] Gráfico na Home ou tela "Resumo do mês"
- [ ] Dados do mês corrente, atualiza ao registrar lançamento
- [ ] Empty state quando não há despesas categorizadas
- [ ] Free: gráfico do mês atual; Pro: comparativo 3/6/12 meses`,
  },
  {
    id: "TRILHO-011",
    title: "TodoList → Listas de compras com teto de gasto",
    labels: ["fase-2", "P1", "feature", "differentiation"],
    body: `## Descrição
Reaproveitar \`TodoList\` como listas de compras com orçamento. Item marcado pode virar despesa. Diferencial vs. Mobills/Organizze.

## Critérios de aceite
- [ ] Renomear UX: "Minhas Listas" → "Listas de compras" (ou similar)
- [ ] Cada lista tem teto de gasto opcional (R$)
- [ ] Checkbox de item mostra progresso vs. teto
- [ ] "Finalizar compra" converte itens marcados em despesa(s) na categoria Alimentação
- [ ] Remover ou esconder listas genéricas sem vínculo financeiro`,
  },
  {
    id: "TRILHO-012",
    title: "Modo Trilho — streak diário",
    labels: ["fase-2", "P1", "feature", "engagement"],
    body: `## Descrição
Ritual diário: check-in "gastou hoje?" → lançamento rápido ou "dia zerado". Reforça hábito.

## Critérios de aceite
- [ ] Card na Home: "Como foi seu dia?" com ações rápidas
- [ ] Streak contado (dias consecutivos com check-in)
- [ ] "Dia zerado" conta como check-in sem lançamento
- [ ] Streak visível no Perfil
- [ ] Retenção D7 +5pp vs. baseline (medir após 30 dias)`,
  },
  {
    id: "TRILHO-013",
    title: "Cache Firestore com React Query",
    labels: ["fase-2", "P1", "refactor", "performance"],
    body: `## Descrição
\`@tanstack/react-query\` está instalado mas não usado. Queries duplicadas em Home e MonthlyTransactions.

## Critérios de aceite
- [ ] \`QueryClientProvider\` no \`_layout.tsx\`
- [ ] Hooks: \`useTransactions\`, \`useMonthlyTransactions\`, \`useUserBudget\`
- [ ] Cache invalida ao criar/editar/excluir lançamento
- [ ] Home não refaz 2+ queries Firestore idênticas ao trocar de aba
- [ ] Loading states unificados`,
  },
  {
    id: "TRILHO-014",
    title: "Export CSV do mês",
    labels: ["fase-2", "P2", "feature", "premium"],
    body: `## Descrição
Exportar transações do mês para planilha. Reduz medo de lock-in; driver leve de conversão Pro.

## Critérios de aceite
- [ ] Botão "Exportar" na tela de movimentações mensais
- [ ] CSV com: data, descrição, tipo, valor, categoria
- [ ] Free: mês atual; Pro: qualquer mês do histórico
- [ ] Compartilhamento via share sheet nativo`,
  },
  {
    id: "TRILHO-015",
    title: "ASO e screenshots reais na Play Store",
    labels: ["fase-2", "P1", "marketing"],
    body: `## Descrição
Assets gerados existem em \`assets/play-store/\`, mas screenshots precisam refletir UI atual pós-categorias/orçamento.

## Critérios de aceite
- [ ] Mín. 4 screenshots de telefone com UI real (não mock)
- [ ] Título e descrição otimizados: "controle financeiro", "orçamento", "gastos"
- [ ] Feature graphic atualizada se branding mudar
- [ ] Publicado em track internal/beta antes de production`,
  },
  {
    id: "TRILHO-016",
    title: "Open Finance via parceiro (Belvo/Pluggy)",
    labels: ["fase-3", "P2", "feature", "premium", "high-complexity"],
    body: `## Descrição
Import automático de transações bancárias. Só após PMF: MRR base > R$ 3k e retenção D30 ≥ 15%.

**Bloqueio:** paywall estável + métricas positivas

## Critérios de aceite
- [ ] Parceiro contratado e ambiente sandbox integrado
- [ ] Fluxo de consentimento LGPD-compliant
- [ ] Import categoriza e deduplica vs. lançamentos manuais
- [ ] Disponível só no Trilho Pro
- [ ] Custo por usuário ativo documentado; break-even calculado`,
  },
  {
    id: "TRILHO-017",
    title: "Relatórios avançados e comparativo anual",
    labels: ["fase-3", "P2", "feature", "premium"],
    body: `## Descrição
Tendências, comparativo mês a mês, projeção de saldo. Bundle do Trilho Pro.

## Critérios de aceite
- [ ] Tela "Relatórios" com: gasto médio mensal, maior categoria, tendência 6 meses
- [ ] Comparativo: este mês vs. mês anterior (%)
- [ ] Pro: histórico 12 meses + export PDF
- [ ] Free: preview borrado do relatório anual com CTA upgrade`,
  },
  {
    id: "TRILHO-018",
    title: "Widget Android — lançamento rápido",
    labels: ["fase-3", "P2", "feature", "platform"],
    body: `## Descrição
Atalho na home screen do Android para registrar despesa em <10 segundos.

## Critérios de aceite
- [ ] Widget 2×2 com botões: + Despesa, + Receita
- [ ] Abre formulário simplificado (valor + categoria)
- [ ] Funciona offline com sync ao reconectar
- [ ] Documentado em README (só Android)`,
  },
  {
    id: "TRILHO-019",
    title: "Plano Família (até 3 perfis)",
    labels: ["fase-3", "P2", "feature", "premium"],
    body: `## Descrição
Orçamento compartilhado para casais/famílias. Só após Trilho Pro estável.

## Critérios de aceite
- [ ] Convite por email para 2º/3º membro
- [ ] Orçamento familiar visível para todos
- [ ] Lançamentos individuais com tag de membro
- [ ] Plano R$ 19,90/mês na Play Console
- [ ] Modelo de dados multi-tenant no Firestore com regras de segurança`,
  },
  {
    id: "TRILHO-020",
    title: "IA para categorização automática",
    labels: ["fase-3", "P2", "feature", "high-complexity"],
    body: `## Descrição
Sugerir categoria a partir da descrição do lançamento. Opcional; custo de API por request.

## Critérios de aceite
- [ ] Ao digitar descrição, sugestão de categoria aparece em <1s
- [ ] Usuário confirma ou altera antes de salvar
- [ ] Fallback offline: regras locais para descrições comuns ("uber" → Transporte)
- [ ] Custo mensal de API < 10% do MRR`,
  },
  {
    id: "TRILHO-021",
    title: "Substituir moment por date-fns",
    labels: ["tech-debt", "P2", "refactor"],
    body: `## Descrição
\`moment\` e \`date-fns\` coexistem. \`date-fns\` já está no \`package.json\`; migrar e remover \`moment\`.

## Critérios de aceite
- [ ] Zero imports de \`moment\` no codebase
- [ ] Locale pt-BR mantido em formatações de data
- [ ] \`moment\` removido do \`package.json\``,
  },
  {
    id: "TRILHO-022",
    title: "Testes unitários dos cálculos financeiros",
    labels: ["testing", "P2", "quality"],
    body: `## Descrição
Jest configurado, zero specs. Testar lógica pura de saldo, orçamento e totais.

## Critérios de aceite
- [ ] Testes para: cálculo de saldo acumulado, totais do dia, % orçamento consumido
- [ ] CI roda \`pnpm test\` em PR
- [ ] Cobertura ≥ 80% nos módulos de cálculo extraídos`,
  },
  {
    id: "TRILHO-023",
    title: "Remover tela Signature placeholder",
    labels: ["tech-debt", "P2", "cleanup"],
    body: `## Descrição
\`app/Signature/index.tsx\` é exemplo de WebBrowser, não feature real. Deep link de checkout no \`app.json\` sem implementação.

## Critérios de aceite
- [ ] Tela removida ou substituída por fluxo real de paywall (Trilho Pro)
- [ ] \`intentFilters\` de checkout removidos ou conectados ao fluxo de assinatura
- [ ] Nenhuma rota morta no drawer ou router`,
  },
];

function ensureLabels() {
  const allLabels = new Set();
  for (const issue of issues) {
    for (const label of issue.labels) allLabels.add(label);
  }
  for (const label of allLabels) {
    try {
      execSync(`gh label create "${label}" --repo ${REPO} --force`, {
        stdio: "pipe",
      });
    } catch {
      /* may already exist */
    }
  }
}

function createIssue(issue) {
  const labelArgs = issue.labels.map((l) => `--label "${l}"`).join(" ");
  const title = `[${issue.id}] ${issue.title}`;
  const bodyFile = join(__dirname, `.issue-${issue.id}.md`);
  writeFileSync(bodyFile, issue.body, "utf8");
  try {
    const out = execSync(
      `gh issue create --repo ${REPO} --title "${title.replace(/"/g, '\\"')}" --body-file "${bodyFile}" ${labelArgs}`,
      { encoding: "utf8" }
    ).trim();
    const match = out.match(/issues\/(\d+)/);
    return {
      ...issue,
      number: match ? Number(match[1]) : null,
      url: out,
    };
  } finally {
    try {
      execSync(`del /f /q "${bodyFile}"`, { stdio: "ignore", shell: true });
    } catch {
      /* ignore */
    }
  }
}

ensureLabels();
const created = [];
for (const issue of issues) {
  const result = createIssue(issue);
  created.push(result);
  console.log(`${result.id} → #${result.number} ${result.url}`);
}

writeFileSync(
  join(__dirname, "github-issues-created.json"),
  JSON.stringify(created, null, 2),
  "utf8"
);
