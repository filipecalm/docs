# Trilho — Análise de Produto, Mercado e Monetização

> Gerado a partir do código em [trillho](../../../trillho) e pesquisa de mercado (jun/2026).  
> Prompt: [Prompt 4](../../prompts-generic/prompt-04-analise-produto.md) · Índice: [README](./README.md)

---

## Resumo executivo

1. **Trilho já é produto lançado** (v2.0.1, `versionCode` 8, pipeline EAS/Play Store), mas o core ainda é **lançamento manual** de receitas/despesas — sem orçamentos, categorias na UI, Open Finance nem monetização ativa.
2. **Não compete de frente com Mobills/Organizze** no curto prazo; o gap de Open Finance + relatórios avançados é caro demais para um time pequeno. Posicione como **app leve, rápido e honesto** (“seu dinheiro no trilho”).
3. **Modelo recomendado: freemium + assinatura** (~R$ 9,90–12,90/mês), com anúncios leves no free — código de AdMob já existe comentado em `app/Home/index.tsx`.
4. **P0 imediato:** categorias, orçamento mensal simples, gráficos básicos, lembretes de contas, alinhar README com o que o app realmente faz.
5. **Evitar:** prometer Open Finance cedo, paywall agressivo no free, ou manter listas de tarefas sem conexão clara com finanças.

---

## ETAPA 1 — Verificação e entendimento do projeto

### 1. Nome, propósito e público-alvo

| Item | Detalhe |
|------|---------|
| **Nome** | Trilho (repositório: `trillho`, slug Expo: `financas`) |
| **Propósito** | Controle financeiro pessoal — registrar receitas/despesas e acompanhar saldo |
| **Tagline** | “Seu dinheiro no trilho” |
| **Público-alvo** | Brasileiros que querem organizar finanças pessoais sem complexidade bancária (**Confiança: Média** — app 100% em PT-BR, moeda implícita R$) |

### 2. Funcionalidades existentes (observadas no código)

| Tela / módulo | O que faz |
|---------------|-----------|
| **SignIn / SignUp / ForgotPassword** | Auth email/senha + Google Sign-In, verificação de email |
| **Home** | Saldo acumulado, receitas/despesas do dia, histórico por mês (12 abas), calendário, exclusão de lançamentos |
| **Register** | Inclusão manual de receita ou despesa (descrição + valor) |
| **MonthlyTransactions** | Lista filtrada por mês, resumo receita/despesa/saldo |
| **TodoList / TodoItems** | Listas genéricas (Firestore `todoLists`) — sem vínculo financeiro claro |
| **Profile** | Nome, telefone, toggle dark/light mode |
| **CustomDrawer** | Navegação lateral |
| **Infra** | Firebase Auth + Firestore, Expo SDK 56, EAS builds, OTA updates, assets Play Store |

**Não implementado** (apesar de prometido no README ou preparado no código):

- Orçamentos por categoria
- Alertas e lembretes de contas
- Categorias na UI (`category?` existe em `types/data.ts`, mas não é usada no fluxo de registro)
- Open Finance / sync bancária
- Assinatura premium (deep link `myapp://checkout/congrats` no `app.json`; tela `Signature` é placeholder)
- Anúncios (código AdMob comentado em `Home`)
- React Query instalado (`@tanstack/react-query`), **zero uso** no código

### 3. Problema principal

**Problema:** pessoas perdem controle de para onde vai o dinheiro porque não registram ou não visualizam gastos de forma simples.

**Para quem:** usuário brasileiro que prefere app dedicado e leve, sem depender só do app do banco.

### 4. Estágio atual

**Produto lançado em estágio MVP+** (**Confiança: Alta**):

- `version: "2.0.1"`, `versionCode: 8` em `app.json`
- `eas.json` com perfil `production` → Play Store
- Scripts `deploy:android`, assets Play Store em `assets/play-store/`
- Stack moderna (Expo 56, RN 0.85, React 19)

Não é ideia nem protótipo — é app publicável/publicado com core funcional, mas **feature set ainda enxuto** frente ao mercado.

