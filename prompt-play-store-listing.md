# Prompt — Textos da listagem Google Play Store



**Uso:** gerar copy pronta para colar nos campos **Detalhes do app** da Google Play Console (nome, descrições e notas de versão).  

**Quando usar:** antes do primeiro submit, ao relançar com novo posicionamento, ou a cada release que mereça release notes revisadas.  

**Resultado esperado:** três campos de listagem (**Nome do app**, **Breve descrição**, **Descrição completa**) em **um único idioma** — locale primário do app (padrão **PT-BR** para apps brasileiros), salvo se o usuário indicar outro via `[LOCALE]` / `[LOCALE_PT]`. **O que há de novo** em **um bloco bilíngue** com tags `<pt-BR>` e `<en-US>` (formato Google Play). Limites de caracteres respeitados; pronto para copiar campo a campo.



Funciona para qualquer app mobile; não assume stack (Flutter, Expo, nativo, etc.). Com o **projeto aberto no Cursor**, placeholders vazios ou a instrução **“use current project”** bastam — o agente deve inferir os valores do workspace antes de redigir.



## Como usar



1. Abra o repositório do app no Cursor (ou anexe README/código ao contexto).

2. Preencha os [placeholders](#placeholders) com dados do app **ou deixe em branco** / escreva “use current project” no chat — o agente **deve** ler o projeto e inferir o que faltar.

3. Copie o bloco [Texto do prompt](#texto-do-prompt) — com placeholders substituídos ou ainda com `[...]`.

4. Cole no chat do Cursor (ou outro LLM) e peça revisão se algum campo estourar o limite.

5. Transfira cada seção da resposta para a Play Console: **Crescer o número de usuários → Presença na loja → Listagem principal → Detalhes do app**.

   - **Nome, breve descrição e descrição completa:** cole na aba do idioma correspondente (ex.: Português (Brasil)). Para outro idioma, gere de novo com `[LOCALE]` ou preencha manualmente a aba EN na Console — **não** duplique PT+EN na mesma resposta para esses três campos.

   - **O que há de novo:** cole o bloco inteiro (com tags `<pt-BR>` e `<en-US>`) no campo de release notes — a Play Console interpreta as tags automaticamente.



### Inferência a partir do workspace (obrigatório se placeholders vazios)



Quando placeholders estiverem vazios, forem `[...]`, ou o usuário pedir **“use current project”**, o agente **deve** inspecionar o repositório aberto **antes** de gerar copy. Não pedir ao usuário dados que já existem no código.



| O que inferir | Onde procurar (prioridade) |

|---------------|----------------------------|

| Nome do app | `pubspec.yaml` / `app.json` / `package.json` / README / título nas telas |

| Categoria/nicho | README, docs de produto, telas principais em `lib/` ou `src/` |

| Proposta de valor e público | README, descrição do app, docs de análise/monetização |

| Funcionalidades | README, changelog, rotas/telas, features em `lib/` ou `src/` |

| Diferenciais | README, docs de monetização, política de privacidade, ausência de login/anúncios no código |

| Versão | `pubspec.yaml` (`version:`), `app.json` / `package.json`, tags git recentes |

| Changelog desta release | `CHANGELOG.md`, commits/tags desde a última versão, release notes em docs |

| Locale primário | `pubspec.yaml` / `l10n` / `intl` / README / mercado-alvo; padrão **PT-BR** se app brasileiro |

| Tom e restrições | Tom do README; `[EXTRA_NOTES]` implícitas (gratuito, offline, sem ads) |



**Por stack — arquivos a ler:**



| Stack | Arquivos / pastas |

|-------|-------------------|

| **Flutter** | `pubspec.yaml`, `README.md`, `CHANGELOG.md`, `lib/` (screens, features), `docs/`, assets Play Store existentes em `android/` ou docs relacionados |

| **Expo / React Native** | `app.json` ou `app.config.js`, `package.json`, `README.md`, `CHANGELOG.md`, `src/` ou `app/`, `docs/` |

| **Genérico** | `README.md`, `CHANGELOG.md`, `docs/`, manifestos de build (`AndroidManifest.xml`, etc.), código das telas principais |



Também consultar, se existirem: [prompt-03-play-store-assets.md](./prompts-generic/prompt-03-play-store-assets.md), [prompt-05-logo-e-play-store.md](./prompts-generic/prompt-05-logo-e-play-store.md), análises em `docs/analyses/[projeto]/`, docs de monetização.



**Saída obrigatória:** gerar os **4 campos** Play Console — **Nome do app**, **Breve descrição** e **Descrição completa** apenas no **locale primário** (padrão PT-BR); **O que há de novo** em **um bloco bilíngue** com tags `<pt-BR>` e `<en-US>`. O que não puder ser inferido com confiança → declarar a suposição num **rodapé** após os textos (não substituir campos vazios por inventário).



## Placeholders



| Placeholder | Descrição | Exemplo |

|-------------|-----------|---------|

| `[APP_NAME]` | Nome comercial do app (como deve aparecer na loja) | FocusTimer |

| `[CATEGORY]` | Categoria/nicho na Play Store | Produtividade / Saúde / Finanças |

| `[VALUE_PROP]` | Proposta de valor em 1–2 frases (o “por quê” usar) | Pomodoro simples, offline, sem conta |

| `[TARGET_AUDIENCE]` | Público-alvo principal | Estudantes e devs que precisam de foco |

| `[FEATURES]` | Lista de funcionalidades (bullets ou parágrafo) | Timer 25/5, estatísticas, tema escuro |

| `[DIFFERENTIATORS]` | O que distingue de alternativas genéricas (sem citar marcas) | Funciona 100% offline; zero anúncios |

| `[TONE]` | Tom de voz desejado | Direto, amigável, sem hype |

| `[VERSION]` | Número da versão atual | 1.2.0 |

| `[CHANGELOG]` | Mudanças desta release (bullets ou rascunho) | Novo widget; correção de crash ao pausar |

| `[LOCALE]` | Locale primário para nome e descrições (sinónimo de `[LOCALE_PT]`) | PT-BR (padrão) |

| `[LOCALE_PT]` | Variante PT para tags de release notes | PT-BR (padrão) |

| `[LOCALE_EN]` | Variante EN para tags de release notes | EN-US (padrão; usar `<en-US>`, não `<en>`) |

| `[EXTRA_NOTES]` | Restrições ou contexto extra | App gratuito; sem coleta de dados pessoais |



Se omitir placeholders, deixar `[...]`, ou o usuário disser **“use current project”**, o agente **deve** inferir do workspace aberto (ver [Inferência a partir do workspace](#inferência-a-partir-do-workspace-obrigatório-se-placeholders-vazios)) e declarar suposições no rodapé da resposta.



## Texto do prompt



```

# Tarefa: Textos da listagem Google Play Store



## Papel

Você é redator de ASO (App Store Optimization) e localização para apps mobile. Escreve copy clara, honesta e orientada a benefícios — sem exageros, sem nomes de concorrentes, sem promessas que o app não comprova.



## Contexto do app

- Nome: [APP_NAME]

- Categoria/nicho: [CATEGORY]

- Proposta de valor: [VALUE_PROP]

- Público-alvo: [TARGET_AUDIENCE]

- Funcionalidades principais: [FEATURES]

- Diferenciais: [DIFFERENTIATORS]

- Tom de voz: [TONE]

- Versão atual: [VERSION]

- Changelog desta release: [CHANGELOG]

- Locale primário (nome + descrições): [LOCALE] ou [LOCALE_PT] — padrão PT-BR

- Variante EN (release notes): [LOCALE_EN] — padrão EN-US

- Notas extras: [EXTRA_NOTES]



## Inferência obrigatória (placeholders vazios ou "use current project")



Se algum campo estiver vazio, for `[...]`, ou o usuário pedir para usar o projeto atual, **ler o workspace aberto antes de redigir**. Não pedir dados que já existem no repositório.



1. **Ler por stack:**

   - **Flutter:** `pubspec.yaml`, `README.md`, `CHANGELOG.md`, `lib/` (telas/features), `docs/`, assets ou docs Play Store em `android/` ou `docs/`

   - **Expo / React Native:** `app.json` ou `app.config.js`, `package.json`, `README.md`, `CHANGELOG.md`, `src/` ou `app/`, `docs/`

   - **Genérico:** `README.md`, `CHANGELOG.md`, `docs/`, manifestos de build, código das telas principais

2. **Extrair:** nome comercial, categoria, proposta de valor, público, features principais, diferenciais, versão (`version` no pubspec/app.json/package.json), changelog desta release, locale primário (padrão PT-BR para apps brasileiros), tom e restrições (gratuito, offline, sem ads, privacidade).

3. **Consultar também:** docs de assets Play Store, monetização, análises de produto e política de privacidade no repo, se existirem.

4. **Gerar sempre** os 4 campos abaixo: os três primeiros **só no locale primário**; **O que há de novo** em bloco bilíngue com tags Google Play.

5. **Rodapé — Suposições:** após os textos finais, listar em até 5 bullets o que foi inferido vs. assumido sem base forte. Se algo não puder ser inferido, declarar a suposição explicitamente (ex.: *“Categoria assumida: Produtividade — README não menciona nicho”*). Não inventar integrações, prêmios ou métricas.



## Campos a gerar (Google Play Console → Detalhes do app)



| Campo Play Console | Idioma(s) na saída | Limite | Requisitos |

|--------------------|-------------------|--------|------------|

| Nome do app | **Locale primário apenas** (`[LOCALE]` / `[LOCALE_PT]`, padrão PT-BR) | máx. **30** caracteres | Nome reconhecível; evitar keyword stuffing |

| Breve descrição | **Locale primário apenas** | máx. **80** caracteres | Uma linha; benefício principal + gancho |

| Descrição completa | **Locale primário apenas** | máx. **4000** caracteres | Estruturada; benefícios antes de features |

| O que há de novo | **Bloco bilíngue** com tags `<pt-BR>` e `<en-US>` | máx. **500** caracteres (total do bloco) | Foco na versão `[VERSION]`; bullets curtos |



**Importante:** Nome, breve descrição e descrição completa **não** devem aparecer duplicados em PT e EN na mesma resposta. O usuário preenche cada idioma na aba correspondente da Play Console. Só **O que há de novo** usa PT + EN juntos, num único campo, com tags de idioma Google Play.



## Regras de redação



1. **Honestidade:** descrever apenas o que o app faz ou plausivelmente faz com base no contexto. Não inventar integrações, prêmios, downloads ou avaliações.

2. **Sem concorrentes:** não mencionar nomes de apps, empresas ou marcas de terceiros.

3. **Sem spam de keywords:** repetir a mesma palavra-chave de forma artificial é proibido na política; priorize leitura natural.

4. **Benefício > feature:** cada feature listada deve ligar-se a um benefício para o usuário.

5. **Descrição completa — estrutura sugerida:**

   - Parágrafo de abertura (problema + solução)

   - Secção **Principais funcionalidades** (bullets)

   - Secção **Para quem é** (1 parágrafo curto)

   - Secção **Por que [APP_NAME]?** (diferenciais, sem hype)

   - Fecho opcional (convite a experimentar / feedback)

6. **O que há de novo:** 3–6 bullets por idioma baseados em `[CHANGELOG]`; omitir “melhorias de performance” genéricas se não houver base. PT e EN equivalentes em significado.

7. **Localização:** nome e descrições no locale primário; release notes PT (`<pt-BR>`) e EN (`<en-US>`) equivalentes em significado, não tradução literal palavra a palavra quando soar artificial.

8. **Contagem:** após cada texto (ou bloco de release notes), indicar `(X/Y caracteres)` com X ≤ Y.



## Formato de saída (obrigatório)



Usar exatamente esta estrutura Markdown:



---



### Nome do app



(texto no locale primário — ex.: PT-BR)



`(X/30 caracteres)`



---



### Breve descrição



(texto no locale primário)



`(X/80 caracteres)`



---



### Descrição completa



(texto completo no locale primário)



`(X/4000 caracteres)`



---



### O que há de novo (v[VERSION])



<pt-BR>

- item 1

- item 2

</pt-BR>

<en-US>

- item 1

- item 2

</en-US>



`(X/500 caracteres)` — total do bloco incluindo tags e quebras de linha



---



### Suposições (se houve inferência do workspace)



- … (até 5 bullets: inferido vs. assumido; o que confirmar antes do submit)



---



## Entrega extra (opcional mas útil)



- **2 variantes alternativas** apenas da breve descrição (locale primário), caso a principal não caiba no limite após revisão.

- **Checklist ASO** (5 itens): palavras-chave naturais usadas, riscos de política evitados, campos que exigem revisão humana antes do submit.



## Rodapé — Suposições (obrigatório se houve inferência)



Após os 4 campos, incluir secção **Suposições** com até 5 bullets: o que foi lido no repo, o que foi assumido, e o que o usuário deve confirmar antes do submit.



## Restrições



- Não gerar screenshots, ícones nem assets gráficos (só copy).

- Não incluir URLs, e-mail de suporte ou preços a menos que estejam em `[EXTRA_NOTES]`.

- Não duplicar nome, breve descrição ou descrição completa em PT e EN na mesma resposta — só release notes são bilíngues com tags.

- Se `[CHANGELOG]` estiver vazio, escrever release notes genéricas mínimas (“Correções e melhorias”) em ambas as tags e **avisar** que precisam ser substituídas por changelog real.

```



## Limites e políticas (referência rápida)



| Campo | Limite Google Play | Idioma na saída do prompt |

|-------|-------------------|---------------------------|

| Nome do app | 30 caracteres | Locale primário (padrão PT-BR) |

| Breve descrição | 80 caracteres | Locale primário |

| Descrição completa | 4000 caracteres | Locale primário |

| O que há de novo | 500 caracteres (bloco inteiro) | `<pt-BR>` + `<en-US>` num único campo |



**Boas práticas / política:**



- Metadados devem refletir com precisão a experiência do app ([Política de metadados](https://support.google.com/googleplay/android-developer/answer/9898842)).

- Proibido: ranking falso (“#1”, “melhor app do mundo”), referências a concorrentes, conteúdo enganoso ou repetição excessiva de keywords.

- Evitar ALL CAPS, emojis em excesso e promessas médicas/financeiras sem base se o app não for regulado para isso.

- Release notes devem descrever mudanças **reais** da versão — usuários e revisão da loja notam copy genérica repetida.

- Tags de idioma em release notes: usar `<pt-BR>` e `<en-US>` (locales padrão Google Play), não `<en>` genérico.



## Exemplo preenchido (app fictício)



Dois modos de teste:



- **Com placeholders** — contexto mínimo abaixo; substituir no bloco do prompt.

- **Sem placeholders** — abrir um repo real no Cursor, colar o prompt com `[...]` e pedir *“use current project”*; o agente deve ler `pubspec.yaml` / `app.json` / README etc. e preencher sozinho, com suposições no rodapé.



Contexto mínimo (app fictício):



```

[APP_NAME] = FocusTimer

[CATEGORY] = Produtividade

[VALUE_PROP] = Timer Pomodoro minimalista que funciona offline e não exige conta.

[TARGET_AUDIENCE] = Estudantes, freelancers e quem precisa de blocos de foco sem distrações.

[FEATURES] = Ciclos 25/5 personalizáveis; pausa longa; histórico da sessão; tema claro/escuro; notificação ao fim do timer.

[DIFFERENTIATORS] = Offline-first; sem login; interface leve; sem anúncios.

[TONE] = Direto e encorajador, sem marketing exagerado.

[VERSION] = 1.1.0

[CHANGELOG] = Novo intervalo de pausa longa configurável; correção de notificação silenciosa em Android 14; melhor contraste no tema escuro.

[LOCALE] = PT-BR

[LOCALE_PT] = PT-BR

[LOCALE_EN] = EN-US

[EXTRA_NOTES] = App gratuito; sem coleta de dados pessoais.

```



**Saída esperada (trecho):** nome, breve descrição e descrição completa **só em PT-BR**; release notes bilíngues:



```

### Nome do app



FocusTimer — Foco Pomodoro



`(24/30 caracteres)`



---



### Breve descrição



Timer Pomodoro offline, leve e sem conta. Foque em blocos de 25 minutos.



`(58/80 caracteres)`



---



### Descrição completa



Precisa de foco sem distrações? O FocusTimer…



`(…/4000 caracteres)`



---



### O que há de novo (v1.1.0)



<pt-BR>

- Pausa longa configurável

- Correção de notificação silenciosa no Android 14

- Melhor contraste no tema escuro

</pt-BR>

<en-US>

- Configurable long break interval

- Fixed silent notification on Android 14

- Improved dark theme contrast

</en-US>



`(…/500 caracteres)`

```



Cole o bloco **Texto do prompt** com esses valores substituídos, **ou** cole o prompt com placeholders vazios num projeto real e valide se o agente inferiu corretamente (confira o rodapé **Suposições**). Confirme contagens de caracteres antes de publicar.



## Relacionado



- [prompts-generic/prompt-03-play-store-assets.md](./prompts-generic/prompt-03-play-store-assets.md) — scripts e assets gráficos

- [prompts-generic/prompt-05-logo-e-play-store.md](./prompts-generic/prompt-05-logo-e-play-store.md) — logo, ícones e screenshots

