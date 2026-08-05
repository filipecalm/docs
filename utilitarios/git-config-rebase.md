# Git — `user.name` / `user.email`, `pull --rebase` e `rebase -i`

Cheatsheet operacional. Precedência de config: **local > global > system**.

Relacionado: commits semânticos no Cursor — [`cursor-semantic-commits.md`](../cursor-semantic-commits.md).

## Identidade (`user.name` / `user.email`)

Sem nome/e-mail o Git recusa commit (ou usa fallback lixo). Defina antes do primeiro commit.

### Configurar

```bash
# Global (todos os repositórios desta máquina / usuário)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Só o repositório atual (.git/config)
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

### Consultar

```bash
# Valor no nível pedido (pode estar vazio se só existir no outro nível)
git config user.name
git config --global user.name

git config user.email
git config --global user.email

# Valor efetivo (local > global > system)
git config --get user.name
git config --get user.email

# Tudo que o Git enxerga
git config --list

# Tudo + de qual arquivo veio cada chave
git config --list --show-origin

# Origem de uma chave específica
git config --show-origin --get user.name
git config --show-origin --get user.email
```

### Remover / editar

```bash
# Remover do global
git config --global --unset user.name
git config --global --unset user.email

# Abrir o arquivo de config global no editor
git config --global --edit
```

Arquivos típicos:

| Nível | Onde |
|-------|------|
| global | `~/.gitconfig` (Windows: `C:\Users\<user>\.gitconfig`) |
| local | `<repo>/.git/config` |
| system | instalação do Git (raro mexer) |

**Dica:** use e-mail da conta GitHub/GitLab (ou o noreply do GitHub) para o commit bater com o perfil remoto.

## `git pull --rebase`

`git pull` = `fetch` + integrar a branch remota na local.

| Forma | O que faz |
|-------|-----------|
| `git pull` (merge, default clássico) | Cria merge commit se houver divergência |
| `git pull --rebase` | Reaplica seus commits locais **em cima** do remoto — histórico linear |

```bash
git pull --rebase
# equivalente explícito:
git fetch origin
git rebase origin/<sua-branch>
```

Quando usar:

- Você tem commits locais e o remoto avançou.
- Quer evitar “Merge branch 'main' of …” no meio do histórico.

Se der conflito no rebase:

```bash
# resolve arquivos →
git add <arquivos>
git rebase --continue

# desistir do rebase atual
git rebase --abort
```

Tornar rebase o default do pull (opcional, global):

```bash
git config --global pull.rebase true
```

Só neste repo:

```bash
git config pull.rebase true
```

## `git rebase -i` (interativo)

Reescreve commits **locais** (ainda não pusados, ou com cuidado extremo se já foram).

```bash
# últimos N commits
git rebase -i HEAD~N

# desde um commit (não incluso) / branch base
git rebase -i <hash-base>
git rebase -i origin/main
```

Abre o editor com uma linha por commit, tipo:

```text
pick a1b2c3d feat: add login
pick d4e5f6a fix: typo
pick 778899a wip
```

Comandos comuns na lista:

| Comando | Efeito |
|---------|--------|
| `pick` | Mantém o commit |
| `reword` / `r` | Mantém, edita a mensagem |
| `edit` / `e` | Para no commit para alterar conteúdo |
| `squash` / `s` | Junta no commit de cima; edita mensagem combinada |
| `fixup` / `f` | Junta no de cima; **descarta** a mensagem deste |
| `drop` / `d` | Remove o commit |
| `break` / `b` | Pausa o rebase ali |

Ordem no arquivo = ordem de aplicação (mais antigo em cima).

Fluxo típico (limpar antes do push):

```bash
git rebase -i origin/main
# pick / squash / reword conforme necessário
# conflitos? add + rebase --continue (ou --abort)
git push
# se já tinha forçado push antes desta branch (cuidado):
# git push --force-with-lease
```

### Avisos (não ignore)

1. **Não rebaseie commits que já estão no remoto compartilhado** sem acordo do time — reescreve hashes e quebra quem já puxou.
2. Prefira `git push --force-with-lease` a `--force` se precisar republicar uma branch rebased.
3. Em ambiente de agente/CI sem TTY, `rebase -i` **não roda** (precisa editor interativo). Use terminal local ou `GIT_SEQUENCE_EDITOR` não interativo só se souber o que está fazendo.

### Comandos úteis no meio do rebase

```bash
git status                 # onde parou / conflitos
git rebase --continue      # depois de resolver + git add
git rebase --skip          # pula o commit atual (raro)
git rebase --abort         # volta ao estado pré-rebase
```

## Fluxo curto recomendado (dia a dia)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

git switch minha-feature
# ... commits locais ...

git fetch origin
git pull --rebase            # ou: git rebase origin/main
git rebase -i origin/main    # opcional: limpar/squash antes do PR
git push
```

## Checklist

| # | Ação |
|---|------|
| 1 | `git config --get user.name` / `user.email` ok |
| 2 | Preferir `pull --rebase` em feature branches |
| 3 | `rebase -i` só em commits locais / branch própria |
| 4 | Conflito → add → `--continue` ou `--abort` |
| 5 | Histórico compartilhado reescrito → `--force-with-lease` + avisar o time |
