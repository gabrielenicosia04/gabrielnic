# Course Exercises Homepage — Design Spec

## Overview

A static website for a university course that hosts and links to individual exercise projects. The site consists of a homepage (`index.html`), an about page (`about.html`), and a contact page (`contact.html`), all sharing a consistent black theme with Gloock font.

## Pages

### Homepage (`index.html`)
- **Header/Nav bar:** Horizontal bar at the top containing:
  - "About" link (left-aligned) → `about.html`
  - "GABRIELE NICOSIA" (centered, electric blue, uppercase)
  - "Contact" link (right-aligned) → `contact.html`
- **Exercise links:** Below the header, a centered vertical list of clickable exercise names in white, ordered by creation date:
  1. Esercizio Pattern → `esercizio pattern/index.html`
  2. Tipografia Cinetica → `tipografia cinetica/index.html`
  3. Maschere Sonore → `maschere sonore/index.html`
  4. Manionetta → `Manionetta/index.html`

### About (`about.html`)
- Same header/nav as homepage
- Description of the university course

### Contact (`contact.html`)
- Same header/nav as homepage
- Contact info: email, phone number, Instagram link

## Design Tokens

- **Background:** `#000000` (black)
- **Primary text (exercise names):** `#FFFFFF` (white)
- **Name/accent color:** Electric blue (`#00BFFF`)
- **Font:** [Gloock](https://fonts.google.com/specimen/Gloock) via Google Fonts
- **Layout:** CSS Flexbox for header alignment and vertical centering of content

## Tech Stack

- Vanilla HTML + CSS (no frameworks)
- Google Fonts CDN for Gloock
- No JavaScript required
