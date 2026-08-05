# SADT — Ambiente local (banco, backend, frontend)

Como conectar no MySQL local, subir a API e apontar o front para ela.

**Projetos**

- Backend: `D:\Projetos\1-SADT\sadtbackend_prod`
- Frontend (Vue 3): `D:\Projetos\1-SADT\sadtfrontend_prod_vue3`
- Frontend (prod atual): `D:\Projetos\1-SADT\sadtfrontend_prod`

---

## 1. Pré-requisitos

- Docker Desktop ligado
- Python no `.venv` do backend (`sadtbackend_prod\.venv`)
- Node compatível com o front (`^20.19` ou `>=22.12`, ver `package.json`)

No Windows, o comando `python` do PATH costuma ser o atalho da Microsoft Store. Prefira:

```powershell
.\.venv\Scripts\python.exe manage.py ...
```

---

## 2. Banco de dados local

### 2.1 Subir MySQL + Redis

No backend:

```powershell
cd D:\Projetos\1-SADT\sadtbackend_prod
$env:REDIS_PORT = "6379"
docker compose up -d db redis
```

| Serviço | Host | Porta | Observação |
|---------|------|-------|------------|
| MySQL | `127.0.0.1` | `3308` | mapeia `3308→3306` do container |
| Redis | `127.0.0.1` | `6379` | |

Espere o MySQL responder:

```powershell
docker exec sadtbackend_prod-db-1 mysqladmin ping -h localhost -uroot -plocalsadt --silent
```

### 2.2 Credenciais (`.env` do backend)

Arquivo: `sadtbackend_prod\.env`

```env
DJANGO_DEBUG=True

SQL_ENGINE=django.db.backends.mysql
SQL_DATABASE=sadt_backend_local
SQL_USER=root
SQL_PASSWORD=localsadt
SQL_HOST=127.0.0.1
SQL_PORT=3308

REDIS_PORT=6379
REDIS_URI=redis://127.0.0.1:6379

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080
```

Banco local em uso: **`sadt_backend_local`**.

Há também `.env.prod` com o RDS de produção — **não use para migrate local** sem autorização.

### 2.3 Cliente SQL (DBeaver / MySQL Workbench / CLI)

| Campo | Valor |
|-------|--------|
| Host | `127.0.0.1` |
| Port | `3308` |
| User | `root` |
| Password | `localsadt` |
| Database | `sadt_backend_local` |

CLI:

```powershell
docker exec -it sadtbackend_prod-db-1 mysql -uroot -plocalsadt sadt_backend_local
```

### 2.4 Criar o banco do zero + migrations

```powershell
cd D:\Projetos\1-SADT\sadtbackend_prod

docker exec sadtbackend_prod-db-1 mysql -uroot -plocalsadt -e "DROP DATABASE IF EXISTS sadt_backend_local; CREATE DATABASE sadt_backend_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

$env:SENTRY_DSN = ""
.\.venv\Scripts\python.exe manage.py migrate --noinput
```

Confirme horários de 15 em 15 (migration `uteis.0069`):

```powershell
docker exec sadtbackend_prod-db-1 mysql -uroot -plocalsadt -N -e "USE sadt_backend_local; SELECT COUNT(*) FROM uteis_horarios; SELECT COUNT(*) FROM uteis_horarios WHERE nome LIKE '%:15' OR nome LIKE '%:45';"
```

Esperado: **96** horários no total, **48** com `:15` ou `:45`.

> **Atenção:** não rode dois `migrate` em paralelo no mesmo banco (outro chat/agent, outro terminal). Isso deixa tabelas sem registro em `django_migrations`.

### 2.5 Conflitos conhecidos no grafo de migrations

Em banco zerado, o app `operadoras` tem branches que criam a mesma tabela (`operadoras_versaoxml`, `operadoras_tipoguia`). Se aparecer `already exists`:

```powershell
.\.venv\Scripts\python.exe manage.py migrate operadoras 0033_versaoxml_procedimentoporoperadora_despesa_and_more --fake
.\.venv\Scripts\python.exe manage.py migrate --noinput
# se tipoguia:
.\.venv\Scripts\python.exe manage.py migrate operadoras 0038_tipoguia_procedimentoporoperadora_tipoguia --fake
.\.venv\Scripts\python.exe manage.py migrate --noinput
```

---

## 3. Rodar o backend

### Opção A — venv local (recomendado no dia a dia)

