# Lançamento Play Store — passo a passo

Guia operacional único. Política de billing: [billing.md](./billing.md). Rejeição por listagem: [store-compliance.md](./store-compliance.md).

**Pacote:** `com.filipecalm.memorygame` — não alterar após publicar sem migração.  
**Textos da loja:** `app/play-store-listing.json` — colar manualmente na Play Console (`eas metadata:push` é **só Apple**).

---

## 1. Stripe — preços Básico e Plus

[Stripe Dashboard → Products](https://dashboard.stripe.com/products):

| Produto | Preço | Env (Vercel back) |
|---------|-------|-------------------|
| Básico (6 fotos) | R$ 9,90 único | `STRIPE_PRICE_ID_BASIC` |
| Plus (12 fotos + extras) | R$ 27,90 único | `STRIPE_PRICE_ID_PLUS` |

Webhook: `https://memory-game-monorepo-back.vercel.app/api/webhook` · `checkout.session.completed` · `STRIPE_WEBHOOK_SECRET`.

---

## 2. Vercel — variáveis de ambiente

### Backend (`memory-game-monorepo-back`)

| Variável | Notas |
|----------|--------|
| `STRIPE_PRICE_ID_BASIC` / `STRIPE_PRICE_ID_PLUS` | Obrigatório |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Produção |
| `DATABASE_URL` | Pooler Supabase (6543) |
| `DIRECT_URL` | Direto (5432) — migrate local |
| `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET` | Bucket `memory-game` |
| `FRONTEND_URL` | `https://memoria.almeidatech.online` |
| `GITHUB_TOKEN`, `GITHUB_REPO_*`, `GITHUB_BRANCH` | Só se APK standalone ativo |
| `SEASONAL_THEME_ENABLED` | Opcional — `false` desliga tema Festas |

Redeploy após alterar.

### Front

| Variável | Valor |
|----------|-------|
| `VITE_API_URL` | `https://memory-game-monorepo-back.vercel.app/api` |
| `VITE_SUPABASE_URL` / keys | Mesmo projeto |
| `VITE_B2B_CONTACT_EMAIL` | `contato@almeidatech.online` |
| `VITE_PLAY_STORE_URL` | Após publicar (§6) |

---

## 3. Supabase — migrations

Projeto: `coyyukxvbzotrauwbpee`. Com `back/.env` de produção:

```bash
cd back
pnpm exec prisma migrate deploy
```

Migrations críticas: `share_token_and_library`, `victory_message`, `required_images`, `plus_tier`.  
Verificar tabela `Game`: colunas `share_token`, `tier`, `card_messages`, etc.

---

## 4. Play Console

### 4.1 App e IAP

1. [Play Console](https://play.google.com/console) — app **Memória Presente**, PT-BR, gratuito, pacote `com.filipecalm.memorygame`  
2. IAP `remove_ads`: ver [billing.md](./billing.md)

### 4.2 IARC (classificação)

[App content → Content ratings](https://play.google.com/console/developers/app/app-content):

| Pergunta | Resposta |
|----------|----------|
| Público | Famílias / todas as idades |
| Violência | Não |
| Anúncios | Sim — AdMob, não personalizados, child-directed |
| Compras in-app | Sim |
| UGC | Sim (fotos) |
| Online | Link/QR; fotos no backend |

### 4.3 Data safety

[Data safety](https://play.google.com/console/developers/app/data-privacy-security) — alinhar com [política de privacidade](https://memoria.almeidatech.online/politica-de-privacidade):

| Dado | Coletado | Compartilhado com |
|------|----------|-------------------|
| Nome, e-mail | Sim | Backend próprio |
| Fotos | Sim | Supabase Storage |
| IDs publicidade | Sim | Google (AdMob) |
| Histórico compras | Sim | Stripe / Google Play |

Criptografia em trânsito: Sim. Exclusão: privacidade@almeidatech.online.

### 4.4 Main store listing

[Main store listing](https://play.google.com/console/developers/app/main-store-listing):

| Campo | Limite | Fonte JSON |
|-------|--------|------------|
| Título | 30 chars | `title` → `Memória Presente - Jogo Fotos` |
| Descrição curta | 80 | `shortDescription` |
| Descrição completa | 4000 | `fullDescription` |

**Assets:**

| Asset | Caminho |
|-------|---------|
| Ícone 512×512 | `app/assets/store/play-store-icon.png` |
| Feature 1024×500 | `app/assets/store/feature-graphic.png` |
| Screenshots | `app/assets/store/screenshots/` |

Gerar screenshots:

```bash
cd app
pnpm generate-game-cards
pnpm generate-store-screenshots
```

Frames sugeridos: menu, Heróis, Princesas, 2 jogadores, compartilhar QR/link.

| Item | Valor |
|------|-------|
| Categoria | Jogo → Família / Puzzle |
| Contato | contato@almeidatech.online |
| Site | https://memoria.almeidatech.online |
| Privacidade | https://memoria.almeidatech.online/politica-de-privacidade |

> Screenshots de outro app → rejeição. Ver [store-compliance.md](./store-compliance.md).

### 4.5 Notas para o revisor

```
Temas gratuitos (Heróis, Princesas) e modo 2 jogadores.
Jogos personalizados: https://memoria.almeidatech.online/criar (pagamento no site).
Após compra: "Meus jogos" no app com e-mail da compra.
"Remover anúncios" = IAP remove_ads.
```

---

## 5. EAS — build e submit

```bash
cd app
pnpm install
eas build --profile production --platform android
```

Service account: [API access](https://play.google.com/console/developers/api-access) → JSON em `app/service-account.json` (não commitar).

```bash
eas submit --profile internal --platform android
# production quando for ao público
```

Tracks: internal → closed → production.

---

## 6. Pós-publicação

1. Copiar URL Play Store → `VITE_PLAY_STORE_URL` no front + redeploy  
2. Testar no aparelho: temas grátis, ads, `remove_ads`, Meus jogos, link/QR  
3. Monitorar revisão se adicionar IAP de jogos no futuro (v2)

---

## Checklist rápido

| # | Tarefa |
|---|--------|
| 1 | Stripe Básico + Plus + webhook |
| 2 | Env Vercel back + front |
| 3 | `prisma migrate deploy` |
| 4 | `remove_ads` Active |
| 5 | IARC + Data safety |
| 6 | Listagem + assets (só deste app) |
| 7 | `eas build` + `eas submit` |
| 8 | `VITE_PLAY_STORE_URL` |

---

## Onde alterar no monorepo

| O quê | Arquivo |
|-------|---------|
| Nome launcher | `app/app.json` → `expo.name` |
| Textos loja | `app/play-store-listing.json` |
| Site / landing | `front/src/pages/Landing/`, `SiteHeader` |
| Privacidade / termos / suporte | `front/src/pages/PrivacyPolicy`, `TermsOfUse`, `Support` |
| URL creator no app | `app/.env` → `CREATOR_WEB_URL` |
| IAP | `app/.env` → `REMOVE_ADS_PRODUCT_ID` |

---

## Referências Google

- [Política de pagamentos](https://support.google.com/googleplay/android-developer/answer/10281818)  
- [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469)  
- [EAS Metadata](https://docs.expo.dev/eas/metadata/) — Android não suportado
