(() => {
  "use strict";

  const DATA = window.TRIBUTE;
  const CHAPTERS = DATA.chapters;
  const CHANNEL_URL = "https://www.youtube.com/@6laltv-y2n";
  const SOUNDCLOUD_URL = "https://soundcloud.com/6lalchannel/";
  const SC_ID = /^[\w-]{1,80}$/;
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
    lbCredit: $("lb-credit"), lbPrev: $("lb-prev"), lbNext: $("lb-next"),
    tourBtn: $("tour-btn"), tourLabel: $("tour-label"), shareBtn: $("share-btn"),
    toast: $("toast"), counter: $("counter"), dust: $("dust"),
    sweep: $("sweep"), songs: $("songs"), songList: $("song-list"), fs: $("fs-btn"),
    musicBtn: $("music-btn"), tabSongs: $("tab-songs"), tabAlbums: $("tab-albums"),
    panelSongs: $("panel-songs"), panelAlbums: $("panel-albums"), albumsIntro: $("albums-intro"),
    chips: $("decade-chips"), albumGroups: $("album-groups"),
    tabSets: $("tab-sets"), panelSets: $("panel-sets"), setsIntro: $("sets-intro"), setGrid: $("set-grid")
  };
  const TOUR_MS = 32000; // how long auto-play stays on each chapter
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const PHOTOS = DATA.photos;
  const anyDialogOpen = () => !!document.querySelector("dialog[open]");

  const state = {
    index: 0,
    lang: "ar", // the site always opens in Arabic; English is one click away
    started: false,
    muted: false,
    oudMode: false
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
    function spawn(force) {
      if (document.hidden || (!force && !document.body.classList.contains("playing"))) return;
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
    return { start() { if (!timer && !reducedMotion) tick(); }, burst() { if (!reducedMotion) spawn(true); } };
  })();

  // ---------- Gold dust drifting up; in the farewell it slows into a field of stars ----------
  (function dust() {
    const c = els.dust;
    const ctx = c.getContext && c.getContext("2d");
    if (!ctx || reducedMotion) { c.hidden = true; return; }
    let w = 0, h = 0, dpr = 1, parts = [], shooting = null, nextShoot = 0;
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      parts = Array.from({ length: n }, () => make(Math.random() * h));
    }
    function make(y) {
      return { x: Math.random() * w, y, r: 0.5 + Math.random() * 1.6, vy: 0.08 + Math.random() * 0.3,
        ph: Math.random() * Math.PI * 2, sw: 0.2 + Math.random() * 0.5, tw: 0.6 + Math.random() * 1.6 };
    }
    let last = performance.now();
    function frame(now) {
      const dt = Math.min(50, now - last) / 16.7;
      last = now;
      const final = document.body.dataset.mood === "farewell";
      const speed = final ? 0.12 : document.body.classList.contains("playing") ? 2.2 : 1;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy * speed * dt;
        p.ph += 0.012 * p.tw * dt;
        p.x += Math.sin(p.ph) * p.sw * 0.3 * dt * (final ? 0.2 : 1);
        if (p.y < -6) Object.assign(p, make(h + 6));
        const tw = 0.45 + 0.55 * Math.sin(p.ph * 2.3) ** 2;
        ctx.globalAlpha = (final ? 0.9 : 0.55) * tw;
        ctx.fillStyle = final ? "#f6eedc" : "#e2bd72";
        ctx.beginPath();
        ctx.arc(p.x, p.y, final ? p.r * 0.8 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // A rare shooting star over the farewell
      if (final && !shooting && now > nextShoot) {
        const fromRight = Math.random() < 0.5;
        shooting = { x: fromRight ? w * (0.6 + Math.random() * 0.4) : w * Math.random() * 0.4, y: h * Math.random() * 0.3,
          vx: (fromRight ? -1 : 1) * (7 + Math.random() * 4), vy: 2.5 + Math.random() * 2, life: 1 };
      }
      if (shooting) {
        const s = shooting;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
        grad.addColorStop(0, "rgba(255,246,225," + s.life + ")");
        grad.addColorStop(1, "rgba(255,246,225,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12); ctx.stroke();
        s.x += s.vx * dt; s.y += s.vy * dt; s.life -= 0.014 * dt;
        if (s.life <= 0) { shooting = null; nextShoot = now + 9000 + Math.random() * 8000; }
      }
      requestAnimationFrame(frame);
    }
    addEventListener("resize", resize);
    resize();
    nextShoot = performance.now() + 5000;
    requestAnimationFrame(frame);
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
    els.fs.setAttribute("aria-label", t("fullscreen"));
    els.fs.title = t("fullscreen");
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
    if (finePointer && !reducedMotion) {
      fig.addEventListener("pointermove", (e) => {
        const r = fig.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        fig.style.setProperty("--rx", (-y * 12).toFixed(2) + "deg");
        fig.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
        fig.style.setProperty("--gx", ((x + 0.5) * 100).toFixed(1) + "%");
        fig.style.setProperty("--gy", ((y + 0.5) * 100).toFixed(1) + "%");
        fig.classList.add("tilting");
      });
      fig.addEventListener("pointerleave", () => {
        fig.classList.remove("tilting");
        ["--rx", "--ry"].forEach((k) => fig.style.setProperty(k, "0deg"));
      });
    }
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
      const yl = el("p", "year-label", c.yearLabel);
      const age = ch.year - FIRST_YEAR;
      if (age > 0) yl.appendChild(el("span", "age", t("age").replace("{n}", num(age))));
      copy.appendChild(yl);
      const h = el("h2", "title");
      c.title.split(" ").forEach((word, k) => {
        if (k) h.appendChild(document.createTextNode(" "));
        const w = el("span", "w", word);
        w.style.setProperty("--i", k);
        h.appendChild(w);
      });
      copy.appendChild(h);
      copy.appendChild(el("p", "body", c.body));
      copy.appendChild(songChip(ch, c));
      const more = moreStrip(ch);
      if (more) copy.appendChild(more);

      if (ch.final) {
        const end = el("div", "ending");
        end.appendChild(el("p", "coda", c.coda));
        const vigil = el("div", "vigil");
        vigil.appendChild(el("p", "rip", t("lifespan")));
        end.appendChild(vigil);
        const list = el("button", "songs-btn", "♪ " + t("songsList"));
        list.type = "button";
        list.addEventListener("click", () => openMusic("songs"));
        end.appendChild(list);
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
      const tip = el("span", "marker-tip");
      const pct = yearPct(ch.year);
      if (pct < 12) tip.classList.add("edge-start"); else if (pct > 88) tip.classList.add("edge-end");
      if (ch.photo && PHOTOS[ch.photo]) {
        const img = setPhoto(el("img"), ch.photo, "mqdefault");
        img.alt = "";
        img.loading = "lazy";
        if (PHOTOS[ch.photo].bw) img.className = "bw";
        tip.appendChild(img);
      }
      tip.append(el("span", "tip-year", ch[state.lang].yearLabel), el("span", "tip-title", ch[state.lang].title));
      m.appendChild(tip);
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
    els.counter.textContent = num(String(i + 1).padStart(2, "0")) + " / " + num(String(CHAPTERS.length).padStart(2, "0"));
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
    const fromIndex = state.index;
    const fromYear = CHAPTERS[fromIndex].year;
    state.index = target;
    layout();
    countYear(fromYear, CHAPTERS[target].year);
    // A tiny tap on phones that support it, so each chapter change is felt
    if (!reducedMotion && !finePointer && navigator.vibrate) navigator.vibrate(8);
    if (!reducedMotion) {
      els.sweep.className = "sweep";
      void els.sweep.offsetWidth;
      els.sweep.classList.add(target > fromIndex ? "fwd" : "back");
    }
    history.replaceState(null, "", "#" + CHAPTERS[target].id);
    playCurrent();
    tour.schedule();
  }

  // The big outlined year rolls from the last chapter's year to this one
  let yearAnim = 0;
  function countYear(from, to) {
    const ghost = els.track.children[state.index]?.querySelector(".year-ghost");
    cancelAnimationFrame(yearAnim);
    if (!ghost || reducedMotion || from === to) return;
    const t0 = performance.now(), ms = 1300;
    const stepY = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      ghost.textContent = String(Math.round(from + (to - from) * e));
      if (p < 1) yearAnim = requestAnimationFrame(stepY);
    };
    yearAnim = requestAnimationFrame(stepY);
  }

  // ---------- Auto-play: moves to the next chapter on its own, with a ring filling round the arrow ----------
  const tour = (() => {
    let on = false, timer = null;
    els.next.style.setProperty("--tour-ms", TOUR_MS + "ms");
    function render() {
      document.body.classList.toggle("touring", on);
      els.tourBtn.setAttribute("aria-pressed", String(on));
      els.tourLabel.textContent = on ? t("tourOn") : t("tour");
      els.tourBtn.setAttribute("aria-label", on ? t("tourOn") : t("tour"));
    }
    function restartRing() {
      els.next.classList.remove("ring-run");
      void els.next.offsetWidth;
      if (on) els.next.classList.add("ring-run");
    }
    function schedule() {
      clearTimeout(timer);
      if (!on) return;
      if (state.index >= CHAPTERS.length - 1) { set(false); return; } // the tour ends at the farewell
      restartRing();
      timer = setTimeout(function fire() {
        if (anyDialogOpen()) { timer = setTimeout(fire, 2000); return; }
        go(state.index + 1);
      }, TOUR_MS);
    }
    function set(v) { on = v; render(); if (!on) { clearTimeout(timer); restartRing(); } else schedule(); }
    els.tourBtn.addEventListener("click", () => {
      if (!on && !state.started) start(true);
      set(!on);
    });
    return { schedule, render, toggle: () => set(!on) };
  })();
  const next = () => go(state.index + 1);
  const prev = () => go(state.index - 1);

  els.next.addEventListener("click", next);
  els.prev.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    if (!state.started || anyDialogOpen() || state.oudMode || e.altKey || e.ctrlKey || e.metaKey) return;
    const forward = isRtl() ? "ArrowLeft" : "ArrowRight";
    const back = isRtl() ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward || e.key === "PageDown" || (e.key === " " && e.target === document.body)) { e.preventDefault(); next(); }
    else if (e.key === back || e.key === "PageUp") { e.preventDefault(); prev(); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(CHAPTERS.length - 1); }
    else if (e.key === "a" || e.key === "A") { tour.toggle(); }
    else if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
  });

  let wheelAcc = 0, wheelLock = false, wheelReset;
  window.addEventListener("wheel", (e) => {
    if (!state.started || anyDialogOpen() || state.oudMode) return;
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

  // ---------- Songs & albums: the journey's songs with credits, and the official discography ----------
  // Small site icons instead of labelled pills; the name lives in the tooltip and the accessible label
  const ICONS = {
    yt: [["path", { class: "fill", d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8z" }],
         ["path", { class: "cut", d: "M10 15V9l5.2 3z" }]],
    sc: [["path", { class: "fill", d: "M11 7.6V17h8.6a3.1 3.1 0 0 0 .2-6.2A5.2 5.2 0 0 0 11 7.6z" }],
         ["path", { class: "line", d: "M2 13.5V17 M4.5 11.5V17 M7 10.5V17 M9.3 9.5V17" }]],
    ly: [["path", { class: "line", d: "M6 3.5h9l3 3V20.5H6z M9 10h6 M9 13.5h6 M9 17h4" }]],
    list: [["path", { class: "line", d: "M3 6h13 M3 11h13 M3 16h7" }], ["path", { class: "fill", d: "M14 13.5v7l6-3.5z" }]],
    go: [["path", { class: "fill", d: "M15 3v11.2A3.3 3.3 0 1 1 13 11.2V6.5L9 7.6V16a3.3 3.3 0 1 1-2-3V5z" }]]
  };
  function icon(kind) {
    const s = svg("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" });
    ICONS[kind].forEach(([tag, attrs]) => svg(tag, attrs, s));
    return s;
  }
  function iconLink(kind, href, label) {
    const a = el("a", "ic ic-" + kind);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = label;
    a.setAttribute("aria-label", label);
    a.appendChild(icon(kind));
    return a;
  }
  function extLink(cls, text, href, label) {
    const a = el("a", cls, text);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (label) a.setAttribute("aria-label", label);
    return a;
  }
  const ytSearch = (q) => CHANNEL_URL + "/search?query=" + encodeURIComponent(q);
  const scSearch = (q) => "https://soundcloud.com/search/sounds?q=" + encodeURIComponent("طلال مداح " + q);
  const LYRICS_HOSTS = ["https://fnanen.com/", "https://kalemat.app/"];
  const lyricsOk = (u) => typeof u === "string" && LYRICS_HOSTS.some((h) => u.startsWith(h));

  function renderSongs() {
    els.songList.replaceChildren();
    CHAPTERS.forEach((ch, i) => {
      const c = ch[state.lang];
      const arSong = ch.ar.song;
      const li = el("li", "song-card" + (i === state.index ? " current" : ""));
      const head = el("button", "song-row");
      head.type = "button";
      head.append(el("span", "sr-year", num(ch.year)), el("strong", "sr-song", c.song), el("span", "sr-chapter", c.title));
      head.addEventListener("click", () => { els.songs.close(); go(i); });
      li.appendChild(head);

      const cr = ch.credits || {};
      const credits = el("dl", "credits");
      [["lyricsBy", cr.lyrics], ["musicBy", cr.music]].forEach(([k, who]) => {
        credits.append(el("dt", null, t(k)), el("dd", who ? null : "unknown", who ? who[state.lang] : t("unconfirmed")));
      });
      li.appendChild(credits);
      if (cr.note) li.appendChild(el("p", "credit-note", cr.note[state.lang]));

      const links = el("div", "links");
      const id = ch.track && ch.track.youtube;
      if (id && YT_ID.test(id)) links.appendChild(iconLink("yt", ytWatchUrl(id), t("youtube") + ": " + c.song));
      const sc = ch.track && ch.track.soundcloud;
      links.appendChild(iconLink("sc", sc && SC_ID.test(sc) ? SOUNDCLOUD_URL + sc : scSearch(arSong), t("soundcloud") + ": " + c.song));
      if (lyricsOk(ch.lyricsUrl)) links.appendChild(iconLink("ly", ch.lyricsUrl, t("lyricsLink") + ": " + c.song));
      li.appendChild(links);
      els.songList.appendChild(li);
    });
  }

  const ALBUMS = DATA.albums || [];
  const SETS = DATA.sets || [];
  // Loose Arabic matching: hamza forms, alef maqsura, ta marbuta, diacritics and punctuation don't count
  const norm = (x) => String(x).replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/[^\u0621-\u064A0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const recordingsOf = (title) => {
    const n = norm(title.replace(/\d+$/, ""));
    const out = [];
    SETS.forEach((st) => st.tracks.forEach(([v, name]) => { if (name.split("+").some((p) => norm(p) === n)) out.push([v, st.title]); }));
    return out;
  };
  const journeySongs = new Set(CHAPTERS.map((c) => norm(c.ar.song)));
  const LABELS = DATA.labels || {};
  const GROUPS = [
    { key: "decade1960", test: (a) => a.decade === 1960 },
    { key: "decade1970", test: (a) => a.decade === 1970 },
    { key: "decade1980", test: (a) => a.decade === 1980 },
    { key: "decade1990", test: (a) => a.decade === 1990 },
    { key: "decadeAfter", test: (a) => !!a.year }
  ];
  const TAG_KEYS = { live: "tagLive", national: "tagNational", renewed: "tagRenewed", rerelease: "tagRerelease", posthumous: "tagPosthumous" };
  let albumFilter = "all";

  function renderAlbums() {
    els.albumsIntro.textContent = t("albumsIntro").replace("{count}", num(ALBUMS.length));
    els.chips.replaceChildren();
    [{ key: "all" }, ...GROUPS].forEach((g) => {
      const n = g.key === "all" ? ALBUMS.length : ALBUMS.filter(g.test).length;
      const b = el("button", "chip", (g.key === "all" ? t("decadeAll") : t(g.key)) + " · " + num(n));
      b.type = "button";
      b.setAttribute("aria-pressed", String(albumFilter === g.key));
      b.addEventListener("click", () => { albumFilter = g.key; renderAlbums(); });
      els.chips.appendChild(b);
    });
    els.albumGroups.replaceChildren();
    GROUPS.filter((g) => albumFilter === "all" || albumFilter === g.key).forEach((g) => {
      const list = ALBUMS.filter(g.test);
      if (!list.length) return;
      const sec = el("section", "album-group");
      sec.appendChild(el("h3", null, t(g.key)));
      const grid = el("ul", "album-grid");
      list.forEach((a) => {
        const card = el("li", "album");
        const top = el("div", "album-top");
        top.appendChild(el("span", "album-when", a.year ? num(a.year) : t("decade" + a.decade)));
        if (a.no) top.appendChild(el("span", "album-no", t("albumNo").replace("{n}", num(a.no))));
        card.appendChild(top);
        const primary = state.lang === "ar" ? a.ar : a.en;
        const secondary = state.lang === "ar" ? a.en : a.ar;
        card.appendChild(el("strong", "album-title", primary));
        card.appendChild(el("span", "album-alt", secondary));
        if (LABELS[a.label]) card.appendChild(el("span", "album-label", LABELS[a.label][state.lang]));
        if (a.tags && a.tags.length) {
          const tags = el("div", "album-tags");
          a.tags.forEach((tg) => { if (TAG_KEYS[tg]) tags.appendChild(el("span", "tag tag-" + tg, t(TAG_KEYS[tg]))); });
          card.appendChild(tags);
        }
        if (a.note) card.appendChild(el("p", "credit-note", a.note[state.lang]));
        const recs = recordingsOf(a.ar);
        if (recs.length) {
          const d = el("details", "recs");
          d.appendChild(el("summary", null, t("titleSong") + " · " + num(recs.length)));
          const ul = el("ul");
          recs.forEach(([v, where]) => { if (YT_ID.test(v)) { const li = el("li"); li.appendChild(extLink(null, "▶ " + where, ytWatchUrl(v))); ul.appendChild(li); } });
          d.appendChild(ul);
          card.appendChild(d);
        }
        const links = el("div", "links");
        links.appendChild(iconLink("yt", ytSearch(a.ar), t("youtube") + ": " + primary));
        links.appendChild(iconLink("sc", scSearch(a.ar), t("soundcloud") + ": " + primary));
        const ci = a.chapter ? CHAPTERS.findIndex((c) => c.id === a.chapter) : -1;
        if (ci >= 0) {
          const b = el("button", "ic ic-go");
          b.type = "button";
          b.title = t("inTribute");
          b.setAttribute("aria-label", t("inTribute") + ": " + primary);
          b.appendChild(icon("go"));
          b.addEventListener("click", () => { els.songs.close(); go(ci); });
          links.appendChild(b);
        }
        card.appendChild(links);
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      els.albumGroups.appendChild(sec);
    });
  }

  const KIND_KEYS = { concert: "kindConcert", session: "kindSession", series: "kindSeries" };
  function renderSets() {
    const total = SETS.reduce((n, st) => n + st.tracks.length, 0);
    els.setsIntro.textContent = t("setsIntro").replace("{count}", num(SETS.length)).replace("{songs}", num(total));
    els.setGrid.replaceChildren();
    [...SETS].sort((a, b) => (a.year || 9999) - (b.year || 9999)).forEach((st) => {
      const li = el("li", "set");
      const top = el("div", "album-top");
      top.appendChild(el("span", "album-when", (KIND_KEYS[st.kind] ? t(KIND_KEYS[st.kind]) : "") + (st.year ? " · " + num(st.year) : "")));
      top.appendChild(el("span", "album-no", t("songsCount").replace("{n}", num(st.tracks.length))));
      li.appendChild(top);
      li.appendChild(el("strong", "album-title", st.title));
      const d = el("details", "recs");
      d.appendChild(el("summary", null, t("showSongs")));
      const ol = el("ol", "tracklist");
      st.tracks.forEach(([v, name]) => {
        if (!YT_ID.test(v)) return;
        const row = el("li", name.split("+").some((p) => journeySongs.has(norm(p))) ? "in-journey" : null);
        row.appendChild(extLink(null, name, ytWatchUrl(v)));
        ol.appendChild(row);
      });
      d.appendChild(ol);
      li.appendChild(d);
      const links = el("div", "links");
      if (/^PL[\w-]{10,40}$/.test(st.playlist)) links.appendChild(iconLink("list", "https://www.youtube.com/playlist?list=" + encodeURIComponent(st.playlist), t("playAll") + ": " + st.title));
      li.appendChild(links);
      els.setGrid.appendChild(li);
    });
  }

  const TABS = [["songs", "tabSongs", "panelSongs"], ["albums", "tabAlbums", "panelAlbums"], ["sets", "tabSets", "panelSets"]];
  function showTab(which) {
    TABS.forEach(([name, tab, panel]) => {
      const on = name === which;
      els[tab].setAttribute("aria-selected", String(on));
      els[tab].tabIndex = on ? 0 : -1;
      els[panel].hidden = !on;
    });
  }
  function openMusic(which) {
    renderSongs();
    renderAlbums();
    renderSets();
    showTab(which);
    if (!els.songs.open) els.songs.showModal();
    els.songs.scrollTop = 0;
  }
  els.musicBtn.addEventListener("click", () => openMusic("songs"));
  els.tabSongs.addEventListener("click", () => { showTab("songs"); els.songs.scrollTop = 0; });
  els.tabAlbums.addEventListener("click", () => { showTab("albums"); els.songs.scrollTop = 0; });
  els.tabSets.addEventListener("click", () => { showTab("sets"); els.songs.scrollTop = 0; });
  const tabEls = [els.tabSongs, els.tabAlbums, els.tabSets];
  tabEls.forEach((tab, k) => tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const fwd = (e.key === "ArrowRight") !== isRtl();
    const other = tabEls[(k + (fwd ? 1 : -1) + tabEls.length) % tabEls.length];
    other.click();
    other.focus();
  }));

  // ---------- Full screen (where the browser allows it) ----------
  if (document.fullscreenEnabled) {
    els.fs.hidden = false;
    els.fs.addEventListener("click", toggleFullscreen);
  }
  function toggleFullscreen() {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {});
  }

  // ---------- Share: the native share sheet on phones, otherwise copy the link to this chapter ----------
  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2400);
  }
  els.shareBtn.addEventListener("click", async () => {
    const url = location.origin + location.pathname + "#" + CHAPTERS[state.index].id;
    const data = { title: t("siteTitle"), text: t("shareText"), url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); toast(t("copied")); }
    catch { toast(url); }
  });

  els.lang.addEventListener("click", () => {
    state.lang = isRtl() ? "en" : "ar";
    els.track.style.transition = "none"; // don't sweep across every slide
    renderStatic(); renderSlides(); renderRuler(); layout(); tour.render(); oudPlayer.render(); remembrance.render();
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

  // ---------- Play the oud: plucked strings tuned to Arabic maqamat, tremolo, slides, pads, recorder, practice ----------
  const oudPlayer = (() => {
    // Cents from the tonic for the seven degrees; quarter tones (150, 350, 1050) are real, not rounded
    const MAQAMAT = {
      rast:   { key: "maqamRast",   root: 130.81, cents: [0, 200, 350, 500, 700, 900, 1050] },
      bayati: { key: "maqamBayati", root: 146.83, cents: [0, 150, 300, 500, 700, 800, 1000] },
      hijaz:  { key: "maqamHijaz",  root: 146.83, cents: [0, 100, 400, 500, 700, 800, 1000] },
      saba:   { key: "maqamSaba",   root: 146.83, cents: [0, 150, 300, 400, 700, 800, 1000] },
      kurd:   { key: "maqamKurd",   root: 146.83, cents: [0, 100, 300, 500, 700, 800, 1000] }
    };
    const MAQAM_CODES = Object.keys(MAQAMAT);
    const PADS = 15;      // two octaves: degrees 0..14
    const STRINGS = 11;   // the drawn oud's strings, bass on the right
    const LOW_KEYS = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK"];   // degrees 0..7
    const HIGH_KEYS = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI"];  // degrees 7..14
    const KEY_LABELS = { KeyA: "A", KeyS: "S", KeyD: "D", KeyF: "F", KeyG: "G", KeyH: "H", KeyJ: "J", KeyK: "K",
      KeyQ: "Q", KeyW: "W", KeyE: "E", KeyR: "R", KeyT: "T", KeyY: "Y", KeyU: "U", KeyI: "I" };
    const TREMOLO_AFTER = 220, TREMOLO_EVERY = 78;
    const PHRASES = [
      { key: "phraseUp", degs: [0, 1, 2, 3, 4, 5, 6, 7] },
      { key: "phraseDown", degs: [7, 6, 5, 4, 3, 2, 1, 0] },
      { key: "phraseMotif", degs: [0, 1, 2, 1, 2, 3, 4, 3, 2, 1, 0] },
      { key: "phraseCadence", degs: [4, 3, 2, 3, 1, 2, 0] }
    ];
    const MAX_EVENTS = 1200, MAX_MS = 180000;

    let maqam = "bayati", ctx = null, input = null, last = -1, resumeMusic = false;
    const cache = new Map();
    const voices = new Map(); // pointer or key id -> { src, gain, deg, loopHz, holdTimer, tremTimer, up }
    const $p = (id) => $(id);
    const oudSvg = $p("oud"), stringsG = $p("oud-strings");
    const panel = $p("oud-panel"), btn = $p("oud-play-btn"), hint = $p("oud-hint"), chips = $p("maqam-chips");
    const padsEl = $p("oud-pads"), recBtn = $p("rec-btn"), playBtn = $p("rec-play"), shareBtn = $p("rec-share");
    const learnBtn = $p("learn-btn"), guideMsg = $p("guide-msg"), sharedBox = $p("shared-box");
    let padEls = [];

    // ----- Sound -----
    function freq(deg) {
      const m = MAQAMAT[maqam];
      const c = m.cents[deg % 7] + 1200 * Math.floor(deg / 7);
      return m.root * Math.pow(2, c / 1200);
    }
    function ensureAudio() {
      if (ctx) return ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return Promise.reject(new Error("no audio"));
      ctx = new AC();
      // The bowl: a low body resonance, a warm mid, and a soft top
      const low = ctx.createBiquadFilter(); low.type = "peaking"; low.frequency.value = 110; low.Q.value = 1.4; low.gain.value = 5;
      const mid = ctx.createBiquadFilter(); mid.type = "peaking"; mid.frequency.value = 240; mid.Q.value = 1.2; mid.gain.value = 6;
      const nasal = ctx.createBiquadFilter(); nasal.type = "peaking"; nasal.frequency.value = 1100; nasal.Q.value = 1.6; nasal.gain.value = 3;
      const top = ctx.createBiquadFilter(); top.type = "lowpass"; top.frequency.value = 4800;
      const out = ctx.createGain(); out.gain.value = 0.75;
      const comp = ctx.createDynamicsCompressor();
      low.connect(mid).connect(nasal).connect(top).connect(out).connect(comp).connect(ctx.destination);
      input = low;
      return ctx.resume();
    }
    // A plucked string (Karplus-Strong): a burst shaped like a risha pick near the bridge, fed round a decaying loop
    function buffer(f) {
      const sr = ctx.sampleRate;
      const N = Math.max(2, Math.floor(sr / f));
      if (cache.has(N)) return cache.get(N);
      const len = Math.floor(sr * 2.6);
      const buf = ctx.createBuffer(1, len, sr);
      const d = buf.getChannelData(0);
      const exc = new Float32Array(N);
      for (let i = 0; i < N; i++) exc[i] = Math.random() * 2 - 1;
      const pos = Math.max(1, Math.round(N * 0.14)); // pluck position: a comb notch gives the nasal oud colour
      for (let i = 0; i < N; i++) d[i] = exc[i] - 0.85 * exc[(i + N - pos) % N];
      for (let i = 1; i < N; i++) d[i] = 0.6 * d[i] + 0.4 * d[i - 1];
      const decay = f < 200 ? 0.9975 : 0.996;
      for (let i = N; i < len; i++) d[i] = decay * 0.5 * (d[i - N] + (i - N - 1 >= 0 ? d[i - N - 1] : 0));
      let peak = 0;
      for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i]));
      const fadeFrom = len - Math.floor(sr * 0.35);
      for (let i = 0; i < len; i++) d[i] = (d[i] / (peak || 1)) * (i > fadeFrom ? (len - i) / (len - fadeFrom) : 1);
      const entry = { buf, loopHz: sr / (N + 0.5) };
      cache.set(N, entry);
      return entry;
    }
    function sound(deg, vel) {
      const f = freq(deg);
      const { buf, loopHz } = buffer(f);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = f / loopHz;
      const g = ctx.createGain();
      g.gain.value = vel;
      src.connect(g).connect(input);
      src.start();
      return { src, gain: g, loopHz };
    }
    function damp(v, secs = 0.18) {
      if (!v || !v.gain) return;
      const now = ctx.currentTime;
      v.gain.gain.cancelScheduledValues(now);
      v.gain.gain.setValueAtTime(v.gain.gain.value, now);
      v.gain.gain.linearRampToValueAtTime(0, now + secs);
      try { v.src.stop(now + secs + 0.02); } catch { /* already stopped */ }
    }

    // ----- What you see -----
    function shiver(deg) {
      const line = stringsG.children[STRINGS - 1 - (deg % STRINGS)];
      if (line) { line.classList.remove("pluck"); void line.getBoundingClientRect(); line.classList.add("pluck"); }
    }
    function light(deg, on) {
      padsEl.querySelectorAll('.pad[data-deg="' + deg + '"]').forEach((p) => p.classList.toggle("down", on));
    }

    // ----- Playing: press, slide, release -----
    function press(id, deg, vel = 0.62) {
      if (!ctx || deg < 0 || deg >= PADS) return;
      release(id, true);
      const v = { ...sound(deg, vel), deg, up: true };
      v.holdTimer = setTimeout(() => {
        // Held: riyasha tremolo, alternating down and up strokes, until released
        v.tremTimer = setInterval(() => {
          const s = sound(v.deg, v.up ? 0.34 : 0.27);
          damp(v, 0.06);
          Object.assign(v, s);
          v.up = !v.up;
          shiver(v.deg);
        }, TREMOLO_EVERY);
      }, TREMOLO_AFTER);
      voices.set(id, v);
      shiver(deg);
      light(deg, true);
      if (deg % 2 === 0) notes.burst();
      record("d", id, deg);
      guideCheck(deg);
    }
    function slide(id, deg) {
      const v = voices.get(id);
      if (!v || deg === v.deg || deg < 0 || deg >= PADS) return;
      light(v.deg, false);
      v.deg = deg;
      // The oud has no frets: the ringing string glides to the new pitch
      v.src.playbackRate.setTargetAtTime(freq(deg) / v.loopHz, ctx.currentTime, 0.025);
      light(deg, true);
      record("m", id, deg);
    }
    function release(id, silent) {
      const v = voices.get(id);
      if (!v) return;
      clearTimeout(v.holdTimer);
      if (v.tremTimer) { clearInterval(v.tremTimer); damp(v, 0.35); }
      light(v.deg, false);
      voices.delete(id);
      if (!silent) record("u", id, v.deg);
    }
    function releaseAll() { [...voices.keys()].forEach((id) => release(id, true)); }

    // ----- Pads -----
    function renderPads() {
      padsEl.replaceChildren();
      padEls = [];
      const rows = [el("div", "pad-row high"), el("div", "pad-row low")];
      for (let deg = 0; deg < PADS; deg++) {
        const b = el("button", "pad" + (deg % 7 === 0 ? " tonic" : ""));
        b.type = "button";
        b.dataset.deg = deg;
        b.setAttribute("aria-label", t("maqam") + " " + t(MAQAMAT[maqam].key) + " " + num(deg + 1));
        b.appendChild(el("span", "pad-num", num((deg % 7) + 1)));
        if (deg >= 7) b.appendChild(el("span", "pad-oct", "·"));
        const key = deg <= 7 ? LOW_KEYS[deg] : HIGH_KEYS[deg - 7];
        if (finePointer && key) b.appendChild(el("span", "pad-key", KEY_LABELS[key]));
        padEls[deg] = b;
        (deg < 7 ? rows[1] : rows[0]).appendChild(b);
        if (deg === 7) rows[1].appendChild(b.cloneNode(true)).dataset.deg = 7; // the octave sits on both rows
      }
      // Re-collect so the low-row copy of degree 7 also lights
      padsEl.append(rows[0], rows[1]);
      padEls = [];
      padsEl.querySelectorAll(".pad").forEach((p) => { const d = Number(p.dataset.deg); if (!padEls[d]) padEls[d] = p; });
    }
    const padAt = (x, y) => {
      const n = document.elementFromPoint(x, y);
      const p = n && n.closest && n.closest(".pad");
      return p && padsEl.contains(p) ? Number(p.dataset.deg) : -1;
    };
    padsEl.addEventListener("pointerdown", (e) => {
      const deg = padAt(e.clientX, e.clientY);
      if (deg < 0) return;
      e.preventDefault();
      try { padsEl.setPointerCapture(e.pointerId); } catch { /* synthetic or already-ended pointer */ }
      ensureAudio().then(() => press("p" + e.pointerId, deg)).catch(() => {});
    });
    padsEl.addEventListener("pointermove", (e) => {
      if (!voices.has("p" + e.pointerId)) return;
      const deg = padAt(e.clientX, e.clientY);
      if (deg >= 0) slide("p" + e.pointerId, deg);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => padsEl.addEventListener(ev, (e) => release("p" + e.pointerId)));
    padsEl.addEventListener("contextmenu", (e) => e.preventDefault());

    // ----- Sweeping the drawn strings: a strum across the maqam -----
    function degreeAt(e) {
      const ctm = stringsG.getScreenCTM();
      if (!ctm) return -1;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      if (p.y < 430 || p.y > 880 || p.x < 30 || p.x > 370) return -1;
      const u = Math.min(0.999, Math.max(0, (p.x - 40) / 320));
      return STRINGS - 1 - Math.floor(u * STRINGS);
    }
    function strum(deg) {
      if (!ctx) return;
      sound(deg, 0.5);
      shiver(deg);
      record("s", "x", deg);
      if (deg % 3 === 0) notes.burst();
    }
    oudSvg.addEventListener("pointermove", (e) => {
      if (!state.oudMode || (e.pointerType !== "mouse" && e.buttons === 0)) return;
      const d = degreeAt(e);
      if (d >= 0 && d !== last) strum(d);
      last = d;
    });
    oudSvg.addEventListener("pointerdown", (e) => {
      if (!state.oudMode) return;
      e.preventDefault();
      ensureAudio().then(() => { const d = degreeAt(e); if (d >= 0) { strum(d); last = d; } }).catch(() => {});
    });
    oudSvg.addEventListener("pointerleave", () => { last = -1; });

    // ----- Keyboard: A–K the lower octave, Q–I the upper -----
    const keyDeg = (code) => { const lo = LOW_KEYS.indexOf(code); if (lo >= 0) return lo; const hi = HIGH_KEYS.indexOf(code); return hi >= 0 ? hi + 7 : -1; };
    document.addEventListener("keydown", (e) => {
      if (!state.oudMode || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      const deg = keyDeg(e.code);
      if (deg < 0 || e.repeat) return;
      e.preventDefault();
      ensureAudio().then(() => press("k" + e.code, deg)).catch(() => {});
    });
    document.addEventListener("keyup", (e) => { if (state.oudMode && keyDeg(e.code) >= 0) release("k" + e.code); });
    window.addEventListener("blur", releaseAll);

    // ----- Recorder: what you play becomes a link anyone can open and hear -----
    let rec = null, recorded = null, playTimers = [];
    const ids = new Map();
    function record(type, id, deg) {
      if (!rec || rec.events.length >= MAX_EVENTS) return;
      const t = Math.round(performance.now() - rec.t0);
      if (t > MAX_MS) { stopRecording(); return; }
      if (!ids.has(id)) ids.set(id, ids.size % 36);
      rec.events.push([type, t, ids.get(id), deg]);
    }
    function startRecording() {
      stopPlayback();
      ids.clear();
      rec = { t0: performance.now(), events: [], maqam };
      recBtn.classList.add("on");
      recBtn.setAttribute("aria-pressed", "true");
      recBtn.querySelector("span").textContent = t("stopRec");
    }
    function stopRecording() {
      if (!rec) return;
      if (rec.events.length) recorded = { maqam: rec.maqam, events: rec.events };
      rec = null;
      recBtn.classList.remove("on");
      recBtn.setAttribute("aria-pressed", "false");
      recBtn.querySelector("span").textContent = t("record");
      renderRecButtons();
    }
    function stopPlayback() {
      playTimers.forEach(clearTimeout);
      playTimers = [];
      releaseAll();
      playBtn.classList.remove("on");
    }
    function playBack(take) {
      if (!take || !take.events.length) { toast(t("recEmpty")); return; }
      stopPlayback();
      if (rec) stopRecording();
      ensureAudio().then(() => {
        if (MAQAMAT[take.maqam] && take.maqam !== maqam) { maqam = take.maqam; renderChips(); renderPads(); }
        playBtn.classList.add("on");
        take.events.forEach(([type, tm, id, deg]) => {
          playTimers.push(setTimeout(() => {
            const vid = "r" + id;
            if (type === "d") press(vid, deg);
            else if (type === "m") slide(vid, deg);
            else if (type === "u") release(vid);
            else if (type === "s") strum(deg);
          }, tm));
        });
        const end = take.events[take.events.length - 1][1] + 600;
        playTimers.push(setTimeout(stopPlayback, end));
      }).catch(() => {});
    }
    // Compact text form: maqam~type.time36.id36.deg36,…
    function encode(take) {
      return take.maqam + "~" + take.events.map(([ty, tm, id, deg]) => ty + tm.toString(36) + "." + id.toString(36) + "." + deg.toString(36)).join(",");
    }
    function decode(str) {
      const m = /^([a-z]{3,8})~([dmus][0-9a-z]{1,6}\.[0-9a-z]\.[0-9a-z](,[dmus][0-9a-z]{1,6}\.[0-9a-z]\.[0-9a-z]){0,1199})$/.exec(str || "");
      if (!m || !MAQAMAT[m[1]]) return null;
      const events = m[2].split(",").map((e) => {
        const [tm, id, deg] = e.slice(1).split(".").map((x) => parseInt(x, 36));
        return [e[0], Math.min(tm, MAX_MS), id, Math.min(deg, PADS - 1)];
      }).sort((a, b) => a[1] - b[1]);
      return { maqam: m[1], events };
    }
    async function shareTake() {
      if (!recorded) { toast(t("recEmpty")); return; }
      const url = location.origin + location.pathname + "#oud=" + encode(recorded);
      if (navigator.share) {
        try { await navigator.share({ title: t("siteTitle"), text: t("playOud"), url }); return; } catch (e) { if (e.name === "AbortError") return; }
      }
      try { await navigator.clipboard.writeText(url); toast(t("copied")); } catch { toast(t("copyFailed")); }
    }
    function renderRecButtons() {
      playBtn.disabled = shareBtn.disabled = !recorded;
    }
    recBtn.addEventListener("click", () => { ensureAudio().catch(() => {}); rec ? stopRecording() : startRecording(); });
    playBtn.addEventListener("click", () => (playTimers.length ? stopPlayback() : playBack(recorded)));
    shareBtn.addEventListener("click", shareTake);

    // A shared performance arrives in the link
    const shared = location.hash.startsWith("#oud=") ? decode(decodeURIComponent(location.hash.slice(5))) : null;
    $p("shared-play").addEventListener("click", () => { sharedBox.hidden = true; playBack(shared); });

    // ----- Practice: the pads light up a traditional phrase, then you follow the light -----
    let guide = null, phraseIdx = -1;
    function stopGuide() {
      if (!guide) return;
      guide.timers.forEach(clearTimeout);
      padsEl.querySelectorAll(".pad").forEach((p) => p.classList.remove("target", "demo", "miss"));
      guide = null;
    }
    function startGuide() {
      stopGuide();
      ensureAudio().then(() => {
        phraseIdx = (phraseIdx + 1) % PHRASES.length;
        const ph = PHRASES[phraseIdx];
        guide = { degs: ph.degs, i: 0, waiting: false, timers: [] };
        guideMsg.textContent = t(ph.key) + " — " + t("listenFirst");
        ph.degs.forEach((deg, k) => {
          guide.timers.push(setTimeout(() => {
            const v = sound(deg, 0.5);
            shiver(deg);
            void v;
            padsEl.querySelectorAll('.pad[data-deg="' + deg + '"]').forEach((pad) => {
              pad.classList.add("demo");
              guide.timers.push(setTimeout(() => pad.classList.remove("demo"), 300));
            });
          }, 200 + k * 420));
        });
        guide.timers.push(setTimeout(() => {
          guide.waiting = true;
          guideMsg.textContent = t("yourTurn");
          target();
        }, 400 + ph.degs.length * 420));
      }).catch(() => {});
    }
    function target() {
      padsEl.querySelectorAll(".pad").forEach((p) => p.classList.remove("target", "miss"));
      const deg = guide.degs[guide.i];
      padsEl.querySelectorAll('.pad[data-deg="' + deg + '"]').forEach((p) => p.classList.add("target"));
    }
    function guideCheck(deg) {
      if (!guide || !guide.waiting) return;
      if (deg !== guide.degs[guide.i]) {
        padsEl.querySelectorAll(".pad.target").forEach((p) => { p.classList.remove("miss"); void p.offsetWidth; p.classList.add("miss"); });
        return;
      }
      guide.i++;
      if (guide.i >= guide.degs.length) {
        stopGuide();
        guideMsg.textContent = t("wellDone");
        notes.burst(); notes.burst(); notes.burst();
        return;
      }
      target();
    }
    learnBtn.addEventListener("click", startGuide);

    // ----- Maqam choice -----
    function renderChips() {
      chips.replaceChildren();
      Object.entries(MAQAMAT).forEach(([name, m]) => {
        const b = el("button", "chip", t(m.key));
        b.type = "button";
        b.setAttribute("role", "radio");
        b.setAttribute("aria-checked", String(name === maqam));
        b.addEventListener("click", () => {
          maqam = name;
          stopGuide();
          renderChips();
          renderPads();
          ensureAudio().then(() => { [0, 2, 4, 7].forEach((d, i) => setTimeout(() => { sound(d, 0.42); shiver(d); }, i * 150)); }).catch(() => {});
        });
        chips.appendChild(b);
      });
    }

    function render() {
      renderChips();
      renderPads();
      renderRecButtons();
      hint.textContent = finePointer ? t("oudHint") : t("oudHintTouch");
      recBtn.querySelector("span").textContent = rec ? t("stopRec") : t("record");
      btn.setAttribute("aria-pressed", String(!!state.oudMode));
      if (!guide) guideMsg.textContent = "";
    }
    function open() {
      if (state.oudMode) return;
      state.oudMode = true;
      resumeMusic = state.started && !state.muted;
      audio.stop();
      document.body.classList.add("oud-mode");
      panel.hidden = false;
      render();
      sharedBox.hidden = !shared;
      ensureAudio().catch(() => {});
      $p("oud-close").focus({ preventScroll: true });
    }
    function close() {
      if (!state.oudMode) return;
      stopGuide();
      stopPlayback();
      stopRecording();
      releaseAll();
      state.oudMode = false;
      document.body.classList.remove("oud-mode");
      panel.hidden = true;
      last = -1;
      render();
      btn.focus({ preventScroll: true });
      if (resumeMusic && !state.muted) playCurrent();
    }
    btn.addEventListener("click", () => (state.oudMode ? close() : open()));
    $p("oud-close").addEventListener("click", close);
    return { render, open, shared: !!shared };
  })();

  // ---------- Remembrance days: his birthday (5 August) and the day he passed (11 August), in Saudi time ----------
  const remembrance = (() => {
    const DAYS = { "08-05": { kind: "birth", from: 1940, chapter: "birth" }, "08-11": { kind: "death", from: 2000, chapter: "farewell" } };
    let today;
    try { today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh" }).format(new Date()); }
    catch { today = new Date().toISOString().slice(0, 10); }
    // ?remember=birth or ?remember=death previews the page as it looks on those days
    const preview = new URLSearchParams(location.search).get("remember");
    const day = preview === "birth" ? DAYS["08-05"] : preview === "death" ? DAYS["08-11"] : DAYS[today.slice(5)];
    const year = Number(today.slice(0, 4));
    const box = $("remembrance");
    function render() {
      if (!day) return;
      const ch = CHAPTERS.find((c) => c.id === day.chapter);
      if (!ch) return;
      const n = num(year - day.from);
      $("rem-kicker").textContent = t(day.kind === "birth" ? "remBirthKicker" : "remDeathKicker");
      $("rem-text").textContent = t(day.kind === "birth" ? "remBirth" : "remDeath").replace("{n}", n);
      $("rem-listen-label").textContent = t("remListen").replace("{song}", ch[state.lang].song);
      box.hidden = false;
      document.body.dataset.remember = day.kind;
    }
    $("rem-listen").addEventListener("click", () => {
      const i = CHAPTERS.findIndex((c) => c.id === day.chapter);
      if (i < 0) return;
      state.index = i;
      layout();
      history.replaceState(null, "", location.pathname + location.search + "#" + CHAPTERS[i].id);
      start(true);
    });
    return { render };
  })();

  // ---------- Boot ----------
  const fromHash = CHAPTERS.findIndex((c) => "#" + c.id === location.hash);
  state.index = fromHash >= 0 ? fromHash : 0;
  renderStatic(); renderSlides(); renderRuler(); layout(); tour.render(); oudPlayer.render(); remembrance.render();
  if (oudPlayer.shared) {
    [els.begin, els.beginSilent].forEach((b) => b.addEventListener("click", () => setTimeout(oudPlayer.open, 900)));
  }
})();
