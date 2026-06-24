# Memory Game — Análise de Produto, Mercado e Monetização

> Gerado a partir do código em [memory_game](../../../memory_game) e pesquisa de mercado (jun/2026).  
> Prompt: [Prompt 4](../../prompts-generic/prompt-04-analise-produto.md) · Índice: [README](./README.md)

---

## Resumo executivo

1. **Memory Game já é produto em produção** (v1.0.0, `versionCode` 3, Play Store, API e web creator no ar), com loop funcional: temas grátis + jogo personalizado pago (R$ 19,90 via Stripe) + AdMob child-directed.
2. **Concorrente direto mais próximo no BR é Nossas Lembranças** (R$ 9,90–19,90, web, link/QR) — o preço atual está alinhado ao tier PRO, mas o produto mobile nativo + temas grátis é diferencial se a retenção e o compliance forem resolvidos.
3. **Modelo recomendado: freemium híbrido** — grátis com anúncios nos temas; pay-per-game para personalizado; opcional assinatura “Família” (sem anúncios + N jogos/mês). Evitar assinatura pura no estágio atual.
4. **P0 imediato:** remover copy de teste (“Pagar com Stripe (teste)”), corrigir fricção web (login após compra), política de privacidade (AdMob + Stripe + fotos), biblioteca “Meus jogos”, avaliar risco Play Billing vs Stripe no Android.
5. **Evitar:** escalar features B2B/corporativo antes de fechar o funil B2C; depender de receita de anúncios child-directed; manter o nome “Memory Game” no iOS sem checar marca Ravensburger no Brasil.

---

## ETAPA 1 — Verificação e entendimento do projeto

### 1. Nome, propósito e público-alvo

| Item | Detalhe |
|------|---------|
| **Nome** | Memory Game (`memory-game`, pacote `com.filipecalm.memorygame`) |
| **Propósito** | Jogo da memória com temas gratuitos ou jogo personalizado com 12 fotos do usuário (24 cartas) |
| **Público-alvo** | Famílias brasileiras, pais/mães, quem busca presente personalizado e brincadeira infantil (**Confiança: Média** — copy em PT-BR, temas Heróis/Princesas, ads COPPA-style) |
| **Canais** | App Android (Expo), web creator (`memoria.almeidatech.online`), API (`memory-game-backend-six.vercel.app`) |

### 2. Funcionalidades existentes (observadas no código)

#### App mobile (Expo Router)

| Tela / rota | O que faz |
|-------------|-----------|
| **Menu** (`/`) | Escolher tema grátis (Heróis / Princesas) ou iniciar fluxo personalizado |
| **Game** (`/game`) | Tabuleiro 24 cartas, flip, vitória, interstitial ao ganhar |
| **Create** (`/create`) | Nome, email, nome do jogo → Stripe Checkout |
| **Payment success** | Verifica sessão Stripe, redireciona para upload ou jogo |
| **Upload** (`/upload`) | Selecionar exatamente 12 fotos, upload, jogar no app |

#### Web creator (Vite)

| Página | Rota | Função |
|--------|------|--------|
| Landing | `/` | Marketing, CTA Play Store e “Criar pelo site” |
| Create | `/criar` | Formulário + Stripe |
| Success | `/success` | Pós-pagamento |
| Upload | `/upload/:gameId` | 12 imagens com otimização WebP |
| Game | `/game/:id` | Jogo no browser (**exige login Supabase**) |
| Login | `/login` | Auth email/senha |
| Termos / Privacidade | `/termos`, `/politica-de-privacidade` | Stubs legais |

#### Backend (Express + Prisma)

- Checkout Stripe (`POST /stripe/checkout`), webhook, verificação de sessão
- CRUD de jogos, upload de 12 imagens → Supabase Storage (WebP via Sharp)
- Trigger opcional de build EAS por jogo via GitHub Actions (`build_id`)

#### Modos de jogo

