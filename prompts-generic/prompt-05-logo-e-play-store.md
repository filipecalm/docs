# Prompt 5 — Logo e assets da Play Store a partir do projeto aberto

**Uso:** criar identidade visual (logo) inferida do app em que você está trabalhando e gerar recursos gráficos da Play Store + ícones/splash wired no build (Expo ou Flutter).  
**Quando usar:** antes do primeiro submit à Play Store, quando não existe logo, ou após mudança de branding.  
**Resultado esperado:** logo em SVG + PNG, ícones do app no lugar certo da stack detectada, assets de loja em `store/play-store/` validados pixel a pixel.

**Stacks suportadas:** Expo / React Native (Expo) · Flutter

## Contexto (opcional)

- Nome do app: `[NOME_DO_PROJETO]`
- Stack forçada: `[EXPO / FLUTTER / auto]`
- Estilo desejado: `[MINIMALISTA / BOLD / FLAT / GRADIENTE / OUTRO]`
- Referência visual: `[URL ou descrição — opcional]`

Se omitido, inferir tudo a partir do repositório aberto.

## Texto do prompt

```
# Tarefa: Logo + recursos gráficos da Play Store (Expo ou Flutter)

## Papel
Você é designer de identidade visual e engenheiro de assets mobile. Cria logos legíveis em 48px e em banner, gera arquivos nas dimensões exatas da Play Store e configura ícone/splash no build correto da stack detectada.

## Contexto
Trabalhe no repositório aberto. Não copie branding de outro produto.

### Etapa 0 — Detectar stack (obrigatório, antes de criar arquivos)

Classifique o projeto como **EXPO** ou **FLUTTER** (nunca assuma Expo se for Flutter):

| Sinal | Expo / RN (Expo) | Flutter |
|-------|------------------|---------|
| Arquivo raiz | `app.json`, `app.config.js/ts`, `package.json` com `expo` | `pubspec.yaml` com `flutter:` |
| Pastas nativas | `android/` gerenciado pelo Expo prebuild ou EAS | `android/`, `ios/`, `lib/` |
| Ícones hoje | `app.json` → `icon`, `android.adaptiveIcon` | `flutter_launcher_icons` no `pubspec.yaml` ou `mipmap-*` em `android/app/src/main/res/` |
| Splash hoje | `expo-splash-screen` / plugin em `app.json` | `flutter_native_splash` no `pubspec.yaml` ou `launch_background.xml` |

**Regra:** se `pubspec.yaml` existir com SDK Flutter, trate como **FLUTTER** — não use `app.json` nem caminhos Expo.

No diagnóstico, declare explicitamente: `Stack detectada: EXPO` ou `Stack detectada: FLUTTER` e os caminhos que o projeto **já usa** (respeite convenção existente; se divergir da tabela abaixo, adapte e documente).

Leia também:
- Nome, slug e descrição (`app.json` / `app.config.*` / `pubspec.yaml` / `AndroidManifest.xml` / README)
- Paleta (`theme/`, `tokens.ts`, `ColorScheme`, `colors.xml`, Material `ThemeData`)
- Domínio e copy das telas principais

Se algo essencial estiver ambíguo, pergunte em no máximo 3 perguntas. Caso contrário, prossiga.

## Fluxo obrigatório
1. **Diagnóstico** — stack, nome, nicho, paleta (HEX), caminhos atuais de ícone/splash
2. **Proposta de logo** — conceito + paleta + o que o símbolo comunica
3. **Aguardar confirmação** — pare aqui, salvo se o usuário pediu execução direta
4. **Execução** — fontes vetoriais, PNGs, scripts, config da stack, build nativo se necessário
5. **Validação** — checklist da stack + dimensões Play Store

---

## Etapa 1 — Logo (comum às duas stacks)

Criar fontes em pasta de design compartilhada (criar se não existir):

```
assets/brand/
├── logo.svg          # vetorial editável
├── logo-mono.svg     # silhueta sólida monocromática
└── logo-1024.png     # 1024×1024, fundo transparente
```

**Estética:** moderna, legível em 48px, funciona em claro/escuro, símbolo separável do wordmark quando fizer sentido.

**Técnico:** paleta dos tokens do projeto; documentar HEX usados.

A partir de `logo-1024.png`, derivar os masters de ícone (1024×1024, safe zone ~66% no centro):

```
assets/brand/
├── app-icon-1024.png              # ícone quadrado completo
├── app-icon-adaptive-fg-1024.png  # foreground Android (conteúdo dentro da safe zone)
└── notification-icon-96.png       # 96×96, branco #FFFFFF em alpha
```

---

## Etapa 2A — Wiring EXPO (React Native / Expo)

### Copiar masters para caminhos Expo

Use estes caminhos **ou** os que o `app.json`/`app.config.*` já referencia:

| Arquivo destino | Origem | Dimensão |
|-----------------|--------|----------|
| `assets/images/icon.png` | `app-icon-1024.png` | 1024×1024 |
| `assets/images/adaptive-icon.png` | `app-icon-adaptive-fg-1024.png` | 1024×1024 |
| `assets/images/notification-icon.png` | `notification-icon-96.png` | 96×96 |
| `assets/images/logo.png` | `logo-1024.png` | 1024×1024 |
| `assets/images/splash.png` | composição logo + fundo tema | conforme `splash` no config |

### Configurar `app.json` ou `app.config.*`

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#HEX_FUNDO"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#HEX_FUNDO"
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#HEX_PRIMARIA"
        }
      ]
    ]
  }
}
```

