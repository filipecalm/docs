# Upload dos CVs para o Google Drive

Pasta: [Currículo (Drive)](https://drive.google.com/drive/folders/1QL9bsifFZrC5xXLwQZ6R18VGkZ7Rkyfy?usp=sharing)

## Status (24/07/2026)

- Drive API: ativa
- Pasta compartilhada com a service account: ok (update de arquivos existentes)
- **Limitação:** service account em *My Drive* **não cria** arquivo novo (sem quota). Só atualiza os que já existem.

### Atualizados com sucesso
- `Filipe_Almeida_Desenvolvedor_React_Native.docx`
- `Filipe_Carneiro_Almeida_Desenvolvedor_React_Native.docx`

### Spread_ATS
Conteúdo alinhado já está no `Filipe_Almeida_Desenvolvedor_React_Native.docx`.  
Para ter o arquivo com o nome Spread: arraste manualmente  
`C:\Users\filip\Downloads\Filipe_Almeida_Desenvolvedor_React_Native_Spread_ATS.docx`  
para a [pasta Currículo](https://drive.google.com/drive/folders/1QL9bsifFZrC5xXLwQZ6R18VGkZ7Rkyfy?usp=sharing).

## Bloqueio anterior (resolvido)

A **Google Drive API** estava desabilitada no projeto GCP `pc-api-4658683592737644820-228` (número `412413496046`).

## O que você precisa fazer (2 minutos)

### 1) Ativar a Drive API

Abra e clique **Enable / Ativar**:

https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=412413496046

### 2) Compartilhar a pasta com a service account

Na pasta [Currículo](https://drive.google.com/drive/folders/1QL9bsifFZrC5xXLwQZ6R18VGkZ7Rkyfy?usp=sharing):

1. Compartilhar
2. Adicionar este e-mail como **Editor**:

```
jogo-do-velho@pc-api-4658683592737644820-228.iam.gserviceaccount.com
```

3. Confirmar (pode desmarcar “notificar”)

### 3) Avisar no chat

Assim que ativar + compartilhar, diga **“drive ok”** que o upload roda de novo.

## Arquivos que serão enviados / atualizados

Origem: `C:\Users\filip\Downloads\`

| Arquivo | Ação |
|---------|------|
| `Filipe_Almeida_Desenvolvedor_React_Native.docx` | Update (já existe no Drive) |
| `Filipe_Carneiro_Almeida_Desenvolvedor_React_Native.docx` | Update (já existe no Drive) |
| `Filipe_Almeida_Desenvolvedor_React_Native_Spread_ATS.docx` | Create (versão Spread) |

## Script

```powershell
$env:NODE_PATH = "$env:TEMP\node_modules"
node "d:\Projetos\docs\carreira\spread-react-native-pl\scripts\upload-drive-cvs.js" sa
```

## Workaround manual (se não quiser mexer no GCP)

Arraste os 3 `.docx` de Downloads para a pasta do Drive no browser. Mova versões antigas para `Antigo/` se quiser histórico.
