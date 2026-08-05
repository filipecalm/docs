# APK standalone pós-jogo personalizado

Feature opcional (backlog [MEM-015](../github-issues.md)): após upload de fotos, o backend dispara workflow EAS e expõe link de download.

---

## Fluxo

1. Upload termina → backend dispara `eas-build.yml` via GitHub Actions  
2. Build conclui → URL salva em `Game.build_id` → API retorna `apk_download_url`

## Onde o usuário vê

| Superfície | Tela |
|------------|------|
| App | Presente pronto (`/share`) — **Baixar APK do jogo** |
| Web | `/compartilhar/:token`, biblioteca Meus jogos |

Link só aparece após o build (vários minutos).

## Infra (back / Vercel)

| Variável | Uso |
|----------|-----|
| `GITHUB_TOKEN` | Disparar workflow (fine-grained, `actions:write`) |
| `GITHUB_REPO_OWNER` | `filipecalm` |
| `GITHUB_REPO_NAME` | `memory-game-monorepo` |
| `GITHUB_BRANCH` | `main` |

GitHub Actions: `EXPO_TOKEN` para EAS.

## API

| Endpoint | Retorno |
|----------|---------|
| `GET /api/games/:id/status` | `apk_download_url` |
| `GET /api/games/share/:token/info` | `apk_download_url` |
| `PUT /api/games/build/:id` | Webhook CI — não chamar manualmente |

## Suporte ao usuário

| Situação | Resposta |
|----------|----------|
| Link não aparece | Build em andamento — aguardar e atualizar |
| Download pede login Expo | Build interno EAS; para público geral, URL direta ou faixa Play |
| Android bloqueia instalação | Habilitar “fontes desconhecidas” no navegador |
| Preferência do usuário | Link/QR web (fluxo principal) — APK é extra |

FAQ relacionado: https://memoria.almeidatech.online/suporte
