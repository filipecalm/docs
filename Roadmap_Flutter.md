# Roadmap Flutter para Filipe

## Fase 0 — Preparação (1 dia)

### Instalar
- Flutter SDK
- Android Studio
- Plugin Flutter
- Plugin Dart
- Git

### Verificar
```bash
flutter doctor
```

Objetivo:
- Ambiente funcionando sem erros.

---

## Fase 1 — Dart (Semana 1)

### Aprender
- Variáveis
- Tipos
- Funções
- Classes
- Herança
- Null Safety
- Future e async/await
- Collections (List, Map, Set)

### Exercícios
- Calculadora
- Lista de tarefas em memória
- Consumo simples de API

Objetivo:
- Conseguir programar em Dart sem consultar exemplos a todo momento.

---

## Fase 2 — Flutter Básico (Semana 2)

### Aprender
- Widgets
- StatelessWidget
- StatefulWidget
- BuildContext
- Scaffold
- AppBar
- Text
- Image
- Button
- TextField

### Layout
- Row
- Column
- Container
- Expanded
- Flexible
- Padding
- Center

### Projeto
- Tela de login

Objetivo:
- Montar telas sem copiar código pronto.

---

## Fase 3 — Navegação e Formulários (Semana 3)

### Aprender
- Navigator
- Rotas
- Forms
- Validações
- Controllers

### Projeto
- Login
- Cadastro
- Recuperação de senha

Objetivo:
- Navegar entre telas e validar dados.

---

## Fase 4 — APIs REST (Semana 4)

### Aprender
- HTTP
- JSON
- Serialização
- Tratamento de erros

Pacotes:
```yaml
http
```

### Projeto
- Aplicativo consumindo API pública

Exemplos:
- CEP
- Clima
- Filmes

Objetivo:
- Consumir APIs reais.

---

## Fase 5 — Gerenciamento de Estado (Semana 5)

### Aprender
- Riverpod

### Conceitos
- Providers
- StateNotifier
- AsyncValue

### Projeto
- Lista de tarefas persistida

Objetivo:
- Entender arquitetura moderna Flutter.

---

## Fase 6 — Persistência Local (Semana 6)

### Aprender
- SharedPreferences
- Hive
- SQLite

### Projeto
- App de notas offline

Objetivo:
- Salvar dados localmente.

---

## Fase 7 — Arquitetura Profissional (Semana 7)

### Aprender
- Clean Architecture
- Repository Pattern
- Services
- Dependency Injection

Estrutura:

lib/
├── core/
├── data/
├── domain/
├── presentation/

Objetivo:
- Criar projetos escaláveis.

---

## Fase 8 — Firebase (Semana 8)

### Aprender
- Authentication
- Firestore
- Storage
- Push Notifications

### Projeto
- App com login Google
- Cadastro de usuários

Objetivo:
- Criar backend sem servidor próprio.

---

## Fase 9 — Projeto Portfólio (Semanas 9 e 10)

### Criar um app completo

Sugestões:
- Agenda médica
- Controle financeiro
- Delivery
- Academia
- Checklist

### Deve conter
- Login
- API
- Persistência
- Estado
- Firebase

Objetivo:
- Ter algo para mostrar em entrevistas e clientes.

---

## Fase 10 — Publicação (Semana 11)

### Android

Gerar AAB:

```bash
flutter build appbundle
```

### Criar conta
- Google Play Console

### Aprender
- Assinatura do app
- Screenshots
- Política de privacidade
- Testes internos

Objetivo:
- Publicar o primeiro aplicativo.

---

## Fase 11 — Diferenciais (Contínuo)

### Aprender depois
- Testes unitários
- Testes de widget
- CI/CD
- Fastlane
- Deep Links
- Internacionalização
- Monetização
- Assinaturas

---

# Meta Final

Ao concluir o roadmap você deverá ser capaz de:

- Criar apps Android completos
- Consumir APIs
- Trabalhar com Firebase
- Publicar na Play Store
- Estruturar projetos profissionais
- Atuar como desenvolvedor Flutter júnior/pleno em projetos reais
