# Padrões de Projeto

## Sumário

- [File-based Routing (Expo Router)](#file-based-routing-expo-router)
- [Route Guard](#route-guard)
- [Context Provider](#context-provider)
- [Service Layer](#service-layer)
- [Controller + Middleware Chain (Backend)](#controller--middleware-chain-backend)
- [Interceptor (Axios)](#interceptor-axios)
- [Store (Zustand)](#store-zustand)
- [Guard Component (Premium)](#guard-component-premium)
- [Singleton / Lazy Initialization (Express App)](#singleton--lazy-initialization-express-app)
- [Factory (createApp)](#factory-createapp)
- [Observer (onAuthStateChanged)](#observer-onauthstatechanged)
- [Strategy (resolução de API URL)](#strategy-resolução-de-api-url)
- [⚠️ Observações](#️-observações)

---

## File-based Routing (Expo Router)

**Onde:** `app/`

**Trecho:**

```typescript
// app/(patient)/_layout.tsx
export default function PatientLayout() {
  return (
    <RoleRouteGuard allowedRole="patient">
      <Stack screenOptions={{ headerShown: false }} />
    </RoleRouteGuard>
  );
}
```

**Justificativa:** Rotas derivadas da estrutura de pastas; grupos `(patient)` e `(professional)` isolam fluxos por papel sem afetar a URL.

---

## Route Guard

**Onde:** `components/navigation/RoleRouteGuard.tsx`

**Trecho:**

```typescript
if (!authCtx.user) {
  return <Redirect href={"/" as never} />;
}
if (authCtx.user.role !== allowedRole) {
  return <Redirect href={getHomeRoute(authCtx.user.role) as never} />;
}
return <>{children}</>;
```

**Justificativa:** Impede acesso cruzado entre papéis (paciente vs nutricionista) antes de renderizar o stack de telas.

---

## Context Provider

**Onde:** `context/auth.tsx`, `context/language.tsx`

**Trecho:**

```typescript
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  // onAuthStateChanged, persistUserData, signIn, signOut...
  return (
    <AuthContext.Provider value={{ signed, user, signIn, signOut, ... }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Justificativa:** Estado de autenticação e idioma consumidos em toda a árvore sem prop drilling.

---

## Service Layer

**Onde:** `services/` (mobile), `functions/src/services/` (backend)

**Trecho:**

```typescript
// services/api.ts
export const api = axios.create({ baseURL: apiUrl, timeout: 60000 });

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Justificativa:** Encapsula comunicação HTTP e Firebase; telas não montam requests manualmente.

---

## Controller + Middleware Chain (Backend)

**Onde:** `functions/src/routes.ts`, `middlewares/`

**Trecho:**

```typescript
router.post(
  '/create',
  verifyToken,
  verifyAppCheck,
  rateLimitNutritionAi,
  checkDietGenerationAccess,
  async (req, res) => {
    const controller = new CreateNutritionController();
    await controller.handle(req, res);
  }
);
```

**Justificativa:** Pipeline Express declarativo — autenticação, proteção, limite de taxa e regra de negócio antes do handler.

---

## Interceptor (Axios)

**Onde:** `services/api.ts`

**Trecho:**

```typescript
if (error.response?.status === 401 && retries < MAX_401_RETRIES) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return api.request(cfg);
}
```

**Justificativa:** Retry automático em 401 para rotas de assinatura, mitigando race condition entre Firebase Auth e chamadas à API.

---

## Store (Zustand)

**Onde:** `store/patientStore.ts`, `store/subscriptionStore.ts`

**Trecho:**

```typescript
export const usePatientStore = create<PatientState>((set) => ({
  patient: null,
  setPatient: (patient) => set({ patient }),
  clearPatient: () => set({ patient: null }),
}));
```

**Justificativa:** Estado compartilhado leve (paciente selecionado, status Premium) sem boilerplate de Redux.

---

## Guard Component (Premium)

**Onde:** `components/PremiumGuard.tsx`

**Trecho:**

```typescript
if (!isDevModePremiumEnabled && !subscriptionStatus?.premium) {
  return (/* UI de bloqueio com CTA para /subscription */);
}
return <>{children}</>;
```

**Justificativa:** Proteção declarativa de conteúdo Premium no client; complementa `checkPremium` no backend.

---

## Singleton / Lazy Initialization (Express App)

**Onde:** `functions/src/server.ts`

**Trecho:**

```typescript
let cachedApp: Application | null = null;

function getApp(): Application {
  if (!cachedApp) {
    cachedApp = createApp();
  }
  return cachedApp;
}
```

**Justificativa:** Reutiliza instância Express entre invocações cold/warm do Cloud Functions.

---

## Factory (createApp)

**Onde:** `functions/src/createApp.ts`

**Trecho:**

```typescript
export function createApp(): express.Application {
  const app = express();
  app.post('/webhook/stripe', express.raw({ type: 'application/json' }), ...);
  app.use(express.json());
  app.use(cors({ origin: corsOrigins }));
  app.use('/', require('./routes').default);
  return app;
}
```

**Justificativa:** Montagem configurável do app Express; usada em produção (`server.ts`) e dev (`npm run dev`).

---

## Observer (onAuthStateChanged)

**Onde:** `context/auth.tsx`

**Trecho:**

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      // hidrata UserData e saveCachedUser
    } else {
      setUser(null);
      await clearCachedUser();
    }
    setLoading(false);
  });
  return unsubscribe;
}, []);
```

**Justificativa:** Reage a mudanças de sessão Firebase e sincroniza perfil Firestore + cache local.

---

## Strategy (resolução de API URL)

**Onde:** `services/apiBaseUrl.ts`

**Trecho:**

```typescript
export function resolveApiBaseUrl(): string | undefined {
  return (
    normalizeApiBaseUrl(process.env.EXPO_PUBLIC_BASE_URL) ||
    normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_URL) ||
    normalizeApiBaseUrl(extra?.apiBaseUrl)
  );
}
```

**Justificativa:** Fallback em cadeia para funcionar em dev (.env), EAS (env vars) e fallback embutido em `app.json`.

---

## ⚠️ Observações

- **Repository Pattern** não está implementado — acesso Firestore direto em services.
- **React Query** está configurado mas quase não adotado; padrão dominante é Zustand + `useEffect` + Context.
- Não há **class components** no repositório — 100% functional components com hooks.
- `React.memo` / `useCallback` / `useMemo` aparecem pontualmente (~15 arquivos), sem política sistemática de otimização.
