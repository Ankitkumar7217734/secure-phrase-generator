# 🔐 Secure Phrase Generator — Browser Extension

The same sentence-based password generator as the web app, now as a browser
extension popup — with username generation and a Google-Password-Manager-style
saved history.

## Install (Chrome / Edge / Brave / Arc — any Chromium browser)

1. Open `chrome://extensions` (Edge: `edge://extensions`).
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select this `extension` folder (the one containing `manifest.json`).
5. Click the puzzle-piece icon in the toolbar and pin **Secure Phrase
   Generator**.

No build step, no network access, no host permissions — everything runs
locally in the popup.

## What it does

- **Generator tab**
  - Passphrase generation identical to the web app (bias-free CSPRNG,
    4 × 250 word pools, per-word mutation, Short / Medium / Long modes).
  - **Also generate a username** — a readable handle like `cleverotter847`,
    with its own regenerate button. Turn it off if you only need a password.
  - **Exclude similar characters**, **Auto-hide password** (blurred until you
    tap to reveal, re-hides after 8 s).
  - Copy password / copy username — one click each.
  - **Open-site detection** — the tab that was open when you clicked the
    toolbar icon is remembered while the popup is up: copying the password
    saves that page's URL as the website link and its hostname as the site
    label. A chip above the copy button shows what will be attached, with an
    ✕ to skip. http(s) pages only; query strings are dropped; blank fields
    get filled but your manual edits are never overwritten.
- **History tab** (mini password manager)
  - Copying a password automatically saves it here — the **password only**.
    The generated username is deliberately not attached; add it yourself if
    you used it.
  - Every entry has an editable **site label** ("Where is this for? e.g.
    Google"), an editable **website link** (e.g. `google.com`, which gets an
    open-in-new-tab button) and an editable **username** — just click and
    type, it saves on blur/Enter.
  - Passwords are masked; reveal with the eye button, copy with the clipboard
    button, remove with the trash button. Clear all wipes the list.
  - Copying the same password twice moves it to the top instead of
    duplicating — your edits (username, site, link) are kept.

## Storage & privacy

- Settings and history live in `chrome.storage.local` on your machine only.
  No backend, no analytics, no network requests.
- Site detection uses the `activeTab` permission: the URL of the tab you were
  on is read only at the moment you open the popup. Nothing runs in the
  background, no other tab is ever read, and on `chrome://` or new-tab pages
  there is nothing to detect.
- Note: like any local store, the saved history is not encrypted at rest.
  If you're on a shared machine, prefer the browser's real password manager
  for long-term storage — this history is a "where did I use this?" reminder.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Manifest V3 definition (permissions: `storage`, `clipboardWrite`, `activeTab`) |
| `popup.html` / `popup.css` / `popup.js` | Popup UI and logic |
| `words.js` | Word pools — extracted verbatim from the web app's `generator.js` |
| `icons/` | Toolbar/store icons in 16/32/48/128 px |

Opening `popup.html` directly in a browser also works for quick previews
(it falls back to localStorage instead of `chrome.storage`).

## Development notes

- The entropy figure shown in the popup is computed from the actual random
  choices made during generation (pool + word + insertion position/character
  + per-character case + separator), so it reflects the real strength of the
  generated output.
- To update the word pools after changing the web app's `generator.js`,
  re-extract `words.js` so the two stay in sync.
