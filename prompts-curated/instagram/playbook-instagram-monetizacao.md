# Playbook — Instagram → seguidores → ebook → serviço

**Uso:** encadear os prompts já curados numa sequência única de monetização.  
**Quando usar:** conta nova ou travada; meta = audiência + caixa (ebook e/ou serviço).  
**Resultado esperado:** nicho, oferta, calendário, Reels com CTA e produto pronto para vender.

**Caminho padrão:** ebook (ticket baixo / lead) → upsell de serviço.  
**Ramificações:** só ebook ou só serviço — ver [Modos](#modos).

Não inventa produto no meio do funil. Preenche o bloco de contexto **uma vez** e reutiliza em todas as etapas.

---

## Contexto (preencher antes de tudo)

```
[NICHO] =
[PUBLICO] =
[OFERTA_EBOOK] =          # nome + preço alvo (ex.: guia R$27–47)
[OFERTA_SERVICO] =        # o que vende + ticket (ex.: mentoria 1:1 R$497)
[BIO_ATUAL] =             # ou "conta nova"
[ESTILO_CONTEUDO] =       # faceless / com rosto / carrossel+reels
[META_90_DIAS] =          # ex.: 2k seguidores + 30 ebooks + 3 clientes
[PERFIS_CONCORRENTES] =   # 2–3 @ do nicho (opcional, etapa 2B)
[FORCAS] =                # o que você sabe fazer melhor que o feed médio
[OBJETIVO_EBOOK] =        # Capturar leads | Vender | Gerar autoridade
[EXTENSAO_EBOOK] =        # Ex.: 3.000 a 5.000 palavras
```

Regra: na fase de oferta, **uma** CTA primária por semana (ebook **ou** DM de serviço). Duas CTAs competindo = conversão morta.

---

## Ordem de execução

| # | Fase | Prompt fonte | Entrega |
|---|------|--------------|---------|
| 0 | Escolher 1 caminho de dinheiro | Growth Kit #6 + Faceless #6 | Decisão: ebook→serviço / só ebook / só serviço |
| 1 | Nicho + posicionamento | Faceless #1 → Growth Kit #4 | Nicho final + ângulo de marca |
| 2A | Volume de ideias | Faceless #2+#4 → Growth Kit #3 | 20 ideias + hooks + 20 Reels com CTA |
| 2B | (Opcional) Reels dos outros | [reels-virais-pipeline](./reels-virais-pipeline.md) | Framework de hooks do nicho |
| 3 | Calendário 30/90 dias | Faceless #5 → Growth Kit #5 | Calendário com posts de venda intercalados |
| 4 | Produto | eBook comercial + template | Ebook pronto + 3 posts de lançamento |
| 5 | Serviço (upsell) | briefing abaixo | Pacote, preço, script de DM/call |
| 6 | Legendas + bio | Faceless #3 + auditoria | Legendas com CTA + bio/link |
| 7 | Escala / correção | Faceless #7 → Growth Kit #1/#2 | Automação + auditoria mensal |

Arquivos fonte: [crescimento-faceless.md](./crescimento-faceless.md) · [instagram-growth.md](./instagram-growth.md) · [origens/from-screenshots.md](../origens/from-screenshots.md#produto-digital-e-monetização) · [origens/from-salvas.md](../origens/from-salvas.md#criação-de-ebook)

---

## Fase 0 — Matar caminhos de monetização

Cole e force **uma** escolha.

```
Act as a social media business strategist. Analyze my niche [NICHO], audience [PUBLICO], and current content strategy ([ESTILO_CONTEUDO]; bio: [BIO_ATUAL]).

Identify ways to monetize through products, services, affiliates, sponsorships, consulting, memberships, digital products.

Then:
1) Rank by speed-to-first-revenue vs long-term margin.
2) Pick ONE primary path for the next 90 days aligned with goal [META_90_DIAS].
3) Kill the rest (say explicitly what NOT to sell yet).
4) If the path is ebook→service, define how the ebook feeds the service (what problem it opens that only the service closes).

Also answer in Portuguese (BR), dense, no fluff:
Liste 5 maneiras de monetizar uma conta nova do Instagram sobre [NICHO], incluindo afiliados, programas de assinaturas e produtos digitais — but keep the same single winner as above.
```

**Checkpoint:** preenche `[OFERTA_EBOOK]` e/ou `[OFERTA_SERVICO]`. Se o modelo for só um dos dois, zera o outro.

---

## Fase 1 — Nicho e marca

### 1.1 Nicho

```
Liste 10 nichos de produtos digitais com baixa concorrência, alta demanda e potencial de renda passiva.
Depois rodeie os 3 mais próximos de: [NICHO] / minhas forças [FORCAS] / público [PUBLICO].
Escolha 1 nicho final e justifique em 3 bullets. Não sugira pivôs depois desta escolha salvo eu pedir.
```

### 1.2 Posicionamento

```
Act as a personal branding consultant. Analyze my niche [NICHO], strengths [FORCAS], goals [META_90_DIAS], and audience [PUBLICO]. Create a positioning strategy that makes me memorable, trusted, differentiated, and recognizable within my niche.

Entregue também em PT-BR:
- One-liner da conta (bio curta)
- 3 pilares de conteúdo
- O que eu NÃO posto (para não diluir)
- Promessa única ligada a [OFERTA_EBOOK] e [OFERTA_SERVICO]
```

---

## Fase 2A — Conteúdo que puxa follow + CTA

### 2A.1 Ideias faceless / recriáveis

```
Para [NICHO], me dê 20 ideias de reels viral ou carrossel que eu possa recriar no estilo [ESTILO_CONTEUDO].
Cada ideia: gancho (1 linha) + formato + CTA sugerido (seguir / salvar / link na bio para [OFERTA_EBOOK] / DM para [OFERTA_SERVICO]).
Máximo 30% das ideias com CTA de venda; o resto = valor + follow.
```

### 2A.2 Hooks e hashtags

```
Gere 15 hashtags de alto desempenho e 5 textos de gancho de parada de rolagem para minha conta do instagram sobre [NICHO].
```

### 2A.3 Reel Growth Machine (com oferta)

```
Act as a viral Instagram Reel strategist. For the topic [NICHO] aiming at [PUBLICO], generate 20 reel concepts including hook, script structure, retention triggers, curiosity gaps, visuals, and CTA. Optimize every reel for watch time, shares, saves, and follows.

Constraint: 4 of the 20 must soft-sell [OFERTA_EBOOK]; 2 must open a DM conversation toward [OFERTA_SERVICO]. The rest must not pitch — only earn trust and follows.
Respond with scripts usable in PT-BR.
```

---

## Fase 2B — (Opcional) Roubar estrutura, não conteúdo

Só se `[PERFIS_CONCORRENTES]` estiver preenchido.

1. Rode [reels-virais-pipeline.md](./reels-virais-pipeline.md) nos `@` da lista (limiar 40k ou o que fizer sentido no nicho).
2. Na Parte 2 do framework, peça:

```
Adapte o framework de roteiros virais ao meu nicho [NICHO] e às ofertas [OFERTA_EBOOK] / [OFERTA_SERVICO].
Não copie temas dos concorrentes — só estrutura de hook, ritmo e CTA.
```

---

## Fase 3 — Calendário com venda embutida

### 3.1 30 dias (conta nova / ritmo)

```
Construa um calendário de conteúdo de 30 dias para minha conta sobre [NICHO], otimizada para engajamento e crescimento.
Estilo: [ESTILO_CONTEUDO].
Inclua: frequência de Reels vs carrossel, dias de CTA para [OFERTA_EBOOK], 1–2 ganchos de DM para [OFERTA_SERVICO], e posts só de autoridade (sem pitch).
Meta: [META_90_DIAS] (use a fatia realista dos primeiros 30 dias).
```

### 3.2 90 dias (sistema)

```
Act as a senior growth strategist. My niche is [NICHO]. My goal is [META_90_DIAS]. Create a complete 90-day Instagram growth roadmap including content pillars, posting frequency, engagement strategy, profile optimization, growth experiments, content series, and performance metrics.

Add a monetization lane:
- Weeks 1–2: trust only
- Weeks 3–6: push [OFERTA_EBOOK]
- Weeks 7–12: case studies + [OFERTA_SERVICO] without killing reach
Deliver in PT-BR.
```

---

## Fase 4 — Ebook (produto)

### 4.1 Ebook comercial completo

```
Atue como um estrategista digital especializado na criação de eBooks que geram vendas.

Preciso que você desenvolva um eBook completo, pronto para captar leads e faturar.

Incluir:
- Título chamativo e comercial
- Subtítulo que destaque o principal benefício
- Estrutura de capítulos lógica e envolvente
- Texto dos capítulos com exemplos práticos aplicáveis
- Sugestão de capa para designer ou IA
- Chamada para ação no final, levando para minha oferta digital: [OFERTA_SERVICO]
- Tom de escrita: leve, persuasivo e voltado para conversão

Informações base:
- Tema: [OFERTA_EBOOK] / nicho [NICHO]
- Público-alvo: [PUBLICO]
- Objetivo: [OBJETIVO_EBOOK]
- Extensão: [EXTENSAO_EBOOK]
```

### 4.2 Fechamento + 3 posts de divulgação

```
Tema: [OFERTA_EBOOK]
Público-alvo: [PUBLICO]
Objetivo: [OBJETIVO_EBOOK]
Extensão: [EXTENSAO_EBOOK]
Ao final, gere também 3 ideias de posts para redes sociais que ajudem a divulgar esse eBook e maximizar o faturamento.
Cada post: gancho + body + CTA (link na bio).
```

**Checkpoint:** preço, página/link, CTA no bio. Sem link, o calendário é teatro.

---

## Fase 5 — Serviço (upsell)

```
Com base no nicho [NICHO], público [PUBLICO], ebook [OFERTA_EBOOK] e meta [META_90_DIAS], desenhe a oferta de serviço [OFERTA_SERVICO]:

1) Nome comercial + transformação prometida (1 frase)
2) O que está incluso / o que NÃO está
3) Preço e âncora (por que esse ticket)
4) Quem NÃO deve comprar
5) Script de DM (3 mensagens) a partir de comentário ou story reply
6) Script de call de 15 min (diagnóstico → proposta)
7) Como o ebook qualifica o lead (perguntas que o leitor já deveria ter respondido)
8) 5 Reels/carrosséis que vendem o serviço sem parecer anúncio

Seja honesto: se eu ainda não tenho prova/resultado para cobrar esse ticket, diga o ticket mínimo viável e o que precisa rodar antes.
```

---

## Fase 6 — Legendas e perfil

### 6.1 Legenda por post

```
Escreva uma legenda do Instagram em estilo viral com um gancho forte e CTA para este post: [cole sua ideia de conteúdo].
CTA primário desta semana: [ebook link na bio | DM "QUERO" para serviço] — só um.
Nicho: [NICHO]. Público: [PUBLICO].
```

### 6.2 Bio + auditoria rápida

```
Act as an elite Instagram consultant. Analyze my Instagram account: Bio: [BIO_ATUAL] Niche: [NICHO] Audience: [PUBLICO] Content Style: [ESTILO_CONTEUDO]
Identify weaknesses, missed opportunities, profile optimization improvements, content gaps, engagement issues, and growth opportunities. Then create a prioritized action plan.

Reescreva a bio em PT-BR com: promessa + para quem + CTA para [OFERTA_EBOOK] (e menção leve a [OFERTA_SERVICO] só se couber sem poluir).
```

---

## Fase 7 — Escala e correção

### 7.1 Automação (depois do produto existir)

```
Me mostre como postar conteúdos em massa, agendar postagens e automatizar legendas para que minha conta seja executada no piloto automático.
Restrição: não automatizar DMs de venda de [OFERTA_SERVICO] — só conteúdo e legendas. Venda de serviço continua manual.
```

### 7.2 Auditoria mensal

```
Act as a world-class Instagram strategist. My niche is [NICHO], my audience is [PUBLICO], and my goal is [META_90_DIAS]. First conduct a complete growth audit and identify the biggest bottlenecks preventing growth. Then create a complete Instagram growth system covering content, positioning, engagement, profile optimization, growth strategy, and monetization opportunities.

Dados do mês (cole o que tiver): [seguidores, alcance, saves, vendas ebook, calls, clientes].
```

---

## Modos

### A — Padrão (ebook → serviço)

Execute Fases **0 → 1 → 2A → 3 → 4 → 5 → 6 → 7**. Fase 2B opcional.

### B — Só ebook

Pule Fase 5. Em todo CTA, use só `[OFERTA_EBOOK]`. Na Fase 0, mate serviço e afiliados “por enquanto”.

### C — Só serviço

Pule Fase 4. Na Fase 2A/3, CTAs = DM/call. Ebook pode virar PDF grátis de lead depois — não misture no mês 1.

### D — Conta já existente

Comece na Fase 0 + 6.2 (auditoria/bio), depois 3.2 e 2A.3. Não rode Faceless #1 se o nicho já está pago com prova.

---

## Modo “cola tudo” (uma conversa)

Só use se a LLM aguentar contexto longo. Senão, fase a fase.

```
Você é estrategista de Instagram + produtos digitais.
Idioma: PT-BR. Direto. Sem enrolação. Não inflar viabilidade.

Contexto:
[COLE O BLOCO DE CONTEXTO PREENCHIDO]

Modo: A (ebook → serviço)

Execute as Fases 0, 1, 2A, 3, 4 e 5 deste playbook em ordem.
Ao fim de cada fase, dê um checkpoint de 3 bullets (o que ficou decidido) e só então avance.
Na Fase 0, escolha UM caminho e mate o resto.
Não gere o ebook completo na Fase 4 se o nicho/posicionamento da Fase 1 ainda estiver ambíguo — pare e pergunte.
```

---

## Checklist brutal

- [ ] Uma oferta primária por vez no bio
- [ ] Link/checkout do ebook no ar antes de calendário de “lançamento”
- [ ] ≤30% dos Reels com pitch; resto = retenção e follow
- [ ] Serviço só depois de prova (depoimento, resultado próprio, ou ebook vendendo)
- [ ] Meta 90 dias com número de **vendas**, não só seguidores
- [ ] Auditoria mensal (Fase 7.2) — senão você otimiza feeling

---

## Relacionados

| Arquivo | Papel neste playbook |
|---------|----------------------|
| [crescimento-faceless.md](./crescimento-faceless.md) | Blocos 1–7 crus |
| [instagram-growth.md](./instagram-growth.md) | Growth Kit 1–6 |
| [reels-virais-pipeline.md](./reels-virais-pipeline.md) | Fase 2B |
| [produto-digital/README.md](../produto-digital/README.md) | Índice de ebooks |
| [pensamento-critico.md](../comportamento-agente/pensamento-critico.md) | Stress-test da oferta antes da Fase 4 |