### 5. Pontos fortes técnicos e de UX

| Área | Situação |
|------|----------|
| Stack | Expo SDK 56, Expo Router, TypeScript, New Architecture habilitada |
| Auth | Email + Google, verificação de email, SecureStore |
| UX | Dark mode (`context/theme.tsx`), styled-components, tokens parciais (`theme/colors`, `theme/tokens`), empty states, toasts |
| DevOps | Docker, EAS local/cloud, scripts de deploy Android, geração de assets |
| Backend | Firebase sem servidor próprio — custo baixo para escala inicial |

### 6. Lacunas evidentes

- **Gap produto vs. marketing:** `README.md` promete orçamentos e alertas que não existem
- **Sem diferencial claro** frente a Mobills Free / Organizze Free / GuiaBolso
- **Todo lists** parecem feature órfã — não reforçam o posicionamento financeiro
- **Firestore queries** sem paginação/cache — pode degradar com volume
- **Sem testes** automatizados no mobile (Jest configurado, sem specs)
- **Monetização zero** — receita inexistente hoje
- **Open Finance ausente** — expectativa padrão do usuário brasileiro em 2026

### 7. Monetização atual

**Nenhuma ativa.** Freemium implícito (tudo liberado). AdMob preparado mas desligado. Deep link de checkout sugere intenção futura de pagamento, sem implementação.

### Quadro resumo — Etapa 1

| Dimensão | Situação atual | Confiança |
|----------|----------------|-----------|
| Problema / público | Controle financeiro pessoal simples para BR | Média |
| Funcionalidades core | Lançamento manual + saldo + histórico mensal + listas genéricas | Alta |
| Estágio do produto | Lançado (MVP+), v2.0.1 na Play Store | Alta |
| Monetização atual | Gratuito total, sem receita | Alta |
| Domínio / nicho inferido | Finanças pessoais B2C | Alta |

---

## ETAPA 2 — Pesquisa de mercado

*Mercado-alvo: **Brasil**, B2C.*

### Cenário do mercado

