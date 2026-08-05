# Brief de arte — cartas do jogo da memória

Documento de referência para produção das **24 cartas ilustradas** (12 Heróis + 12 Princesas) do app Memória Presente.

Use este arquivo ao briefar designers ou IAs de geração de imagem. Os **nomes dos temas no app são fixos**: **Heróis** e **Princesas** — não renomear.

---

## Especificações técnicas

| Item | Valor |
|------|--------|
| Formato | PNG (preferencial) ou SVG |
| Proporção | **3:4** (retrato) — ex.: 300×400 px ou 600×800 px |
| Enquadramento | Personagem centralizado; peito/cintura para cima ou corpo inteiro se couber |
| Fundo | Cor sólida ou gradiente suave por carta (paleta indicada em cada carta) |
| Bordas | Cantos arredondados (~8 px na referência 100×120) |
| Estilo | Fantasia medieval **realista estilizado** — proporções humanas, armaduras/roupas com volume e sombreamento |
| Evitar | Chibi, cartoon infantil genérico, personagens licenciados (Marvel, Disney, Senhor dos Anéis, etc.) |
| Público | Familiar — violência leve, sem gore |
| Idioma dos nomes | Português (Brasil) |
| Regra crítica | **Cada carta deve ser visualmente única** — silhueta, pose, equipamento e paleta distintos |

### Onde colocar os arquivos

```
app/assets/cards/game/heroes/01-guerreiro-escudo.png … 12-archimago.png
app/assets/cards/game/princesses/01-princesa-guerreira.png … 12-princesa-oraculo.png
```

### Distribuição por tema

Cada tema tem **12 cartas** = **3 guerreiros + 3 elfos + 3 arqueiros + 3 magos**.

---

## Tema Heróis (personagens masculinos)

### 01 — Guerreiro do Escudo

- **Classe:** Guerreiro
- **Arquivo:** `01-guerreiro-escudo.png`
- **Fundo:** `#2C1810`
- **Visual:** Homem adulto, pele média, cabelo castanho escuro. Armadura de placas cinza-aço com detalhes dourados. Escudo grande retangular à esquerda (madeira + metal, emblema dourado). Espada curta na mão direita. Capacete aberto mostrando rosto determinado. Capa vermelha escura nas costas.

### 02 — Cavaleiro Pesado

- **Classe:** Guerreiro
- **Arquivo:** `02-cavaleiro-pesado.png`
- **Fundo:** `#1A1A2E`
- **Visual:** Homem robusto, armadura completa prateada/cinza-azulado, ombreiras largas. Elmo com visor levantado. Espada longa apoiada no ombro ou na vertical. Escudo redondo no braço esquerdo com estrela dourada. Postura imponente.

### 03 — Bárbaro

- **Classe:** Guerreiro
- **Arquivo:** `03-barbaro.png`
- **Fundo:** `#3E2723`
- **Visual:** Homem musculoso, pele morena, cabelo e barba ruivos/desgrenhados. Sem armadura pesada — peitoral de couro e peles nos ombros. Machado de batalha na mão direita. Pintura de guerra ou cicatriz leve. Expressão feroz.

### 04 — Elfo Guerreiro

- **Classe:** Elfo
- **Arquivo:** `04-elfo-guerreiro.png`
- **Fundo:** `#0D2818`
- **Visual:** Elfo jovem, pele clara, cabelo loiro-dourado, **orelhas pontiagas longas**. Armadura leve verde-floresta com detalhes prateados. Espada curva élfica. Postura ágil, corpo esguio. Floresta escura sugerida no ambiente.

### 05 — Elfo Ancião

- **Classe:** Elfo
- **Arquivo:** `05-elfo-anciao.png`
- **Fundo:** `#1B4332`
- **Visual:** Elfo idoso, cabelo branco-prateado longo, barba fina, orelhas pontiagas. Túnica verde escura com bordados dourados. Cajado de madeira com orbe verde brilhante. Expressão sábia e serena.

### 06 — Elfo das Sombras

- **Classe:** Elfo
- **Arquivo:** `06-elfo-sombras.png`
- **Fundo:** `#0F0F1A`
- **Visual:** Elfo magro, pele pálida, cabelo cinza-escuro, orelhas pontiagas. Capuz escuro, armadura de couro preta/cinza. Adaga ou espada curta. Arco curto nas costas. Atmosfera misteriosa, rosto parcialmente na sombra.

### 07 — Arqueiro do Bosque

