# Prompts Genéricos

Versões dos prompts de [prompts.md](../prompts.md) que se adaptam ao **projeto aberto no momento** — sem assumir domínio (dietas, saúde, etc.), stack fixa ou nome de produto.

O catálogo original permanece em `prompts.md` com contexto e exemplos do DietOS.

## Como usar

1. Abra o repositório do projeto alvo no Cursor (ou anexe docs/código ao contexto).
2. Escolha o prompt abaixo conforme a tarefa.
3. Opcional: preencha os placeholders no topo do prompt antes de colar.
4. Se não preencher nada, o agente deve **inferir** nome, domínio, stack e estágio a partir do código.

## Placeholders

| Placeholder | Quando preencher | Se omitido |
|-------------|------------------|------------|
| `[NOME_DO_PROJETO]` | Quiser forçar um nome | Inferir do `package.json`, README ou pasta |
| `[DOMÍNIO/NICHO]` | Nicho não óbvio no código | Inferir do propósito do app/serviço |
| `[MERCADO_ALVO]` | Análise de produto (Prompt 4) | Perguntar ou assumir Brasil |
| `[PROJETO_DE_REFERÊNCIA]` | Assets Play Store (Prompt 3) | Perguntar qual repo tem os scripts |
| `[PASTA_DOCS]` | System design (Prompt 2) | `[nome-do-projeto]-docs` ao lado do repo |

## Índice

| # | Arquivo | Uso |
|---|---------|-----|
| 1 | [prompt-01-modernizacao.md](./prompt-01-modernizacao.md) | Upgrade de stack, refactor, UI, qualidade |
| 2 | [prompt-02-system-design.md](./prompt-02-system-design.md) | Documentação técnica sem alterar código |
| 3 | [prompt-03-play-store-assets.md](./prompt-03-play-store-assets.md) | Scripts e assets para lojas mobile |
| 4 | [prompt-04-analise-produto.md](./prompt-04-analise-produto.md) | Mercado, features, monetização, roadmap |

## Ordem recomendada

1. **Prompt 2** — baseline técnica
2. **Prompt 4** — estratégia antes de features grandes
3. **Prompt 1** — modernização faseada
4. **Prompt 3** — assets, quando identidade visual estiver estável

## Exemplos de entregáveis (Prompt 4)

| Projeto | Documentação |
|---------|--------------|
| **Trilho** (finanças pessoais) | [analyses/trilho/](../analyses/trilho/) — análise completa + backlog |

Salvar novas análises em `analyses/[nome-do-projeto]/` e indexar em [analyses/README.md](../analyses/README.md).

## Princípios (iguais ao original)

- Papel explícito + critérios por área
- Diagnóstico → plano → confirmação → execução
- Escopo delimitado por prompt
- Não inventar métricas nem ADRs sem base no código
