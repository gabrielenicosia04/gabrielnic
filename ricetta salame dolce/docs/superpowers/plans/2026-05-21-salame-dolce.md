# Salame Dolce — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare una singola pagina HTML con la ricetta del salame dolce, styling embedded, e immagine.

**Architecture:** Singolo file `index.html` con CSS nel `<style>` tag. Nessuna dipendenza esterna.

**Tech Stack:** HTML5, CSS3

---

### Task 1: Creare index.html

**Files:**
- Create: `index.html`

- [ ] **Step 1: Scrivere il file index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ricetta Salame Dolce</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: #000;
      color: #fff;
      font-family: Helvetica, Arial, sans-serif;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .container {
      max-width: 700px;
      width: 100%;
    }

    h1 {
      font-size: 25px;
      color: rgb(0, 0, 255);
      margin-bottom: 24px;
      text-align: center;
    }

    h2 {
      font-size: 20px;
      color: rgb(0, 0, 255);
      margin-top: 32px;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 15px;
      color: #fff;
      margin-top: 24px;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto 32px;
      border-radius: 8px;
    }

    ul, ol {
      padding-left: 24px;
      line-height: 1.8;
    }

    li {
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Ricetta Salame Dolce</h1>

    <img src="Foto-blog-4.png" alt="Salame Dolce">

    <h2>Ingredienti</h2>
    <ul>
      <li>200 gr di biscotti secchi</li>
      <li>100 gr di cacao in polvere</li>
      <li>150 gr di zucchero</li>
      <li>100 gr di burro</li>
      <li>2 uova</li>
      <li>zucchero a velo q.b.</li>
    </ul>

    <h2>Procedimento</h2>
    <ol>
      <li>Sbriciolare i biscotti in una ciotola.</li>
      <li>In un'altra ciotola ammorbidire il burro con lo zucchero fino a ottenere un composto cremoso.</li>
      <li>Aggiungere le uova e continuare a mescolare fino a ottenere una crema omogenea.</li>
      <li>Aggiungi le briciole di biscotti, mescola il composto fino a ottenere il composto ben incorporato.</li>
      <li>Prendi la carta forno e versa il composto. Dai la forma di un salame avvolgendo il composto nella carta forno e chiudendo bene le estremità.</li>
      <li>Metti il salame in frigorifero per minimo 4 ore, ancora meglio tutta la notte.</li>
      <li>Una volta bello rassodato, togli il salame dalla carta, spolvera con lo zucchero a velo e taglialo a fette.</li>
    </ol>

    <h3>Consiglio</h3>
    <p>Lascia riposare in frigorifero almeno 4 ore, idealmente tutta la notte, per un risultato più compatto e saporito.</p>
  </div>
</body>
</html>
```

- [ ] **Step 2: Copiare l'immagine nella cartella del progetto**

```bash
cp "/Users/gabrielnicosia/Desktop/Foto-blog-4.png" "/Users/gabrielnicosia/Desktop/App/ricetta salame dolce/"
```

Expected output: nessun errore, file copiato.

- [ ] **Step 3: Verifica visiva**

```bash
open "/Users/gabrielnicosia/Desktop/App/ricetta salame dolce/index.html"
```

Aprire nel browser e verificare:
- Sfondo nero, testo bianco
- Titolo "Ricetta Salame Dolce" in blu 25px
- Immagine visibile sopra gli ingredienti
- "Ingredienti" e "Procedimento" in blu 20px
- Liste correttamente formattate
- Layout centrato, max-width ~700px