| Modo | Detalhe |
|------|---------|
| **Temas grátis** | `heroes`, `princesses` — 12 ilustrações SVG cada → 24 cartas |
| **Personalizado pago** | 12 fotos do usuário → 24 cartas (tamanho fixo) |
| **Ausente** | Dificuldade variável, timer, pontuação (mobile), som, multiplayer, histórico de jogos |

### 3. Problema principal

**Problema:** transformar fotos de família em experiência lúdica compartilhável — presente personalizado ou atividade infantil sem montar jogo manualmente.

**Para quem:** pais, avós e parceiros que querem surpresa emocional com baixo esforço técnico; secundariamente crianças que jogam temas grátis no celular.

### 4. Estágio atual

**Produção inicial / soft launch** (**Confiança: Alta**):

- `version: "1.0.0"`, Android `versionCode: 3`
- Infra de produção (Vercel, EAS, AdMob IDs reais, Stripe)
- Assets de Play Store presentes
- Copy de pagamento ainda em modo teste; política de privacidade incompleta; fluxo web com inconsistência de auth

Não é ideia nem protótipo — é produto publicável com monetização ligada, mas **não totalmente endurecido para escala**.

### 5. Pontos fortes técnicos e de UX

| Área | Situação |
|------|----------|
| Arquitetura | Monorepo pnpm (`app/`, `back/`, `front/`) com sync para repos espelho |
| Stack mobile | Expo SDK 56, RN 0.85, Reanimated, TypeScript, dev client |
| Gameplay | Animação de flip, paletas por tema, grid responsivo, fluxo de vitória |
| Monetização | AdMob (banner menu + interstitial vitória) + Stripe one-shot |
| Compliance ads | `requestNonPersonalizedAdsOnly`, `MaxAdContentRating.G`, child-directed tags |
| Cross-channel | Mesmo backend para compra no app e na web |
| Upload | Validação 12 imagens client + server; WebP no backend e no front |

### 6. Lacunas evidentes

| Lacuna | Impacto |
|--------|---------|
| Web: compra sem login, jogo **com** login (`PrivateRoute`) | Churn pós-compra (**Alta**) |
| Sem “Meus jogos” / recuperação por email | Perda de valor pós-compra |
| Botão “Pagar com Stripe (teste)” | Quebra confiança |
| Política de privacidade não cita AdMob, Stripe, retenção de fotos | Risco Play Store / LGPD |
| Stripe in-app no Android vs Google Play Billing | Risco de política Google |
| Marca “Memory” — Ravensburger tem trademark no Brasil | Risco iOS / expansão internacional |
| `User` no Prisma não usado; auth só na web | Modelo de conta fragmentado |
| Mobile sem timer/pontuação vs web com contador | Inconsistência de produto |
| Pipeline EAS por jogo opaco ao usuário | Feature poderosa mas invisível |
| iOS configurado, foco operacional 100% Android | Metade do mercado premium iOS ignorada |

### 7. Monetização atual

| Mecanismo | Status |
|-----------|--------|
| **AdMob banner** | Menu — produção |
| **AdMob interstitial** | Ao completar jogo — produção |
| **Stripe pagamento único** | R$ 19,90 default (`Game.price`) — custom game |
| **Assinatura / IAP nativo** | Não implementado |
| **B2B / white-label** | Capacidade técnica parcial (build por jogo), sem produto comercial |

### Quadro resumo — Etapa 1

| Dimensão | Situação atual | Confiança |
|----------|----------------|-----------|
| Problema / público | Presente personalizado + jogo infantil familiar (BR) | Média |
| Funcionalidades core | Temas grátis + custom 12 fotos + web creator + API | Alta |
| Estágio do produto | Produção inicial (v1.0.0, Play Store pipeline) | Alta |
| Monetização atual | Ads + pay-per-game Stripe (R$ 19,90) | Alta |
| Domínio / nicho inferido | Jogos casuais infantis / presentes personalizados com fotos | Alta |

---

## ETAPA 2 — Pesquisa de mercado

*Mercado-alvo inferido: **Brasil**, B2C familiar; secundário B2B eventos.*

### Cenário do mercado

