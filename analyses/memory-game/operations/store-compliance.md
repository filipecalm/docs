# Play Store — listagem e rejeição por comportamento enganoso

Rejeição recebida: *“O app deturpa ou não descreve a funcionalidade com clareza e precisão”*.

**Causa:** listagem pt-BR desatualizada — **não é bug no app**.

| Problema | Detalhe |
|----------|---------|
| Screenshots | Imagens de **outro app** (finanças) |
| Descrição | Texto antigo em inglês (“Memory Gift”) |
| App instalado | Correto — jogo Heróis/Princesas, 2 jogadores |

---

## Correção na Play Console

### 1. Main store listing (pt-BR)

[Main store listing](https://play.google.com/console/developers/app/main-store-listing) → idioma **Português (Brasil)**:

1. Remover **todas** as capturas incorretas  
2. Enviar mín. 2 (recomendado 4–5):

| Arquivo | Conteúdo |
|---------|----------|
| `01-menu.png` | Menu — temas + criar com fotos |
| `02-jogo-herois.png` | Partida Heróis |
| `03-jogo-princesas.png` | Partida Princesas |
| `04-dois-jogadores.png` | Modo 2 jogadores |
| `05-compartilhar.png` | QR + link |

Gerar no repo:

```bash
cd app
pnpm generate-game-cards
pnpm generate-store-screenshots
```

Preferível: captura real no dispositivo (Power + Volume Down).

3. Textos de `app/play-store-listing.json` → `locales["pt-BR"]` (`title`, `shortDescription`, `fullDescription`)  
4. Feature graphic: `app/assets/store/feature-graphic.png`  
5. Ícone: `app/assets/store/play-store-icon.png`

### 2. Outros idiomas e trilhas

Revisar **todos** os locales em Store presence e trilhas (Internal, Closed, Production). Zero screenshot de outro app.

### 3. Reenviar

1. [Publishing overview](https://play.google.com/console/developers/app/publishing)  
2. Corrigir listagem **antes** de reenviar o mesmo AAB (ou incrementar `versionCode`)  
3. Policy status → marcar resolvido

### Nota para o revisor (opcional)

```
Memória Presente é jogo da memória Android (Heróis, Princesas, 2 jogadores).
Capturas antigas eram de outro app — substituídas. Descrição pt-BR atualizada.
Jogos personalizados: https://memoria.almeidatech.online/criar (pagamento no site).
```

---

## Checklist pré-reenvio

- [ ] Zero screenshots de apps que não sejam Memória Presente  
- [ ] Título: `Memória Presente - Jogo Fotos`  
- [ ] Descrição completa em português (`play-store-listing.json`)  
- [ ] Feature graphic e ícone corretos  
- [ ] Todos os locales/trilhas revisados  
- [ ] Privacidade: https://memoria.almeidatech.online/politica-de-privacidade  

Guia completo de listagem: [launch-play-store.md](./launch-play-store.md)
