# Auditoria de segurança — estilo hacker

**Uso:** simular ataque ao seu site/app e mapear vulnerabilidades antes de um pentest real.  
**Quando usar:** antes de lançar, após mudanças em auth/API, ou periodicamente em produção.  
**Resultado esperado:** relatório passo a passo com vetor de ataque, impacto e se está protegido ou não.

**Fonte:** story @odanilogato — `Screenshot_20260103-213241.png`

## Contexto (obrigatório)

- URL ou descrição do alvo: `[URL]`
- Stack: `[STACK]` (ex.: React + Firebase, Next.js + Postgres)
- Autenticação: `[AUTH]` (ex.: JWT, Firebase Auth, sessão)
- Dados sensíveis: `[DADOS_SENSIVEIS]` (ex.: PII, pagamentos)

## Texto do prompt

```
Aja como um hacker ético (pentester) e analise o alvo abaixo.

Alvo: [URL]
Stack: [STACK]
Autenticação: [AUTH]
Dados sensíveis em jogo: [DADOS_SENSIVEIS]

Para cada vetor abaixo, descreva:
1. O que você tentaria fazer (passo a passo)
2. Impacto se der certo (baixo/médio/alto/crítico)
3. Se o sistema parece PROTEGIDO ou VULNERÁVEL — e por quê
4. Como corrigir (ação concreta)

Vetores obrigatórios:
- Injection (SQL, NoSQL, command)
- XSS e CSRF
- Broken authentication / session hijacking
- IDOR e escalação de privilégio
- Exposição de API keys, .env, endpoints admin
- Rate limiting e brute force
- Headers de segurança e HTTPS
- Dependências desatualizadas (se stack conhecida)
- DoS lógico (operações caras sem limite)

Regras:
- Baseie-se no que eu fornecer (código, configs, headers). Não invente vulnerabilidades sem evidência.
- Se faltar informação, liste o que precisa ver para concluir.
- Priorize por severidade × probabilidade.

Ao final: resumo executivo + top 5 correções imediatas.
```

## Variações

**Só API/mobile:**

```
Mesmo prompt, foco em API REST/GraphQL e app mobile. Ignore vetores de front estático.
```

**Após correções — revalidar:**

```
Reexecute a auditoria nos itens que estavam VULNERÁVEL na análise anterior. Confirme se corrigido.
[Cole o relatório anterior ou liste as correções feitas]
```

## Checklist

- [ ] Anexar trechos de `firebase.json`, regras Firestore, rotas API, middleware de auth
- [ ] Não colar secrets reais — redigir tokens
- [ ] Após corrigir, pedir relatório final limpo
