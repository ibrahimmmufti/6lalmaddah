# Talal Maddah — The Voice of the Land

A bilingual (English / Arabic) tribute that moves through his life from 1940 to 2000, one chapter at a time, with a song for each chapter.

## Run it

```bash
python3 -m http.server 8040
```

Then open http://localhost:8040. It's a static site, so you can host it on GitHub Pages, Netlify, or any web server.

## Add the music

Every chapter plays a song from the official channel, [قناة طلال مداح الرسمية](https://www.youtube.com/@6laltv-y2n), through a small YouTube player in the corner. The player has to stay visible because YouTube's terms require it. The photos are the thumbnails of the channel's videos, plus two free-licensed photos from Wikimedia Commons in `images/`.

To change a song, edit the chapter's `track` entry in `content.js`. Set **one** of these:

- `youtube: "XXXXXXXXXXX"`: the 11-character ID of a video on the channel (the part after `watch?v=`).
- `file: "audio/03-wardak.mp3"`: an audio file you have the right to use, placed in `audio/`.
- `start: 30` (optional): the second where playback starts.

Tracks fade into each other as you move between chapters. On the final chapter the song plays once at a lower volume and then the site goes quiet.

## Photos and the oud

All photos are listed once in `photos` in `content.js`, and each chapter picks a main photo plus a few more (`more`). The **Photos** button opens a gallery of all of them.

The oud is drawn in his two looks, taken from concert footage on the channel: a dark oud with gold rosettes and a mother-of-pearl edge, and the honey-coloured oud with a calligraphy rosette that he played in Abha in 1999. Set each chapter's `oud` to `"ebony"` or `"honey"`. The writing in the calligraphy ring is a stylised version (his name and "صوت الأرض"), not a copy of the real inscription.

## Edit the text

All text is in `content.js`, under `en` and `ar`. After editing, run:

```bash
node scripts/check-content.mjs
```

The check fails if the two languages have different fields, if a field is empty, if the chapters are out of year order, or if a track path or ID is invalid.

## Sources

The facts come from English and Arabic Wikipedia. Where only a Hijri year was available, the site shows the Hijri year in Arabic and an approximate Gregorian year in English.