| Métrica | Estimativa | Metodologia / fonte | Confiança |
|---------|------------|---------------------|-----------|
| **TAM** (fintech BR) | ~US$ 5,5 bi (2025) → US$ 19,1 bi (2034) | [IMARC Group — mercado fintech Brasil](https://www.imarcgroup.com/report/pt-br/brazil-fintech-market) | Média |
| **SAM** (apps PF/controle de gastos BR) | ~15–25 M usuários potenciais | Mobills cita 15 M+ downloads; ~53–70 M contas em Open Finance ([O Globo/BC](https://oglobo.globo.com/economia/noticia/2025/08/28/open-finance-ja-tem-70-milhoes-de-contas-e-avanca-para-portabilidade-de-credito-diz-galipolo.ghtml)) | Baixa |
| **SOM** (Trilho, indie, 12–24 meses) | 1.000–50.000 MAU realista | App sem marca estabelecida vs. líderes com milhões de downloads | Baixa |
| **Crescimento** | CAGR ~15% fintech BR; Open Finance expandindo para PJ | IMARC + BC | Média |
| **Tendências 12–24 meses** | Open Finance como commodity no premium; IA para categorização; consolidação (GuiaBolso → Cora); apps minimalistas com pagamento vitalício | Comparativos 2026 + notícias BC | Média |

### Análise competitiva — 5 diretos

| Concorrente | Funcionalidades principais | Preço (ref. 2026) | Pontos fortes | Pontos fracos | Gap explorável |
|-------------|---------------------------|-------------------|---------------|---------------|----------------|
| **Mobills** | Open Finance, orçamentos, relatórios, cartões | Free limitado; Premium ~R$ 14,90/mês ou ~R$ 99,90/ano | Mais completo, 15 M+ downloads, 4.7★ | Complexo, premium caro, free restritivo | Simplicidade sem fricção |
| **Organizze** | Lançamento manual/import, metas, fluxo de caixa | Free; Premium ~R$ 12,90–19,90/mês | UI limpa, foco em planejamento | Open Finance só no premium; menos automação | UX mais rápida no lançamento diário |
| **GuiaBolso (Cora)** | Open Finance automático, categorização | Gratuito (monetiza indiretamente) | Grátis + sync bancária | Menos controle manual fino; dependência Cora | Privacidade / controle manual |
| **Monefy** | Lançamento ultra-simples, widgets | Free; ~R$ 9,90/mês | Minimalista, baixa curva de aprendizado | Sem Open Finance BR robusto | “Trilho” como hábito diário em 10 segundos |
| **Minhas Economias** | Controle local, sem sync obrigatório | Gratuito | Privacidade, offline | Sem Open Finance, UI datada | Privacidade + nuvem opcional |

Fontes de benchmark de preços: [Cofre Urbano](https://cofreurbano.com/melhores-apps-financeiros-controle-gastos-2026/), [Ganhe Recompensa](https://ganherecompensa.com.br/blog/apps-para-controlar-gastos-top-8-2026-gratuitos-pagos). **Verificar sites oficiais antes de pricing final.**

### Substitutos indiretos

| Substituto | Por que competem |
|------------|------------------|
| **Planilhas Google/Excel** | Grátis, flexível, já usado por milhões |
| **App do Nubank / bancos** | Categorização automática, grátis, já instalado |
| **WhatsApp / notas** | Zero fricção para anotar gasto na hora |

### Comportamento do usuário

**Dores comuns:**

- Não saber para onde vai o dinheiro no fim do mês
- Abandonar app por fricção no lançamento manual
- Desconfiança em compartilhar dados bancários (LGPD)
- Paywall agressivo no free gera churn imediato

**Reclamações recorrentes em apps concorrentes** (padrão em comparativos; **Confiança: Média**):

- Sync bancária falha ou categoriza errado
- Versão free “inútil” sem Open Finance
- Assinatura cara para o que oferece
- App pesado / muitas telas

**Features com maior retenção no nicho** (**Hipótese: Média**):

- Lançamento em &lt;15 segundos
- Visão clara de “quanto posso gastar” (orçamento)
- Lembretes de contas a vencer
- Gráficos simples por categoria

### Oportunidades

1. **App “trilho”** — foco em hábito diário, não em dashboard corporativo
2. **Listas financeiras** — transformar `TodoList` em listas de compras com orçamento (hoje desconectado)
3. **Modo privacidade** — manual first, sync opcional depois
4. **Preço intermediário** — entre grátis (GuiaBolso) e R$ 19,90 (Organizze premium)
5. **Open Finance para PJ/MEI** — mercado PJ ainda imaturo — oportunidade de médio prazo, não agora

---

## ETAPA 3 — Funcionalidades recomendadas

### Funcionalidades gratuitas (Free / Base)

#### 1. Categorias de lançamento

- **Descrição:** escolher categoria ao registrar (Alimentação, Transporte, etc.); filtrar no histórico
- **Justificativa de mercado:** table stakes; sem isso o app parece incompleto
- **Complexidade:** Baixa (campo já existe no tipo `Transaction`)
- **Prioridade:** P0
- **Impacto esperado:** Retenção, Engajamento

#### 2. Orçamento mensal simples

- **Descrição:** definir teto de gastos do mês; barra de progresso na Home
- **Justificativa de mercado:** responde “quanto ainda posso gastar?” — dor #1 do segmento
- **Complexidade:** Média
- **Prioridade:** P0
- **Impacto esperado:** Retenção, Conversão (preview do premium)

#### 3. Gráfico de gastos por categoria

- **Descrição:** pizza ou barras no mês atual
- **Justificativa de mercado:** visualização = valor percebido sem Open Finance
- **Complexidade:** Média
- **Prioridade:** P1
- **Impacto esperado:** Engajamento, Retenção

#### 4. Lembretes de contas a pagar

- **Descrição:** cadastrar conta recorrente + notificação local (`expo-notifications`)
- **Justificativa de mercado:** README já promete; gap crítico produto vs. marketing
- **Complexidade:** Média
- **Prioridade:** P0
- **Impacto esperado:** Retenção D7/D30

#### 5. Onboarding de 3 telas

- **Descrição:** propósito, primeiro lançamento guiado, permissão de notificação
- **Justificativa de mercado:** ativação — sem onboarding, usuário vê Home vazia e sai
- **Complexidade:** Baixa
- **Prioridade:** P1
- **Impacto esperado:** Aquisição, Ativação

#### 6. Export CSV do mês

- **Descrição:** exportar transações para planilha
- **Justificativa de mercado:** reduz medo de lock-in; substituto indireto é Excel
- **Complexidade:** Baixa
- **Prioridade:** P2
- **Impacto esperado:** Aquisição (confiança)

### Funcionalidades premium (Pago / Assinatura)

#### 1. Histórico ilimitado + múltiplas contas/carteiras

- **Descrição:** free limita a 6 meses de histórico e 1 carteira; premium ilimitado
- **Proposta de valor:** power users e quem usa há mais de meio ano
- **Benchmark de preço:** Mobills free limita contas/transações; Organizze restringe integrações
- **Complexidade:** Média
- **Potencial de receita:** Médio

#### 2. Orçamentos por categoria + alertas inteligentes

- **Descrição:** orçamento por categoria, push quando atingir 80%/100%
- **Proposta de valor:** controle fino — o que Mobills cobra premium
- **Benchmark de preço:** incluso no premium Mobills ~R$ 14,90/mês
- **Complexidade:** Média
- **Potencial de receita:** Alto (driver de conversão)

#### 3. Relatórios avançados + comparativo mês a mês

- **Descrição:** tendências, comparativo 12 meses, projeção de saldo
- **Proposta de valor:** “entender para onde vai o dinheiro” de forma profunda
- **Benchmark de preço:** Organizze premium ~R$ 12,90–19,90/mês
- **Complexidade:** Média
- **Potencial de receita:** Médio

#### 4. Sync multi-dispositivo prioritário + backup

- **Descrição:** já tem Firebase; premium garante export automático e suporte
- **Complexidade:** Baixa (infra existente)
- **Potencial de receita:** Baixo sozinho; bom como bundle

#### 5. Open Finance (fase 2 — premium)

- **Descrição:** import automático via parceiro (Belvo, Pluggy, etc.)
- **Proposta de valor:** commodity esperada no premium brasileiro
- **Benchmark de preço:** diferencial dos líderes
- **Complexidade:** Alta (compliance, custo por usuário, contratos)
- **Potencial de receita:** Alto — mas só com escala

### Funcionalidades de diferenciação

#### 1. “Modo Trilho” — ritual diário de 30 segundos

- Check-in diário: “gastou hoje?” → lançamento rápido ou “dia zerado”
- **Potencial de viralização:** streaks, widget Android
- **Risco principal:** gamificação pode parecer infantil se mal executada

#### 2. Listas de compras com teto de gasto

- Reaproveitar `TodoList` → lista de mercado com orçamento e checkbox que vira despesa
- **Killer feature potencial:** poucos concorrentes no formato simples
- **Risco principal:** escopo creep se virar app de listas genérico

#### 3. “Cofre do mês” — quanto ainda pode gastar

- Um número grande na Home: orçamento − gastos − compromissos futuros
- **Mecanismo:** responde pergunta emocional, não contábil
- **Risco principal:** precisa de orçamento + contas recorrentes para funcionar bem

### Matriz impacto × esforço

| Funcionalidade | Impacto | Esforço | Prioridade |
|----------------|---------|---------|------------|
| Categorias | Alto | Baixo | P0 |
| Orçamento mensal simples | Alto | Médio | P0 |
| Lembretes de contas | Alto | Médio | P0 |
| Gráficos por categoria | Médio | Médio | P1 |
| Onboarding | Alto | Baixo | P1 |
| Listas → compras com orçamento | Alto | Médio | P1 |
| Paywall + planos (RevenueCat/Play Billing) | Alto | Médio | P1 |
| React Query + cache Firestore | Médio | Baixo | P1 |
| Relatórios avançados (premium) | Médio | Médio | P2 |
| Open Finance | Alto | Alto | P2 (futuro) |
| Anúncios AdMob (free) | Baixo | Baixo | P2 |

---

## ETAPA 4 — Modelo de monetização

### Modelo recomendado

**Freemium + assinatura**, com anúncios leves no free.

**Justificativa:**

- Padrão dominante no nicho BR (Mobills, Organizze, Monefy)
- Usuário brasileiro espera free funcional; paga por conveniência e automação
- Trilho ainda não tem Open Finance — premium deve vender **controle e insights**, não sync bancária (por enquanto)
- AdMob já está esboçado no código — receita complementar, não principal

**Modelos descartados:**

| Modelo | Por quê |
|--------|---------|
| Pago upfront | GuiaBolso grátis mata essa aposta |
| Marketplace de produtos financeiros | Precisa escala e licenças |
| B2B SaaS puro | App é B2C; PJ seria outro produto |
| 100% anúncios | CPM baixo em app financeiro BR; UX ruim |

### Estrutura de planos (sugestão inicial — BRL)

| Plano | Preço mensal | Preço anual | Funcionalidades incluídas | Limites de uso |
|-------|--------------|-------------|---------------------------|----------------|
| **Free** | R$ 0 | — | Lançamentos, categorias, 1 carteira, orçamento mensal básico, dark mode | Histórico 6 meses; sem relatórios avançados; anúncios discretos |
| **Trilho Pro** | R$ 9,90 | R$ 79,90 (~33% off) | Tudo do free + histórico ilimitado, orçamento por categoria, alertas, relatórios, export, sem ads | — |
| **Trilho Família** *(futuro)* | R$ 19,90 | R$ 149,90 | Até 3 perfis, orçamento compartilhado | Só após PMF do Pro |

*Preços são sugestão inicial, abaixo de Mobills (R$ 14,90) e Organizze premium.*

### Estratégia de conversão Free → Premium

**Gates de valor (momentos, não paywalls cegos):**

- Ao tentar ver histórico &gt; 6 meses → “Desbloqueie seu histórico completo”
- Ao criar 2º orçamento por categoria → upgrade
- Ao gerar relatório comparativo anual → preview borrado + CTA
- Após 30 dias de uso com streak ≥ 15 → oferta anual com desconto

**Limitar, não bloquear:**

- Free: orçamento **total** do mês (liberado)
- Premium: orçamento **por categoria** + alertas

**Momentos ideais para apresentar plano:**

- Fim do onboarding (soft CTA, não obrigatório)
- Primeiro fechamento de mês com saldo positivo
- Quando usuário bate 80% do orçamento

**Não colocar atrás de paywall no estágio atual:**

- Lançamento básico de receita/despesa
- Saldo do dia/mês
- Dark mode
- Login Google

### Projeção simplificada de MRR

**Premissas declaradas:**

| Premissa | Conservador | Base | Otimista |
|----------|-------------|------|----------|
| Conversão free → paid | 1% | 3% | 5% |
| ARPU mensal efetivo | R$ 9,90 | R$ 9,90 | R$ 11,50 (mix anual) |

*Benchmark: apps freemium productivity/finance tipicamente 2–5% conversão (**Hipótese: Média**).*

| Usuários ativos | Conversão | MRR conservador | MRR base | MRR otimista |
|-----------------|-----------|-----------------|----------|--------------|
| **1.000** | 1% / 3% / 5% | R$ 99 | R$ 297 | R$ 575 |
| **10.000** | 1% / 3% / 5% | R$ 990 | R$ 2.970 | R$ 5.750 |
| **100.000** | 1% / 3% / 5% | R$ 9.900 | R$ 29.700 | R$ 57.500 |

Cenário base: 10k MAU × 3% × R$ 9,90 ≈ **R$ 2.970/mês**.

**AdMob** (hipótese **Baixa**): receita complementar irrelevante vs. assinatura no estágio inicial.

---

## ETAPA 5 — Roadmap e próximos passos

### Fase 1 — Quick wins (0–30 dias)

| Item | Métrica de sucesso |
|------|-------------------|
| Categorias no fluxo de registro + filtro no histórico | ≥ 70% dos lançamentos com categoria |
| Orçamento mensal com barra na Home | Retenção D7 +5pp |
| Lembretes locais (`expo-notifications`) | ≥ 30% dos ativos cadastram 1+ lembrete |
| Corrigir README / Play Store listing | Reduzir reviews “não faz o que promete” |
| Firebase Analytics + eventos chave | Baseline de funil instalado |
| Decisão explícita sobre AdMob | Código ativado ou removido |

### Fase 2 — Crescimento (30–90 dias)

| Item | Dependência |
|------|-------------|
| Paywall Trilho Pro (RevenueCat ou Google Play Billing) | Orçamento por categoria |
| Gráficos + relatório mensal | Categorias estáveis |
| TodoList → listas de compras com orçamento | Redesign de UX |
| Onboarding + “Modo Trilho” (streak) | Analytics |
| React Query para cache Firestore | Refactor queries |
| ASO Play Store + screenshots reais | Assets em `assets/play-store/` |

**Métricas:** conversão free→paid ≥ 2%; retenção D30 ≥ 15%; NPS ≥ 30.

### Fase 3 — Escala (90–180 dias)

| Item | Risco |
|------|-------|
| Open Finance via parceiro | Custo fixo + compliance; só com &gt;5k MAU |
| Plano Família | Complexidade multi-usuário |
| Widget Android + lançamento rápido | Dev nativo |
| IA para categorização | Custo API |

### O que evitar

1. Open Finance antes de PMF
2. Feature creep — virar “Mobills pior”
3. Paywall no lançamento básico
4. Prometer no README o que não existe
5. Competir só por preço contra GuiaBolso grátis

### Recomendação final

1. Aceite o posicionamento: app manual, rápido e honesto.
2. Feche o gap P0: categorias + orçamento + lembretes em 30 dias.
3. Monetize com Trilho Pro a R$ 9,90 vendendo histórico, alertas e relatórios.
4. Reaproveite TodoList como diferencial ou remova.
5. Open Finance só na Fase 3, quando MRR base &gt; R$ 3k e retenção D30 comprovada.

Detalhamento em issues: [backlog.md](./backlog.md) · [GitHub #8–#30](https://github.com/filipecalm/trillho/issues) · [github-issues.md](./github-issues.md).

---

## Premissas e fontes

| Dado | Tipo | Fonte |
|------|------|-------|
| Features do Trilho | **Observado** | Código em `trillho/` |
| Preços Mobills/Organizze | **Benchmark** | Comparativos 2026 (ver links na Etapa 2) |
| TAM fintech BR | **Estimativa** | [IMARC Group](https://www.imarcgroup.com/report/pt-br/brazil-fintech-market) |
| Open Finance 70M contas | **Fonte pública** | [O Globo / BC](https://oglobo.globo.com/economia/noticia/2025/08/28/open-finance-ja-tem-70-milhoes-de-contas-e-avanca-para-portabilidade-de-credito-diz-galipolo.ghtml) |
| Taxas de conversão 1–5% | **Hipótese** | Benchmarks gerais freemium SaaS/mobile |
| MRR projetado | **Modelo** | Premissas declaradas; sem dados reais do Trilho |
| MAU/SOM Trilho | **Hipótese** | Sem analytics públicos do app |

---

## Resumo executivo (refinado)

1. Trilho é **produto lançado com core sólido mas incompleto** — falta o que o README promete e o que o mercado espera (categorias, orçamento, lembretes).
2. **Não tente vencer Mobills no Open Finance agora** — vença em simplicidade, hábito diário e preço justo.
3. **Freemium + Trilho Pro (~R$ 9,90/mês)** é o modelo viável; ads são complemento.
4. **P0 em 30 dias:** categorias, orçamento mensal, lembretes, alinhar marketing com código.
5. **TodoList vira diferencial** (listas de compras com teto) ou sai do app — feature órfã confunde posicionamento.