Ajuste plugins já existentes em vez de duplicar.

### Scripts Node (Expo)

Se não existirem, criar/adaptar com `sharp`:

- `scripts/fix-icon-padding.mjs` — trim + margem em `icon.png`, `adaptive-icon.png`, `logo.png`
- `scripts/generate-play-store-assets.mjs` — gera assets de loja a partir dos masters
- `scripts/validate-assets.mjs` — valida dimensões; exit ≠ 0 se falhar

`package.json`:

```json
{
  "scripts": {
    "assets:fix-icons": "node scripts/fix-icon-padding.mjs",
    "assets:play-store": "node scripts/generate-play-store-assets.mjs",
    "assets:validate": "node scripts/validate-assets.mjs",
    "assets:all": "npm run assets:fix-icons && npm run assets:play-store && npm run assets:validate"
  },
  "devDependencies": {
    "sharp": "^0.33.0"
  }
}
```

Executar `npm run assets:all` (ou pnpm/yarn). Se houve mudança de ícone nativo, rodar `npx expo prebuild --clean` **somente** se o projeto usa prebuild local (não em managed puro sem android/).

---

## Etapa 2B — Wiring FLUTTER

**Não** use `app.json`. **Não** assuma `package.json` na raiz.

### Copiar masters para caminhos Flutter

Padrão recomendado (adaptar se `pubspec.yaml` já declara outros):

| Arquivo destino | Origem | Dimensão |
|-----------------|--------|----------|
| `assets/icon/app_icon.png` | `app-icon-1024.png` | 1024×1024 |
| `assets/icon/adaptive_foreground.png` | `app-icon-adaptive-fg-1024.png` | 1024×1024 |
| `assets/brand/logo.png` | `logo-1024.png` | 1024×1024 |
| `assets/splash/splash_logo.png` | logo centralizada | conforme splash |

Registrar pastas em `pubspec.yaml` → `flutter.assets` se ainda não estiverem.

### `flutter_launcher_icons`

Adicionar/atualizar em `pubspec.yaml`:

```yaml
dev_dependencies:
  flutter_launcher_icons: ^0.14.0

flutter_launcher_icons:
  android: true
  ios: true
  image_path: assets/icon/app_icon.png
  adaptive_icon_background: "#HEX_FUNDO"
  adaptive_icon_foreground: assets/icon/adaptive_foreground.png
  min_sdk_android: 21
  remove_alpha_ios: true
```

Executar:

```bash
dart run flutter_launcher_icons
```

Isso gera `android/app/src/main/res/mipmap-*` e `ios/Runner/Assets.xcassets/AppIcon.appiconset/` — **não** editar mipmaps à mão se o gerador rodou.

### `flutter_native_splash`

Adicionar/atualizar:

```yaml
dev_dependencies:
  flutter_native_splash: ^2.4.0

flutter_native_splash:
  color: "#HEX_FUNDO"
  image: assets/splash/splash_logo.png
  android_12:
    color: "#HEX_FUNDO"
    image: assets/splash/splash_logo.png
```

Executar:

```bash
dart run flutter_native_splash:create
```

### Notificação Android (Flutter)

Ícone mono branco em `android/app/src/main/res/drawable-xxxhdpi/ic_notification.png` (96×96) **ou** configurar via pacote de push usado no projeto (`firebase_messaging`, `awesome_notifications`, etc.). Ler o pacote antes de chutar caminho.

### Scripts de loja (Flutter)

Opções (escolha uma):

1. **Reutilizar scripts Node** em `tool/` ou `scripts/` + `package.json` mínimo só para assets (comum em monorepos)
2. **Script Dart** em `tool/generate_store_assets.dart` usando pacote `image`

O script deve ler `assets/brand/` e escrever em `store/play-store/`. Validar dimensões no final.

**Não** exigir `npm run assets:all` se o projeto Flutter não tiver Node — use Dart ou documente `node tool/...` após criar `package.json` mínimo.

---

