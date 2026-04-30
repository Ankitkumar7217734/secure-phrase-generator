# 🔐 Secure Phrase Generator

A military-grade sentence password generator with character mutation, bias-free CSPRNG, and 85+ bit entropy. Works offline as a PWA.

## Features

- **Sentence-Based Passwords** — Memorable, high-entropy passphrases
- **Character Mutation** — Random characters injected into words, making dictionary attacks infeasible
- **Bias-Free CSPRNG** — Uses `crypto.getRandomValues()` with rejection sampling
- **250-Word Pools** — 1,000 words across 4 categories (adjectives, nouns, verbs, adverbs)
- **Three Modes** — Short (15-20), Medium (15-25), Long (25-45) characters
- **PWA Ready** — Install on your phone, works fully offline
- **Zero Tracking** — No backend, no cookies, no data stored

## Entropy

| Mode | Entropy | Crack Time (GPU Farm) |
|---|---|---|
| Short | ~85 bits | ~1.2 billion years |
| Medium | ~70-85 bits | ~37,000+ years |
| Long | ~100-130 bits | Trillions of years |

## Tech Stack

- HTML5 + Tailwind CSS
- Vanilla JavaScript
- Web Crypto API
- Service Worker (PWA)

## Usage

Open `index.html` in any browser, or host on GitHub Pages / Netlify for full PWA support.

## License

MIT
