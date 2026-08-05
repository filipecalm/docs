# Instagram — Pipeline Reels virais (coleta → transcrição → framework)

**Uso:** extrair padrões de Reels que já viralizaram e montar um framework reutilizável de roteiros.  
**Quando usar:** pesquisa competitiva em perfis do Instagram; engenharia reversa de scripts com +40k views.  
**Resultado esperado:** lista de links → arquivo único de transcrições → diagnóstico + framework de roteiros virais.

**Fonte:** WhatsApp · 28/07/2026  
**Status:** Etapas 1 e 2 completas. Etapa 3 — Parte 2 (framework) **truncada** no original (“os limites de…”).

Ordem fixa: **1 → 2 → 3**. A saída de cada etapa alimenta a próxima.

---

## Contexto (preencher antes)

- Perfis: `[@perfil1, @perfil2, …]`
- Limiar de views: `40000` (default)
- Idioma das transcrições: português BR / conforme o áudio

---

## Ordem de uso

| Etapa | Entrega | Arquivo / artefato |
|-------|---------|-------------------|
| 1 | Lista de links (só Reels > limiar) | `links-reels.md` |
| 2 | Transcrições palavra a palavra | `transcricoes-reels.md` |
| 3 | Diagnóstico + framework | `framework-roteiros-virais.md` |

---

## Modo A — pipeline completo

```
Execute o pipeline de Reels virais em 3 etapas, nesta ordem.
Perfis: [COLOQUE AQUI OS @ DOS PERFIS]
Limiar: 40.000 views.

Etapa 1: coletar links (só Reels confirmados acima do limiar).
Etapa 2: baixar → extrair áudio → transcrever (teste 1 Reel antes de processar todos).
Etapa 3: diagnóstico de padrões + framework reutilizável.

Pare após cada etapa e aguarde meu OK antes de avançar, a menos que eu diga para seguir direto.
```

---

## Modo B — etapas isoladas

### Etapa 1 — Coletar Reels acima do limiar

```
Quero que voce entre no Instagram e busque pelos perfis que eu
indicar.

Perfis: [COLOQUE AQUI OS @ DOS PERFIS]

Em cada perfil, va na aba de Reels e selecione todos os videos que
passaram de 40.000 visualizacoes. Monte uma lista unica com todos
os links, um embaixo do outro.

Regras: inclua apenas Reels acima de 40.000 views. Nao invente; se
nao conseguir confirmar as visualizacoes de um Reel, deixe ele de
fora. Entregue so a lista de links, pronta pro proximo passo.
```

**Entrega:** só links, um por linha. Sem inventar views.

**Variação (EN):**

```
I want you to go to Instagram and search for the profiles I indicate.

Profiles: [INSERT PROFILE TAGS HERE]

On each profile, go to the Reels tab and select all the videos that
have exceeded 40,000 views.
```

---

### Etapa 2 — Transcrever roteiros (yt-dlp + ffmpeg + whisper)

Depende da lista da Etapa 1.

```
Agora quero que voce assista cada um dos videos da lista e faca a
transcricao do roteiro de cada um. Crie um arquivo unico com todas
as transcricoes.

O caminho real e: baixar cada Reel, extrair o audio e rodar a
transcricao (speech-to-text). As ferramentas essenciais:
- yt-dlp: baixa cada Reel a partir do link
- ffmpeg: extrai o audio do video baixado
- whisper: transcreve o audio, roda local, funciona offline e sem
  custo de API

Antes de processar tudo, teste a pipeline completa com 1 Reel so
(baixar, extrair o audio e transcrever) para validar. Se o primeiro
sair certo, repita para todos.

Transcreva a narracao falada palavra por palavra, exatamente como e
dita. Nao resuma, nao corrija a linguagem e nao adicione nada.
Preserve o jeito oral e informal da fala.
```

**Entrega:** um único arquivo com todas as transcrições (verbatim).

**Checklist técnico**

- [ ] `yt-dlp` instalado e autenticado se o Instagram exigir login/cookies
- [ ] `ffmpeg` no PATH
- [ ] Whisper local (modelo escolhido: tiny/base/small/…)
- [ ] Smoke test com **1** Reel antes do lote

**Variação (EN, resumida):**

```
Now I want you to watch each of the videos on the list and transcribe
the script for each one. Create a single file with all the transcriptions.

The actual way is: download each Reel, extract the audio.
```

---

### Etapa 3 — Diagnóstico + framework de roteiros virais

Depende do arquivo de transcrições da Etapa 2.

```
Agora analise em profundidade todos os roteiros transcritos e
construa um framework de roteiros virais a partir deles.

PARTE 1 - DIAGNOSTICO. Compare todos os roteiros e me mostre os
padroes que se repetem entre os que mais viralizaram:
- Tipos de hook usados na abertura, e quais deram mais views
- A estrutura do roteiro do inicio ao fim (as partes, na ordem)
- Tamanho medio: numero de palavras e de caracteres
- Temas e angulos mais recorrentes
- Estilo de escrita e de fala: pessoa, tom e tipo de frase
- Formato e frequencia dos CTAs: o que pedem e como pedem
- Palavras, frases e formulas que mais se repetem

PARTE 2 - FRAMEWORK. Com base no diagnostico, monte um framework
claro e reutilizavel: a estrutura bloco a bloco, o que cada bloco
precisa ter, os limites de [TEXTO ORIGINAL TRUNCADO — completar]
```

**Entrega:** Parte 1 (diagnóstico) + Parte 2 (framework). Completar o restante da Parte 2 quando o texto integral estiver disponível.

**Variação (EN, só Parte 1):**

```
Now analyze in depth all the transcribed scripts and build a
framework of viral scripts from them.

PART 1 - DIAGNOSIS. Compare all the scripts and show me the
patterns that emerge.
```

---

## Variações

**Limiar diferente:**

```
Na Etapa 1, use limiar de [N] visualizacoes em vez de 40.000.
```

**Só diagnóstico (já tenho transcrições):**

```
Pule Etapas 1 e 2. Use estas transcricoes:

[COLE OU APONTE O ARQUIVO]

Execute so a Etapa 3.
```

**Só lista de links (pesquisa):**

```
Execute apenas a Etapa 1 para os perfis: [LISTA DE @].
```

---

## Relacionados

| Prompt | Quando usar |
|--------|-------------|
| [crescimento-faceless.md](./crescimento-faceless.md) | Ideias e calendário sem engenharia reversa |
| [instagram-growth.md](./instagram-growth.md) — Reel Growth Machine | Gerar 20 conceitos a partir de um tópico |
| [roteiro-magnetico.md](../youtube/roteiro-magnetico.md) | Roteiro YouTube (não Reels) |

## Pendência

Recuperar o final da **Parte 2 — Framework** (a partir de “os limites de…”) e remover o marcador de truncamento.
