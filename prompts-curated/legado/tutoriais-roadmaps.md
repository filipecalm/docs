# Screenshots legado (2022–2024) — tutoriais, roadmaps e desafios

Complemento de [origens/from-screenshots.md](../origens/from-screenshots.md) (prompts 2025–2026). Conteúdo extraído das **360 imagens restantes** em `C:\Users\filip\Pictures\Pictures\Screenshots` — anos 2022, 2023 e início de 2024.

> **Índice por tipo (prompts):** [por-tipo.md](../por-tipo.md) · Tutoriais, roadmaps e desafios permanecem neste arquivo.

## Cobertura da varredura

| Ano | Arquivos | Status |
|-----|----------|--------|
| 2023 | 262 | ✅ 262/262 |
| 2024 (jan–abr) | 22 | ✅ 22/22 |
| 2022 | 76 | ⚠️ 38/76 completos + amostra de 8/38 (jan–nov); padrão = fotos pessoais/Hiring Coders |
| **Total** | **360** | **~350 efetivamente cobertos** |

**997 imagens** na pasta no total — com a rodada anterior (~637), cobertura **~987/997**.

---

## Resumo

| Tipo | Itens | Imagens |
|------|-------|---------|
| [Aprendizado e estudo](#aprendizado-e-estudo) | 1 | 1 |
| [Imagem (IA generativa)](#imagem-ia-generativa) | 1 | 2 |
| Tutoriais de código | 28 | 28 |
| Roadmaps / carreira | 9 | 11 |
| Desafios de código | 1 | 1 |
| **Já em [origens/from-salvas.md](../origens/from-salvas.md)** | vários | ver seção final |

---

## Aprendizado e estudo

### Técnica Feynman

**Imagem:** `Screenshot_20230511-062848.png` — também em [origens/from-screenshots.md](../origens/from-screenshots.md)

```
Explique [TÓPICO OU HABILIDADE] da forma mais simplificada possível como se estivesse ensinando a um iniciante completo.
```

---

## Imagem (IA generativa)

### DALL-E — imagem personalizada

**Imagens:** `Screenshot_20231122-133829.png`, `134039.png`

```
Crie uma imagem da minha gata, chamada Lara, jogando futebol
```

---

## Tutoriais de código

### CSS — `inset`

**Imagem:** `Screenshot_20230322-180602.png` · **Fonte:** @frontend_trend

```css
/* Longhand */
bottom: 10px;
left: 10px;
right: 10px;

/* Shorthand */
.frontend {
  inset: 10px;
}
```

### CSS — pseudo-elementos

**Imagem:** `Screenshot_20230329-023234.png` · **Fonte:** continueLendo()

`::first-letter`, `::first-line`, `::before`, `::after`, `::marker`, `::placeholder`, `::selection`, `::cue`

### CSS — seletores de atributo

**Imagem:** `Screenshot_20230329-023257.png` · **Fonte:** continueLendo()

`[title]`, `[title="x"]`, `[class~="x"]`, `[href^="#"]`, `[href$=".com"]`, `[href*=".com"]`, `[lang|="pt"]`

### CSS — `position: sticky`

**Imagem:** `Screenshot_20230614-143904.png`

Elemento segue o fluxo até um offset; depois “cola” no topo ao rolar.

### CSS — hover em links sociais

**Imagem:** `Screenshot_20221207-204631.png` · **Título:** Social Link Hover Effect

HTML com FontAwesome (`fa-instagram`, `fa-whatsapp`, `fa-twitter`); `::before` com `height: 0` → `height: 100%` no hover; gradiente no Instagram.

### Python — OOP (exemplo didático)

**Imagem:** `Screenshot_20230329-171926.png` · **Arquivo:** `capitalismo.py`

Classes `ClasseSocial`, `Proletario`, `Burguesia` com `riqueza_produzida(período)` — herança e polimorfismo.

### UX — loading skeleton vs spinner

**Imagem:** `Screenshot_20230507-054139.png` · **Fonte:** @design.carolth

Preferir skeleton que comunica layout em vez de spinner genérico “Please wait…”.

### Git — comandos básicos (PT)

**Imagem:** `Screenshot_20230520-150833.png`

`init`, `branch`, `checkout`, `add`, `commit`, `push`, `merge`, `clone`, `pull`, `log`, `status` — com comentários em português.

### Git — cheat sheet completo (PT)

**Imagem:** `Screenshot_20240106-215354.png`

7 seções: Criação, Mudanças locais, Histórico, Branches, Atualizar & publicar, Fundir & rebase, Desfazer — com `git add -p`, `git blame`, `git mergetool`, `git reset --keep`, etc.

### Git — Conventional Commits

**Imagem:** `Screenshot_20230607-213656.png` · **Fonte:** @ENGENHEIRA_COELHO

```
git commit -m "<tipo>[escopo opcional]: <descrição>"
```

Tipos: `fix`, `feat`, `chore`, `refactor`, `test`, `style`, `perf`, `docs`, `ci`, `build`.

### Git — recurso Conventional Commits

**Imagem:** `Screenshot_20220819-190048.png`

Repositório: https://github.com/iuricode/padroes-de-commits

### Git — Git Flow (feature)

**Imagem:** `Screenshot_20230913-171227.png`

```bash
git flow feature start name-feature
# finish:
git checkout develop && git merge name-feature
# ou: git flow feature finish name-feature
```

### SEO básico

**Imagem:** `Screenshot_20230607-215931.png` · **Fonte:** Matheus (Instagram Q&A)

HTML semântico, meta tags (description, title, keywords, Open Graph), sitemap, imagens otimizadas, carregamento rápido.

### Firebase + Vite env

**Imagem:** `Screenshot_20230709-110749.png`

`initializeApp` com `import.meta.env.VITE_*`; export de `auth`, `db` (firestore/lite), `storage`.

### NativeBase — fix SSRProvider React 18

**Imagem:** `Screenshot_20230709-185130.png` · **Fonte:** GitHub native-base #5758

Remover `<SSRProvider>` em `NativeBaseProvider.tsx` + `npx patch-package native-base`, ou `LogBox.ignoreLogs` como workaround.

### JavaScript — arrays (spread, concat, clone)

**Imagem:** `Screenshot_20230713-081122.png`

`.concat()` vs `[...arr]`; `.slice()` vs `[...arr]`.

### JavaScript — math shorthands

**Imagem:** `Screenshot_20230713-081127.png`

`~~4.9` como floor; `2**3` como `Math.pow`.

### JavaScript — loops

**Imagem:** `Screenshot_20230713-081129.png`

`for...of` em arrays; `for...in` para índices.

### JavaScript — métodos de array (infográfico)

**Imagem:** `Screenshot_20221224-230045.png`

`.map()`, `.filter()`, `.find()`, `.findIndexOf()`, `.fill()`, `.some()`, `.every()` — com analogia visual (copos).

### Python — métodos de lista

**Imagem:** `Screenshot_20231006-150049.png`

`.append()`, `.insert()`, `.pop()`, `.remove()`, `.reverse()`, `.sort()`, `.index()`, `.count()`.

### React — `useState` com closures

**Imagem:** `Screenshot_20230807-145639.png`

Réplica simplificada de `useState` retornando `[getState, setState]` via closure.

### React Query vs fetch manual

**Imagem:** `Screenshot_20231217-224046.png` · **Fonte:** Mario Paglia (LinkedIn)

Comparação `useEffect` + `fetch` vs `useQuery` (loading, error, cache).

### React Native — formulários

**Imagem:** `Screenshot_20231123-132754.png` · **Fonte:** Instagram Q&A

**React Hook Form** + **Zod** (também no React web).

### React — app Radio Broadcast

**Imagem:** `Screenshot_20221205-235502.png` · **Projeto:** `radio-broadcast/App.jsx`

React Router `Link`, `react-feather` (`Mic`, `Volume2`), Tailwind (`rounded-3xl`, `font-mono`).

### Node — token OAuth SERPRO (NF-e)

**Imagem:** `Screenshot_20231028-140837.png` · **Fonte:** Jefferson Lima (LinkedIn)

`TokenController.getBaererToken`: POST `/token` com `grant_type: client_credentials`, header `Basic` de `CONSUMER_KEY:CONSUMER_SECRET`.

### PDF — assinatura com jsPDF

**Imagem:** `Screenshot_20231108-205517.png` · **Fonte:** Flávio Andrade (WhatsApp)

`getImageFromUrl`, `doc.addImage(imageData, 150, 195, 22, 12)`; forçar HTTPS se URL `http`.

### VS Code — atalhos

**Imagem:** `Screenshot_20230730-082551.png`

Geral (`Ctrl+P`, `Ctrl+Shift+P`, `Ctrl+D`), navegação (`Ctrl+G`, `Alt+←/→`), texto (`Ctrl+Shift+K`, `Shift+Alt+↑`), refatoração (`F12`, `Shift+F12`, `Ctrl+Shift+F`).

### Recursos para devs

**Imagem:** `Screenshot_20230826-123818.png`

Extensões: WhatFont, CSSViewer, WGoFullPage. Imagens: Pexels, Unsplash, PicJumbo. Livros: Código Limpo, Entendendo Algoritmos, Não Me Faça Pensar, etc.

### Ideias de projetos (portfolio)

**Imagem:** `Screenshot_20220819-190056.png`

Repositório: https://github.com/florinpop17/app-ideas — projetos por nível de complexidade.

---

## Roadmaps e carreira

### Construir oportunidades (anti-Pokédex)

**Imagens:** `Screenshot_20230328-152655.png`, `152757.png` · **Fonte:** LinkedIn (autor não identificado)

Estratégia para júnior sem vaga formal:

1. Empresas contratam quem resolve problemas, não quem pede “oportunidade que me ensine tudo”.
2. Ir a eventos de empresários (BNI); identificar dor real; resolver com stack atual.
3. Curso barato e focado só se travar num problema específico — evitar colecionador de cursos.
4. Documentar no LinkedIn o projeto real (“dashboard pro açougue da dona Joana…”) em vez de “mais uma Pokédex”.
5. Prova social com 1 empresário → escala; conversa direta evita peneirão de RH.

### Plataformas de freela

**Imagem:** `Screenshot_20230906-125541.png`

Upwork, Freelancer.com, GetNinjas, Fiverr, 99freelas.

### Concurso — perfis Analista (edital)

**Imagem:** `Screenshot_20230804-183622.png`

**Perfil Tecnológico (70 questões):** Português, RLM, Matemática, Estatística, Conhecimentos Gerais + Inglês, Ciência de Dados, Desenvolvimento de Sistemas, BD, Infra, Segurança.

**Perfil Interno:** mesmos básicos + Administração/Políticas Públicas, Finanças, Economia, Gestão Governamental.

### Estudo para concurso com IA

**Imagem:** `Screenshot_20231019-210817.png` · **Título:** 7 I.A. CONCURSO

| Tarefa | Ferramenta |
|--------|------------|
| Edital | AI PDF |
| Legislação | AI LAWYER |
| Questões | ChatGPT 4 |
| Organizar | Notion AI |
| Mapas | xmind.app |
| Cursos | tutor.ai |

### Entrevista — perguntas difíceis (enquete)

**Imagem:** `Screenshot_20231112-125459~2.png` · **Fonte:** Stephany Borowiec (LinkedIn)

Opções: pontos fracos, pretensão salarial, pressão, mudanças.

### Entrevista — o que perguntar à empresa

**Imagem:** `Screenshot_20231119-200150.png` · **Fonte:** Ana Prado / Viviane Fernandes

- Equipe e ambiente
- Metas do cargo e medição de desempenho
- Projetos e desafios atuais
- Expectativa de adaptabilidade

### LinkedIn — busca booleana de vagas

**Imagem:** `Screenshot_20231129-110835.png`

```
("oportunidade" and "seu-framework") #vagasti
("desenvolvedor" and "junior") #vagasti
("react" and "contratando" and "junior") #vagasti
```

Filtrar por **Publicações**.

### Startup — validar ideia

**Imagem:** `Screenshot_20221205-054233.png`

1. Pedir feedback honesto a colegas/mentores
2. Avaliar: estranhamento, mercado, crescimento do setor, timing

### PMBA/CBMBA — cronograma (quadro pessoal)

**Imagem:** `Screenshot_20231124-220631-333.png`

Timeline de convocação/excedentes e possível novo edital (2024–2025) — quadro em lousa, contexto PM/CBM Bahia.

### Marco de carreira (referência)

**Imagem:** `Screenshot_20231205-100333.png` · **Fonte:** João Vitor Melo Kremer

“De estudante ao Tech Lead em 1 ano” na Dopster.io — relato, não trilha passo a passo.

---

## Desafios de código

### `flatten()` — array aninhado

**Imagem:** `Screenshot_20231027-210705.png` — **já documentado** em [origens/from-salvas.md](../origens/from-salvas.md#1-flatten--array-aninhado)

Teste técnico (10 min): implementar `flatten` para `[[1, [2, 3, [4, [5]], 6, [7, [8]]]]]` → `[1..8]`.

---

## Já documentados em from-salvas (mesma pasta Screenshots)

Não repetidos aqui; ver [origens/from-salvas.md](../origens/from-salvas.md):

| Imagem | Tipo |
|--------|------|
| `Screenshot_20241209-082125.png` | 6 prompts emprego remoto |
| `Screenshot_20250201-072146.png` | 7 prompts DeepSeek |
| `Screenshot_20250212-170022.png` | Reflexão pessoal |
| `Screenshot_20241121-235713.png` | Roadmap backend 3 fases |
| `Screenshot_20250303-222735.png` | Roadmap React por senioridade |
| `Screenshot_20250207-094505.png` | Front-end moderno (10 competências) |
| `Screenshot_20231027-210705.png` | Desafio `flatten()` |
| `Screenshot_20250520-113411.png` | Desafio `getMax()` |
| `Screenshot_20250519-123618.png` | Meme `goto` (C# EmailService) |

---

## Inventário — sem conteúdo técnico relevante

As **~300+** demais imagens do lote legado são predominantemente: fotos pessoais, futebol, política, apps bancários/saúde, memes, notificações, Spotify Wrapped, conversas WhatsApp/Instagram, rankings Gama/Hiring Coders (resultado, não tutorial), e telas de app em desenvolvimento sem texto didático.

### 2022 (parte jan–nov) — não varrida arquivo a arquivo

Amostra de 8 arquivos: 2 recursos dev (`190048`, `190056`), restante fotos/Hiring Coders. Parte dez/2022 (38 arquivos): 4 tutoriais/roadmaps, 34 não-técnicos.