```powershell
cd D:\Projetos\1-SADT\sadtbackend_prod
$env:REDIS_PORT = "6379"
docker compose up -d db redis

$env:SENTRY_DSN = ""
.\.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000
```

API: **http://127.0.0.1:8000/**

Alternativa (ASGI, como no Docker):

```powershell
.\.venv\Scripts\python.exe -m uvicorn core.asgi:application --host 0.0.0.0 --port 8000 --reload
```

### Opção B — container `app` (Docker)

```powershell
cd D:\Projetos\1-SADT\sadtbackend_prod
$env:REDIS_PORT = "6379"
docker compose up -d
```

API no host: **http://127.0.0.1:8001/** (`8001→8000` no `docker-compose.yml`).

Dentro do container o host do MySQL deve ser `db` e a porta `3306` (não `127.0.0.1:3308`). O `.env` atual está otimizado para o processo Python **no Windows**; para o serviço `app` no Compose, sobrescreva:

```powershell
docker compose run --rm -e SQL_HOST=db -e SQL_PORT=3306 -e REDIS_URI=redis://redis:6379 app python manage.py migrate
```

### Health check rápido

```powershell
curl http://127.0.0.1:8000/uteis/horarios/ -H "Authorization: Bearer <token>"
```

(Sem token autenticado a API deve responder 401/403 — o importante é o servidor estar no ar.)

---

## 4. Conectar o frontend

Os fronts Vite leem a URL da API em:

`VITE_APP_API_URL` → `src/service/utilsService.js` → `UtilsService.urlApi()` → Axios (`src/http/index.js`).

### 4.1 Ajustar `.env` do front

**`sadtfrontend_prod_vue3\.env`** ou **`sadtfrontend_prod\.env`**:

```env
# Local (venv na 8000)
VITE_APP_API_URL=http://127.0.0.1:8000/

# Se o backend estiver no Docker app (porta 8001):
# VITE_APP_API_URL=http://127.0.0.1:8001/

# Produção (não use enquanto testa local):
# VITE_APP_API_URL=https://api.gssma.com.br/

VITE_DEV_MODE=true
```

Reinicie o Vite depois de mudar o `.env` (variáveis `VITE_*` só entram no boot).

### 4.2 Subir o front

```powershell
cd D:\Projetos\1-SADT\sadtfrontend_prod_vue3
npm install
npm run dev
```

UI: **http://127.0.0.1:8080/** (script `dev` usa `--port 8080`).

O mesmo vale para `sadtfrontend_prod` se for o front que você usa no dia a dia.

### 4.3 CORS / CSRF

O backend atual tem `CORS_ALLOW_ALL_ORIGINS = True` em settings, então `8080` costuma funcionar. Mesmo assim o `.env` local pode listar `http://localhost:8080` e `http://127.0.0.1:8080` em `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` (já sugerido na seção 2.2).

### 4.4 Checklist “está falando com o local?”

1. MySQL `sadt_backend_local` no ar (`3308`)
2. Backend em `8000` (ou `8001` no Docker)
3. Front com `VITE_APP_API_URL` apontando para essa porta
4. Vite reiniciado
5. No DevTools → Network, as calls vão para `127.0.0.1:8000` (não `api.gssma.com.br`)
6. Prescrição → grade de horários mostra `:15` / `:45` (ver [horarios-15-min.md](./horarios-15-min.md))

---

## 5. Ordem sugerida no dia a dia

```powershell
# 1) Infra
cd D:\Projetos\1-SADT\sadtbackend_prod
$env:REDIS_PORT = "6379"
docker compose up -d db redis

# 2) API
$env:SENTRY_DSN = ""
.\.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000

# 3) Front (outro terminal)
cd D:\Projetos\1-SADT\sadtfrontend_prod_vue3
# garantir VITE_APP_API_URL=http://127.0.0.1:8000/
npm run dev
```

Abrir: http://127.0.0.1:8080/

---

## 6. Produção (não misturar)

| Item | Local | Produção |
|------|-------|----------|
| `.env` | `sadt_backend_local` / `127.0.0.1:3308` | `.env.prod` → RDS |
| Front API | `http://127.0.0.1:8000/` | `https://api.gssma.com.br/` |
| Migrate | livre no local | só com autorização |

Migrate em prod exige ok explícito do responsável — o RDS não deve ser o alvo do fluxo local acima.
