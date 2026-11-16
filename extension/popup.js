"use strict";

/* ============================================================
 * Secure Phrase Generator — browser extension popup
 *
 * The generation pipeline mirrors the web app's generator.js
 * (bias-free CSPRNG via rejection sampling, 4 word pools x 250
 * words, per-word mutation with random casing). The entropy
 * figure shown is computed from the actual random choices made
 * during generation, so it reflects reality for this exact
 * output rather than a fixed table.
 * ============================================================ */

// ---------- storage ----------
// chrome.storage.local inside the extension. When popup.html is opened
// directly as a file (preview / testing), fall back to a localStorage-backed
// shim with the same get/set signature.
const storageArea =
  typeof chrome !== "undefined" && chrome.storage && chrome.storage.local
    ? chrome.storage.local
    : {
        _key(k) {
          return "pgext_" + k;
        },
        get(keys, cb) {
          const defaults =
            keys && !Array.isArray(keys) && typeof keys === "object"
              ? keys
              : {};
          const list =
            keys == null
              ? []
              : Array.isArray(keys)
                ? keys
                : typeof keys === "string"
                  ? [keys]
                  : Object.keys(keys);
          const out = {};
          for (const k of list) {
            const raw = localStorage.getItem(this._key(k));
            out[k] =
              raw === null
                ? defaults[k] !== undefined
                  ? defaults[k]
                  : null
                : JSON.parse(raw);
          }
          cb(out);
        },
        set(obj, cb) {
          for (const [k, v] of Object.entries(obj)) {
            localStorage.setItem(this._key(k), JSON.stringify(v));
          }
          if (cb) cb();
        },
      };

const storageGet = (keys) => new Promise((res) => storageArea.get(keys, res));
const storageSet = (obj) => new Promise((res) => storageArea.set(obj, res));

// ---------- constants ----------

const LENGTH_RANGES = {
  short: { min: 15, max: 20 },
  medium: { min: 15, max: 25 },
  long: { min: 25, max: 45 },
};

const MUTATION_STANDARD =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const MUTATION_NO_SIMILAR =
  "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%^&*";

const MAX_HISTORY = 100;
const REVEAL_MS = 8000;

const DEFAULT_SETTINGS = {
  mode: "medium",
  withUsername: true,
  excludeSimilar: false,
  autoHide: true,
};

const ICONS = {
  user:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  lock:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  eye:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  copy:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  trash:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  link:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  external:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6c0 1-1 2-2 2H5c-1 0-2-1-2-2V8c0-1 1-2 2-2h6"/></svg>',
};

// ---------- state ----------

const state = {
  settings: { ...DEFAULT_SETTINGS },
  history: [],
  password: "",
  username: "",
  bits: 0,
  words: 0,
  detected: null, // { site, url } from the tab open when the popup launched
  revealTimer: null,
};

let ui = {};

const $ = (id) => document.getElementById(id);
const log2 = Math.log2;

// ---------- CSPRNG ----------

