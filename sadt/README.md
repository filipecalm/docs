# SADT — Documentação local

Guias operacionais do ecossistema SADT (`D:\Projetos\1-SADT`).

## Índice

| Documento | Conteúdo |
|-----------|----------|
| [dev-local.md](./dev-local.md) | Banco local, subir backend, apontar o frontend |
| [horarios-15-min.md](./horarios-15-min.md) | Intervalos de 15 min na prescrição de medicamento |

## Repositórios

| Pasta | Papel |
|-------|--------|
| `sadtbackend_prod` | API Django (produção / local com `.env`) |
| `sadtfrontend_prod` | Front Vite/Vue (branch/legado ativo) |
| `sadtfrontend_prod_vue3` | Front Vite/Vue 3 |
| `sadtfrontend_dev` | Front de desenvolvimento |
| `sadtbackend_dev` | Backend de desenvolvimento (se usado) |

## Portas locais (referência rápida)

| Serviço | Porta no host |
|---------|----------------|
| MySQL (Docker `db`) | `3308` |
| Redis (Docker) | `6379` |
| Backend (venv / `runserver`) | `8000` |
| Backend (Docker `app`) | `8001` → container `8000` |
| Frontend Vite | `8080` |
