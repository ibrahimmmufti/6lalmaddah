# Talal Maddah — The Voice of the Land (technical notes)

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

## Songs & albums

The **Songs & albums** button opens two lists:

- **Songs of this journey:** each chapter's song with its writer and composer (`credits` in `content.js`), plus YouTube, SoundCloud and lyrics links. Credits come from press articles and the fnanen.com archive; anything we couldn't confirm is labelled that way. `lyricsUrl` must point to fnanen.com or kalemat.app; `track.soundcloud` is the part after `soundcloud.com/6lalchannel/`.
- **Official albums:** 85 albums from Arabic and English Wikipedia (`albums` and `labels` in `content.js`). The sources give only the decade before 2001, so those albums use `decade`; posthumous releases use an exact `year`. No track lists are published in those sources, so each album links to a search of the official YouTube and SoundCloud channels.

Lyrics are linked, not copied, because they belong to their writers.

## Play the oud, share preview and remembrance days

- **Play the oud:** the button above the arrows brings the oud forward with two rows of note pads (two octaves of the chosen maqam). Tap to pluck, hold for riyasha tremolo, slide across pads to bend the pitch (the oud is fretless), sweep the drawn strings to strum. Keyboard: A–K lower octave, Q–I upper; Esc closes. The sound is a plucked-string model generated in the browser, tuned to Rast, Bayati, Hijaz, Saba and Kurd with real quarter tones. **Record** captures what you play as note events; **Share** turns it into a `#oud=` link that replays it (parsed with a strict pattern, capped at 1,200 events / 3 minutes). **Learn a phrase** plays one of four traditional practice phrases (ascent, descent, a short phrase, a cadence), then lights the pads for you to follow. The song that was playing resumes on close.
- **Share preview:** `images/share-card.jpg` (1200×630) and the `og:`/`twitter:` tags in `index.html` make links show a card on WhatsApp, X and others. The tags use the full domain, so they only work once the site is live at https://طلال-مداح.com. The card uses the CC BY-SA portrait, so it is shared under the same licence, with the credit on the image.
- **Remembrance days:** on 5 August (his birth) and 11 August (his passing), Saudi time, the opening screen shows a short remembrance and a link to the matching song. Preview them with `?remember=birth` or `?remember=death`.

## Edit the text

All text is in `content.js`, under `en` and `ar`. After editing, run:

```bash
node scripts/check-content.mjs
```

The check fails if the two languages have different fields, if a field is empty, if the chapters are out of year order, or if a track path or ID is invalid.

## Sources

The facts come from English and Arabic Wikipedia. Where only a Hijri year was available, the site shows the Hijri year in Arabic and an approximate Gregorian year in English.
