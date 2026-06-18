# YouTube — Workflow canal sem rosto (5 etapas)

**Uso:** pipeline completo de ideia a storyboard para canal faceless (narração + imagens/Canva).  
**Quando usar:** produção semanal de vídeos sem aparecer na câmera.  
**Resultado esperado:** nicho validado → ideia + título → roteiro → script para TTS → storyboard por cena.

## Contexto (opcional)

- Nicho preferido: `[NICHO]` (se já souber; senão o agente sugere no passo 1)
- Idioma: `[IDIOMA]` (default: português BR)
- Duração alvo do vídeo: `[DURACAO_MINUTOS]` (default: 8–12 min)

## Modo A — executar tudo de uma vez

Cole o prompt abaixo e diga: *"Execute as 5 etapas em sequência. Pare após cada etapa só se eu pedir."*

```
Você é um produtor de canal YouTube sem rosto (faceless), focado em alto RPM e retenção.

Execute este pipeline em sequência, usando a saída de cada etapa como entrada da próxima.

---

ETAPA 1 — Nichos
Liste 5 nichos do YouTube sem rosto com alta demanda, baixa competição e CPM alto.
Para cada um: público-alvo, exemplo de canal de referência, risco regulatório (baixo/médio/alto), potencial de evergreen.

ETAPA 2 — Ideias e títulos
Com base no nicho [NICHO] (ou no melhor da Etapa 1 se eu não indicar), gere 10 ideias de vídeos virais.
Para cada ideia: título clickável (até 12 palavras), gancho em 1 frase, ângulo único.

ETAPA 3 — Roteiro
Escreva um roteiro de [QUANTIDADE_PALAVRAS] palavras para o título: [TITULO_DO_VIDEO].
Priorize retenção, storytelling e naturalidade. Marque [PAUSA] e [ÊNFASE] onde ajudar na narração.

ETAPA 4 — Narração por IA
Adapte o roteiro da Etapa 3 para narração por IA (ElevenLabs, etc.).
Mantenha leveza e naturalidade de locução real. Frases curtas. Evite tom robótico.

ETAPA 5 — Storyboard Canva
Quebre o roteiro em cenas. Para cada parágrafo ou bloco de ~15–30s, indique:
- O que aparece na tela (imagem/vídeo stock sugerido)
- Texto on-screen (se houver)
- Transição (corte, zoom, ken burns)
- Timing aproximado (mm:ss)
```

## Modo B — etapas isoladas

Use os prompts individuais em [youtube.md](../youtube.md) ou cole só a etapa desejada do bloco acima.

## Variações

**Nicho já definido — pular etapa 1:**

```
Pule a Etapa 1. Nicho fixo: [NICHO]. Execute Etapas 2 a 5.
```

**Vídeo longo (2h+ sleep content):**

```
Na Etapa 3, roteiro de [QUANTIDADE_PALAVRAS] palavras com tom calmo e repetitivo, ideal para dormir.
Etapa 5: cenas lentas, pouca mudança visual, loop suave.
```

## Checklist

- [ ] Etapa 3 precisa de `[TITULO_DO_VIDEO]` — escolha um da Etapa 2 antes de continuar
- [ ] Para TTS, revisar Etapa 4 ouvindo uma amostra antes de gerar áudio completo
- [ ] Etapa 5: exportar como checklist para montagem no Canva/CapCut