- **Classe:** Arqueiro
- **Arquivo:** `07-arqueiro-bosque.png`
- **Fundo:** `#1A2E1A`
- **Visual:** Homem, armadura de couro marrom, capa verde escura. Arco longo empunhado com flecha encaixada (pose de mirar). Aljava com penas coloridas no ombro. Expressão concentrada.

### 08 — Besta de Precisão

- **Classe:** Arqueiro
- **Arquivo:** `08-besta-precisao.png`
- **Fundo:** `#263238`
- **Visual:** Homem, armadura leve cinza-aço. **Besta (crossbow)** apontada para frente, virote visível. Equipamento técnico/militar. Postura de mira precisa.

### 09 — Ranger do Norte

- **Classe:** Arqueiro
- **Arquivo:** `09-ranger-norte.png`
- **Fundo:** `#1C2833`
- **Visual:** Homem, capa com capuz cinza-escuro. Arco nas costas, facas no cinto. Roupa de viagem robusta (couro + lã). Clima frio — cachecol ou peles. Olhar vigilante.

### 10 — Mago Piromante

- **Classe:** Mago
- **Arquivo:** `10-mago-piromante.png`
- **Fundo:** `#2C0A0A`
- **Visual:** Homem, túnica roxa escura com detalhes vermelhos. Cajado com gema de fogo laranja. Chamas na mão livre ou ao redor do cajado. Cabelo escuro. Aura quente alaranjada.

### 11 — Mago Gélido

- **Classe:** Mago
- **Arquivo:** `11-mago-gelido.png`
- **Fundo:** `#0A1628`
- **Visual:** Homem, túnica azul profundo com bordas brancas/prateadas. Cajado com cristal de gelo. Cristais de gelo flutuando ou geada no ombro/barba clara. Brilho azul-claro.

### 12 — Archimago

- **Classe:** Mago
- **Arquivo:** `12-archimago.png`
- **Fundo:** `#1A0A2E`
- **Visual:** Homem mais velho, barba roxa escura, túnica roxa real com bordados dourados. Chapéu de mago alto ou capuz ornamentado. Cajado com gema dourada. Círculo arcano ou runas flutuando. Livro mágico aberto na mão ou ao lado. Aparência de mestre supremo.

---

## Tema Princesas (personagens femininos)

Mesmas quatro classes que Heróis, com **designs totalmente distintos** — não reutilizar silhueta masculina com cores diferentes.

### 01 — Princesa Guerreira

- **Classe:** Guerreira
- **Arquivo:** `01-princesa-guerreira.png`
- **Fundo:** `#2C1810`
- **Visual:** Mulher adulta, pele clara, cabelo castanho, coroa dourada pequena. Armadura de placas cinza com detalhes dourados (adaptada, sem sexualização). Espada longa na mão direita. Escudo menor com emblema real. Postura regia e forte.

### 02 — Princesa Valquíria

- **Classe:** Guerreira
- **Arquivo:** `02-princesa-valquiria.png`
- **Fundo:** `#1A1A2E`
- **Visual:** Guerreira nórdica/fantasia. Cabelo loiro-dourado, **asas** prateadas/cinza nas costas (estilizadas). Armadura prateada-azul, lança longa, escudo redondo. Expressão nobre e belicosa.

### 03 — Princesa Gladiadora

- **Classe:** Guerreira
- **Arquivo:** `03-princesa-gladiadora.png`
- **Fundo:** `#3E2723`
- **Visual:** Mulher atlética, pele morena, cabelo ruivo preso. Armadura de couro + ombreiras de metal. Tridente ou lança curta e escudo oval. Cicatriz leve. Postura de combate; poeira de arena sugerida.

### 04 — Princesa Elfa

- **Classe:** Elfa
- **Arquivo:** `04-princesa-elfa.png`
- **Fundo:** `#1B3A1B`
- **Visual:** Elfa jovem, pele clara, cabelo loiro-dourado, orelhas pontiagas, tiara dourada delicada. Vestes verde esmeralda com bordados. Arco élfico elegante na mão. Luz dourada suave (aurora).

### 05 — Princesa Elfa Noturna

- **Classe:** Elfa
- **Arquivo:** `05-princesa-elfa-noturna.png`
- **Fundo:** `#0F0F1A`
- **Visual:** Elfa, pele pálida, cabelo prateado-branco, orelhas pontiagas. Vestido azul-noite com estrelas bordadas. Estrela cadente no cabelo ou tiara. Atmosfera lunar.