function ri(max) {
  if (max <= 1) return 0;
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

const pick = (arr) => arr[ri(arr.length)];

function mutationCharset() {
  return state.settings.excludeSimilar
    ? MUTATION_NO_SIMILAR
    : MUTATION_STANDARD;
}

// ---------- generation ----------

// One mutated word = pool choice + word choice + 1-3 random character
// insertions + one independent case bit per final character.
function buildWord() {
  const pools = [adjectives, nouns, verbs, adverbs];
  const pool = pools[ri(pools.length)];
  const mc = mutationCharset();
  let bits = log2(pools.length) + log2(pool.length);

  const chars = pick(pool).split("");
  const insertions = 1 + ri(3);
  bits += log2(3);
  for (let i = 0; i < insertions; i++) {
    const pos = ri(chars.length + 1);
    bits += log2(chars.length + 1);
    chars.splice(pos, 0, mc[ri(mc.length)]);
    bits += log2(mc.length);
  }
  bits += chars.length; // case bits
  const word = chars
    .map((ch) => (ri(2) ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
  return { word, bits };
}

function generatePassword() {
  const range = LENGTH_RANGES[state.settings.mode] || LENGTH_RANGES.medium;
  const targetLen = range.min + ri(range.max - range.min + 1);

  let password = "";
  let bits = 0;
  let words = 0;

  for (let attempt = 0; attempt < 50; attempt++) {
    const { word, bits: wordBits } = buildWord();
    if (password === "") {
      if (word.length > range.max) continue;
      password = word;
      bits += wordBits;
    } else {
      const useSymbol = ri(2) === 1;
      const sep = useSymbol ? pick(symbols) : String(ri(10));
      bits += 1 + (useSymbol ? log2(symbols.length) : log2(10));
      const candidate = password + sep + word;
      if (candidate.length > range.max) break;
      password = candidate;
      bits += wordBits;
    }
    words += 1;
    if (password.length >= targetLen) break;
  }

  const mc = mutationCharset();
  while (password.length < range.min) {
    password += mc[ri(mc.length)];
    bits += log2(mc.length);
  }

  return { password, bits, words };
}

// e.g. "cleverotter847" — readable, lowercase, accepted by most sign-up forms.
function generateUsername() {
  const stem = pick(adjectives) + pick(nouns);
  const digitCount = 2 + ri(3); // 2-4 digits
  let num = "";
  for (let i = 0; i < digitCount; i++) num += String(ri(10));
  return stem + num;
}

function newGeneration() {
  const result = generatePassword();
  state.password = result.password;
  state.bits = result.bits;
  state.words = result.words;
  if (state.settings.withUsername) state.username = generateUsername();
  renderGenerator();
}

// ---------- generator rendering ----------

function renderGenerator() {
  ui.pwText.textContent = state.password;

  const level = state.bits < 50 ? "fair" : state.bits < 70 ? "good" : "strong";
  const pct = level === "fair" ? "33%" : level === "good" ? "66%" : "100%";
  const label =
    level === "fair" ? "Fair" : level === "good" ? "Good" : "Strong";

  ui.meterBar.style.width = pct;
  ui.meterBar.className = "meter-bar" + (level === "strong" ? "" : " " + level);
  ui.strengthText.textContent = label;
  ui.strengthText.className =
    "strength-label" + (level === "strong" ? "" : " " + level);
  ui.entropyText.textContent =
    state.password.length +
    " chars - " +
    state.words +
    (state.words === 1 ? " word" : " words") +
    " - " +
    Math.floor(state.bits) +
    " bits";

  ui.usernameValue.textContent = state.username || "—";

  if (state.settings.autoHide) hidePassword();
  else {
    clearTimeout(state.revealTimer);
    ui.pwText.classList.remove("pw-hidden");
    ui.pwOverlay.hidden = true;
  }
}

function hidePassword() {
  clearTimeout(state.revealTimer);
  ui.pwText.classList.add("pw-hidden");
  ui.pwOverlay.hidden = false;
}

function revealPassword() {
  clearTimeout(state.revealTimer);
  ui.pwText.classList.remove("pw-hidden");
  ui.pwOverlay.hidden = true;
  state.revealTimer = setTimeout(hidePassword, REVEAL_MS);
}

// ---------- clipboard ----------

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:-999px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (err2) {
      return false;
    }
  }
}

// ---------- open-site detection ----------

// Reads the tab that was open when the popup launched. The activeTab
// permission grants access to that one tab's URL only because the user
// clicked the toolbar icon — nothing is watched in the background and no
// other tab is ever read. http(s) pages only; query string and fragment are
// dropped so session tokens / tracking params never reach local storage.
async function getActiveTabSite() {
  try {
    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.query) {
      return null; // file:// preview or another non-extension context
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const u = new URL(tab && tab.url ? tab.url : "");
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return {
      site: u.hostname.replace(/^www\./, ""),
      url: u.origin + u.pathname,
    };
  } catch {
    return null; // unreadable / restricted URL (chrome://, about:blank, ...)
  }
}

function renderDetectedChip() {
  ui.detectedChip.hidden = !state.detected;
  if (state.detected) ui.detectedSite.textContent = state.detected.site;
}

// ---------- history ----------

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : "e-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 10);
}

function findEntry(id) {
  return state.history.find((e) => e.id === id);
}

async function persistHistory() {
  await storageSet({ history: state.history });
}