| Métrica | Estimativa | Metodologia / fonte | Confiança |
|---------|------------|---------------------|-----------|
| **TAM** (jogos casuais online BR) | ~US$ 598 M (2025) → US$ 1,06 bi (2034), CAGR 6,6% | [Deep Market Insights — casual games Brazil](https://deepmarketinsights.com/vista/insights/online-casual-games-market/brazil) | Média |
| **TAM** (mobile games BR, segmento amplo) | US$ 3,67 bi receita jogos até 2028 (16,3% CAGR) | [Mordor Intelligence — South America mobile gaming](https://www.mordorintelligence.com/industry-reports/south-america-mobile-gaming-market) | Média |
| **SAM** (apps infantis / pré-escola BR) | ~US$ 86 M (2025) | [Deep Market Insights — preschool apps Brazil](https://deepmarketinsights.com/vista/insights/preschool-app-market/brazil) | Média |
| **SAM** (presentes digitais personalizados / memory games com fotos) | ~R$ 5–30 M/ano (**hipótese**) | Micro-nicho: concorrentes web BR (Nossas Lembranças, freelancers) + apps globais de photo memory; sem relatório dedicado | Baixa |
| **SOM** (Memory Game, 12–24 meses) | 500–10.000 MAU; 20–400 compras/mês | App indie sem marca estabelecida; depende de ASO e boca-a-boca | Baixa |
| **Penetração** | ~83% dos brasileiros jogam digitalmente; smartphone dominante | [IMARC / Pesquisa Game Brasil via IMARC](https://www.imarcgroup.com/brazil-gaming-market) | Média |

### Tendências 12–24 meses

- **Hiperpersonalização** em presentes digitais (fotos + mensagem + QR) — Nossas Lembranças e Love Puzzle validam demanda
- **Mobile-first** e PIX/checkout local — vantagem para app nativo vs só web
- **Child safety / ads não personalizados** — exigência crescente (COPPA, Google Families)
- **IA generativa em presentes** — risco de commoditização de “montar jogo com fotos”
- **B2B gamificação** (eventos, pharma, SIPAT) — mercado adjacente maior ticket, ciclo de venda longo

### Análise competitiva — 5 diretos

| Concorrente | Funcionalidades principais | Preço | Pontos fortes | Pontos fracos | Gap explorável |
|-------------|---------------------------|-------|---------------|---------------|----------------|
| **Nossas Lembranças** (BR) | Web: upload fotos, mensagens, tema, música, QR/link vitalício | R$ 9,90 / 14,90 / 19,90 | Preço baixo, foco presente BR, edição pós-compra | Só web; sem app nativo; tiers por nº de cartas | App Android + jogar offline nos temas grátis |
| **Love Puzzle** (global) | Web: 4–12 fotos, link/QR, mensagem final, bundle com outros puzzles | US$ 19 (~R$ 95) publicar | UX de presente madura, combo de produtos | Preço alto para BR; sem app store BR | Preço local R$ 19,90 + app nativo |
| **Memory Match – My Memories** (iOS) | Temas + decks custom, 2P, 3 tamanhos de tabuleiro, gift decks | Grátis; IAP US$ 0,99–9,99 | Modelo freemium maduro, múltiplos decks | iOS; não focado em “presente único” | Fluxo “presente” + link compartilhável no BR |
| **Picture This** (iOS) | Fotos + legendas, convites, stats, uso terapêutico/educação | Grátis; Premium US$ 9,99 | Profundidade (stats, captions), posicionamento saúde | Complexo; iOS; não é gift-first | Simplicidade familiar + preço único BR |
| **Awase** (iOS) | Álbum do iPhone → jogo; local-only; shared albums | Grátis + plano pago | Privacidade (on-device), UX emocional | Só iOS/ecossistema Apple | Android + upload web para quem não tem iPhone |

### Substitutos indiretos

| Substituto | Por que competem |
|------------|------------------|
| **Álbum de fotos / WhatsApp** | “Lembrança” sem gamificação — custo zero |
| **Freelancers (VintePila ~R$ 40–200)** | Jogo .exe personalizado sob encomenda |
| **CustomGames / Notiva (B2B)** | Memory games para eventos corporativos — orçamento sob consulta |
| **Jogos de memória genéricos grátis** | Mecânica igual nos temas free; não substituem personalização |

### Comportamento do usuário

**Dores no segmento** (**Confiança: Média** — inferido de reviews de apps similares e copy de concorrentes):

- Quer surpresa emocional sem ser designer ou dev
- Medo de perder o link/jogo após pagar
- Desconfiança de pagamento “teste” ou gateway estranho no celular
- Pais querem conteúdo seguro para crianças (ads, dados de fotos)
- Presenteador quer mensagem final / revelação no fim do jogo

**Reclamações recorrentes em apps de photo memory** (App Store, categorias similares):

- Paywall agressivo em decks custom
- Dificuldade de recuperar decks após troca de aparelho
- Ads intrusivos em apps infantis
- Poucas opções de dificuldade ou replay value baixo

**Features com maior retenção no nicho** (**hipótese**, Confiança Baixa):

- Múltiplos tabuleiros / dificuldades
- Modo 2 jogadores local
- Biblioteca de decks salvos
- Mensagem surpresa ao completar
- Compartilhar link sem instalar app

### Oportunidades

| Oportunidade | Janela |
|--------------|--------|
| **App BR nativo + preço local** vs concorrentes web globais | 12–24 meses |
| **Temas grátis com ads** como aquisição; custom como conversão | Agora |
| **“Presente em 3 passos”** com link/QR compartilhável (como Nossas Lembranças) | P0–P1 |
| **Pacote família** (vários jogos, aniversários) | P1 |
| **White-label B2B** (eventos, escolas) — ticket alto, ciclo longo | P2 |

---

## ETAPA 3 — Funcionalidades recomendadas

### Funcionalidades gratuitas (Free / Base)

#### 1. Biblioteca “Meus jogos”
- **Descrição:** Lista jogos comprados/criados por email ou conta; reabrir sem perder `gameId`
- **Justificativa:** Reclamação #1 pós-compra em produtos similares; Nossas Lembranças oferece link de edição vitalício
- **Complexidade:** Média (auth leve ou magic link por email)
- **Prioridade:** P0
- **Impacto:** Retenção, Suporte à conversão

#### 2. Mensagem surpresa ao vencer
- **Descrição:** Campo opcional de texto/foto exibido no modal de vitória (custom games)
- **Justificativa:** Diferencial emocional dos concorrentes web BR
- **Complexidade:** Baixa
- **Prioridade:** P1
- **Impacto:** Engajamento, Aquisição (boca-a-boca)

#### 3. Compartilhar jogo via link/QR
- **Descrição:** Gerar link web para presenteado jogar sem pagar de novo
- **Justificativa:** Padrão do mercado (Nossas Lembranças, Love Puzzle)
- **Complexidade:** Média (jogo web sem login obrigatório para convidado)
- **Prioridade:** P0
- **Impacto:** Aquisição, Retenção

#### 4. Timer e contador de jogadas (mobile)
- **Descrição:** Paridade com web; recordes locais por tema
- **Justificativa:** Replay value; apps líderes têm metas de tempo/moves
- **Complexidade:** Baixa
- **Prioridade:** P1
- **Impacto:** Engajamento

#### 5. Terceiro tema grátis rotativo
- **Descrição:** Tema sazonal (Natal, festa junina) como aquisição
- **Justificativa:** ASO e retenção sazonal sem custo de custom
- **Complexidade:** Média (assets + CMS simples)
- **Prioridade:** P2
- **Impacto:** Aquisição

#### 6. Haptics e SFX leves
- **Descrição:** `expo-haptics` já instalado; sons de flip/match
- **Justificativa:** Apps concorrentes citam feedback tátil como diferencial
- **Complexidade:** Baixa
- **Prioridade:** P1
- **Impacto:** Engajamento

### Funcionalidades premium (Pago)

#### 1. Jogo personalizado (atual — evoluir)
- **Descrição:** 12 fotos → 24 cartas; manter como produto âncora
- **Proposta de valor:** Presente único pronto em minutos
- **Benchmark:** Nossas Lembranças PRO R$ 19,90; Love Puzzle US$ 19
- **Complexidade:** Já implementada
- **Potencial de receita:** Alto (driver principal)

#### 2. Pacotes de cartas (tier Básico)
- **Descrição:** 6 fotos / 12 cartas por R$ 9,90 — alinhar ao plano Básico da concorrência
- **Proposta de valor:** Entrada de preço menor para testar
- **Benchmark:** Nossas Lembranças R$ 9,90 (6 cartas)
- **Complexidade:** Média (variar grid no game engine)
- **Potencial de receita:** Médio — pode cannibalizar tier PRO

#### 3. Pacote Presente Plus
- **Descrição:** Custom + mensagem por carta + música + tema de cores — R$ 24,90–29,90
- **Proposta de valor:** Paridade com tiers Premium/PRO concorrentes
- **Benchmark:** Nossas Lembranças R$ 14,90–19,90 com extras
- **Complexidade:** Média–Alta
- **Potencial de receita:** Médio

#### 4. Plano Família (assinatura)
- **Descrição:** R$ 14,90/mês — sem anúncios + 3 jogos custom/mês + biblioteca
- **Proposta de valor:** Quem cria vários presentes/ano (aniversários)
- **Benchmark:** Picture This Premium ~US$ 9,99; Memory Match unlimited ~US$ 4,99–9,99
- **Complexidade:** Alta (billing recorrente, Play Billing)
- **Potencial de receita:** Alto a longo prazo; Baixo no curto

#### 5. Remover anúncios (IAP único)
- **Descrição:** R$ 4,90 one-time nos temas grátis
- **Proposta de valor:** Pais que jogam frequentemente com crianças
- **Benchmark:** Apps similares US$ 2,99–5,99 remove ads
- **Complexidade:** Média
- **Potencial de receita:** Baixo–Médio (eCPM child-directed é baixo)

### Funcionalidades de diferenciação

#### 1. “Presente agendado”
- **Descrição:** Pagar hoje, link só desbloqueia na data (aniversário)
- **Mecanismo:** Valor emocional + urgência; poucos concorrentes BR automatizam
- **Viralização:** Média — compartilhamento do link na data
- **Risco:** Suporte (“não recebi”) se email falhar — **Confiança adoção: Média**

#### 2. Modo 2 jogadores local (split screen)
- **Descrição:** Dois jogadores alternam turns no mesmo aparelho
- **Mecanismo:** Memory Match já posiciona isso; aumenta sessão familiar
- **Viralização:** Baixa; retém em contexto família
- **Risco:** UX em telas pequenas — **Confiança adoção: Alta**

#### 3. APK standalone do jogo custom (pipeline EAS existente)
- **Descrição:** Após upload, opção de baixar APK “só do seu jogo” para presentear offline
- **Mecanismo:** Diferencial técnico já parcialmente implementado (`githubBuild.ts`)
- **Viralização:** Baixa; valor percebido alto no presente
- **Risco:** Custo de build EAS + suporte — **Confiança adoção: Média**

### Matriz impacto × esforço

| Funcionalidade | Impacto | Esforço | Prioridade |
|----------------|---------|--------|------------|
| Corrigir auth web pós-compra | Alto | Baixo | P0 |
| Remover copy “Stripe (teste)” | Alto | Baixo | P0 |
| Link/QR compartilhável sem login | Alto | Médio | P0 |
| Biblioteca “Meus jogos” | Alto | Médio | P0 |
| Política privacidade (LGPD + ads) | Alto | Baixo | P0 |
| Mensagem surpresa na vitória | Médio | Baixo | P1 |
| Timer/jogadas no mobile | Médio | Baixo | P1 |
| Tier 6 cartas (R$ 9,90) | Médio | Médio | P1 |
| IAP remover anúncios | Médio | Médio | P1 |
| Modo 2 jogadores | Médio | Médio | P1 |
| Play Billing (substituir Stripe in-app) | Alto | Alto | P1 |
| Plano Família assinatura | Alto | Alto | P2 |
| Presente agendado | Médio | Médio | P2 |
| APK standalone por jogo | Médio | Alto | P2 |
| White-label B2B | Alto | Alto | P2 |

---

## ETAPA 4 — Modelo de monetização

### Modelo recomendado

**Freemium híbrido: ads + pay-per-game + upsells**

| Camada | Mecanismo |
|--------|-----------|
| Free | Temas Heróis/Princesas + AdMob (child-directed) |
| Core pago | Jogo custom R$ 19,90 (one-shot) |
| Upsell | Remover ads R$ 4,90; tier básico R$ 9,90; Plus R$ 24,90 |
| Futuro | Assinatura Família R$ 14,90/mês quando houver retenção comprovada |

**Justificativa:** O mercado BR de presente personalizado precifica por **jogo criado**, não por assinatura (Nossas Lembranças, Love Puzzle). Apps de app store (Memory Match, Picture This) usam IAP/assinatura porque o custom é **ilimitado no dispositivo** — modelo diferente. O Memory Game hoje está no meio: custom na nuvem com pagamento único, o que combina com gift economics.

**Modelos descartados (agora):**

| Modelo | Motivo |
|--------|--------|
| **Só assinatura** | Sem base de usuários recorrentes; CAC alto para presente esporádico |
| **Só ads** | eCPM child-directed BR estimado baixo; não paga custo de upload/storage |
| **Marketplace de temas** | Sem comunidade nem supply side |
| **B2B primeiro** | Ciclo de venda longo; desvia foco do funil B2C já construído |

### Estrutura de planos

| Plano | Preço | Periodicidade | Inclui | Limites |
|-------|-------|---------------|--------|---------|
| **Grátis** | R$ 0 | — | Temas Heróis e Princesas; jogos ilimitados | Com anúncios (banner + interstitial vitória) |
| **Custom Básico** | R$ 9,90 | Pagamento único | 6 fotos (12 cartas), link compartilhável, mensagem final | 1 jogo; sem música/tema custom |
| **Custom PRO** | R$ 19,90 | Pagamento único | 12 fotos (24 cartas), link/QR, mensagem final | 1 jogo — **preço atual** |
| **Custom Plus** | R$ 27,90 | Pagamento único | PRO + mensagem por carta + tema de cores + música | 1 jogo |
| **Sem anúncios** | R$ 4,90 | Pagamento único (IAP) | Temas grátis sem ads | Não inclui custom |
| **Família** | R$ 14,90 | Mensal | Sem ads + 3 custom PRO/mês + biblioteca | **Fase 2** — requer Play Billing |

*Preços sugestão inicial alinhados a Nossas Lembranças (jun/2026).*

### Estratégia de conversão Free → Premium

**Gates de valor (momentos, não paywalls cegos):**

1. **Tap em “Criar jogo personalizado”** — preview blurred das fotos no tabuleiro antes do paywall
2. **Após 3 vitórias no tema grátis** — CTA suave: “E se fossem fotos da família?”
3. **Pós-vitória** — interstitial ad **ou** CTA para custom (A/B test; não ambos agressivos)
4. **Web landing** — “Crie grátis, publique por R$ 19,90” (modelo Love Puzzle)

**Limitar sem bloquear:**

- Temas grátis sempre jogáveis (aquisição + ASO)
- Upload de fotos **antes** do pagamento (reduz fricção; cobrar só para publicar/compartilhar)

**Onboarding pago ideal:**

- Compra → upload imediato → jogar em <5 min → botão “Enviar para [nome]”

**Não colocar atrás de paywall agora:**

- Temas grátis completos
- Jogar custom no mesmo dispositivo após compra (já pago)
- Replay do jogo custom comprado

### Projeção simplificada

**Premissas declaradas** (**hipóteses**, Confiança Baixa–Média):

| Premissa | Valor assumido | Referência |
|----------|----------------|------------|
| Conversão MAU → compra custom/mês | 0,5% / 1,5% / 3% | E-commerce apps 1–3%; presente é compra esporádica — conservador |
| Ticket médio | R$ 19,90 | Preço atual PRO |
| Receita ads por MAU/mês | R$ 0,05 / 0,15 / 0,30 | eCPM child-directed BR baixo; ~2–5 impressões/MAU (**hipótese**) |
| Modelo | Principalmente one-shot; MRR equivalente = compras do mês + ads | |

**MRR equivalente (receita mensal recorrente + compras do mês):**

| Usuários ativos | Conversão | MRR conservador | MRR base | MRR otimista |
|-----------------|-----------|-----------------|----------|--------------|
| 1.000 | 0,5% / 1,5% / 3% | R$ 150 | R$ 448 | R$ 897 |
| 10.000 | 0,5% / 1,5% / 3% | R$ 1.495 | R$ 4.485 | R$ 8.970 |
| 100.000 | 0,5% / 1,5% / 3% | R$ 14.950 | R$ 44.850 | R$ 89.700 |

*Cálculo: (MAU × conversão × R$ 19,90) + (MAU × receita ads/MAU). Ex.: base 10k = 150 × 19,90 + 10.000 × 0,15 ≈ R$ 4.485.*

**Nota:** Com tiers a R$ 9,90 e R$ 27,90, ticket médio pode cair ou subir ±15%; recomputar após 60 dias de dados reais.

---

## ETAPA 5 — Roadmap e próximos passos

### Fase 1 — Quick wins (0–30 dias)

| Item | Métrica de sucesso |
|------|-------------------|
| Remover “Pagar com Stripe (teste)”; copy de confiança | 0 strings de teste em produção |
| Corrigir web: jogo acessível pós-compra sem login forçado | >80% dos compradores web chegam ao jogo em <3 cliques |
| Atualizar política de privacidade (fotos, AdMob, Stripe, retenção) | Compliance review interno OK |
| Link/QR compartilhável para presenteado | ≥30% dos compradores compartilham link (meta inicial) |
| Magic link “Meus jogos” por email | ≥50% dos recompradores encontram jogo anterior |
| Avaliar risco Play Billing; plano de migração se necessário | Documento de decisão escrito |

**Métricas:** retenção D7 nos temas grátis; taxa de conclusão upload pós-pagamento; crash-free sessions >99%.

### Fase 2 — Crescimento (30–90 dias)

| Item | Dependência |
|------|-------------|
| Timer + jogadas no mobile | Nenhuma |
| Mensagem surpresa na vitória | Campo no schema `Game` |
| Tier Básico 6 cartas (R$ 9,90) | Ajuste grid + Stripe price IDs |
| IAP “Remover anúncios” via Play Billing | Conta Google Play products |
| ASO: screenshots com custom + keywords “presente personalizado” | Assets |
| Modo 2 jogadores local | UX mobile |
| Renomear para iOS se expandir (“Memória” / “Pares”) | Checagem marca Ravensburger |

**Métricas:** conversão create→paid; CAC orgânico (instalações Play Store); ARPU blended.

### Fase 3 — Escala (90–180 dias)

| Item | Risco |
|------|-------|
| Plano Família (assinatura) | Complexidade billing |
| Pacote Plus (mensagens por carta, música) | Scope creep |
| APK standalone opcional pós-custom | Custo EAS/build |
| Piloto B2B (1 cliente eventos/educação) | Desvio de foco |
| iOS launch com IAP nativo | 2× superfície de manutenção |
| Temas sazonais + notificações reengajamento | Requer opt-in |

### O que evitar

1. **Feature creep antes do funil** — leaderboard, social, IA de fotos antes de “comprar → jogar → compartilhar” funcionar sem atrito
2. **Paywall nos temas grátis** — mata ASO e uso infantil; ads já monetizam o free
3. **Stripe in-app ignorando política Google** — risco de remoção da Play Store
4. **Assinatura prematura** — sem MAU e recompra, MRR de assinatura é ilusório
5. **Nome “Memory Game” no iOS BR** — trademark Ravensburger ativo no Brasil ([Game Developer, 2012](https://www.gamedeveloper.com/business/-memory-board-game-trademark-threatens-several-ios-games))

### Recomendação final

1. **Tratar o produto como presente digital**, não como jogo casual genérico — o dinheiro está no custom, os temas grátis são aquisição.
2. **Fechar o funil pós-compra em 30 dias** (web auth, biblioteca, link compartilhável, compliance) antes de qualquer feature nova.
3. **Manter R$ 19,90 no PRO**; testar R$ 9,90 só com escopo menor (6 cartas) para não cannibalizar sem dados.
4. **Ads são complemento**, não motor — investir em conversão custom e share loop.
5. **Não escalar iOS ou B2B** até o loop Android B2C mostrar conversão ≥1% em 10k MAU.

---

## Premissas e fontes

### Observado no projeto (fatos)

- Monorepo `memory_game` com app Expo, back Express/Prisma, front Vite
- Preço default R$ 19,90 em `back/prisma/schema.prisma`
- AdMob produção em `app/src/ads/config.ts`
- Versão 1.0.0, `versionCode` 3 em `app/app.json`
- Fluxo web com `PrivateRoute` em `/game/:id` vs create/upload abertos

### Estimativas e hipóteses

| Afirmação | Tipo | Confiança |
|-----------|------|-----------|
| SAM presentes digitais memory BR R$ 5–30 M | Estimativa | Baixa |
| Conversão MAU→compra 0,5–3% | Hipótese | Baixa |
| Receita ads R$ 0,05–0,30/MAU/mês | Hipótese | Baixa |
| SOM 500–10k MAU em 12–24 meses | Hipótese | Baixa |

### Fontes externas

| Fonte | Uso |
|-------|-----|
| [Nossas Lembranças](https://nossaslembrancas.com/) | Preços e features concorrente BR |
| [Love Puzzle — Custom Memory](https://lovepuzzle.com/games/custom-photo-memory-game/) | Benchmark US$ 19 |
| [App Store — Memory Match](https://apps.apple.com/us/app/memory-match-my-memories/id6448664960) | IAP freemium |
| [App Store — Picture This](https://apps.apple.com/us/app/picture-this-matching-game/id1437524324) | Premium US$ 9,99 |
| [Deep Market Insights — Casual Games Brazil](https://deepmarketinsights.com/vista/insights/online-casual-games-market/brazil) | TAM casual BR |
| [Deep Market Insights — Preschool Apps Brazil](https://deepmarketinsights.com/vista/insights/preschool-app-market/brazil) | SAM infantil |
| [Mordor Intelligence — South America Mobile Gaming](https://www.mordorintelligence.com/industry-reports/south-america-mobile-gaming-market) | Crescimento mobile BR |
| [IMARC — Brazil Gaming Market](https://www.imarcgroup.com/brazil-gaming-market) | Penetração jogos BR |
| [Game Developer — Ravensburger Memory trademark](https://www.gamedeveloper.com/business/-memory-board-game-trademark-threatens-several-ios-games) | Risco marca “Memory” no Brasil |
| [Notiva — Game Abbott](https://notiva.com.br/portfolio/game-personalizado-jogo-da-memoria-abbott/) | Referência B2B adjacente |

---

## Resumo executivo (refinado)

1. **Memory Game está em produção inicial** com stack sólida e monetização híbrida (ads + R$ 19,90/custom), mas o funil pós-compra e compliance ainda travam crescimento.
2. **Posicione contra Nossas Lembranças**, não contra Candy Crush — presente personalizado BR a R$ 19,90 com app nativo e temas grátis é a tese.
3. **P0 é produto, não feature:** auth web, “Meus jogos”, link/QR, privacidade, copy de pagamento real.
4. **Monetização:** manter pay-per-game como motor; ads child-directed como complemento; assinatura Família só com dados de recompra.
5. **Evitar iOS com nome “Memory”, B2B prematuro e Stripe in-app sem plano Play Billing** — riscos reais para um indie já na Play Store.
