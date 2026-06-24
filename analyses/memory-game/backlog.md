# Memory Game — Backlog (Etapa 5)

Issues derivadas da [análise de produto](./product-analysis.md). Formato: título, prioridade, critério de aceite.

---

## P0 — 0–30 dias

### Remover copy de teste no fluxo de pagamento
**Prioridade:** P0  
**Descrição:** Substituir “Pagar com Stripe (teste)” por copy de produção (“Criar jogo personalizado — R$ 19,90”).  
**Critério de aceite:** Nenhuma string com “teste” ou “Stripe” visível ao usuário final no app; pagamento mostra preço e benefícios claros.

### Corrigir acesso ao jogo web pós-compra sem login obrigatório
**Prioridade:** P0  
**Descrição:** Comprador que pagou e fez upload deve jogar em `/game/:id` sem criar conta. Login opcional para biblioteca.  
**Critério de aceite:** Fluxo create → success → upload → game completo sem tela de login; convidado com link também joga.

### Política de privacidade completa (LGPD)
**Prioridade:** P0  
**Descrição:** Documentar coleta de fotos, email, AdMob, Stripe, retenção, direitos do titular, contato DPO/responsável.  
**Critério de aceite:** `/politica-de-privacidade` menciona AdMob (child-directed), Stripe, Supabase Storage e prazo de retenção de imagens.

### Link/QR compartilhável para presenteado
**Prioridade:** P0  
**Descrição:** Após criar jogo custom, gerar link público (token ou slug) para presenteado jogar no browser ou deep link no app.  
**Critério de aceite:** Comprador copia link ou baixa QR; presenteado abre e joga 24 cartas sem pagar.

### Biblioteca “Meus jogos” via magic link
**Prioridade:** P0  
**Descrição:** Usuário informa email; recebe link com lista de jogos comprados/criados.  
**Critério de aceite:** Email com ≥1 jogo retorna lista; tap reabre upload ou jogo conforme estado.

### Documento de decisão: Stripe vs Play Billing no Android
**Prioridade:** P0  
**Descrição:** Avaliar política Google para digital goods in-app; definir migração ou isenção aplicável.  
**Critério de aceite:** Markdown em `docs/` com decisão, prazo e alternativa (Play Billing / produto físico-equivalente / web-only purchase).

---

## P1 — 30–90 dias

### Timer e contador de jogadas no app mobile
**Prioridade:** P1  
**Critério de aceite:** Game mobile exibe tempo e número de jogadas; paridade mínima com web.

### Mensagem surpresa no modal de vitória (custom)
**Prioridade:** P1  
**Critério de aceite:** Campo opcional no create; exibido ao completar todas as pairs em jogo custom.

### Tier Custom Básico — 6 fotos / R$ 9,90
**Prioridade:** P1  
**Critério de aceite:** Novo Stripe Price ID; grid 3×4; checkout e upload validam 6 imagens.

### IAP Remover anúncios (Play Billing)
**Prioridade:** P1  
**Critério de aceite:** Produto consumível/não-consumível na Play Console; temas grátis sem banner/interstitial após compra.

### Modo 2 jogadores local
**Prioridade:** P1  
**Critério de aceite:** Dois jogadores alternam; placar de pairs por jogador; funciona em tema grátis.

### ASO — assets Play Store com foco em presente personalizado
**Prioridade:** P1  
**Critério de aceite:** Screenshots atualizados; short description contém “presente” e “fotos”; keywords revisadas.

---

## P2 — 90–180 dias

### Pacote Custom Plus (mensagem por carta + música)
**Prioridade:** P2  
**Critério de aceite:** Checkout tier Plus; upload aceita mensagens por carta; música opcional no jogo.

### Plano Família — assinatura mensal
**Prioridade:** P2  
**Critério de aceite:** Play Billing subscription; 3 custom PRO/mês; sem ads; cancelamento funcional.

### APK standalone opcional pós-custom
**Prioridade:** P2  
**Critério de aceite:** UI mostra link de download quando `build_id` disponível; README de suporte.

### Tema sazonal rotativo
**Prioridade:** P2  
**Critério de aceite:** Terceiro tema disponível por período limitado; removível sem deploy de app (OTA ou remote config).

### Piloto B2B — landing e orçamento
**Prioridade:** P2  
**Critério de aceite:** Página `/empresas` ou PDF comercial; 1 lead qualificado contactado.