// Add-or-update: copying the same password again moves it to the top instead
// of creating a duplicate. A username is only written when one is explicitly
// passed in, and a detected site/url only fills blank fields, so re-copying
// never overwrites edits made in the History tab.
async function upsertHistoryEntry({ password, username, site, url }) {
  const list = state.history;
  const idx = list.findIndex((e) => e.password === password);
  if (idx !== -1) {
    const entry = list[idx];
    if (username) entry.username = username;
    if (site && !entry.site) entry.site = site;
    if (url && !entry.url) entry.url = url;
    entry.updatedAt = Date.now();
    list.splice(idx, 1);
    list.unshift(entry);
  } else {
    list.unshift({
      id: uid(),
      password,
      username: username || "",
      site: site || "",
      url: url || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
  if (list.length > MAX_HISTORY) list.length = MAX_HISTORY;
  await persistHistory();
}

// Fills defaults for entries saved by older versions (missing url, etc.).
function normalizeHistory(list) {
  return (Array.isArray(list) ? list : [])
    .filter((e) => e && typeof e.password === "string")
    .map((e) => ({
      ...e,
      username: typeof e.username === "string" ? e.username : "",
      site: typeof e.site === "string" ? e.site : "",
      url: typeof e.url === "string" ? e.url : "",
    }));
}

function maskPassword(pw) {
  return pw.length > 28 ? "•".repeat(28) + "…" : "•".repeat(pw.length);
}

function iconSpan(svg) {
  const s = document.createElement("span");
  s.className = "row-icon";
  s.innerHTML = svg;
  return s;
}

// Built with DOM APIs and .value/.textContent assignments only — history
// values are user input and must never pass through innerHTML.
function entryNode(entry) {
  const root = document.createElement("div");
  root.className = "entry";
  root.dataset.id = entry.id;

  // Row 1 — site label ("where do I log in with this?") + delete
  const top = document.createElement("div");
  top.className = "entry-top";
  const site = document.createElement("input");
  site.type = "text";
  site.className = "site-input";
  site.placeholder = "Where is this for? e.g. Google";
  site.value = entry.site;
  site.setAttribute("aria-label", "Site or app name");
  site.dataset.field = "site";
  const del = document.createElement("button");
  del.type = "button";
  del.className = "icon-btn danger";
  del.title = "Remove entry";
  del.setAttribute("aria-label", "Remove entry");
  del.dataset.act = "delete";
  del.innerHTML = ICONS.trash;
  top.append(site, del);

  // Row 2 — website link (editable) + open in new tab
  const urlRow = document.createElement("div");
  urlRow.className = "entry-row";
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.className = "url-input";
  urlInput.placeholder = "Website link (e.g. google.com)";
  urlInput.value = entry.url;
  urlInput.setAttribute("aria-label", "Website link");
  urlInput.dataset.field = "url";
  const open = document.createElement("button");
  open.type = "button";
  open.className = "icon-btn open-link";
  open.title = "Open website";
  open.setAttribute("aria-label", "Open website");
  open.dataset.act = "open";
  open.innerHTML = ICONS.external;
  open.hidden = !entry.url;
  urlRow.append(iconSpan(ICONS.link), urlInput, open);

  // Row 3 — username (editable) + copy
  const userRow = document.createElement("div");
  userRow.className = "entry-row";
  const user = document.createElement("input");
  user.type = "text";
  user.className = "user-input";
  user.placeholder = "Add username";
  user.value = entry.username;
  user.setAttribute("aria-label", "Username");
  user.dataset.field = "username";
  const copyUser = document.createElement("button");
  copyUser.type = "button";
  copyUser.className = "icon-btn";
  copyUser.title = "Copy username";
  copyUser.setAttribute("aria-label", "Copy username");
  copyUser.dataset.act = "copy-username";
  copyUser.innerHTML = ICONS.copy;
  copyUser.hidden = !entry.username;
  userRow.append(iconSpan(ICONS.user), user, copyUser);

  // Row 4 — masked password + reveal + copy
  const pwRow = document.createElement("div");
  pwRow.className = "entry-row";
  const pw = document.createElement("span");
  pw.className = "pw-mask";
  pw.title = "Reveal with the eye button";
  pw.textContent = maskPassword(entry.password);
  const reveal = document.createElement("button");
  reveal.type = "button";
  reveal.className = "icon-btn";
  reveal.title = "Show / hide password";
  reveal.setAttribute("aria-label", "Show or hide password");
  reveal.dataset.act = "toggle";
  reveal.innerHTML = ICONS.eye;
  const copyPw = document.createElement("button");
  copyPw.type = "button";
  copyPw.className = "icon-btn";
  copyPw.title = "Copy password";
  copyPw.setAttribute("aria-label", "Copy password");
  copyPw.dataset.act = "copy-password";
  copyPw.innerHTML = ICONS.copy;
  pwRow.append(iconSpan(ICONS.lock), pw, reveal, copyPw);

  // Row 5 — saved date
  const date = document.createElement("div");
  date.className = "entry-date";
  date.textContent =
    "Saved " +
    new Date(entry.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  root.append(top, urlRow, userRow, pwRow, date);
  return root;
}

function renderHistory() {
  const list = state.history;
  ui.historyCount.textContent = list.length ? "(" + list.length + ")" : "";
  ui.historyBadge.textContent = list.length || "";
  ui.historyBadge.hidden = list.length === 0;
  ui.historyEmpty.hidden = list.length !== 0;
  ui.btnClearHistory.hidden = list.length === 0;
  ui.historyList.replaceChildren();
  for (const entry of list) {
    ui.historyList.appendChild(entryNode(entry));
  }
}

// ---------- actions ----------

async function onCopyPassword() {
  if (!state.password) return;
  const ok = await copyText(state.password);
  if (!ok) return toast("Copy failed — please try again");
  // Password only: the generated username is deliberately NOT attached.
  // Add or edit the username in the History tab whenever it's actually used.
  const detected = state.detected || {};
  await upsertHistoryEntry({
    password: state.password,
    site: detected.site,
    url: detected.url,
  });
  renderHistory();
  toast(
    state.detected
      ? "Copied — saved to History for " + state.detected.site
      : "Password copied — saved to History"
  );
}

function onCopyUsername() {
  if (!state.username) return;
  // Clipboard only — no history write. Copying the password is what saves
  // an entry; the username joins it only when you add that yourself.
  copyText(state.username).then((ok) =>
    toast(ok ? "Username copied" : "Copy failed — please try again")
  );
}

function onHistoryClick(event) {
  const btn = event.target.closest("[data-act]");
  if (!btn) return;
  const root = btn.closest(".entry");
  if (!root) return;
  const entry = findEntry(root.dataset.id);
  if (!entry) return;

  const act = btn.dataset.act;
  if (act === "delete") {
    state.history = state.history.filter((e) => e.id !== entry.id);
    persistHistory().then(renderHistory);
    toast("Entry removed");
  } else if (act === "toggle") {
    const showing = root.dataset.revealed === "1";
    root.dataset.revealed = showing ? "" : "1";
    root.querySelector(".pw-mask").textContent = showing
      ? maskPassword(entry.password)
      : entry.password;
  } else if (act === "copy-password") {
    copyText(entry.password).then((ok) =>
      toast(ok ? "Password copied" : "Copy failed")
    );
  } else if (act === "copy-username") {
    if (entry.username) {
      copyText(entry.username).then((ok) =>
        toast(ok ? "Username copied" : "Copy failed")
      );
    }
  } else if (act === "open") {
    openLink(entry.url);
  }
}

function onHistoryChange(event) {
  const input = event.target.closest("input[data-field]");
  if (!input) return;
  const root = input.closest(".entry");
  const entry = root && findEntry(root.dataset.id);
  if (!entry) return;

  const field = input.dataset.field;
  const value = input.value.trim();
  if (entry[field] === value) return;
  entry[field] = value;
  entry.updatedAt = Date.now();
  persistHistory();
  if (field === "username") {
    root.querySelector('[data-act="copy-username"]').hidden = !value;
  }
  if (field === "url") {
    root.querySelector('[data-act="open"]').hidden = !value;
  }
}

function onClearHistory() {
  if (!state.history.length) return;
  if (
    !confirm(
      "Delete all " + state.history.length + " saved passwords? This cannot be undone."
    )
  )
    return;
  state.history = [];
  persistHistory().then(renderHistory);
  toast("History cleared");
}

// ---------- website links ----------

// Accepts "google.com" or full URLs; only http(s) is allowed so a stored
// string like "javascript:..." can never execute when opened.
function normalizeUrl(raw) {
  if (!raw) return null;
  let s = raw.trim();
  if (!s) return null;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

function openLink(raw) {
  const url = normalizeUrl(raw);
  if (!url) return toast("Invalid website link");
  try {
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch {
    toast("Could not open link");
  }
}

// ---------- settings & tabs ----------

async function saveSettings() {
  await storageSet({ settings: state.settings });
}

function onModeClick(event) {
  const btn = event.target.closest(".seg-btn");
  if (!btn || !btn.dataset.mode) return;
  state.settings.mode = btn.dataset.mode;
  document
    .querySelectorAll(".seg-btn")
    .forEach((b) => b.classList.toggle("active", b === btn));
  saveSettings();
  newGeneration();
}

function onOptionToggle(event) {
  const input = event.target;
  const key = input.dataset.setting;
  state.settings[key] = input.checked;
  saveSettings();

  if (key === "withUsername") {
    ui.usernameRow.hidden = !input.checked;
    ui.btnCopyUsername.hidden = !input.checked;
    if (input.checked && !state.username) {
      state.username = generateUsername();
    }
    ui.usernameValue.textContent = state.username || "—";
  }
  if (key === "autoHide") {
    if (input.checked) hidePassword();
    else {
      clearTimeout(state.revealTimer);
      ui.pwText.classList.remove("pw-hidden");
      ui.pwOverlay.hidden = true;
    }
  }
  if (key === "excludeSimilar") {
    newGeneration();
  }
}

function switchTab(name) {
  const gen = name === "generate";
  ui.viewGenerate.hidden = !gen;
  ui.viewHistory.hidden = gen;
  ui.tabGenerate.classList.toggle("active", gen);
  ui.tabHistory.classList.toggle("active", !gen);
  if (gen) {
    if (state.settings.autoHide) hidePassword();
  } else {
    renderHistory();
  }
}

// ---------- toast ----------

let toastTimer = null;

function toast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 2200);
}

// ---------- init ----------

function collectUi() {
  ui = {
    pwText: $("pwText"),
    pwOverlay: $("pwOverlay"),
    meterBar: $("meterBar"),
    strengthText: $("strengthText"),
    entropyText: $("entropyText"),
    seg: $("modeSeg"),
    optUsername: $("optUsername"),
    optAutoHide: $("optAutoHide"),
    optExcludeSimilar: $("optExcludeSimilar"),
    usernameRow: $("usernameRow"),
    usernameValue: $("usernameValue"),
    btnNewUsername: $("btnNewUsername"),
    btnGenerate: $("btnGenerate"),
    btnCopyPassword: $("btnCopyPassword"),
    btnCopyUsername: $("btnCopyUsername"),
    detectedChip: $("detectedChip"),
    detectedSite: $("detectedSite"),
    btnDismissDetected: $("btnDismissDetected"),
    tabGenerate: $("tabGenerate"),
    tabHistory: $("tabHistory"),
    viewGenerate: $("viewGenerate"),
    viewHistory: $("viewHistory"),
    historyList: $("historyList"),
    historyEmpty: $("historyEmpty"),
    historyCount: $("historyCount"),
    historyBadge: $("historyBadge"),
    btnClearHistory: $("btnClearHistory"),
    toast: $("toast"),
  };
}

async function init() {
  collectUi();

  // Capture the open site up front so it's ready whenever the first copy
  // happens; the chip visibility follows immediately.
  state.detected = await getActiveTabSite();
  renderDetectedChip();

  const { settings, history } = await storageGet({
    settings: null,
    history: null,
  });
  if (settings && typeof settings === "object") {
    state.settings = { ...DEFAULT_SETTINGS, ...settings };
  }
  state.history = normalizeHistory(history);

  // Sync UI with loaded settings.
  ui.optUsername.checked = state.settings.withUsername;
  ui.optAutoHide.checked = state.settings.autoHide;
  ui.optExcludeSimilar.checked = state.settings.excludeSimilar;
  document
    .querySelectorAll(".seg-btn")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.mode === state.settings.mode)
    );
  ui.usernameRow.hidden = !state.settings.withUsername;
  ui.btnCopyUsername.hidden = !state.settings.withUsername;

  // Wire events.
  ui.tabGenerate.addEventListener("click", () => switchTab("generate"));
  ui.tabHistory.addEventListener("click", () => switchTab("history"));
  ui.seg.addEventListener("click", onModeClick);
  document
    .querySelectorAll("input[data-setting]")
    .forEach((i) => i.addEventListener("change", onOptionToggle));
  ui.btnGenerate.addEventListener("click", newGeneration);
  ui.btnNewUsername.addEventListener("click", () => {
    state.username = generateUsername();
    ui.usernameValue.textContent = state.username;
  });
  ui.btnCopyPassword.addEventListener("click", onCopyPassword);
  ui.btnCopyUsername.addEventListener("click", onCopyUsername);
  ui.btnDismissDetected.addEventListener("click", () => {
    state.detected = null;
    renderDetectedChip();
    toast("Site skipped — label it in History anytime");
  });
  ui.btnClearHistory.addEventListener("click", onClearHistory);
  ui.pwOverlay.addEventListener("click", revealPassword);
  ui.historyList.addEventListener("click", onHistoryClick);
  ui.historyList.addEventListener("change", onHistoryChange);

  newGeneration();
  renderHistory();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
