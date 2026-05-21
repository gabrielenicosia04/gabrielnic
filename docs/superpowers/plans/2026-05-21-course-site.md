# Course Exercises Homepage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static homepage (`index.html`), about page (`about.html`), and contact page (`contact.html`) for a university course site, linking to 4 existing exercise projects.

**Architecture:** 3 plain HTML pages sharing a single CSS stylesheet. Zero JavaScript. Zero frameworks. Each exercise link points to the existing `index.html` inside its subdirectory. Google Fonts loads Gloock via CDN.

**Tech Stack:** Vanilla HTML5, CSS3 (Flexbox), Google Fonts CDN.

---

### Task 1: Create shared stylesheet (`style.css`)

**Files:**
- Create: `/Users/gabrielnicosia/Desktop/App/sito/style.css`

- [ ] **Step 1: Write `style.css`**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #000;
  color: #fff;
  font-family: 'Gloock', serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
}

.nav-left,
.nav-right {
  flex: 1;
}

.nav-left a,
.nav-right a {
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  transition: opacity 0.2s;
}

.nav-left a:hover,
.nav-right a:hover {
  opacity: 0.7;
}

.nav-right {
  text-align: right;
}

.nav-center h1 {
  color: #00bfff;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 6px;
  text-align: center;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.exercise-list {
  list-style: none;
  text-align: center;
}

.exercise-list li {
  margin: 16px 0;
}

.exercise-list a {
  color: #fff;
  text-decoration: none;
  font-size: 24px;
  transition: opacity 0.2s;
}

.exercise-list a:hover {
  opacity: 0.6;
}

.content {
  max-width: 640px;
  text-align: center;
  font-size: 20px;
  line-height: 1.6;
}

.content a {
  color: #00bfff;
  text-decoration: none;
}

.content a:hover {
  text-decoration: underline;
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la "/Users/gabrielnicosia/Desktop/App/sito/style.css"`
Expected: File exists with non-zero size

---

### Task 2: Create homepage (`index.html`)

**Files:**
- Create: `/Users/gabrielnicosia/Desktop/App/sito/index.html`

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gabriele Nicosia — Corso</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav>
    <div class="nav-left">
      <a href="about.html">About</a>
    </div>
    <div class="nav-center">
      <h1>GABRIELE NICOSIA</h1>
    </div>
    <div class="nav-right">
      <a href="contact.html">Contact</a>
    </div>
  </nav>

  <main>
    <ul class="exercise-list">
      <li><a href="esercizio pattern/index.html">Esercizio Pattern</a></li>
      <li><a href="tipografia cinetica/index.html">Tipografia Cinetica</a></li>
      <li><a href="maschere sonore/index.html">Maschere Sonore</a></li>
      <li><a href="Manionetta/index.html">Manionetta</a></li>
    </ul>
  </main>
</body>
</html>
```

- [ ] **Step 2: Verify file exists and preview**

Run: `ls -la "/Users/gabrielnicosia/Desktop/App/sito/index.html"`
Expected: File exists with non-zero size

---

### Task 3: Create about page (`about.html`)

**Files:**
- Create: `/Users/gabrielnicosia/Desktop/App/sito/about.html`

- [ ] **Step 1: Write `about.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — Gabriele Nicosia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav>
    <div class="nav-left">
      <a href="about.html">About</a>
    </div>
    <div class="nav-center">
      <a href="index.html" style="text-decoration:none"><h1>GABRIELE NICOSIA</h1></a>
    </div>
    <div class="nav-right">
      <a href="contact.html">Contact</a>
    </div>
  </nav>

  <main>
    <div class="content">
      <p>Raccolta di esercizi per il corso universitario. Ogni esercizio esplora un diverso aspetto della grafica computazionale, dell'animazione e dell'interazione.</p>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la "/Users/gabrielnicosia/Desktop/App/sito/about.html"`
Expected: File exists with non-zero size

---

### Task 4: Create contact page (`contact.html`)

**Files:**
- Create: `/Users/gabrielnicosia/Desktop/App/sito/contact.html`

- [ ] **Step 1: Write `contact.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact — Gabriele Nicosia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav>
    <div class="nav-left">
      <a href="about.html">About</a>
    </div>
    <div class="nav-center">
      <a href="index.html" style="text-decoration:none"><h1>GABRIELE NICOSIA</h1></a>
    </div>
    <div class="nav-right">
      <a href="contact.html">Contact</a>
    </div>
  </nav>

  <main>
    <div class="content">
      <p>Email: <a href="mailto:gabriele@example.com">gabriele@example.com</a></p>
      <p>Telefono: <a href="tel:+390000000000">+39 000 000 0000</a></p>
      <p>Instagram: <a href="https://instagram.com/gabriele.nicosia" target="_blank" rel="noopener">@gabriele.nicosia</a></p>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la "/Users/gabrielnicosia/Desktop/App/sito/contact.html"`
Expected: File exists with non-zero size

---

### Task 5: Verify the site works

**Files:** (no changes)

- [ ] **Step 1: Verify all 4 exercise links point to existing files**

Run: `ls -la "/Users/gabrielnicosia/Desktop/App/sito/esercizio pattern/index.html" "/Users/gabrielnicosia/Desktop/App/sito/tipografia cinetica/index.html" "/Users/gabrielnicosia/Desktop/App/sito/maschere sonore/index.html" "/Users/gabrielnicosia/Desktop/App/sito/Manionetta/index.html"`
Expected: All 4 files exist

- [ ] **Step 2: Verify all HTML files parse correctly**

Run: `for f in "/Users/gabrielnicosia/Desktop/App/sito/index.html" "/Users/gabrielnicosia/Desktop/App/sito/about.html" "/Users/gabrielnicosia/Desktop/App/sito/contact.html"; do echo "=== $f ===" && xmllint --html --noout "$f" 2>&1 || true; done`
Expected: No fatal parsing errors
