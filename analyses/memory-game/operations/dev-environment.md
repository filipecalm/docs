# Ambiente de desenvolvimento — erros comuns

Registro condensado do setup monorepo (`app/`, `back/`, `front/`). Detalhe completo permanece em `memory_game/docs/troubleshooting.md`.

---

## Fluxo recomendado (Windows)

```powershell
# Primeira vez
pnpm docker:install      # ~20 min — deps no volume Docker
pnpm android:emulator
pnpm docker:android      # dev build + Metro

# Dia a dia
pnpm docker:start
pnpm docker:open
pnpm docker:status
```

API + web em paralelo: `pnpm back` (3000), `pnpm front` (5173).

| Onde | Variável dev |
|------|--------------|
| `back/.env` | `PUBLIC_CHECKOUT_BASE_URL=http://localhost:3000` |
| `back/.env` | `FRONTEND_URL_DEV=http://localhost:5173` |
| `front/.env` | `VITE_API_URL_DEV=http://localhost:3000/api` |
| App emulador | `API_BASE_URL=http://10.0.2.2:3000/api` |

Usar **pnpm** na raiz — não `npm`/`npx` quando `.npmrc` tem `node-linker`.

---

## App — Metro

| Sintoma | Causa | Fix |
|---------|-------|-----|
| `JavaScript heap out of memory` | Metro observa monorepo inteiro | `metro.config.js` limita `watchFolders`; heap 8 GB em `package.json` start |
| `exclusionList is not a function` | API metro-config | `blockList` manual em `metro.config.js` |
| Regex inválida no Windows | Paths `D:\` em regex | `blockPath()` com `/` normalizado |
| Porta 8081 ocupada | Metro duplicado | `kill-port 8081` ou `RCT_METRO_PORT` consistente |

---

## App — Android local

| Sintoma | Causa | Fix |
|---------|-------|-----|
| No development build installed | Expo Go não serve — usa dev-client | `pnpm docker:android` |
| `--port` + `--no-bundler` | Expo SDK 56 | Remover `--port` de `run-android.mjs`; porta via env |
| Gradle cache corrupto | Build interrompido | Apagar `app/android/.gradle`, `gradlew --stop` |
| `autolinking.gradle` missing | Template android antigo | `expo prebuild --platform android --clean` |
| Path > 250 chars (Ninja) | pnpm junctions Windows | `node-linker=hoisted` + `copy` em `app/.npmrc`; ou **Docker** |
| Metro porta errada | Script vs Metro real | Detectar Metro existente antes de subir novo |

**Melhor opção Windows:** Docker (`pnpm docker:android`) — evita limite de path.

---

## Docker

| Sintoma | Causa | Fix |
|---------|-------|-----|
| `expo not found` / Metro timeout | Volume `node_modules` vazio | `pnpm docker:install`; `ensure-docker-install.mjs` |
| `no devices/emulators` | Emulador no host, não no container | `pnpm android:emulator` antes |
| Porta 8081 não publicada | Containers órfãos | `pnpm docker:clean` + `docker:start` |
| Docker daemon inacessível | Desktop parado | `pnpm docker:fix` |
| Unable to load script | Metro caiu | `docker:status`, `docker:start`, `docker:open` |

Emulador → Metro host: `http://10.0.2.2:8081`.

---

## Backend

| Sintoma | Fix |
|---------|-----|
| `PrismaClient` não exportado | `pnpm back:setup`; Prisma 6.19.3 fixo; **não** `.npmrc` copy na raiz |
| Rota `/:id` captura `/session/:id` | Rotas específicas **antes** de `/:id` em `game.ts` |
| CORS em dev | `localhost:5173` permitido |

---

## Frontend

Refactor landing + `/criar`: páginas em `front/src/pages/Landing/` e `Create/`; Stripe com `platform: "web"`.

---

## Decisões conscientes (não “bugs”)

- Prisma 7 adiado — mantém 6.19.3  
- Subdeps deprecados da cadeia Expo/RN  
- Billing: ver [billing.md](./billing.md) — Stripe in-app bloqueado por design  

---

## Arquivos tocados nas correções

`app/metro.config.js`, `app/package.json`, `app/scripts/run-android.mjs`, `app/scripts/docker-android.mjs`, `app/scripts/ensure-docker-install.mjs`, `app/Dockerfile*`, `app/.npmrc`, `back/src/routes/game.ts`, `front/src/pages/`
