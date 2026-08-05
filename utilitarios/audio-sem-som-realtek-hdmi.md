# Áudio sem som — Realtek ALC887 + HDMI (X99)

Runbook para PC sem áudio nenhum: serviços OK, mas nenhum endpoint de reprodução ativo.

**Hardware deste caso (2026-08-04):**

| Item | Valor |
|------|--------|
| Placa | INTEL X99 |
| Codec onboard | Realtek ALC887 (`VEN_10EC&DEV_0887`, `SUBSYS_10EC0887`) |
| GPU | AMD Radeon RX 580 |
| Monitor | LG ULTRAWIDE (áudio HDMI) |
| OS | Windows 11 |

## Sintoma

- Nenhum som (apps, sistema, YouTube).
- Em **Configurações → Som**, ou não há dispositivo padrão útil, ou só aparecem endpoints “desconectados”.
- Serviços `Audiosrv` e `AudioEndpointBuilder` podem estar **Running** — isso **não** prova que o áudio funciona.

## Diagnóstico rápido

PowerShell:

```powershell
Get-Service Audiosrv, AudioEndpointBuilder | Format-Table Name, Status, StartType

Get-CimInstance Win32_SoundDevice | Format-Table Name, Status, Manufacturer

Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render" | ForEach-Object {
  $n = (Get-ItemProperty "$($_.PSPath)\Properties").'{a45c254e-df1c-4efd-8020-67d146a850e0},2'
  $s = (Get-ItemProperty $_.PSPath).DeviceState
  "{0} = 0x{1:X8}" -f $n, $s
}
```

**DeviceState relevante:**

| Valor | Significado |
|-------|-------------|
| `0x1` | Active — usável |
| `0x2` | Disabled |
| `0x4` | Not present |
| `0x8` | Unplugged (jack sense / cabo) |

Neste incidente:

- **Alto-falantes** (Realtek) = `0x8` (Unplugged) — jack sense / driver genérico.
- Vários HDMI = unplugged / not present.
- Depois do fix AMD: **`6 - LG ULTRAWIDE` = `0x1`**.

Sinais extras:

- Realtek no Device Manager como **High Definition Audio Device** (provider **Microsoft**, `hdaudio.inf`) — driver genérico, não o codec Realtek.
- Pacote WU “Realtek … MEDIA” pode ser **OEM HP** (`HDXHP*`) e **não casa** com `SUBSYS_10EC0887` de placa X99 genérica.

## Causa

1. Codec Realtek no driver inbox da Microsoft → detecção de jack marca alto-falantes como desconectados.
2. Forçar `DeviceState = 1` no registro **não segura**: o stack de áudio reverte para `Unplugged`.
3. Áudio HDMI da AMD estava no genérico / incompleto até instalar o driver **AMD High Definition Audio Device**.

## Correção que resolveu

Ordem que restaurou o som neste PC (saída pelo monitor). Repetiu em **2026-08-05** após regressão.

**Regressão:** o AMD HDMI volta ao driver Microsoft genérico → some o endpoint `LG ULTRAWIDE` Active → mudo de novo. Reaplicar o passo 1.

### 1. Instalar driver AMD HD Audio (HDMI)

Via Windows Update (drivers pendentes) **ou** CAB do Catalog (`AtihdWT6.inf` → `pnputil /add-driver ... /install`). Em 2026-08-05 o CAB + `/install` foi o que grudou no dispositivo `VEN_1002&DEV_AA01`.

Confirmar:

```powershell
Get-PnpDevice -Class MEDIA | Format-Table Status, FriendlyName
Get-CimInstance Win32_SoundDevice | Format-Table Name, Status, Manufacturer
```

Esperado: **AMD High Definition Audio Device** (Manufacturer AMD), Status OK.

### 2. Definir o monitor como padrão

Confirmar endpoint ativo (`0x1`), depois definir como default (roles Console / Multimedia / Communications).

PowerShell **Admin** (GUID do endpoint muda quando o device é recriado — use o ID atual do `LG ULTRAWIDE`):

```powershell
# Exemplos neste PC:
# 2026-08-04: {0.0.0.00000000}.{c179b032-3159-448e-81aa-03733a256cf1}
# 2026-08-05: {0.0.0.00000000}.{8bf30713-980c-4d87-bd85-134a626ae05e}
```

Script one-shot (UAC): `C:\Users\filip\AudioFixNow.ps1`

Ou manualmente:

1. `Win + I` → Sistema → Som  
2. Saída = **LG ULTRAWIDE** (ou equivalente HDMI)  
3. Volume do Windows **e** do monitor (OSD) altos / sem mute  

### 3. Testar

Notificação do Windows, `C:\Windows\Media\Alarm01.wav`, ou um vídeo no browser.

**Áudio volta pelo HDMI do LG.**

## O que NÃO resolveu / armadilhas

| Tentativa | Resultado |
|-----------|-----------|
| Só reiniciar `Audiosrv` / `AudioEndpointBuilder` | Insuficiente sozinho |
| Remover/rescaneizar Realtek e manter `hdaudio.inf` Microsoft | Speakers continuam `Unplugged` |
| `DeviceState = 1` nos Alto-falantes | Revertido na hora pela jack sense |
| CAB Realtek do Catalog (`HDXHP*`, OEM HP) | Instala no store, **não** aplica no ALC887 `SUBSYS_10EC0887` |
| Assumir que “serviço de áudio rodando = tem som” | Falso se não há endpoint Active |

## Se precisar do jack do PC (verde / fone)

Ainda pendente neste hardware: Alto-falantes Realtek em `Unplugged`.

Próximos passos (não validados ainda neste incidente):

1. Confirmar cabo no **jack verde traseiro** (painel frontal só funciona se o HD Audio do case estiver ligado na placa).
2. Instalar **Realtek HD Audio Codec** clássico compatível com ALC887 / placa X99 genérica — **não** pacote HP UAD.
3. No Realtek Audio Console / driver OEM: desativar **jack detection** se a opção existir.
4. Evitar depender só do driver Microsoft `hdaudio.inf` para o jack analógico nesta config.

## Checklist rápido

| # | Ação | Onde |
|---|------|------|
| 1 | Ver endpoints Active vs Unplugged | Registry MMDevices / Configurações → Som |
| 2 | Confirmar provider do Realtek (Microsoft vs Realtek) | Device Manager / `Get-PnpDeviceProperty` |
| 3 | Instalar **AMD High Definition Audio** | WU / Device Manager |
| 4 | Selecionar **monitor HDMI** como saída padrão | Som + volume do monitor |
| 5 | Se jack PC ainda mudo | Driver Realtek certo para ALC887 / jack sense |

## Relacionado

- Placa: INTEL X99 + Realtek ALC887 + RX 580  
- Datas do incidente / fix: **2026-08-04**, **2026-08-05** (mesma regressão AMD → Microsoft)  
- Scripts temporários (home): `AudioFixNow.ps1`, logs `AudioFix*.txt` — não versionados neste repo
