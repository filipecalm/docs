# Prompt 3 — Geração de Recursos Gráficos para Play Store

**Uso:** copiar scripts de um projeto de referência, adaptar para o app atual, redesenhar logo e gerar assets de loja.  
**Quando usar:** antes do primeiro submit à Play Store, após redesign, ou quando faltam screenshots/feature graphic.  
**Resultado esperado:** scripts funcionando, assets nas dimensões corretas, logo em SVG + PNG + monocromática.

## Contexto (opcional)

- Projeto atual: `[NOME_DO_PROJETO]`
- Projeto com scripts de referência: `[PROJETO_DE_REFERÊNCIA]`

Se omitido, pergunte qual repositório já possui scripts de geração de assets ou procure no workspace.

## Texto do prompt

```
# Tarefa: Geração de Recursos Gráficos para Play Store

## Contexto
Você está trabalhando em um app mobile. Existe um projeto de referência chamado **[PROJETO_DE_REFERÊNCIA]**
que já possui scripts prontos para geração de imagens e recursos gráficos.

Se o nome do projeto de referência não foi informado, pergunte ao usuário ou localize no workspace
repositórios com scripts de assets (generate-*-assets, play-store, icon, splash, etc.).

Identifique também o domínio e a identidade visual do app atual a partir do código (tema, cores, nome, copy)
— não assuma nicho ou branding de outro produto.

## Etapa 1 — Copiar scripts do projeto de referência
Localize no projeto de referência todos os scripts relacionados a:
- Geração de imagens e assets gráficos
- Exportação de recursos para lojas (Play Store / App Store)
- Automação de ícones, splash screens ou banners

Copie esses scripts para o projeto atual, adaptando caminhos, nomes de pacote e configurações
para que funcionem neste contexto.

## Etapa 2 — Gerar recursos gráficos para a Play Store
Usando os scripts copiados (ou criando novos se necessário), gere todos os
assets obrigatórios da Play Store nos tamanhos e formatos corretos:

| Asset                  | Tamanho         | Formato |
|------------------------|-----------------|---------|
| Ícone do app           | 512×512 px      | PNG     |
| Feature graphic        | 1024×500 px     | PNG/JPG |
| Screenshots (telefone) | mín. 320px      | PNG/JPG |
| Screenshots (tablet)   | 1080×1920 px    | PNG/JPG |

Adapte textos, mocks de tela e paleta ao produto atual (telas reais ou representativas do domínio).

## Etapa 3 — Melhorar e modernizar a logo do app
Redesenhe a logo atual seguindo estes critérios:

**Estética:**
- Visual moderno, limpo e minimalista
- Legível em tamanhos pequenos (ícone 48px) e grandes (splash screen)
- Compatível com fundos claros e escuros (dark mode)
- Coerente com o propósito e o público do app atual

**Técnico:**
- Exportar em SVG (escalabilidade) e PNG (uso imediato)
- Versão monocromática para notificações Android
- Paleta alinhada aos tokens de tema do projeto, se existirem

## Critérios de sucesso
- [ ] Scripts do projeto de referência copiados e funcionando no projeto atual
- [ ] Todos os assets da Play Store gerados sem erros
- [ ] Logo exportada em todos os formatos solicitados
- [ ] Assets validados nas dimensões corretas
- [ ] Identidade visual reflete o produto atual, não o projeto de referência
```

## Estrutura de artefatos esperada

```
assets/
├── images/
│   ├── logo.svg
│   ├── logo-mono.svg
│   ├── logo.png
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── notification-icon.png
│   └── splash.png
└── play-store/
    ├── playstore-icon-512.png
    ├── playstore-feature-1024x500.png
    ├── screenshot-phone-*.png
    └── screenshot-tablet-*.png
```
