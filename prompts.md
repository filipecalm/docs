# Prompts Úteis para Melhoria do Projeto

Catálogo de prompts estruturados que funcionaram bem com agentes de IA (Cursor, Claude, etc.) no contexto do DietOS. Cada prompt segue o padrão **diagnosticar → planejar → aguardar confirmação → executar**, evitando mudanças aleatórias no código.

## Sumário

- [Por que esses prompts funcionam](#por-que-esses-prompts-funcionam)
- [Prompt 1 — Modernização React Native / Expo](#prompt-1--modernização-react-native--expo)
- [Prompt 2 — Documentação de System Design](#prompt-2--documentação-de-system-design)
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
2. **Prompt 1** (modernização) — uma fase por vez, com confirmação

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
