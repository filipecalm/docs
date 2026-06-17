# Cursor — commits semânticos (global)

Configuração versionada para o Cursor sugerir e criar commits semânticos em **inglês** ([Conventional Commits](https://www.conventionalcommits.org/)) em **qualquer projeto** da máquina.

Arquivos-fonte neste repositório: [`cursor/`](./cursor/).

## O que faz

| Comportamento | Quando |
|---------------|--------|
| **Sugerir** mensagens de commit agrupadas por tipo | Ao terminar uma tarefa com arquivos modificados |
| **Criar** commits separados por mudança lógica | Quando você pedir explicitamente ("faça os commits", "semantic commits", etc.) |

Mensagens sempre em inglês, no formato `type(scope): imperative summary`.

Tipos comuns: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `build`, `ci`, `perf`.

## Estrutura versionada

```
cursor/
├── skills/
│   ├── suggest-semantic-commits/SKILL.md   # workflow de sugestão
│   └── create-semantic-commits/SKILL.md    # workflow de commit
├── commands/
│   ├── suggest-commits.md                  # slash command /suggest-commits
│   └── semantic-commits.md                 # slash command /semantic-commits
└── user-rules/
    └── semantic-commits.md                 # texto para User Rules (sempre ativo)
```

## Instalação (Windows)

Substitua `%USERPROFILE%` pelo seu usuário (ex.: `C:\Users\filip`).

### 1. Skills (todos os projetos)

```powershell
$src = "D:\Projetos\DietOS-docs\cursor\skills"
$dst = "$env:USERPROFILE\.cursor\skills"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item -Recurse -Force "$src\*" $dst
```

### 2. Slash commands (opcional)

```powershell
$src = "D:\Projetos\DietOS-docs\cursor\commands"
$dst = "$env:USERPROFILE\.cursor\commands"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item -Force "$src\*" $dst
```

### 3. User Rules (recomendado — sempre ativo)

`~/.cursor/rules/` **não** é carregado globalmente pelo Cursor. Para comportamento garantido em toda sessão do Agent:

1. Abra **Cursor Settings → Rules → User Rules**
2. Cole o conteúdo de [`cursor/user-rules/semantic-commits.md`](./cursor/user-rules/semantic-commits.md)

Skills e commands complementam; User Rules é o que mantém a sugestão automática após cada tarefa.

## Uso no dia a dia

- **Automático:** após editar código, o agente lista **Suggested commits** no final da resposta
- **`/suggest-commits`** — só sugerir mensagens, sem commitar
- **`/semantic-commits`** — inspecionar, agrupar e commitar
- **Pedido direto:** "faça os commits semânticos em inglês"

## Exemplo de sugestão

Após mudanças mistas:

```
chore(gitignore): ignore local pnpm store
  → .gitignore

feat(docker): add containerized Metro and Android dev workflow
  → Dockerfile, docker-compose.yml, scripts/docker-*.mjs, package.json

docs: add Docker development workflow guide
  → README.md
```

## Regras por projeto vs. global

| Mecanismo | Escopo | Formato |
|-----------|--------|---------|
| **User Rules** | Todos os projetos | Texto em Settings |
| **`~/.cursor/skills/`** | Todos os projetos | `SKILL.md` |
| **`~/.cursor/commands/`** | Todos os projetos | `.md` (slash) |
| **`.cursor/rules/*.mdc`** | Só o repositório atual | `.mdc` com `alwaysApply` |

Para o mesmo comportamento em um único repo (sem instalar globalmente), copie os `SKILL.md` para `.cursor/skills/` do projeto ou importe como [Remote Rule](https://cursor.com/docs/rules) apontando para este repositório.

## Atualizar após mudanças neste repo

```powershell
git -C D:\Projetos\DietOS-docs pull
# repetir os comandos de cópia da seção Instalação
# revisar User Rules se o texto em cursor/user-rules/ mudou
```

## Segurança (workflow de commit)

- Não commitar sem pedido explícito
- Não commitar secrets (`.env`, chaves, credentials)
- Não usar `--no-verify`, force push ou amend sem pedido
- Agrupar hunks diferentes com `git add -p` (no Windows: Git Bash `printf 'y\nn\n' | git add -p <file>`)
