---
name: suggest-semantic-commits
description: >-
  Suggest semantic Conventional Commit messages in English after code changes.
  Use when finishing a task with uncommitted files, when the user asks what to
  commit, or before ending a response that modified the codebase.
---

# Suggest semantic commits

When you finish a task that modified files, or when the user asks what to commit, check `git status` and `git diff` and suggest commit message(s) before ending your response.

## Format

Use [Conventional Commits](https://www.conventionalcommits.org/) in English:

```
type(scope): imperative summary

Optional body explaining why, not what.
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `build`, `ci`, `perf`.

## Grouping

Split unrelated changes into separate suggested commits. One logical change per commit.

Example after mixed changes:

```
chore(gitignore): ignore local pnpm store

feat(docker): add containerized Metro and Android dev workflow

docs: add Docker development workflow guide
```

## Response format

If there are uncommitted changes, end with a **Suggested commits** section:

- List each proposed commit message (title only, or title + short body if needed)
- Briefly note which files belong to each commit
- Do not run `git commit` unless the user explicitly asks

If the working tree is clean, skip this section.
