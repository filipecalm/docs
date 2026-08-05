# AbemidNead — ferramentas dev para PDF de admissão

Arquivo de referência local em **`D:\Projetos\docs\utilitarios\`**.  
**Não está integrado em produção** — o componente em `sadtfrontend_prod` permanece na versão original.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `AbemidNead-admissao-dev-tools.vue` | Cópia do componente com Regenerar PDF + Ocultar (dev) |
| `abemid-nead-admissao-dev-tools.md` | Esta documentação |

## Projeto alvo

`D:\Projetos\1-SADT\sadtfrontend_prod`

Componente de destino ao reativar:

`src/components/prontuario/componentes/pacientes/Documentos/AbemidNead.vue`

## Objetivo

Corrigir PDFs de **Relatório de Admissão** já salvos no prontuário (pasta Avaliações, `tipopasta.id = 1`) sem criar nova avaliação no backend e sem alterar o backend de documentos.

## Onde aparece na UI

Prontuário → **Documentos** → aba **Avaliações** (`AbemidNead.vue`), ao lado de **Baixar**, somente em documentos de admissão.

## Visibilidade (dev + admin)

Computed `canManageAdmissaoDocsDev`:

- `import.meta.env.NODE_ENV === "production"` → **nunca** mostra os botões
- Usuário `id === 1` ou `is_superuser === true` → pode usar em dev

## Funcionalidades

### Regenerar PDF

1. Identifica documento de admissão (`tipodoc` 45, nome com "admiss" ou arquivo `RELATORIO_ADMISSAO_*`)
2. Busca avaliação em `GET nead_abemid/avaliacao_admissao/?paciente={id}&ativo=true`
3. Cruza data pelo sufixo do arquivo: `Avaliado_em_DD_MM_YYYY`
4. Chama `AvaliacaoAdmissaoRelatorio.generateAndDownload(evaluation)` — usa `enfermeiro` original da avaliação
5. Salva novo PDF via `POST /pacientes/docs/` (`tipodoc` 45, `tipopasta` 1)
6. Faz download automático do PDF assinado

**Não** cria registro em `avaliacao_admissao_criar/`.

### Ocultar (dev, local)

- Remove o item **só deste navegador** (`localStorage`: `dev-hidden-admissao-docs:{pacienteId}`)
- **Não** inativa no servidor — a API atual só expõe list/create em `/pacientes/docs/`
- Banner com **Mostrar novamente** restaura a lista local

### Filtro de listagem

- `fetchUploadedDocuments` ignora `ativo === false`
- `filteredExams` também exclui IDs em `hiddenDocIds`

## Dependências

- `src/components/relatorios/avaliacao/Avaliacao_admissao.vue` (correções de layout do PDF — commitar no frontend)
- Vuex `userData`
- `moment`

## Como reativar

1. Copiar o conteúde de  
   `D:\Projetos\docs\utilitarios\AbemidNead-admissao-dev-tools.vue`  
   para  
   `D:\Projetos\1-SADT\sadtfrontend_prod\src\components\prontuario\componentes\pacientes\Documentos\AbemidNead.vue`
2. Garantir que `Avaliacao_admissao.vue` com as correções de margem/fonte esteja no frontend
3. **Não** commitar `AbemidNead.vue` se quiser manter só local/dev

## Limitações

| Ação | Sem backend extra |
|------|-------------------|
| Regenerar PDF | Funciona (POST docs + APIs existentes) |
| Ocultar na sua tela | Funciona (localStorage) |
| Inativar/excluir para todos | **Não** — precisa endpoint PATCH/DELETE em `/pacientes/docs/{id}/` |

## Histórico

- Layout PDF: `Avaliacao_admissao.vue` — `wrapTextToWidth`, fonte 9pt após `drawHeader` em continuações de página
- Ferramentas dev em `AbemidNead`: arquivadas em `D:\Projetos\docs\utilitarios\`, não no repositório `sadtfrontend_prod`
