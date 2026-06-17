# Prompts Úteis para Melhoria do Projeto

Catálogo de prompts estruturados que funcionaram bem com agentes de IA (Cursor, Claude, etc.) no contexto do DietOS. Cada prompt segue o padrão **diagnosticar → planejar → aguardar confirmação → executar**, evitando mudanças aleatórias no código.

## Sumário

- [Por que esses prompts funcionam](#por-que-esses-prompts-funcionam)
- [Prompt 1 — Modernização React Native / Expo](#prompt-1--modernização-react-native--expo)
- [Prompt 2 — Documentação de System Design](#prompt-2--documentação-de-system-design)
- [Prompt 3 — Geração de Recursos Gráficos para Play Store](#prompt-3--geração-de-recursos-gráficos-para-play-store)
- [Prompt 4 — Análise de Produto, Mercado e Monetização](#prompt-4--análise-de-produto-mercado-e-monetização)
- [Matriz: prompt vs. estado atual do DietOS](#matriz-prompt-vs-estado-atual-do-dietos)
- [Como usar e adaptar](#como-usar-e-adaptar)
- [⚠️ Observações](#️-observações)

---

## Por que esses prompts funcionam

| Princípio | Efeito |
|-----------|--------|
| **Papel explícito** | "Você é um dev sênior…" ancora tom, profundidade e prioridades |
| **Critérios por área** | Dependências, código, UI, features, qualidade — o agente sabe o que cobrir |
| **Bibliotecas nomeadas** | NativeWind, Tamagui, React Query — reduz improviso |
| **Fluxo em fases** | Diagnóstico antes de código; confirmação antes de executar |
| **Escopo delimitado** | "Apenas documente" vs. "modernize tudo" — evita misturar tarefas |

Prompts vagos ("modernize o visual", "melhore o app") geram diffs grandes sem alinhamento. Os abaixo são a versão corrigida.

---

## Prompt 1 — Modernização React Native / Expo

**Uso:** upgrade de stack, refactor de código, redesign, novas features e qualidade.  
**Quando usar:** antes de um ciclo grande de evolução do app mobile.  
**Resultado esperado:** diagnóstico + plano faseado; execução só após confirmação.

### Texto do prompt

```
Você é um desenvolvedor React Native / Expo sênior. Faça uma modernização completa deste projeto seguindo estas instruções:

1. Atualização de dependências
- Migre para o Expo SDK mais recente (verifique a versão atual em expo.dev/changelog)
- Atualize todas as dependências para as versões compatíveis com o novo SDK
- Resolva conflitos de versão e deprecações
- Substitua pacotes descontinuados pelos seus sucessores oficiais

2. Modernização do código
- Migre para Expo Router v3+ (file-based routing) se ainda não usar
- Substitua class components por functional components com hooks
- Adote TypeScript estrito onde ainda não estiver tipado
- Use React Query ou Zustand para gerenciamento de estado, se aplicável
- Aplique React.memo, useCallback e useMemo onde houver gargalos evidentes

3. Redesign visual completo
- Implemente um design system consistente com tokens de cor, tipografia e espaçamento definidos em um arquivo central (ex: theme.ts)
- Use NativeWind v4 (Tailwind para React Native) ou StyleSheet organizado por componente
- Adote uma biblioteca de componentes moderna compatível com Expo (ex: react-native-paper v5, gluestack-ui, ou tamagui)
- Garanta suporte a dark mode com useColorScheme
- Aplique animações com react-native-reanimated v3 (transições de tela, feedbacks de toque, skeletons de loading)

4. Novas features (condizentes com o projeto)
Analise o propósito do app e proponha + implemente melhorias como:
- Onboarding com splash screen animada
- Notificações push com expo-notifications
- Suporte offline com cache local (expo-sqlite ou MMKV)
- Biometria / autenticação segura com expo-local-authentication
- Deep linking configurado no app.json

5. Qualidade e performance
- Configure ESLint + Prettier com as regras do Expo
- Adicione testes unitários básicos com Jest + Testing Library
- Use expo-constants para variáveis de ambiente
- Garanta que o app rode sem warnings no simulador iOS e Android

Comece fazendo um diagnóstico do estado atual do projeto (versões instaladas, estrutura de pastas, padrões em uso) antes de aplicar qualquer mudança. Apresente um plano de execução e aguarde confirmação antes de começar.
```

### Por que é melhor que "modernize o app"

- Lista **5 eixos** com ações verificáveis
- Cita **fonte de verdade** para SDK (`expo.dev/changelog`)
- Diferencia **já feito vs. a fazer** (Expo Router, TS strict)
- Impõe **gate de confirmação** antes de tocar no código

### Plano de execução sugerido (após diagnóstico DietOS)

| Fase | Escopo | Risco |
|------|--------|-------|
| **M1** | SDK 55 → 56 + `npx expo install --fix` | Médio — breaking changes Router/SDK |
| **M2** | Consolidar estado (React Query para API; Zustand só UI) | Baixo |
| **M3** | `theme.ts` + UI lib (escolher uma: Tamagui / NativeWind / Paper) | Alto — muitas telas |
| **M4** | Features em falta (biometria, MMKV, onboarding animado) | Médio |
| **M5** | Prettier, testes Jest, limpar warnings | Baixo |

**Não recomendado:** M1 + M3 no mesmo PR — regressões visuais e de build ficam impossíveis de isolar.

---

## Prompt 2 — Documentação de System Design

**Uso:** gerar documentação técnica completa sem alterar código.  
**Quando usar:** onboarding de devs, pré-refactor, ou antes do Prompt 1.  
**Resultado esperado:** pasta `Projetos/DietOS-docs/` com 7 arquivos Markdown (já gerada neste repositório).

### Texto do prompt

```
Você é um engenheiro de software sênior especialista em documentação técnica. Analise este projeto de ponta a ponta e gere uma documentação completa de System Design.

1. Diagnóstico inicial
Antes de qualquer coisa, faça uma varredura completa do repositório:
- Mapeie a estrutura de pastas e arquivos
- Identifique a stack tecnológica completa (linguagens, frameworks, bibliotecas, versões)
- Detecte o padrão arquitetural em uso (MVC, Clean Architecture, Feature-based, etc.)
- Liste todos os scripts disponíveis (package.json, Makefile, shell scripts, etc.)
- Identifique integrações externas (APIs, serviços de terceiros, SDKs)

2. System Design
Documente a arquitetura do sistema com:
- Visão geral do projeto (propósito, público-alvo, plataformas suportadas)
- Diagrama de arquitetura em texto (ASCII ou Mermaid) mostrando camadas e fluxo de dados
- Descrição de cada camada/módulo principal e sua responsabilidade
- Fluxos principais (autenticação, navegação, chamadas de API, persistência de dados)
- Decisões arquiteturais relevantes encontradas no código (ex: por que Zustand e não Redux)

3. Padrões de projeto identificados
Para cada padrão encontrado, documente:
- Nome do padrão (ex: Repository Pattern, Observer, Factory, HOC)
- Onde está aplicado (pasta/arquivo)
- Trecho de código ilustrativo
- Justificativa de uso

4. Scripts e automações
Para cada script encontrado, documente:
- Nome e localização
- Comando de execução
- O que faz (passo a passo)
- Dependências necessárias para rodar
- Exemplo de uso

5. Geração dos arquivos
Ao final da análise, crie a seguinte estrutura dentro de Projetos/[nome-do-projeto]-docs/:

Projetos/
└── [nome-do-projeto]-docs/
    ├── README.md               # Visão geral e índice da documentação
    ├── system-design.md        # Arquitetura completa e diagramas
    ├── patterns.md             # Padrões de projeto identificados
    ├── scripts.md              # Todos os scripts documentados
    ├── stack.md                # Stack completa com versões e justificativas
    ├── data-flow.md            # Fluxos de dados e estados principais
    └── decisions.md            # ADRs (Architecture Decision Records) inferidos

Regras de execução:
- Documente apenas o que está no código — não invente decisões arquiteturais
- Use linguagem técnica mas objetiva, sem rodeios
- Trechos de código nos docs devem ser curtos e ilustrativos (máximo 20 linhas)
- Se encontrar inconsistências ou code smells relevantes, registre em uma seção ## ⚠️ Observações dentro do arquivo pertinente
- Todos os arquivos em Markdown com headers, sumário automático e links internos entre documentos

Comece pelo diagnóstico, liste o que encontrou e aguarde confirmação antes de gerar os arquivos finais.
```

### Por que é melhor que "documente o projeto"

- Define **estrutura de saída** (7 arquivos, nomes fixos)
- Proíbe inventar ADRs — só inferir do código
- Inclui **scripts** (frequentemente ignorados em docs)
- Separa **diagnóstico** da **geração** de arquivos

### Artefatos gerados (DietOS)

| Arquivo | Link |
|---------|------|
| Índice | [README.md](./README.md) |
| Arquitetura | [system-design.md](./system-design.md) |
| Padrões | [patterns.md](./patterns.md) |
| Scripts | [scripts.md](./scripts.md) |
| Stack | [stack.md](./stack.md) |
| Fluxos | [data-flow.md](./data-flow.md) |
| ADRs | [decisions.md](./decisions.md) |

---

## Prompt 3 — Geração de Recursos Gráficos para Play Store

**Uso:** copiar scripts de geração de assets de um projeto de referência (ex.: dietOS), adaptar para o app atual, redesenhar a logo e gerar todos os recursos obrigatórios da Play Store.  
**Quando usar:** antes do primeiro submit à Play Store, após redesign visual, ou quando faltam screenshots/feature graphic.  
**Resultado esperado:** scripts funcionando no projeto alvo, assets nas dimensões corretas, logo em SVG + PNG + versão monocromática.

### Texto do prompt

```
# Tarefa: Geração de Recursos Gráficos para Play Store

## Contexto
Você está trabalhando em um app mobile. Existe um projeto de referência chamado **dietOS**
que já possui scripts prontos para geração de imagens e recursos gráficos.

## Etapa 1 — Copiar scripts do projeto dietOS
Localize no projeto `dietOS` todos os scripts relacionados a:
- Geração de imagens e assets gráficos
- Exportação de recursos para lojas (Play Store / App Store)
- Automação de ícones, splash screens ou banners

Copie esses scripts para o projeto atual, adaptando caminhos e configurações
conforme necessário para que funcionem neste contexto.

## Etapa 2 — Gerar recursos gráficos para a Play Store
Usando os scripts copiados (ou criando novos se necessário), gere todos os
assets obrigatórios da Play Store nos tamanhos e formatos corretos:

| Asset                  | Tamanho         | Formato |
|------------------------|-----------------|---------|
| Ícone do app           | 512×512 px      | PNG     |
| Feature graphic        | 1024×500 px     | PNG/JPG |
| Screenshots (telefone) | mín. 320px      | PNG/JPG |
| Screenshots (tablet)   | 1080×1920 px    | PNG/JPG |

## Etapa 3 — Melhorar e modernizar a logo do app
Redesenhe a logo atual seguindo estes critérios:

**Estética:**
- Visual moderno, limpo e minimalista
- Legível em tamanhos pequenos (ícone 48px) e grandes (splash screen)
- Compatível com fundos claros e escuros (dark mode)

**Técnico:**
- Exportar em SVG (para escalabilidade) e PNG (para uso imediato)
- Versão monocromática para uso em notificações Android
- Paleta de cores coerente com a identidade visual do app

## Critérios de sucesso
- [ ] Scripts do dietOS copiados e funcionando
- [ ] Todos os assets da Play Store gerados sem erros
- [ ] Logo exportada em todos os formatos solicitados
- [ ] Assets validados nas dimensões corretas
```

### Scripts de referência no dietOS

| Script | Comando npm | O que faz |
|--------|-------------|-----------|
| `scripts/generate-play-store-assets.mjs` | `npm run assets:play-store` | Gera ícone 512px e feature graphic 1024×500 |
| `scripts/fix-icon-padding.mjs` | (manual) | Ajusta safe zone de `icon.png`, `adaptive-icon.png` e `logo.png` |
| `sharp` (devDependency) | — | Renderização SVG → PNG e composição de banners |

### Adaptação para outro projeto (ex.: Kronos/cronometro)

1. Copiar os 3 scripts acima + adicionar `generate-logo.mjs` e `validate-assets.mjs` se necessário
2. Ajustar paleta, textos do feature banner e mocks de screenshot ao `theme/tokens.ts` do app
3. Criar `logo.svg` e `logo-mono.svg` como fonte vetorial
4. Adicionar ao `package.json`:
   - `"assets:logo"`, `"assets:fix-icons"`, `"assets:play-store"`, `"assets:all"`
   - `sharp` em `devDependencies`
5. Executar `pnpm run assets:all` e validar com `node scripts/validate-assets.mjs`

### Artefatos esperados

```
assets/
├── images/
│   ├── logo.svg
│   ├── logo-mono.svg
│   ├── logo.png
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── notification-icon.png
│   └── splash.png
└── play-store/
    ├── playstore-icon-512.png
    ├── playstore-feature-1024x500.png
    ├── screenshot-phone-*.png
    └── screenshot-tablet-*.png
```

### Por que é melhor que "gera os assets da Play Store"

- Aponta **projeto de referência** com scripts já testados (dietOS)
- Define **dimensões exatas** por tipo de asset
- Inclui **redesign da logo** com requisitos técnicos (SVG, mono, dark/light)
- Lista **critérios de sucesso** verificáveis (dimensões, formatos, scripts rodando)

---

## Prompt 4 — Análise de Produto, Mercado e Monetização

**Uso:** análise estratégica de produto — mercado, funcionalidades, monetização e roadmap.  
**Quando usar:** antes de definir pricing, priorizar backlog, preparar pitch ou validar direção do produto.  
**Resultado esperado:** diagnóstico do projeto (Etapa 1) + relatório completo nas Etapas 2–5, com premissas e fontes explícitas.

### Texto do prompt

```
Você é um agente especialista em análise de produtos digitais, pesquisa de mercado e estratégia de produto. Sua missão é realizar uma análise completa e aprofundada do projeto apresentado, identificando oportunidades de melhoria, funcionalidades de valor e um modelo de monetização viável. Aborde a análise como um consultor de produto sênior combinado com um analista de mercado — seja direto, baseado em evidências e orientado a decisões acionáveis.

## Regras de execução

- Se código, documentação ou arquivos do projeto estiverem disponíveis, analise-os diretamente antes de concluir. Se não, peça ao usuário que os forneça ou descreva o projeto em detalhes.
- Use pesquisa web para dados de mercado, preços de concorrentes e tendências. Cite fontes ou indique claramente quando um dado for estimativa.
- Não invente métricas (TAM, conversão, MRR). Use faixas e declare premissas. Marque cada afirmação crítica com nível de confiança: Alta / Média / Baixa.
- Diferencie fatos observados no projeto de hipóteses estratégicas.
- Recomendações técnicas devem considerar a stack e o estágio atual do produto — não sugira features de complexidade Alta sem justificar custo vs. impacto.
- Comece pela Etapa 1. Apresente o diagnóstico e pergunte se o usuário quer a análise completa (Etapas 2–5) ou foco em áreas específicas (ex.: só monetização, só concorrência). Se o usuário pedir tudo de uma vez, execute as cinco etapas sem pausar.

## Contexto opcional (pergunte se não estiver claro)

- Mercado-alvo e geografia (ex.: Brasil, LATAM, global)
- Modelo de negócio pretendido (B2C, B2B, B2B2C)
- Tamanho da equipe e restrições de prazo/orçamento
- Objetivo da análise (validar ideia, preparar lançamento, escalar receita)

---

ETAPA 1 — VERIFICAÇÃO E ENTENDIMENTO DO PROJETO

Antes de qualquer análise estratégica, examine o projeto e responda:

1. Qual é o nome, propósito central e público-alvo do app?
2. Quais funcionalidades já existem? (liste telas, fluxos e recursos identificados)
3. Qual problema principal o app resolve e para quem?
4. Qual é o estágio atual? (ideia / MVP / beta / produto lançado / escala)
5. Quais são os pontos fortes técnicos e de UX já presentes?
6. Quais são as lacunas ou limitações mais evidentes?
7. Qual modelo de monetização já existe, se houver? (gratuito, freemium, assinatura, etc.)

Ao final, entregue um quadro resumo:

| Dimensão | Situação atual | Confiança |
|----------|----------------|-----------|
| Problema / público | … | Alta/Média/Baixa |
| Funcionalidades core | … | … |
| Estágio do produto | … | … |
| Monetização atual | … | … |

---

ETAPA 2 — PESQUISA DE MERCADO

Realize pesquisa estruturada. Priorize fontes verificáveis (sites oficiais, app stores, relatórios públicos, reviews).

### Cenário do mercado
- Tamanho estimado do mercado (TAM / SAM / SOM) — com metodologia e fontes
- Taxa de crescimento do segmento
- Tendências atuais e emergentes (12–24 meses)

### Análise competitiva
Liste os 5 principais concorrentes diretos e preencha a tabela:

| Concorrente | Funcionalidades principais | Preço | Pontos fortes | Pontos fracos | Gap explorável |
|-------------|---------------------------|-------|---------------|---------------|----------------|
| … | … | … | … | … | … |

Inclua também 1–2 substitutos indiretos (planilhas, WhatsApp, serviços manuais) se relevantes ao nicho.

### Comportamento do usuário
- Dores mais comuns no segmento
- Reclamações recorrentes em apps concorrentes (reviews, fóruns, redes)
- Features com maior retenção e engajamento no nicho (com evidência ou hipótese marcada)

### Oportunidades
- Espaços pouco explorados pelos concorrentes
- Tendências que o app pode capturar nos próximos 12–24 meses

---

ETAPA 3 — FUNCIONALIDADES RECOMENDADAS

Cruze a análise do projeto com a pesquisa de mercado. Para cada funcionalidade, avalie alinhamento com o que já existe no código (quando disponível).

### Funcionalidades gratuitas (Free / Base)

Para cada item:
- **Nome**
- **Descrição** — o que faz e como o usuário interage
- **Justificativa de mercado** — por que gera aquisição e retenção
- **Complexidade** — Baixa / Média / Alta (considerando stack atual)
- **Prioridade** — P0 (imediata) / P1 (próximo ciclo) / P2 (futuro)
- **Impacto esperado** — Aquisição / Retenção / Engajamento / Suporte à conversão

### Funcionalidades premium (Pago / Assinatura)

Para cada item:
- **Nome**
- **Descrição detalhada**
- **Proposta de valor** — por que o usuário pagaria
- **Benchmark de preço** — o que concorrentes cobram por equivalente (moeda e periodicidade)
- **Complexidade** — Baixa / Média / Alta
- **Potencial de receita** — qualitativo (Alto / Médio / Baixo) + drivers

### Funcionalidades de diferenciação

2 a 3 ideias que poucos ou nenhum concorrente oferecem:
- Descrição e mecanismo de valor
- Potencial de viralização ou "killer feature"
- Risco principal de adoção

### Matriz impacto × esforço

Classifique as top 8–10 recomendações em uma tabela:

| Funcionalidade | Impacto | Esforço | Prioridade |
|----------------|---------|--------|------------|
| … | Alto/Médio/Baixo | Alto/Médio/Baixo | P0/P1/P2 |

---

ETAPA 4 — MODELO DE MONETIZAÇÃO

### Modelo recomendado
- Indique o modelo mais adequado (freemium, assinatura, créditos, marketplace, B2B SaaS, híbrido, etc.)
- Justifique com base no comportamento do mercado, perfil do usuário e estágio do produto
- Mencione modelos descartados e por quê

### Estrutura de planos

| Plano | Preço mensal | Preço anual (desconto) | Funcionalidades incluídas | Limites de uso |
|-------|--------------|------------------------|---------------------------|----------------|
| Free | … | — | … | … |
| … | … | … | … | … |

Adapte moeda ao mercado-alvo (ex.: BRL para Brasil). Indique se preços são sugestão inicial ou benchmark de concorrentes.

### Estratégia de conversão Free → Premium
- "Gates" de valor que motivam upgrade (momentos de uso, não só paywalls)
- Funcionalidades limitadas (não bloqueadas) para criar desejo
- Momentos ideais no onboarding e no uso recorrente para apresentar plano pago
- O que **não** colocar atrás de paywall no estágio atual (risco de churn ou baixa aquisição)

### Projeção simplificada

Declare explicitamente as premissas:
- Taxa de conversão free → paid assumida (e benchmark de referência)
- ARPU mensal por plano
- Mix de planos estimado

Projete MRR com cenários conservador, base e otimista para:
- 1.000 usuários ativos
- 10.000 usuários ativos
- 100.000 usuários ativos

Formato sugerido:

| Usuários ativos | Conversão | MRR conservador | MRR base | MRR otimista |
|-----------------|-----------|-----------------|----------|--------------|
| 1.000 | …% | … | … | … |
| … | … | … | … | … |

---

ETAPA 5 — ROADMAP E PRÓXIMOS PASSOS

### Fase 1 — Quick wins (0–30 dias)
- O que implementar para aumentar valor e retenção imediata
- Métricas de sucesso (ex.: retenção D7, ativação, NPS)

### Fase 2 — Crescimento (30–90 dias)
- Funcionalidades que sustentam aquisição e preparam monetização
- Dependências técnicas ou de conteúdo

### Fase 3 — Escala (90–180 dias)
- Features premium, integrações e diferenciais competitivos
- Riscos e trade-offs

### O que evitar
- 3–5 armadilhas comuns neste nicho (feature creep, pricing errado, etc.)

### Recomendação final
Resumo executivo em até 5 pontos: o que fazer primeiro, por quê e o que evitar.

---

## FORMATO DE SAÍDA

1. **Resumo executivo** no topo (5 bullets acionáveis)
2. Títulos claros para cada etapa
3. Tabelas para comparação competitiva, planos, matriz impacto×esforço e projeção de MRR
4. Listas para funcionalidades com todos os campos preenchidos
5. Seção **Premissas e fontes** ao final (o que foi medido vs. estimado)
6. Seção **Resumo executivo** repetida ao final (mesmos 5 pontos, refinados)
7. Linguagem direta; técnica quando necessário; sem jargão vazio
8. Afirmações de mercado com benchmark real sempre que possível; caso contrário, marque como hipótese
```

### Por que é melhor que "analise meu app e sugira como monetizar"

- Impõe **diagnóstico antes da estratégia** (Etapa 1) com gate de confirmação opcional
- Exige **fontes e níveis de confiança** — reduz números inventados (TAM, MRR, conversão)
- Cruza recomendações com **código e stack existentes**, não só ideias genéricas
- Define **tabelas e campos obrigatórios** (concorrência, planos, impacto×esforço, MRR com premissas)
- Separa **limitar vs. bloquear** na conversão free → paid
- Inclui **o que evitar** e métricas por fase do roadmap

### Variações úteis

**Só monetização (recorte):**

```
Com base no código e docs deste projeto, execute apenas as Etapas 1 e 4 deste prompt de análise de produto.
Foque em modelo de preço, planos e conversão free → premium para o mercado [Brasil/global].
Declare todas as premissas de MRR.
```

**Só concorrência e posicionamento:**

```
Execute Etapas 1 e 2 do prompt de análise de produto.
Priorize tabela competitiva, gaps de mercado e proposta de diferenciação em 3 frases (elevator pitch).
Use pesquisa web e cite fontes.
```

**Roadmap pós-análise:**

```
Com base na última análise de produto deste projeto, gere apenas a Etapa 5 em formato de issues/backlog:
cada item com título, descrição, prioridade P0/P1/P2 e critério de aceite mensurável.
```

### Checklist antes de colar o prompt

- [ ] Repositório ou documentação do produto abertos no contexto do agente
- [ ] Mercado-alvo definido (ou disposto a responder quando o agente perguntar)
- [ ] Objetivo claro: validação de ideia, pricing, backlog ou pitch
- [ ] Se quiser análise completa de uma vez, diga explicitamente no início da conversa

---

## Matriz: prompt vs. estado atual do DietOS

Referência cruzada do **Prompt 1** com o código em jun/2026. Detalhes em [stack.md](./stack.md) e [decisions.md](./decisions.md).

### 1. Dependências

| Item do prompt | Estado DietOS |
|----------------|---------------|
| Expo SDK mais recente | SDK **55** instalado; SDK **56** disponível |
| Deps compatíveis | Alinhadas com SDK 55 |
| Pacotes descontinuados | `moment` candidato a `dayjs`/`date-fns`; Zustand em **RC** |

### 2. Modernização de código

| Item do prompt | Estado DietOS |
|----------------|---------------|
| Expo Router v3+ | ✅ Em uso (SDK 55 / Router ~55) |
| Class → functional | ✅ Sem class components |
| TypeScript strict | ✅ `strict: true` |
| React Query / Zustand | ⚠️ Ambos presentes; Query **subutilizado** |
| memo / useCallback / useMemo | ⚠️ Pontual (~15 arquivos) |

### 3. Redesign visual

| Item do prompt | Estado DietOS |
|----------------|---------------|
| `theme.ts` central | ❌ Só `constants/colors.ts` |
| NativeWind / StyleSheet | StyleSheet inline + 2 arquivos em `styles/` |
| UI library (Paper/Tamagui/etc.) | ❌ Não adotada |
| Dark mode (`useColorScheme`) | ❌ Tema escuro fixo |
| Reanimated v3+ animações | ⚠️ Reanimated 4 instalado; pouco uso visível |

### 4. Novas features

| Item do prompt | Estado DietOS |
|----------------|---------------|
| Onboarding + splash animada | ❌ Splash estática |
| Push (`expo-notifications`) | ✅ Lembretes + mensagens nutri |
| Offline (SQLite/MMKV) | ⚠️ AsyncStorage + SecureStore apenas |
| Biometria | ❌ `expo-local-authentication` ausente |
| Deep linking | ✅ `scheme: myapp`, redirect Stripe |

### 5. Qualidade

| Item do prompt | Estado DietOS |
|----------------|---------------|
| ESLint Expo | ✅ `eslint-config-expo` |
| Prettier | ❌ Não configurado |
| Jest + Testing Library | ⚠️ Jest configurado; **sem** specs mobile |
| `expo-constants` para env | ✅ `apiBaseUrl.ts` |
| Zero warnings simulador | Não verificado automaticamente |

**Legenda:** ✅ feito · ⚠️ parcial · ❌ pendente

---

## Como usar e adaptar

### Ordem recomendada

1. **Prompt 2** (documentação) — baseline antes de mudanças
2. **Prompt 4** (produto e monetização) — estratégia e backlog antes de features grandes
3. **Prompt 1** (modernização) — uma fase por vez, com confirmação
4. **Prompt 3** (assets Play Store) — após identidade visual estável ou antes do submit

### Variações úteis

**Só upgrade SDK (recorte do Prompt 1):**

```
Atualize este projeto Expo para o SDK mais recente (expo.dev/changelog).
Diagnóstico primeiro: liste versões atuais e breaking changes aplicáveis.
Plano em um único PR. Aguarde confirmação antes de executar.
```

**Só design system (recorte do Prompt 1):**

```
Crie theme.ts com tokens de cor, tipografia e spacing a partir de constants/colors.ts.
Adote [Tamagui|NativeWind v4] sem alterar lógica de negócio.
Diagnóstico das telas mais críticas primeiro. Aguarde confirmação da lib escolhida.
```

**Atualizar docs após refactor:**

```
Releia o repositório DietOS e atualize apenas os arquivos em DietOS-docs/ que mudaram
(stack.md, system-design.md, patterns.md). Não altere código do app.
```

### Checklist antes de colar o prompt

- [ ] Repositório aberto no Cursor com contexto do projeto
- [ ] Branch limpa ou intenção de feature branch explícita
- [ ] Escolha de UI lib definida (se for redesign)
- [ ] "Aguarde confirmação" mantido no final — evita diff de 10k linhas

---

## ⚠️ Observações

- Prompts são **templates** — ajuste nomes de pasta (`DietOS-docs`) e fases conforme o momento do projeto.
- O Prompt 1 assume greenfield de modernização; no DietOS vários itens já estão feitos — o diagnóstico evita retrabalho (ex.: migrar Router que já existe).
- Documentação (Prompt 2) deve ser **reexecutada** após modernizações grandes para não divergir do código.
- Não commitar secrets nem pedir ao agente para commitar sem instrução explícita.
