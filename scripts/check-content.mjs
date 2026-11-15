// Fails if the English and Arabic text drift apart, or a track entry is malformed.
// Run: node scripts/check-content.mjs
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ctx = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, "content.js"), "utf8"), ctx);
const { ui, chapters, photos } = ctx.window.TRIBUTE;
const errors = [];
const keys = (o) => Object.keys(o).sort().join(",");

if (keys(ui.en) !== keys(ui.ar)) errors.push(`ui keys differ:\n  en: ${keys(ui.en)}\n  ar: ${keys(ui.ar)}`);
for (const [lang, strings] of Object.entries(ui))
  for (const [k, v] of Object.entries(strings)) if (!String(v).trim()) errors.push(`ui.${lang}.${k} is empty`);

const ids = new Set();
let lastYear = -Infinity;
for (const ch of chapters) {
  if (ids.has(ch.id)) errors.push(`duplicate chapter id ${ch.id}`);
  ids.add(ch.id);
  if (ch.year < lastYear) errors.push(`${ch.id}: chapters must be in year order`);
  lastYear = ch.year;
  if (keys(ch.en) !== keys(ch.ar)) errors.push(`${ch.id}: en/ar fields differ (${keys(ch.en)} vs ${keys(ch.ar)})`);
  for (const lang of ["en", "ar"])
    for (const [k, v] of Object.entries(ch[lang])) if (!String(v).trim()) errors.push(`${ch.id}.${lang}.${k} is empty`);
  const tr = ch.track || {};
  if (tr.file && tr.youtube) errors.push(`${ch.id}: set track.file OR track.youtube, not both`);
  if (tr.youtube && !/^[\w-]{11}$/.test(tr.youtube)) errors.push(`${ch.id}: track.youtube must be an 11-character video ID, not a URL`);
  if (tr.file && (/^[a-z]+:/i.test(tr.file) || tr.file.includes(".."))) errors.push(`${ch.id}: track.file must be a local path inside the site (e.g. audio/x.mp3)`);
  if (tr.file && !existsSync(path.join(root, tr.file))) errors.push(`${ch.id}: ${tr.file} not found`);
  for (const key of [ch.photo, ...(ch.more || [])]) if (key && !photos[key]) errors.push(`${ch.id}: unknown photo "${key}"`);
  if (!["ebony", "honey"].includes(ch.oud)) errors.push(`${ch.id}: oud must be "ebony" or "honey"`);
}
for (const [key, ph] of Object.entries(photos)) {
  if (!!ph.yt === !!ph.src) errors.push(`photo ${key}: needs exactly one of yt or src`);
  if (ph.yt && !/^[\w-]{11}$/.test(ph.yt)) errors.push(`photo ${key}: yt must be an 11-character video ID`);
  if (ph.src && !existsSync(path.join(root, ph.src))) errors.push(`photo ${key}: ${ph.src} not found`);
  if (ph.src && !ph.credit) errors.push(`photo ${key}: local photos need a credit line`);
  if (!ph.en?.trim() || !ph.ar?.trim()) errors.push(`photo ${key}: needs an en and ar caption`);
}
if (!chapters.at(-1)?.final) errors.push("the last chapter must be marked final: true");

if (errors.length) { console.error("✗ content check failed\n- " + errors.join("\n- ")); process.exit(1); }
console.log(`✓ content ok — ${chapters.length} chapters, ${Object.keys(ui.en).length} UI strings in en + ar`);
