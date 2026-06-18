# Prompt 1 — Modernização de Projeto

**Uso:** upgrade de stack, refactor, redesign, novas features e qualidade.  
**Quando usar:** antes de um ciclo grande de evolução do produto.  
**Resultado esperado:** diagnóstico + plano faseado; execução só após confirmação.

## Contexto (opcional)

- Projeto: `[NOME_DO_PROJETO]`
- Domínio: `[DOMÍNIO/NICHO]`

Se omitido, inferir tudo a partir do repositório aberto.

## Texto do prompt

```
Você é um desenvolvedor sênior na stack deste projeto. Faça uma modernização completa seguindo estas instruções:

Antes de qualquer ação, identifique automaticamente:
- Tipo de projeto (mobile, web, backend, monorepo, CLI, etc.)
- Frameworks e versões em uso (package.json, Cargo.toml, pyproject.toml, etc.)
- Padrões arquiteturais e estrutura de pastas já adotados
- O propósito do produto e o público-alvo (README, telas, rotas, entidades de domínio)

Adapte todas as recomendações abaixo à stack detectada — não force tecnologias que não se aplicam (ex.: Expo Router em projeto Next.js).

1. Atualização de dependências
- Migre para as versões estáveis mais recentes compatíveis com o ecossistema do projeto
- Consulte changelogs oficiais da stack principal antes de propor upgrades
- Atualize dependências transitivas e resolva conflitos de versão
- Substitua pacotes descontinuados pelos sucessores oficiais documentados

2. Modernização do código
- Alinhe-se aos padrões idiomáticos atuais da linguagem/framework (hooks vs classes, async/await, etc.)
- Reforce tipagem estática onde existir (TypeScript strict, mypy, etc.)
- Consolide gerenciamento de estado/dados conforme o que o projeto já usa ou o padrão da stack (React Query, Zustand, Redux, TanStack Query, etc.)
- Aplique otimizações de performance apenas onde houver evidência de gargalo

3. Redesign visual / UX (se aplicável)
- Se o projeto tiver UI: implemente ou consolide um design system com tokens centralizados (cores, tipografia, espaçamento)
- Use a abordagem de estilização já presente ou a biblioteca de componentes mais adequada à stack
- Garanta acessibilidade básica e suporte a tema claro/escuro se fizer sentido para o produto
- Animações e feedback visual apenas onde melhoram UX mensurável

4. Novas features (condizentes com o domínio do projeto)
Analise o propósito real do produto (não assuma nicho de saúde, finanças, etc. sem evidência no código) e proponha melhorias como:
- Onboarding ou first-run experience, se ainda não existir
- Notificações, offline, autenticação segura — somente se relevantes ao tipo de app
- Integrações que completem o fluxo principal do usuário
- Cada sugestão deve citar onde no código a lacuna foi identificada

5. Qualidade e performance
- Configure ou alinhe linter e formatter ao padrão do ecossistema
- Adicione testes básicos nos módulos de maior risco, se ainda não houver cobertura
- Variáveis de ambiente e secrets seguindo as práticas da stack
- Build e execução local sem warnings evitáveis

Comece fazendo um diagnóstico do estado atual (versões, estrutura, padrões, domínio de negócio inferido) antes de aplicar qualquer mudança. Apresente um plano de execução em fases com risco estimado por fase e aguarde confirmação antes de começar.
```

## Recortes úteis

**Só upgrade de dependências:**

```
Atualize as dependências deste projeto para versões estáveis recentes compatíveis com a stack detectada.
Diagnóstico primeiro: liste versões atuais e breaking changes aplicáveis.
Plano em um único PR. Aguarde confirmação antes de executar.
```

**Só design system:**

```
Com base no tema/cores já existentes neste projeto, crie ou consolide tokens centralizados de design.
Não altere lógica de negócio. Diagnóstico das telas/componentes mais críticos primeiro. Aguarde confirmação.
```