### 06 — Princesa Druida

- **Classe:** Elfa
- **Arquivo:** `06-princesa-druida.png`
- **Fundo:** `#1B4332`
- **Visual:** Elfa, cabelo castanho, orelhas pontiagas, grinalda com galhos ou pequenos chifres de veado estilizados. Túnica verde musgo. Cajado de madeira viva com folhas. Borboletas ou vagalumes discretos.

### 07 — Princesa Arqueira

- **Classe:** Arqueira
- **Arquivo:** `07-princesa-arqueira.png`
- **Fundo:** `#0D2818`
- **Visual:** Mulher esguia, cabelo dourado (elfa ou humana). Armadura de couro verde. Arco longo em posição de tiro, flecha visível. Aljava ornamentada. Tiara ou trança. Pose graciosa.

### 08 — Princesa Caçadora

- **Classe:** Arqueira
- **Arquivo:** `08-princesa-cacadora.png`
- **Fundo:** `#1C2833`
- **Visual:** Mulher com capuz cinza-verde. Arco curto, vestes de caçadora, botas altas. Pele de animal no ombro. Faca no cinto. Floresta densa, tom mais sombrio que a arqueira élfica.

### 09 — Princesa Atiradora

- **Classe:** Arqueira
- **Arquivo:** `09-princesa-atiradora.png`
- **Fundo:** `#263238`
- **Visual:** Mulher, armadura leve cinza. Besta apontada. Cabelo escuro preso. Equipamento militar preciso — menos selvagem que a caçadora.

### 10 — Princesa Maga

- **Classe:** Maga
- **Arquivo:** `10-princesa-maga.png`
- **Fundo:** `#2C0A0A`
- **Visual:** Mulher, túnica roxa com detalhes laranja/dourado. Bola de fogo ou chama na mão. Cabelo escuro ondulado. Cajado fino com gema de fogo. Aura quente.

### 11 — Princesa Feiticeira

- **Classe:** Maga
- **Arquivo:** `11-princesa-feiticeira.png`
- **Fundo:** `#1A0A2E`
- **Visual:** Mulher, capa escura roxa/preta, capuz parcial. Poções no cinturão ou frascos brilhantes flutuando. Mãos com energia roxa/magenta. Cabelo roxo escuro. Tom misterioso e sombrio.

### 12 — Princesa Oráculo

- **Classe:** Maga
- **Arquivo:** `12-princesa-oraculo.png`
- **Fundo:** `#0A1628`
- **Visual:** Mulher, vestes azul profundo com prata. Tiara com lua crescente. Bola de cristal ou luz mística nas mãos. Cabelo escuro com mechas prateadas. Círculo arcano ao fundo. Expressão enigmática.

---

## Verso das cartas (referência)

Ilustrações separadas — já existem no app como componentes SVG.

| Tema | Texto no verso | Cor principal |
|------|----------------|---------------|
| Heróis | HERÓIS | `#0C447C` |
| Princesas | PRINCESAS | `#3C3489` |

---

## Prompt base para IA de imagem

Copie e adapte por carta:

```
Crie uma ilustração de carta de jogo da memória, proporção 3:4 (300x400px),
estilo fantasia medieval realista estilizado, personagem original (sem copyright).
Fundo sólido [COR]. Personagem centralizado, do peito para cima ou corpo inteiro.
Alta legibilidade em tamanho pequeno (~80px de largura no celular).
Sem texto na imagem. Cantos arredondados.
[NOME]: [descrição da carta neste documento]
```

---

## Labels no código

Definidos em `app/src/assets/illustrations/config.ts`:

**Heróis:** Guerreiro do Escudo, Cavaleiro Pesado, Bárbaro, Elfo Guerreiro, Elfo Ancião, Elfo das Sombras, Arqueiro do Bosque, Besta de Precisão, Ranger do Norte, Mago Piromante, Mago Gélido, Archimago.

**Princesas:** Princesa Guerreira, Princesa Valquíria, Princesa Gladiadora, Princesa Elfa, Princesa Elfa Noturna, Princesa Druida, Princesa Arqueira, Princesa Caçadora, Princesa Atiradora, Princesa Maga, Princesa Feiticeira, Princesa Oráculo.

---

## Regenerar assets a partir de SVG (opcional)

Se as ilustrações forem entregues como SVG gerado por script:

```bash
cd app
pnpm run generate-game-cards
```

Saída: `app/assets/cards/game/heroes/` e `app/assets/cards/game/princesses/`.
