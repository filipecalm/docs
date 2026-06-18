# Prompt 2 — Documentação de System Design

**Uso:** gerar documentação técnica completa sem alterar código.  
**Quando usar:** onboarding de devs, pré-refactor, ou antes do Prompt 1.  
**Resultado esperado:** pasta de docs com 7 arquivos Markdown.

## Contexto (opcional)

- Projeto: `[NOME_DO_PROJETO]`
- Pasta de saída: `[PASTA_DOCS]` (padrão: `[nome-do-projeto]-docs`)

Se omitido, inferir nome do projeto e criar a pasta de docs adequada.

## Texto do prompt

```
Você é um engenheiro de software sênior especialista em documentação técnica. Analise este projeto de ponta a ponta e gere uma documentação completa de System Design.

1. Diagnóstico inicial
Antes de qualquer coisa, faça uma varredura completa do repositório:
- Mapeie a estrutura de pastas e arquivos
- Identifique a stack tecnológica completa (linguagens, frameworks, bibliotecas, versões)
- Detecte o padrão arquitetural em uso (MVC, Clean Architecture, Feature-based, etc.)
- Liste todos os scripts disponíveis (package.json, Makefile, shell scripts, etc.)
- Identifique integrações externas (APIs, serviços de terceiros, SDKs)
- Infira o domínio de negócio e o problema que o produto resolve (sem assumir nicho específico sem evidência)

2. System Design
Documente a arquitetura do sistema com:
- Visão geral do projeto (propósito, público-alvo, plataformas suportadas)
- Diagrama de arquitetura em texto (ASCII ou Mermaid) mostrando camadas e fluxo de dados
- Descrição de cada camada/módulo principal e sua responsabilidade
- Fluxos principais relevantes ao produto (autenticação, navegação, API, persistência, jobs, etc.)
- Decisões arquiteturais relevantes encontradas no código

3. Padrões de projeto identificados
Para cada padrão encontrado, documente:
- Nome do padrão
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
Ao final da análise, crie a seguinte estrutura em [PASTA_DOCS] (ou Projetos/[nome-do-projeto]-docs/ se não especificado):

[nome-do-projeto]-docs/
├── README.md               # Visão geral e índice da documentação
├── system-design.md        # Arquitetura completa e diagramas
├── patterns.md             # Padrões de projeto identificados
├── scripts.md              # Todos os scripts documentados
├── stack.md                # Stack completa com versões e justificativas
├── data-flow.md            # Fluxos de dados e estados principais
└── decisions.md            # ADRs inferidos do código

Regras de execução:
- Documente apenas o que está no código — não invente decisões arquiteturais
- Use linguagem técnica mas objetiva
- Trechos de código nos docs: máximo 20 linhas, ilustrativos
- Inconsistências ou code smells relevantes: seção ## ⚠️ Observações no arquivo pertinente
- Markdown com headers, sumário e links internos entre documentos

Comece pelo diagnóstico, liste o que encontrou (incluindo domínio inferido) e aguarde confirmação antes de gerar os arquivos finais.
```

## Recorte útil

**Atualizar docs após refactor:**

```
Releia este repositório e atualize apenas os arquivos em [PASTA_DOCS] que mudaram
(stack.md, system-design.md, patterns.md). Não altere código do produto.
```