## Etapa 3 — Assets da Play Store (Expo e Flutter — upload manual)

Estes arquivos **não entram no build do app**. Servem para upload na Google Play Console.

Gerar em `store/play-store/` (ou `assets/play-store/` se o repo já usa esse caminho — manter consistência):

| Asset | Dimensão | Formato | Nome |
|-------|----------|---------|------|
| **Ícone da loja** | **512×512 px exatos** | PNG | `playstore-icon-512.png` |
| Feature graphic | 1024×500 px exatos | PNG | `playstore-feature-1024x500.png` |
| Screenshot telefone | 1080×1920 (9:16) | PNG/JPG | `screenshot-phone-01.png` … |
| Screenshot tablet 7" | 1200×1920 | PNG/JPG | `screenshot-tablet-7-01.png` |
| Screenshot tablet 10" | 1920×1200 | PNG/JPG | `screenshot-tablet-10-01.png` |

Regras:
- Ícone da Play Store: **sempre 512×512** — gerar via script (`sharp`/`image`) a partir de `app-icon-1024.png`, nunca renomear 1024px sem resize
- Feature graphic: copy do app atual; sem texto cortado
- Screenshots: preferir captura real (`flutter run` + emulator screenshot, ou Expo dev build). Se impossível, mock fiel às telas reais e **avisar** que são placeholders
- Mínimo 2 screenshots de telefone quando viável

---

## Etapa 4 — Validação

### Comum (Play Store)

- [ ] `playstore-icon-512.png` → 512×512
- [ ] `playstore-feature-1024x500.png` → 1024×500
- [ ] Cada screenshot → dimensão da tabela acima
- [ ] Script de validação executado sem erro

### Checklist EXPO

- [ ] `app.json`/`app.config.*` aponta para os PNGs gerados
- [ ] `assets/images/icon.png` → 1024×1024
- [ ] `adaptive-icon.png` → 1024×1024, conteúdo na safe zone
- [ ] `notification-icon.png` → 96×96 mono branco
- [ ] `npm run assets:all` passou (se scripts Node existem)

### Checklist FLUTTER

- [ ] `pubspec.yaml` declara `flutter_launcher_icons` e assets paths
- [ ] `dart run flutter_launcher_icons` executado sem erro
- [ ] `dart run flutter_native_splash:create` executado (se splash configurado)
- [ ] `android/app/src/main/res/mipmap-*/ic_launcher.png` atualizado (timestamp recente)
- [ ] iOS `AppIcon.appiconset` atualizado (se target iOS existir)
- [ ] Nenhum caminho Expo (`app.json`) foi criado por engano

### Entrega final

Listar todos os arquivos com caminho relativo, stack usada, comandos executados e o que falta upload manual na Play Console.

## Restrições
- Não misturar convenções Expo e Flutter no mesmo repo
- Não usar stock sem licença
- Não inventar nome/nicho divergente do código
- Não pular validação de dimensões
- Não afirmar que screenshots são reais se forem mock
```

## Estrutura de artefatos

### Comum (design + loja)

```
assets/brand/
├── logo.svg
├── logo-mono.svg
├── logo-1024.png
├── app-icon-1024.png
├── app-icon-adaptive-fg-1024.png
└── notification-icon-96.png

store/play-store/          # upload manual na Play Console
├── playstore-icon-512.png       # 512×512
├── playstore-feature-1024x500.png
├── screenshot-phone-*.png
├── screenshot-tablet-7-*.png
└── screenshot-tablet-10-*.png
```

### Expo (build)

```
assets/images/
├── icon.png
├── adaptive-icon.png
├── notification-icon.png
├── logo.png
└── splash.png

app.json / app.config.*
scripts/
├── generate-play-store-assets.mjs
├── fix-icon-padding.mjs
└── validate-assets.mjs
```

### Flutter (build)

```
assets/icon/
├── app_icon.png
└── adaptive_foreground.png
assets/splash/
└── splash_logo.png

pubspec.yaml               # flutter_launcher_icons, flutter_native_splash, assets
android/app/src/main/res/  # gerado por flutter_launcher_icons
ios/Runner/Assets.xcassets/
tool/ ou scripts/          # geração store/play-store/
```

## O que o prompt não faz

- **Upload** na Play Console (só gera arquivos)
- **Garantir** design premiado — dimensões sim, gosto é revisão humana
- **Screenshots reais** sem emulador/dispositivo — tenta capturar; senão mock com aviso

## Relacionado

- [Prompt 3 — Play Store (copiar scripts de referência)](./prompt-03-play-store-assets.md)
- Scripts Expo de referência: [scripts/generate-play-store-assets.mjs](../scripts/generate-play-store-assets.mjs), [scripts/fix-icon-padding.mjs](../scripts/fix-icon-padding.mjs)
