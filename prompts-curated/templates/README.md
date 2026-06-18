# Templates reutilizáveis

Versões dos prompts curados com **placeholders padronizados**, regras de execução e variações — no mesmo espírito de [prompts-generic/](../../prompts-generic/).

Catálogo bruto: [from-tops.md](../from-tops.md) · [from-screenshots.md](../from-screenshots.md) · YouTube: [youtube.md](../youtube.md)

## Placeholders

| Placeholder | Exemplo | Se omitido |
|-------------|---------|------------|
| `[NICHO]` | finanças pessoais, true crime | Perguntar ou inferir do contexto |
| `[PUBLICO_ALVO]` | homens 25–40, iniciantes em investimentos | Perguntar |
| `[IDIOMA]` | português (BR) | Assumir português BR |
| `[CANAL_REFERENCIA]` | MrBeast, Canal X | Perguntar estilo desejado |
| `[TOPICO]` / `[ASSUNTO]` | Como o Banco Central controla a inflação | Obrigatório |
| `[TITULO_DO_VIDEO]` | O SEGREDO que os bancos não contam | Obrigatório no passo 3+ |
| `[FORMATO_REFERENCIA]` | documentário 15 min, listicle rápido | Perguntar |
| `[QUANTIDADE_PALAVRAS]` | 1000 | Default 800–1200 |
| `[URL]` / `[STACK]` | Auditoria de segurança | Obrigatório |
| `[TEMA]` | CDB vs poupança | Obrigatório (CESGRANRIO) |

## Índice

### YouTube

| # | Arquivo | Uso |
|---|---------|-----|
| 1 | [prompt-youtube-pacote-completo.md](./prompt-youtube-pacote-completo.md) | Pacote completo: título, thumb, roteiro, SEO |
| 2 | [prompt-youtube-workflow-sem-rosto.md](./prompt-youtube-workflow-sem-rosto.md) | Pipeline 5 etapas (nicho → Canva) |
| 3 | [prompt-youtube-ideias-virais.md](./prompt-youtube-ideias-virais.md) | 20 ideias com gatilhos de viralização |
| 4 | [prompt-youtube-titulos-virais.md](./prompt-youtube-titulos-virais.md) | Títulos clickbait por nicho |
| 5 | [prompt-youtube-roteiro-magnetico.md](./prompt-youtube-roteiro-magnetico.md) | Roteiro irônico/sarcástico |

### Outros (de `tops`)

| # | Arquivo | Uso |
|---|---------|-----|
| 6 | [prompt-auditoria-seguranca.md](./prompt-auditoria-seguranca.md) | Pentest lógico do seu site/app |
| 7 | [prompt-cesgranrio-bb.md](./prompt-cesgranrio-bb.md) | Questões CESGRANRIO Banco do Brasil |
| 8 | [prompt-melhoria-imagem.md](./prompt-melhoria-imagem.md) | Upscale fotorrealista sem alterar identidade |
| 9 | [prompt-financas-pessoais.md](./prompt-financas-pessoais.md) | Orçamento e corte de gastos |
| 10 | [prompt-aprendizado-produtividade.md](./prompt-aprendizado-produtividade.md) | 6 prompts de estudo e hábitos |

### De `Screenshots`

| # | Arquivo | Uso |
|---|---------|-----|
| 11 | [prompt-instagram-crescimento.md](./prompt-instagram-crescimento.md) | 7 prompts Instagram faceless |
| 12 | [prompt-co-fundador-tecnico.md](./prompt-co-fundador-tecnico.md) | Vibe coding com fases |
| 13 | [prompt-pensamento-critico.md](./prompt-pensamento-critico.md) | Sparring partner para ideias |

## Ordem sugerida (YouTube)

1. **Ideias virais** ou **Workflow passo 1** — escolher direção
2. **Títulos virais** — refinar o gancho
3. **Roteiro magnético** ou **Pacote completo** — produção
4. **Workflow passos 4–5** — narração IA + storyboard (se canal sem rosto)
