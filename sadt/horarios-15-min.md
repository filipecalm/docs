# SADT — Horários de medicamento de 15 em 15

Alteração pedida para a grade de horários na **prescrição / edição de medicamento** (incluindo fluxo do médico no celular): slots de **15 minutos** em vez de só meia em meia hora.

Data de referência: julho/2026.

---

## Por que não era “só front”

`horario_administracao` é **ManyToMany** com `uteis.Horarios`. O front envia **IDs** da tabela.

Se o banco só tem `:00` e `:30`, inventar `:15`/`:45` na UI quebra no save (FK inválida) ou força arredondamento mentiroso.

Caminho correto: cadastrar os horários no backend (migration) + UI com step/layout adequados.

---

## Backend (`sadtbackend_prod`)

### Migration `uteis.0069_horarios_intervalo_15_min`

Arquivo: `uteis/migrations/0069_horarios_intervalo_15_min.py`

- Percorre `00:00` … `23:45` em passos de 15 minutos
- Insere o que ainda não existe (`bulk_create`)
- Reverse: remove apenas nomes `:15` e `:45`

### API

`HorariosLCAPIView` ordena por `nome`, `id` para a lista sair cronológica:

`GET /uteis/horarios/`

### Local

Aplicada no banco **`sadt_backend_local`** (ver [dev-local.md](./dev-local.md)).

Conferência:

```sql
SELECT COUNT(*) FROM uteis_horarios;                          -- 96
SELECT COUNT(*) FROM uteis_horarios
 WHERE nome LIKE '%:15' OR nome LIKE '%:45';                 -- 48
```

### Produção

**Não aplicar sem autorização.** Usar `.env.prod` / RDS só com ok do responsável:

```bash
python manage.py migrate uteis 0069
```

---

## Frontend

Telas tocadas (prescrição medicamento + médico):

- `Novo.vue` / `Editar.vue`
- `NovoMedico.vue` / `EditarMedico.vue`

Ajustes típicos:

- `step="900"` no time picker (15 min)
- Lista de horários ordenada
- Grade em **CSS grid** (4 colunas no mobile, 6 no desktop) — o CSS mobile antigo forçava `col` a 100% e estourava com 96 slots
- Scroll limitado na lista do fluxo médico

Repos: `sadtfrontend_prod` / `sadtfrontend_prod_vue3` (conforme o que estiver em uso).

---

## Deploy / teste

1. Migration no ambiente desejado (`uteis 0069`)
2. Front apontando para essa API ([dev-local.md](./dev-local.md))
3. Abrir prescrição (ícone do médico no celular) e validar grade `:15` / `:45`

Dieta/aprazamento que consomem a mesma API de horários também passam a ver os novos slots.

---

## Commits sugeridos

**Backend**

```
feat(uteis): seed 15-minute horario slots
```

- `uteis/migrations/0069_horarios_intervalo_15_min.py`
- (se ainda pendente) ordenação em `uteis/views.py`

**Frontend**

```
feat(prescricao-medicamento): support 15-minute schedule slots on mobile
```

```
fix(prescricao-medicamento): fix horario grid layout on mobile
```

---

## Armadilhas

| Problema | Causa | Mitigação |
|----------|--------|-----------|
| Front mostra 15 min, save falha | Migration não rodou no banco da API | Rodar `migrate uteis 0069` nesse ambiente |
| `python` não achado no Windows | Atalho da Store | Usar `.\.venv\Scripts\python.exe` ou Docker |
| `already exists` / histórico inconsistente | Dois migrates paralelos no mesmo DB | Um migrate por vez; se corromper, dropar o DB local e migrar de novo |
| API ainda meia em meia hora | Front ainda em `api.gssma.com.br` | `VITE_APP_API_URL=http://127.0.0.1:8000/` e reiniciar Vite |
