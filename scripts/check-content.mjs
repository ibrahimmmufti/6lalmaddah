// Fails if the English and Arabic text drift apart, or a track entry is malformed.
// Run: node scripts/check-content.mjs
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ctx = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, "content.js"), "utf8"), ctx);
const { ui, chapters, photos, albums = [], labels = {}, sets = [] } = ctx.window.TRIBUTE;
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
// Song credits and SoundCloud ids
for (const ch of chapters) {
  const sc = ch.track?.soundcloud;
  if (sc && !/^[\w-]{1,80}$/.test(sc)) errors.push(`${ch.id}: track.soundcloud must be the part after soundcloud.com/6lalchannel/`);
  if (ch.lyricsUrl && !/^https:\/\/(fnanen\.com|kalemat\.app)\//.test(ch.lyricsUrl)) errors.push(`${ch.id}: lyricsUrl must point to fnanen.com or kalemat.app`);
  for (const [k, v] of Object.entries(ch.credits || {})) {
    if (!["lyrics", "music", "note"].includes(k)) errors.push(`${ch.id}: unknown credits field "${k}"`);
    if (!v?.en?.trim() || !v?.ar?.trim()) errors.push(`${ch.id}: credits.${k} needs en and ar`);
  }
}

// Albums: a decade (before 2001) or an exact year, a known label, known tags, both languages
const TAGS = ["live", "national", "renewed", "rerelease", "posthumous"];
const chapterIds = new Set(chapters.map((c) => c.id));
albums.forEach((a, i) => {
  const name = `album ${i + 1} (${a.ar})`;
  if (!!a.decade === !!a.year) errors.push(`${name}: needs exactly one of decade or year`);
  if (a.decade && ![1960, 1970, 1980, 1990].includes(a.decade)) errors.push(`${name}: decade must be 1960, 1970, 1980 or 1990`);
  if (a.year && (a.year < 2001 || a.year > 2030)) errors.push(`${name}: exact years are only used for posthumous releases`);
  if (!labels[a.label]?.en || !labels[a.label]?.ar) errors.push(`${name}: unknown label "${a.label}"`);
  if (!a.en?.trim() || !a.ar?.trim()) errors.push(`${name}: needs en and ar titles`);
  for (const tg of a.tags || []) if (!TAGS.includes(tg)) errors.push(`${name}: unknown tag "${tg}"`);
  if (a.year && !(a.tags || []).includes("posthumous")) errors.push(`${name}: releases after 2000 must be tagged posthumous`);
  if (a.chapter && !chapterIds.has(a.chapter)) errors.push(`${name}: unknown chapter "${a.chapter}"`);
  if (a.note && (!a.note.en?.trim() || !a.note.ar?.trim())) errors.push(`${name}: note needs en and ar`);
});
// Official channel playlists: valid playlist and video ids, known kind, no empty or duplicate songs
sets.forEach((st) => {
  if (!/^PL[\w-]{10,40}$/.test(st.playlist)) errors.push(`set "${st.title}": bad playlist id`);
  if (!["concert", "session", "series"].includes(st.kind)) errors.push(`set "${st.title}": unknown kind "${st.kind}"`);
  if (!st.tracks?.length) errors.push(`set "${st.title}": no tracks`);
  const seen = new Set();
  for (const [v, name] of st.tracks || []) {
    if (!/^[\w-]{11}$/.test(v)) errors.push(`set "${st.title}": bad video id ${v}`);
    if (!String(name).trim()) errors.push(`set "${st.title}": empty song title`);
    if (seen.has(v)) errors.push(`set "${st.title}": video ${v} listed twice`);
    seen.add(v);
  }
});
for (const d of [1960, 1970, 1980, 1990]) if (!ui.en["decade" + d]) errors.push(`missing UI string decade${d}`);

// Every data-i18n key in the page and every t("key") in app.js must exist in the UI strings
const html = readFileSync(path.join(root, "index.html"), "utf8");
const app = readFileSync(path.join(root, "app.js"), "utf8");
const used = new Set([...html.matchAll(/data-i18n="([\w]+)"/g), ...app.matchAll(/\bt\("([\w]+)"\)/g)].map((m) => m[1]));
for (const k of used) if (!(k in ui.en)) errors.push(`UI string "${k}" is used but missing from content.js`);

if (!chapters.at(-1)?.final) errors.push("the last chapter must be marked final: true");

if (errors.length) { console.error("✗ content check failed\n- " + errors.join("\n- ")); process.exit(1); }
console.log(`✓ content ok — ${chapters.length} chapters, ${albums.length} albums, ${sets.length} playlists, ${Object.keys(ui.en).length} UI strings in en + ar`);
