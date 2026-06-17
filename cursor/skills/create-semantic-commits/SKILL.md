---
name: create-semantic-commits
description: >-
  Create semantic git commits in English when the user asks to commit, make
  commits, or create semantic commits. Groups changes by type and uses
  Conventional Commits.
---

# Create semantic commits

When the user asks to commit, make commits, or create semantic commits, follow this workflow. Do not commit unless explicitly requested.

## 1. Inspect

Run in parallel:

- `git status`
- `git diff` and `git diff --cached`
- `git log --oneline -10` (match existing message style)

## 2. Plan

Group changes by logical type. One concern per commit. Use English Conventional Commits:

`type(scope): imperative summary`

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `build`, `ci`, `perf`.

## 3. Commit

For each group, sequentially:

1. Stage only the files for that commit (`git add` or `git add -p` when a file spans multiple concerns)
2. Commit with a HEREDOC message:

```bash
git commit -m "$(cat <<'EOF'
type(scope): imperative summary

Optional body explaining why.
EOF
)"
```

3. Run `git status` after all commits to confirm a clean tree.

## Safety

- Never update git config
- Never commit secrets (`.env`, credentials, keys)
- Never use `--no-verify`, force push, or destructive git commands unless explicitly requested
- Never amend unless the user explicitly asks and the commit was not pushed

## Mixed files

If one file has unrelated hunks (e.g. `package.json` with rename + new scripts), use partial staging (`git add -p`) or Git Bash `printf 'y\nn\n' | git add -p <file>` on Windows to keep commits focused.
