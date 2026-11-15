(() => {
  "use strict";

  const DATA = window.TRIBUTE;
  const CHAPTERS = DATA.chapters;
  const CHANNEL_URL = "https://www.youtube.com/@6laltv-y2n";
  const FIRST_YEAR = 1940;
  const LAST_YEAR = 2000;
  const FADE_MS = 1500;
  const VOLUME = 0.85;
  const FINAL_VOLUME = 0.6;
  const YT_ID = /^[\w-]{11}$/;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (id) => document.getElementById(id);
  const els = {
    track: $("track"), stage: $("stage"), ruler: $("ruler"), progress: $("ruler-progress"),
    prev: $("prev-btn"), next: $("next-btn"), sound: $("sound-btn"), soundLabel: $("sound-label"),
    lang: $("lang-btn"), intro: $("intro"), begin: $("begin-btn"), beginSilent: $("begin-silent-btn"),
    ytDock: $("yt-dock"), notes: $("notes"),
    galleryBtn: $("gallery-btn"), gallery: $("gallery"), galleryGrid: $("gallery-grid"),
    lightbox: $("lightbox"), lbImg: $("lb-img"), lbCaption: $("lb-caption"), lbLink: $("lb-link"),
    lbCredit: $("lb-credit"), lbPrev: $("lb-prev"), lbNext: $("lb-next")
  };
  const PHOTOS = DATA.photos;
  const anyDialogOpen = () => els.gallery.open || els.lightbox.open;

  const state = {
    index: 0,
    lang: "ar", // the site always opens in Arabic; English is one click away
    started: false,
    muted: false
  };
  if (!DATA.ui[state.lang]) state.lang = "en";

  const t = (key) => DATA.ui[state.lang][key] ?? key;
  const isRtl = () => state.lang === "ar";
  const yearPct = (y) => ((Math.min(Math.max(y, FIRST_YEAR), LAST_YEAR) - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR)) * 100;
  const num = (n) => (isRtl() ? String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]) : String(n));
  const lerp = (a, b, u) => a + (b - a) * u;
  const ytWatchUrl = (id) => "https://www.youtube.com/watch?v=" + encodeURIComponent(id);

  function svg(tag, attrs, parent) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------- Drawing: oud strings, pegs, rosettes, staff ----------
  (function drawOud() {
    const ring = (n, r, rot = 0) => Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + rot;
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
    const star = (g, n, skip, r, rot = 0) => {
      const p = ring(n, r, rot);
      let d = "";
      for (let i = 0, k = 0; i <= n; i++, k = (k + skip) % n) d += (i ? "L" : "M") + p[k][0].toFixed(2) + " " + p[k][1].toFixed(2);
      svg("path", { d }, g);
    };

    // Dark oud: gold filigree rosettes
    const eb = $("rose-eb-main");
    star(eb, 12, 5, 46);
    star(eb, 8, 3, 46, Math.PI / 8);
    svg("circle", { r: 30 }, eb);
    star(eb, 6, 2, 17);
    svg("circle", { r: 8 }, eb);
    ring(24, 40).forEach(([x, y]) => svg("circle", { class: "dot", cx: x.toFixed(2), cy: y.toFixed(2), r: 2.2 }, eb));
    ["rose-eb-l", "rose-eb-r"].forEach((id) => {
      const g = $(id);
      star(g, 8, 3, 17);
      svg("circle", { r: 6 }, g);
      ring(8, 12.5, Math.PI / 8).forEach(([x, y]) => svg("circle", { class: "dot", cx: x.toFixed(2), cy: y.toFixed(2), r: 1.4 }, g));
    });
    // Honey oud: geometric centre inside the calligraphy ring
    const hn = $("rose-hn");
    star(hn, 16, 7, 42);
    svg("circle", { r: 22 }, hn);
    star(hn, 8, 3, 20);

    // Six pegs on each side of the bent pegbox
    const pegs = $("oud-pegs");
    const edge = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
    for (let i = 0; i < 6; i++) {
      const u = 0.12 + i * 0.145;
      const [lx, ly] = edge([181, 200], [197, 58], u);
      svg("path", { class: "oud-peg", d: `M${lx} ${ly} L${lx - 16} ${ly - 3} l-8 -4 a3.5 3.5 0 0 0 0 8 l8 -4` }, pegs);
      const [rx, ry] = edge([220, 200], [227, 54], u);
      svg("path", { class: "oud-peg", d: `M${rx} ${ry} L${rx + 16} ${ry - 3} l8 -4 a3.5 3.5 0 0 1 0 8 l-8 -4` }, pegs);
    }

    // Eleven strings: five double courses and a single bass string
    const strings = $("oud-strings");
    const centres = [0.06, 0.25, 0.44, 0.63, 0.82];
    const us = centres.flatMap((c) => [c - 0.018, c + 0.018]).concat(0.97);
    us.forEach((u) => svg("line", { class: "oud-string", x1: lerp(184, 216, u), y1: 202, x2: lerp(164, 236, u), y2: 842 }, strings));

    // Five-line staff, a gentle wave twice as wide as the screen so it can loop
    const staff = $("staff-lines");
    for (let line = 0; line < 5; line++) {
      let d = "";
      for (let x = 0; x <= 3200; x += 20) {
        const y = 40 + line * 14 + Math.sin((x / 800) * Math.PI * 2) * 26;
        d += (x ? "L" : "M") + x + " " + y.toFixed(1);
      }
      svg("path", { d }, staff);
    }
  })();

  // ---------- Notes rising from the soundhole while music plays ----------
  const notes = (() => {
    let timer = null;
    function spawn() {
      if (document.hidden || !document.body.classList.contains("playing")) return;
      const hole = document.querySelector(".look-" + (document.body.dataset.oud || "ebony") + " .soundhole");
      const r = hole.getBoundingClientRect();
      if (!r.width) return;
      const kind = 1 + Math.floor(Math.random() * 3);
      const n = svg("svg", { class: "note" + (kind === 3 ? " wide" : "") });
      svg("use", { href: "#note-" + kind }, n);
      const x = r.left + r.width / 2 + (Math.random() - 0.5) * r.width * 0.6;
      const y = r.top + r.height / 2;
      n.style.left = x + "px";
      n.style.top = y + "px";
      const final = document.body.dataset.mood === "farewell";
      n.style.setProperty("--dx", ((Math.random() - 0.65) * 340 * (isRtl() ? -1 : 1)).toFixed(0) + "px");
      n.style.setProperty("--dy", (-(r.top + 120) * (0.55 + Math.random() * 0.45)).toFixed(0) + "px");
      n.style.setProperty("--rot", ((Math.random() - 0.5) * 70).toFixed(0) + "deg");
      n.style.setProperty("--dur", (final ? 9 + Math.random() * 3 : 5 + Math.random() * 3).toFixed(1) + "s");
      n.addEventListener("animationend", () => n.remove());
      els.notes.appendChild(n);
    }
    function tick() {
      spawn();
      const final = document.body.dataset.mood === "farewell";
      timer = setTimeout(tick, (final ? 1800 : 520) + Math.random() * 500);
    }
    return { start() { if (!timer && !reducedMotion) tick(); } };
  })();

  // ---------- Audio: local files (cross-faded) or the official channel via a visible YouTube player ----------
  const audio = (() => {
    const players = [new Audio(), new Audio()];
    players.forEach((a) => { a.preload = "auto"; a.volume = 0; });
    let token = 0;
    let yt = null;
    let ytReady = null;
    let ytLoop = { start: 0, loop: true };
    const ramps = new Map();

    function ramp(key, get, set, to, ms) {
      cancelAnimationFrame(ramps.get(key));
      return new Promise((resolve) => {
        const from = get();
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / ms);
          set(from + (to - from) * p);
          if (p < 1) ramps.set(key, requestAnimationFrame(step)); else resolve();
        };
        ramps.set(key, requestAnimationFrame(step));
      });
    }
    const setPlaying = (on) => document.body.classList.toggle("playing", on);

    function loadYouTube() {
      if (ytReady) return ytReady;
      ytReady = new Promise((resolve, reject) => {
        window.onYouTubeIframeAPIReady = () => {
          yt = new window.YT.Player("yt-player", {
            host: "https://www.youtube-nocookie.com",
            width: 320, height: 180,
            playerVars: { controls: 1, playsinline: 1, rel: 0, disablekb: 1 },
            events: {
              onReady: () => resolve(yt),
              onStateChange: (e) => {
                if (e.data === 1) setPlaying(true);
                else if (e.data === 2) setPlaying(false);
                else if (e.data === 0) {
                  if (ytLoop.loop) yt.seekTo(ytLoop.start, true); else setPlaying(false);
                }
              }
            }
          });
        };
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.onerror = () => reject(new Error("YouTube unavailable"));
        document.head.appendChild(s);
      });
      return ytReady;
    }

    function fadeOutAll() {
      const jobs = players.map((a, i) => (a.paused ? Promise.resolve()
        : ramp("a" + i, () => a.volume, (v) => { a.volume = v; }, 0, FADE_MS).then(() => a.pause())));
      if (yt && yt.getPlayerState && yt.getPlayerState() === 1) {
        jobs.push(ramp("yt", () => yt.getVolume() / 100, (v) => yt.setVolume(v * 100), 0, FADE_MS).then(() => yt.pauseVideo()));
      }
      return Promise.all(jobs);
    }

    async function play(chapter, onUnavailable) {
      const my = ++token;
      const tr = chapter.track || {};
      const target = chapter.final ? FINAL_VOLUME : VOLUME;
      const loop = !chapter.final; // the last song plays once, then silence
      const out = fadeOutAll();

      if (tr.file) {
        els.ytDock.classList.remove("on");
        const a = players.find((p) => p.paused) || players[0];
        const idx = players.indexOf(a);
        a.loop = loop;
        a.onplaying = () => { if (my === token) setPlaying(true); };
        a.onended = () => { if (my === token) setPlaying(false); };
        a.onerror = () => { if (my === token) onUnavailable(); };
        if (!a.src.endsWith(tr.file)) a.src = tr.file;
        try { a.currentTime = tr.start || 0; } catch { /* metadata not loaded yet */ }
        a.volume = 0;
        try {
          await a.play();
          if (my === token) ramp("a" + idx, () => a.volume, (v) => { a.volume = v; }, target, FADE_MS);
        } catch { if (my === token) onUnavailable(); }
        return;
      }

      if (tr.youtube && YT_ID.test(tr.youtube)) {
        try {
          const p = await loadYouTube();
          await out;
          if (my !== token) return;
          els.ytDock.classList.add("on");
          ytLoop = { start: tr.start || 0, loop };
          p.setVolume(0);
          p.loadVideoById({ videoId: tr.youtube, startSeconds: tr.start || 0 });
          ramp("yt", () => 0, (v) => p.setVolume(v * 100), target, FADE_MS);
        } catch { if (my === token) onUnavailable(); }
        return;
      }

      await out;
      if (my === token) { setPlaying(false); els.ytDock.classList.remove("on"); }
    }

    function stop() { token++; setPlaying(false); return fadeOutAll(); }

    // Warm up the player early so the first song starts quickly after "Begin"
    if (CHAPTERS.some((c) => c.track && c.track.youtube)) loadYouTube().catch(() => {});

    return { play, stop };
  })();

  // ---------- Rendering ----------
  function renderStatic() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = isRtl() ? "rtl" : "ltr";
    document.title = t("siteTitle");
    document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = t(n.dataset.i18n); });
    els.prev.setAttribute("aria-label", t("prev"));
    els.next.setAttribute("aria-label", t("next"));
    renderSound();
  }

  function renderSound() {
    const on = !state.muted;
    els.sound.setAttribute("aria-pressed", String(on));
    els.soundLabel.textContent = on ? t("unmuted") : t("muted");
    els.sound.setAttribute("aria-label", on ? t("unmuted") : t("muted"));
  }

  // ---------- Photos ----------
  // Sets an <img> to a photo; YouTube serves a 120px placeholder when there is no HD thumbnail.
  function setPhoto(img, key, size = "maxresdefault") {
    const ph = PHOTOS[key];
    img.decoding = "async";
    img.alt = ph[state.lang];
    if (ph.yt && YT_ID.test(ph.yt)) {
      img.src = `https://i.ytimg.com/vi/${ph.yt}/${size}.jpg`;
      img.onload = () => { if (img.naturalWidth <= 120) { img.onload = null; img.src = `https://i.ytimg.com/vi/${ph.yt}/hqdefault.jpg`; } };
    } else {
      img.onload = null;
      img.src = ph.src;
    }
    return img;
  }

  function photoFor(ch) {
    const key = ch.photo;
    if (!key || !PHOTOS[key]) return null;
    const ph = PHOTOS[key];
    const media = el("div", "media");
    const vinyl = el("div", "vinyl");
    vinyl.appendChild(el("div", "vinyl-disc"));
    media.appendChild(vinyl);

    const fig = el("figure", "sleeve" + (ph.bw ? " bw" : ""));
    if (ph.pos) fig.style.setProperty("--pos", ph.pos);
    fig.appendChild(setPhoto(el("img"), key));
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", ph[state.lang]);
    const open = () => lightbox.open(chapterSet(ch), 0);
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    media.appendChild(fig);
    if (ph.credit) media.appendChild(el("p", "credit", ph.credit));
    return media;
  }

  const chapterSet = (ch) => [ch.photo, ...(ch.more || [])].filter((k) => PHOTOS[k]);

  function moreStrip(ch) {
    const set = chapterSet(ch);
    if (set.length < 2) return null;
    const wrap = el("div", "more");
    wrap.appendChild(el("span", "more-label", t("morePhotos")));
    set.slice(1).forEach((key, i) => {
      const b = el("button", "thumb" + (PHOTOS[key].bw ? " bw" : ""));
      b.type = "button";
      b.setAttribute("aria-label", PHOTOS[key][state.lang]);
      b.appendChild(setPhoto(el("img"), key, "mqdefault"));
      b.addEventListener("click", () => lightbox.open(set, i + 1));
      wrap.appendChild(b);
    });
    return wrap;
  }

  const lightbox = (() => {
    let set = [], idx = 0;
    function show() {
      const key = set[idx];
      const ph = PHOTOS[key];
      els.lightbox.classList.toggle("bw", !!ph.bw);
      setPhoto(els.lbImg, key);
      els.lbCaption.textContent = ph[state.lang];
      els.lbCredit.textContent = ph.credit || "";
      els.lbLink.hidden = !ph.yt;
      if (ph.yt) { els.lbLink.href = ytWatchUrl(ph.yt); els.lbLink.textContent = t("watch") + " ↗"; }
      els.lbPrev.hidden = els.lbNext.hidden = set.length < 2;
    }
    function step(d) { idx = (idx + d + set.length) % set.length; show(); }
    els.lbPrev.addEventListener("click", () => step(-1));
    els.lbNext.addEventListener("click", () => step(1));
    els.lightbox.addEventListener("keydown", (e) => {
      const fwd = isRtl() ? "ArrowLeft" : "ArrowRight";
      const back = isRtl() ? "ArrowRight" : "ArrowLeft";
      if (e.key === fwd) { e.preventDefault(); step(1); }
      else if (e.key === back) { e.preventDefault(); step(-1); }
    });
    return {
      open(s, i) {
        set = s; idx = i;
        els.lbPrev.setAttribute("aria-label", t("prevPhoto"));
        els.lbNext.setAttribute("aria-label", t("nextPhoto"));
        show();
        if (!els.lightbox.open) els.lightbox.showModal();
      }
    };
  })();

  function renderGallery() {
    els.galleryGrid.replaceChildren();
    const all = Object.keys(PHOTOS);
    all.forEach((key, i) => {
      const ph = PHOTOS[key];
      const b = el("button", "g-item" + (ph.bw ? " bw" : ""));
      b.type = "button";
      const frame = el("span", "frame");
      frame.appendChild(setPhoto(el("img"), key, "hqdefault"));
      b.append(frame, el("span", "cap", ph[state.lang]));
      b.addEventListener("click", () => lightbox.open(all, i));
      els.galleryGrid.appendChild(b);
    });
  }

  els.galleryBtn.addEventListener("click", () => { renderGallery(); els.gallery.showModal(); });
  document.querySelectorAll("dialog [data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  function songChip(ch, c) {
    const id = ch.track && ch.track.youtube;
    const chip = el(id ? "a" : "div", "song");
    if (id) {
      chip.href = ytWatchUrl(id);
      chip.target = "_blank";
      chip.rel = "noopener noreferrer";
    }
    const icon = el("span", "song-icon");
    icon.setAttribute("aria-hidden", "true");
    const s = svg("svg", { viewBox: "0 0 24 24" }, icon);
    svg("path", { d: "M8 5v14l11-7z" }, s);
    chip.appendChild(icon);
    const text = el("span");
    text.appendChild(el("small", "song-kind", t("nowPlaying")));
    const name = el("strong", null, c.song);
    if (id) name.appendChild(el("span", "ext", "· " + t("watch") + " ↗"));
    text.appendChild(name);
    chip.appendChild(text);
    return chip;
  }

  function renderSlides() {
    els.track.replaceChildren();
    CHAPTERS.forEach((ch, i) => {
      const c = ch[state.lang];
      const slide = el("section", "slide" + (ch.final ? " final" : ""));
      slide.id = "ch-" + ch.id;
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", t("chapterOf").replace("{n}", num(i + 1)).replace("{total}", num(CHAPTERS.length)));

      const ghost = el("div", "year-ghost", String(ch.year));
      ghost.setAttribute("aria-hidden", "true");
      slide.appendChild(ghost);

      const copy = el("div", "copy");
      copy.appendChild(el("p", "era", c.era));
      copy.appendChild(el("p", "year-label", c.yearLabel));
      copy.appendChild(el("h2", "title", c.title));
      copy.appendChild(el("p", "body", c.body));
      copy.appendChild(songChip(ch, c));
      const more = moreStrip(ch);
      if (more) copy.appendChild(more);

      if (ch.final) {
        const end = el("div", "ending");
        end.appendChild(el("p", "coda", c.coda));
        const btn = el("button", "restart", t("restart"));
        btn.type = "button";
        btn.addEventListener("click", () => go(0));
        end.appendChild(btn);
        const fine = el("p", "fine");
        const link = el("a", null, t("channelCredit"));
        link.href = CHANNEL_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        fine.append(link, el("br"), document.createTextNode(t("sources")));
        end.appendChild(fine);
        copy.appendChild(end);
      }
      slide.appendChild(copy);

      const media = photoFor(ch);
      if (media) slide.appendChild(media);
      els.track.appendChild(slide);
    });
  }

  function renderRuler() {
    els.ruler.querySelectorAll(".tick, .tick-label, .marker").forEach((n) => n.remove());
    for (let y = FIRST_YEAR; y <= LAST_YEAR; y += 10) {
      const tick = el("span", "tick");
      tick.style.insetInlineStart = yearPct(y) + "%";
      const label = el("span", "tick-label", num(y));
      label.style.insetInlineStart = yearPct(y) + "%";
      els.ruler.append(tick, label);
    }
    CHAPTERS.forEach((ch, i) => {
      const m = el("button", "marker");
      m.type = "button";
      m.style.insetInlineStart = yearPct(ch.year) + "%";
      m.setAttribute("aria-label", ch[state.lang].yearLabel + " — " + ch[state.lang].title);
      m.appendChild(el("span", "marker-tip", ch[state.lang].yearLabel));
      m.addEventListener("click", () => go(i));
      els.ruler.appendChild(m);
    });
  }

  function markUnavailable(i) {
    const kind = els.track.children[i]?.querySelector(".song-kind");
    if (kind) kind.textContent = t("noTrack");
  }

  // ---------- Navigation ----------
  function layout() {
    const i = state.index;
    els.track.style.transform = `translateX(${(isRtl() ? 1 : -1) * i * 100}vw)`;
    [...els.track.children].forEach((s, k) => {
      s.classList.toggle("is-active", k === i);
      s.setAttribute("aria-hidden", String(k !== i));
      s.inert = k !== i;
      s.querySelector(".year-ghost").style.setProperty("--parallax", reducedMotion ? 0 : (k - i) * (isRtl() ? -1 : 1));
    });
    els.ruler.querySelectorAll(".marker").forEach((m, k) => {
      m.classList.toggle("current", k === i);
      m.classList.toggle("passed", k < i);
      if (k === i) m.setAttribute("aria-current", "step"); else m.removeAttribute("aria-current");
    });
    els.progress.style.width = yearPct(CHAPTERS[i].year) + "%";
    els.prev.disabled = i === 0;
    els.next.disabled = i === CHAPTERS.length - 1;
    document.body.dataset.mood = CHAPTERS[i].mood;
    document.body.dataset.oud = CHAPTERS[i].oud || "ebony";
  }

  function playCurrent() {
    const i = state.index;
    if (state.started && !state.muted) audio.play(CHAPTERS[i], () => markUnavailable(i));
  }

  function go(i) {
    const target = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    if (target === state.index) return;
    state.index = target;
    layout();
    history.replaceState(null, "", "#" + CHAPTERS[target].id);
    playCurrent();
  }
  const next = () => go(state.index + 1);
  const prev = () => go(state.index - 1);

  els.next.addEventListener("click", next);
  els.prev.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    if (!state.started || anyDialogOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
    const forward = isRtl() ? "ArrowLeft" : "ArrowRight";
    const back = isRtl() ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward || e.key === "PageDown" || (e.key === " " && e.target === document.body)) { e.preventDefault(); next(); }
    else if (e.key === back || e.key === "PageUp") { e.preventDefault(); prev(); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(CHAPTERS.length - 1); }
  });

  let wheelAcc = 0, wheelLock = false, wheelReset;
  window.addEventListener("wheel", (e) => {
    if (!state.started || anyDialogOpen()) return;
    e.preventDefault();
    if (wheelLock) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX * (isRtl() ? -1 : 1) : e.deltaY;
    wheelAcc += d;
    clearTimeout(wheelReset);
    wheelReset = setTimeout(() => { wheelAcc = 0; }, 200);
    if (Math.abs(wheelAcc) > 50) {
      if (wheelAcc > 0) next(); else prev();
      wheelAcc = 0;
      wheelLock = true;
      setTimeout(() => { wheelLock = false; }, 1000);
    }
  }, { passive: false });

  let touch = null;
  els.stage.addEventListener("touchstart", (e) => { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  els.stage.addEventListener("touchend", (e) => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x;
    const dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (isRtl() ? dx > 0 : dx < 0) next(); else prev();
  });

  // ---------- Controls ----------
  els.sound.addEventListener("click", () => {
    state.muted = !state.muted;
    renderSound();
    if (state.muted) audio.stop(); else playCurrent();
  });

  els.lang.addEventListener("click", () => {
    state.lang = isRtl() ? "en" : "ar";
    els.track.style.transition = "none"; // don't sweep across every slide
    renderStatic(); renderSlides(); renderRuler(); layout();
    void els.track.offsetWidth;
    els.track.style.transition = "";
  });

  document.querySelector('[data-action="restart"]').addEventListener("click", (e) => {
    e.preventDefault();
    if (state.started) go(0);
  });

  function start(withSound) {
    state.started = true;
    state.muted = !withSound;
    renderSound();
    els.intro.classList.add("gone");
    els.intro.setAttribute("aria-hidden", "true");
    els.intro.inert = true;
    els.next.focus({ preventScroll: true });
    notes.start();
    playCurrent();
  }
  els.begin.addEventListener("click", () => start(true));
  els.beginSilent.addEventListener("click", () => start(false));

  // ---------- Boot ----------
  const fromHash = CHAPTERS.findIndex((c) => "#" + c.id === location.hash);
  state.index = fromHash >= 0 ? fromHash : 0;
  renderStatic(); renderSlides(); renderRuler(); layout();
})();
