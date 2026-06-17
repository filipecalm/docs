# DietOS — Documentação Técnica

Documentação de System Design gerada a partir do código-fonte do repositório [DietOS](../DietOS).

## Visão geral

**DietOS** é um aplicativo mobile de nutrição (React Native / Expo) com backend em Firebase Cloud Functions. Atende dois papéis:

- **Paciente** — plano alimentar, check-in, diário, ferramentas de saúde, contato com nutricionista
- **Nutricionista** — gestão de pacientes, geração de dietas com IA, dietas favoritas, mensagens, assinatura Premium

Plataformas: **Android** (produção via EAS/Play Store), **iOS** (configurado), **Web** (Expo web, suporte parcial).

## Índice

| Documento | Conteúdo |
|-----------|----------|
| [system-design.md](./system-design.md) | Arquitetura, camadas, módulos, diagramas |
| [stack.md](./stack.md) | Stack completa com versões e dependências |
| [data-flow.md](./data-flow.md) | Fluxos de autenticação, API, navegação, persistência |
| [patterns.md](./patterns.md) | Padrões de projeto identificados no código |
| [scripts.md](./scripts.md) | Scripts npm, PowerShell, CMD, VS Code tasks e utilitários |
| [scripts/](./scripts/) | Espelho dos scripts + [README](./scripts/README.md) |
| [.vscode/tasks.json](./.vscode/tasks.json) | Tasks de dev (ex.: Kill Metro porta 8081) |
| [decisions.md](./decisions.md) | ADRs inferidos das escolhas no código |
| [prompts.md](./prompts.md) | Prompts úteis para modernização e documentação (com matriz de gaps) |
| [cursor-semantic-commits.md](./cursor-semantic-commits.md) | Commits semânticos no Cursor (skills, commands e User Rules globais) |
| [cursor/](./cursor/) | Arquivos versionados para instalar em `~/.cursor/` |

## Estrutura do repositório (resumo)

```
DietOS/
├── app/                 # Telas — Expo Router (file-based)
├── components/          # Componentes reutilizáveis
├── context/             # React Context (auth, language)
├── hooks/               # Hooks customizados
├── store/               # Zustand stores
├── services/            # Camada de serviços (API, Firebase, Stripe)
├── utils/               # Utilitários (i18n, rotas, PDF, etc.)
├── constants/           # Tokens de cor
├── styles/              # StyleSheets compartilhados (parcial)
├── scripts/             # Automação de build, deploy e secrets (espelhado em DietOS-docs/scripts/)
├── functions/           # Firebase Cloud Functions (Express API)
├── tests/               # Testes de regras Firestore/Storage
├── hosting/             # Site estático (dietos.com.br)
├── docs/                # Documentação operacional existente
└── assets/              # Imagens, ícones, Play Store
```

## Documentação operacional existente

O repositório já contém guias em `DietOS/docs/` (Firebase, Stripe, Play Store, pentest, desenvolvimento). Esta pasta (`DietOS-docs`) complementa com visão arquitetural e de engenharia.

## ⚠️ Observações

- `docs/estrutura.md` no repositório referencia pastas de `app/` que migraram para grupos `(shared)/`, `(patient)/` e `(professional)/`.
- O script `reset-project` está declarado em `package.json` mas o arquivo `scripts/reset-project.js` não existe no repositório.
