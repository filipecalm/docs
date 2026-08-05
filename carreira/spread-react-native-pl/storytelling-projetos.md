# Storytelling dos projetos (entrevista)

Use estrutura **STAR** (Situação → Tarefa → Ação → Resultado). Cada bloco cabe em ~90 segundos.

---

## 1) São Luís Home Care / LMO — produção CLT

**Uma frase:** App React Native de saúde (planos) em produção desde 2023, premiado Centelha (MCTI).

**Situação:** Produto mobile Android/iOS para plano de saúde / home care.  
**Tarefa:** Entregar features, integrar APIs, manter qualidade e UX.  
**Ação:** React Native + TypeScript/JS, React Navigation, Context API, REST, testes Jest, Git/code review, tooling nativo.  
**Resultado:** App em produção contínua; reconhecimento Centelha.

**Perguntas que vêm em cima:**
- Como organiza pastas/módulos?
- Como trata erro de API offline?
- Como evita re-render desnecessário?

**Não exagerar:** Se algo for só no DietOS/Bíblia (Zustand, Stripe), diga “no produto do trabalho usei X; nos apps pessoais usei Y”.

---

## 2) DietOS — Play Store + pagamentos + stack desejável

**Uma frase:** App de nutrição (paciente + nutricionista) na Play Store, com Premium via Stripe, Zustand, TanStack Query e EAS.

**Situação:** Produto próprio multi-papel (paciente/profissional).  
**Tarefa:** Publicar Android, monetizar, manter dados e auth estáveis.  
**Ação:**
- Estado global: Zustand (`store/`)
- Server state: TanStack Query
- Pagamentos: `@stripe/stripe-react-native` + Functions
- UI motion: Reanimated + Gesture Handler
- Deploy: EAS Build / Submit + scripts
- Backend: Firebase Functions  
**Resultado:** App publicado (`com.filipecalm.mobile`), pipeline de release.

**Gancho para a vaga:** “Tenho vivência com **meios de pagamento** em mobile (Stripe), que é desejável no anúncio.”

**Demo mental (se pedirem deep dive):**
1. Usuário inicia assinatura → Stripe sheet/checkout  
2. Webhook/backend confirma  
3. Store/contexto de subscription atualiza UI Premium  

---

## 3) A Bíblia Sagrada — Play Store + Context + EAS

**Uma frase:** App de Bíblia offline publicado na Play Store, com favoritos, highlights, auth e Premium Stripe.

**Situação:** App pessoal para leitura limpa (motivação: app cheio de ads).  
**Tarefa:** Offline-first, UX simples, publicar e iterar.  
**Ação:** Expo Router, SQLite, vários Contexts (`Auth`, `Favorites`, `Subscription`…), Reanimated/GH, EAS Update/Build/Submit, Stripe.  
**Resultado:** Publicado (`com.filipecalm.biblia`), canal de updates.

**Gancho técnico:** diferença Context (UI/estado de sessão local) vs TanStack (cache de servidor) — mostra maturidade.

---

## Pitch de 30 segundos (abertura)

> Sou Filipe, desenvolvedor React Native pleno. Há cerca de três anos atuo em app de saúde em produção, premiado pelo Centelha. Em paralelo publico apps na Play Store — DietOS e A Bíblia Sagrada — com TypeScript, Zustand/TanStack Query, Reanimated, Stripe e pipeline EAS. Busco a vaga pleno remoto da Spread para contribuir em produto mobile com qualidade, performance e boas práticas.

---

## Pitch de 10 segundos (LinkedIn / recruiter)

> React Native em produção (saúde) + 2 apps na Play Store com Stripe, Zustand/TanStack e EAS. CLT remoto, disponível.
