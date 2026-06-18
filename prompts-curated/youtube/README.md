# Prompts YouTube — curados de `tops`

> **Tipo:** Conteúdo e redes sociais · **Índice geral:** [por-tipo.md](./por-tipo.md#conteúdo-e-redes-sociais)

10 prompts extraídos de screenshots em `C:\Users\filip\Desktop\Filipe\tops`. Versões reutilizáveis com placeholders padronizados em [templates/](./templates/).

## Sumário

- [Ordem de uso](#ordem-de-uso)
- [Ideias virais](#1-ideias-virais)
- [Workflow canal sem rosto (5 passos)](#workflow-canal-sem-rosto-5-passos)
- [Títulos clickbait](#títulos-impossíveis-de-ignorar)
- [Roteiro magnético](#roteiro-magneticamente-envolvente)
- [Pacote completo (equipe virtual)](#pacote-completo-equipe-virtual)
- [Fontes](#fontes)
- [Templates](#templates)

---

## Ordem de uso

| Cenário | Caminho |
|---------|---------|
| Um vídeo do zero (canal sem rosto) | Workflow 5 passos → ou [template workflow](./templates/prompt-youtube-workflow-sem-rosto.md) |
| Só títulos + roteiro estilo sarcástico | Títulos → Roteiro magnético |
| Tudo de uma vez (título, thumb, roteiro, SEO) | [Pacote completo](./templates/prompt-youtube-pacote-completo.md) |
| Brainstorm de ideias | Ideias virais |

---

## 1. Ideias virais

**Fonte:** `Screenshot_20260126-203607.png`  
**Template:** [prompt-youtube-ideias-virais.md](./templates/prompt-youtube-ideias-virais.md)

```
Atue como um estrategista de crescimento no YouTube com mais de 15 anos de experiência ajudando criadores a escalar canais no nicho/segmento [NICHO]. Sua missão é criar 20 ideias de vídeos com alto potencial de viralização, combinando gatilhos emocionais, curiosidade e otimização para o algoritmo. As ideias devem ser pensadas para capturar atenção rapidamente e manter alto interesse do público-alvo [PUBLICO_ALVO].
```

---

## Workflow canal sem rosto (5 passos)

**Fonte:** `Screenshot_20260126-221213.png`  
**Template unificado:** [prompt-youtube-workflow-sem-rosto.md](./templates/prompt-youtube-workflow-sem-rosto.md)

Execute em sequência, passando a saída de cada etapa para a próxima.

### Passo 1 — Nichos

```
Liste 5 nichos do YouTube sem rosto, com alta demanda, baixa competição e CPM alto.
```

### Passo 2 — Ideias e títulos

```
Me dê 10 ideias de vídeos virais sobre [NICHO]. Adicione títulos que fazem as pessoas clicarem e ficar.
```

### Passo 3 — Roteiro

```
Escreva um roteiro de 1000 palavras para [TITULO_DO_VIDEO]. Priorize retenção, storytelling e naturalidade do roteiro.
```

### Passo 4 — Narração por IA

```
Adapte esse roteiro para narração por IA. Mantenha a leveza e naturalidade parecida como a de uma narração real.
```

### Passo 5 — Storyboard Canva

```
Quebre cada parágrafo em imagens para Canva — o que deveria aparecer na tela, quando e como.
```

---

## Títulos impossíveis de ignorar

**Fonte:** `Screenshot_20260225-133304.png`  
**Template:** [prompt-youtube-titulos-virais.md](./templates/prompt-youtube-titulos-virais.md)

```
Quero que você atue como um criador de títulos virais para YouTube no nicho de [NICHO], no estilo do canal [CANAL_REFERENCIA].

Siga estas orientações:
- Os títulos devem estar em idioma [IDIOMA].
- Use pelo menos uma palavra em caixa alta para chamar atenção (ex: SEGREDO, NUNCA, CRUEL).
- Inclua expressões superlativas e exageradas: "AS MAIS INCRÍVEIS...", "As MAIS BIZARRAS...", "VOCÊ NUNCA imaginaria...".
- Explore a curiosidade negativa, destacando erros, punições, fracassos, segredos, conspirações etc.
- Mantenha os títulos curtos e de impacto (até 12 palavras).
```

---

## Roteiro magneticamente envolvente

**Fonte:** `Screenshot_20260225-133309.png` (screenshot truncado — template completa o restante)  
**Template:** [prompt-youtube-roteiro-magnetico.md](./templates/prompt-youtube-roteiro-magnetico.md)

Texto original visível no screenshot:

```
Quero que você assuma o papel de roteirista profissional de YouTube, criando roteiros envolventes, dinâmicos e bem estruturados, no mesmo estilo narrativo do canal [CANAL_REFERENCIA].

Diretrizes para o roteiro:
- O roteiro deve ter [QUANTIDADE_PALAVRAS].
- Tema central: [ASSUNTO].

Estrutura narrativa:
- Inicie com uma introdução chamativa e irônica, que quebre a expectativa e desperte curiosidade já nos primeiros segundos.
- Apresente os fatos em ordem lógica, mas sempre trazendo piadas, comparações inusitadas e comentários sarcásticos.
```

---

## Pacote completo (equipe virtual)

**Fonte:** `Screenshot_20260405-191024.png`  
**Template:** [prompt-youtube-pacote-completo.md](./templates/prompt-youtube-pacote-completo.md)

```
You are my full YouTube team: strategist, creative director, scriptwriter, SEO expert, and thumbnail designer.

Task: Build a complete YouTube content package on: [TOPICO]

Deliver:
1. 5 viral, curiosity-driven titles
2. MrBeast-style thumbnail concept (strong visual tension)
3. Full script (hook -> conflict -> resolution -> CTA)
4. Optimized description (SEO keywords, value, CTAs)
5. Hashtags + keyword tags

Tone/Format: Match pacing, tone, and style to: [FORMATO_REFERENCIA]

Guidance: Think like a YouTube growth strategist. Optimize for retention, engagement, and shareability. Hook must be irresistible, structure tight, and every element built for virality.
```

---

## Fontes

| Prompt | Arquivo |
|--------|---------|
| Ideias virais | `Screenshot_20260126-203607.png` |
| Workflow 5 passos | `Screenshot_20260126-221213.png` |
| Títulos clickbait | `Screenshot_20260225-133304.png` |
| Roteiro magnético | `Screenshot_20260225-133309.png` |
| Pacote completo | `Screenshot_20260405-191024.png` |

Pasta: `C:\Users\filip\Desktop\Filipe\tops`

---

## Templates

| Template | Uso |
|----------|-----|
| [prompt-youtube-pacote-completo.md](./templates/prompt-youtube-pacote-completo.md) | Um vídeo completo (título, thumb, roteiro, SEO) |
| [prompt-youtube-workflow-sem-rosto.md](./templates/prompt-youtube-workflow-sem-rosto.md) | Pipeline inteiro canal sem rosto |
| [prompt-youtube-ideias-virais.md](./templates/prompt-youtube-ideias-virais.md) | Brainstorm de 20 ideias |
| [prompt-youtube-titulos-virais.md](./templates/prompt-youtube-titulos-virais.md) | Títulos estilo clickbait |
| [prompt-youtube-roteiro-magnetico.md](./templates/prompt-youtube-roteiro-magnetico.md) | Roteiro sarcástico/irônico |
