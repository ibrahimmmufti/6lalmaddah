// All text on the site lives here, in both languages.
// Every chapter needs the same fields in `en` and `ar` — `node scripts/check-content.mjs` enforces it.
//
// MUSIC: for each chapter, set ONE of:
//   track.youtube — the 11-character ID of a video on the official channel
//                   (قناة طلال مداح الرسمية — https://www.youtube.com/@6laltv-y2n)
//   track.file    — path to an audio file you have the right to use, e.g. "audio/03-wardak.mp3"
//   track.start   — optional: second to start playback from
//
// PHOTOS: every picture is listed once in `photos`, then chapters refer to it by key.
//   yt   — the video whose thumbnail is used (from the official channel)
//   src  — a local image you're allowed to use (needs `credit`)
//   pos  — horizontal crop for the square record sleeve (0% = left edge, where album covers sit)
//   bw   — show in black and white
//
// OUD: "ebony" = his dark oud with gold rosettes and mother-of-pearl edge;
//      "honey" = the honey-coloured oud with a calligraphy rosette he played in Abha, 1999.

window.TRIBUTE = {
  ui: {
    en: {
      siteTitle: "Talal Maddah — The Voice of the Land",
      kicker: "A tribute",
      name: "Talal Maddah",
      epithet: "The Voice of the Land",
      lifespan: "1940 — 2000",
      intro: "Sixty years, a thousand songs, one voice. Walk through his life, year by year, with the music that defined each chapter.",
      begin: "Begin the journey",
      beginNoSound: "Continue without sound",
      nowPlaying: "Song of this chapter",
      noTrack: "Song for this chapter",
      muted: "Sound off",
      unmuted: "Sound on",
      prev: "Previous chapter",
      next: "Next chapter",
      langSwitch: "العربية",
      hint: "Use ← → keys, scroll, or swipe",
      restart: "Return to the beginning",
      timeline: "Years of his life",
      chapterOf: "Chapter {n} of {total}",
      sources: "Sources: English and Arabic Wikipedia, Okaz, Al-Rai, Al-Watan, Sada El-Balad, Enab Baladi and Sky News Arabia. Hijri dates converted to approximate Gregorian years.",
      watch: "Watch on YouTube",
      channelCredit: "Music, video and album art: the official Talal Maddah channel",
      portraitCredit: "Portrait: Bait Al-Fann, CC BY-SA 4.0, via Wikimedia Commons",
      gallery: "Photos",
      galleryTitle: "Photographs",
      galleryIntro: "From concerts, television, music videos and album covers — the official Talal Maddah channel and Wikimedia Commons.",
      close: "Close",
      morePhotos: "More photos",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo"
    },
    ar: {
      siteTitle: "طلال مداح — صوت الأرض",
      kicker: "تحية وفاء",
      name: "طلال مداح",
      epithet: "صوت الأرض",
      lifespan: "١٩٤٠ — ٢٠٠٠",
      intro: "ستون عامًا، وألف أغنية، وصوت واحد. رحلة عبر حياته عامًا بعد عام، مع الأغنية التي صنعت كل مرحلة.",
      begin: "ابدأ الرحلة",
      beginNoSound: "المتابعة بدون صوت",
      nowPlaying: "أغنية هذه المرحلة",
      noTrack: "أغنية هذه المرحلة",
      muted: "الصوت مغلق",
      unmuted: "الصوت مفتوح",
      prev: "المرحلة السابقة",
      next: "المرحلة التالية",
      langSwitch: "English",
      hint: "استخدم الأسهم أو التمرير أو السحب",
      restart: "العودة إلى البداية",
      timeline: "سنوات حياته",
      chapterOf: "المرحلة {n} من {total}",
      sources: "المصادر: ويكيبيديا العربية والإنجليزية، عكاظ، الراي، الوطن، صدى البلد، عنب بلدي وسكاي نيوز عربية. التواريخ الهجرية محوّلة إلى سنوات ميلادية تقريبية.",
      watch: "شاهد على يوتيوب",
      channelCredit: "الأغاني والصور وأغلفة الألبومات: قناة طلال مداح الرسمية",
      portraitCredit: "الصورة: بيت الفن، CC BY-SA 4.0، عبر ويكيميديا كومنز",
      gallery: "الصور",
      galleryTitle: "صور",
      galleryIntro: "من الحفلات والتلفزيون والفيديو كليب وأغلفة الألبومات — قناة طلال مداح الرسمية وويكيميديا كومنز.",
      close: "إغلاق",
      morePhotos: "صور أخرى",
      prevPhoto: "الصورة السابقة",
      nextPhoto: "الصورة التالية"
    }
  },

  photos: {
    "wad-clip":      { yt: "4eZLNP3Zgjg", pos: "45%", en: "“Wa'd” music video", ar: "فيديو كليب «وعد»" },
    "portrait":      { src: "images/talal-portrait.png", pos: "50%", credit: "Bait Al-Fann, CC BY-SA 4.0, via Wikimedia Commons", en: "Portrait", ar: "صورة شخصية" },
    "with-oud":      { yt: "8gWqxg-bFnk", pos: "74%", en: "With his oud", ar: "مع عوده" },
    "taqasim":       { yt: "k1yJjAJx5Sc", pos: "55%", en: "Taqasim on the oud, “Alwan wa Bidun Alwan”", ar: "تقاسيم عود، برنامج «ألوان وبدون ألوان»" },
    "khafaji-1985":  { yt: "9oDkU8sDtzs", pos: "50%", en: "Al-Khafaji tribute concert, 1985", ar: "حفل تكريم الخفاجي ١٩٨٥" },
    "ahly-egypt":    { yt: "NbCOOzLEkr0", pos: "50%", bw: true, en: "Al-Ahly Club concert, Egypt", ar: "حفلة النادي الأهلي المصري" },
    "tv-stage":      { yt: "FURmK0T3CfU", pos: "45%", bw: true, en: "On the Saudi TV stage", ar: "على مسرح التلفزيون" },
    "matha-clip":    { yt: "ZURGzmVo1LQ", pos: "36%", bw: true, en: "“Matha Aqool” music video", ar: "فيديو كليب «ماذا أقول»" },
    "mawid-clip":    { yt: "m54UVkbEbzo", pos: "45%", en: "“Al-Maw'id Al-Thani” music video", ar: "فيديو كليب «الموعد الثاني»" },
    "hail-tv":       { yt: "M9ABKex3WII", pos: "50%", bw: true, en: "Singing “Hail Ba'd Hayyi” on the TV stage", ar: "«حائل بعد حيي» على مسرح التلفزيون" },
    "riyadh-1986":   { yt: "UIZEih3FqrU", pos: "42%", en: "Al-Amana concert, Riyadh, 1986", ar: "حفلة الأمانة بالرياض ١٩٨٦" },
    "riyadh-1986b":  { yt: "bPJw6Exmhfs", pos: "40%", en: "Al-Amana concert, Riyadh, 1986", ar: "حفلة الأمانة بالرياض ١٩٨٦" },
    "janadriyah":    { yt: "4mjxxpzxskQ", pos: "40%", en: "Janadriyah Festival, 1989", ar: "مهرجان الجنادرية الخامس ١٩٨٩" },
    "samt-clip":     { yt: "f5uKT3cxXj4", pos: "45%", en: "“Zaman al-Samt” music video", ar: "فيديو كليب «زمان الصمت»" },
    "qatar-tape":    { yt: "iWQYCKSLyY8", pos: "50%", en: "Cassette of the Qatar concert, 1975", ar: "شريط حفلة قطر ١٩٧٥" },
    "qatar-1975":    { yt: "X1j6KhG1YrA", pos: "45%", en: "Qatar concert, 1975", ar: "حفلة قطر ١٩٧٥" },
    "cairo-maqadeer":{ yt: "gOxYfO6UchE", pos: "50%", en: "Singing “Maqadeer” in Cairo", ar: "«مقادير» في القاهرة" },
    "maqadeer-album":{ yt: "nE633bnaoyg", pos: "0%", en: "The album “Maqadeer”", ar: "ألبوم «مقادير»" },
    "khaizarana":    { yt: "-GE8FL8dPLM", pos: "55%", en: "“La La ya al-Khaizarana” music video", ar: "فيديو كليب «لا لا يالخيزرانة»" },
    "jazirah-1983":  { src: "images/talal-1983.jpg", pos: "50%", bw: true, credit: "Al-Jazirah newspaper, 1983 — public domain, via Wikimedia Commons", en: "Al-Jazirah newspaper, 1983", ar: "صحيفة الجزيرة ١٩٨٣" },
    "cairo-1989":    { yt: "WSbiawBLqmk", pos: "45%", en: "Marriott concert, Cairo, 1989", ar: "حفلة الماريوت بالقاهرة ١٩٨٩" },
    "paris":         { yt: "6XVU_ayMftI", pos: "45%", en: "Concert for the Lebanese community, Paris", ar: "حفلة الجالية اللبنانية بباريس" },
    "rajie-album":   { yt: "54_ao51OW0g", pos: "0%", en: "The album “Ana Rajie Ashoofak”", ar: "ألبوم «أنا راجع أشوفك»" },
    "abha-1999":     { yt: "cPFV2KmmYNc", pos: "72%", en: "Abha, 1999 — the honey-coloured oud", ar: "أبها ١٩٩٩ — العود العسلي" },
    "abha-1999b":    { yt: "1vvVR10D-mg", pos: "45%", en: "Abha, 1999", ar: "حفلة أبها ١٩٩٩" },
    "last-2000":     { yt: "XMMcvZewZ6I", pos: "55%", en: "Singing “Allah Yerod Khatak”, Durrat Al-Arous, 2000", ar: "«الله يرد خطاك»، حفلة درة العروس ٢٠٠٠" },
    "jeddah-2000":   { yt: "8JoGx-Qg3dY", pos: "45%", en: "Jeddah Summer Festival, 2000", ar: "مهرجان صيف جدة ٢٠٠٠" },
    "layali-2000":   { yt: "1HrViXWz7V0", pos: "45%", en: "“Ahla Al-Layali” on television, 2000", ar: "برنامج «أحلى الليالي» ٢٠٠٠" },
    "durra-2000":    { yt: "92B2TT36uQQ", pos: "50%", en: "Durrat Al-Arous concert, 2000", ar: "حفلة درة العروس ٢٠٠٠" }
  },

  chapters: [
    {
      id: "birth", year: 1940, mood: "dawn", oud: "ebony",
      track: { youtube: "4eZLNP3Zgjg" },
      photo: "wad-clip", more: ["portrait", "mawid-clip"],
      en: {
        yearLabel: "1940", era: "Mecca", title: "A child named Talal",
        body: "Born on 5 August 1940 in Mecca as Talal bin Abdul Sheikh Al-Jabiri. He was raised from birth by Ali Maddah, his aunt's husband, who gave him the name the Arab world would come to know: Talal Maddah.",
        song: "Wa'd (Promise)"
      },
      ar: {
        yearLabel: "١٩٤٠", era: "مكة المكرمة", title: "طفلٌ اسمه طلال",
        body: "وُلد في الخامس من أغسطس ١٩٤٠ في مكة المكرمة باسم طلال بن عبدالشيخ الجابري. ربّاه منذ ولادته علي مداح، زوج خالته، فمنحه الاسم الذي سيعرفه به العالم العربي: طلال مداح.",
        song: "وعد"
      }
    },
    {
      id: "oud", year: 1950, mood: "dusk", oud: "ebony",
      track: { youtube: "dalfHvfGJu0" },
      photo: "with-oud", more: ["taqasim", "khafaji-1985"],
      en: {
        yearLabel: "1950s", era: "Taif", title: "The hidden oud",
        body: "At school in Taif his voice made him the natural host of every concert. A classmate's oud, kept at Talal's house away from disapproving eyes, became his teacher — he learned it by himself, string by string.",
        song: "Ta'aly (Come)"
      },
      ar: {
        yearLabel: "الخمسينيات", era: "الطائف", title: "العود المخبّأ",
        body: "في مدارس الطائف جعله صوته العذب مقدّم الحفلات المدرسية. وعودُ زميله عبدالرحمن خوندنة، المخبّأ في بيت طلال بعيدًا عن الأعين، صار معلّمه الأول — فتعلّمه بنفسه وترًا بعد وتر.",
        song: "تعالي"
      }
    },
    {
      id: "first-song", year: 1958, mood: "radio", oud: "ebony",
      track: { youtube: "8gWqxg-bFnk" },
      photo: "ahly-egypt", more: [],
      en: {
        yearLabel: "c. 1958", era: "Radio Jeddah", title: "The first song",
        body: "Encouraged by Abbas Ghazzawi of Radio Jeddah, he recorded his own composition, “Wardak ya Zare' al-Ward”. It was played on the radio every day — and a career of half a century began.",
        song: "Wardak ya Zare' al-Ward"
      },
      ar: {
        yearLabel: "١٣٧٧هـ", era: "إذاعة جدة", title: "الأغنية الأولى",
        body: "بتشجيع من عباس غزاوي في إذاعة جدة، سجّل من ألحانه أغنية «وردك يا زارع الورد». صارت تُذاع كل يوم — وبدأت مسيرة امتدت نصف قرن.",
        song: "وردك يا زارع الورد"
      }
    },
    {
      id: "sixties", year: 1962, mood: "screen", oud: "ebony",
      track: { youtube: "ysFA5FFh0Js" },
      photo: "matha-clip", more: ["mawid-clip"],
      en: {
        yearLabel: "1962", era: "Beirut · Cairo", title: "Beyond the borders",
        body: "After recording in Beirut, he starred opposite Sabah in the film “Fog Street” — the first Saudi to step into cinema. In 1963 he took first place in the kingdom's first national radio poll for singing.",
        song: "Matha Aqool"
      },
      ar: {
        yearLabel: "١٩٦٢", era: "بيروت · القاهرة", title: "أبعد من الحدود",
        body: "بعد تسجيلاته في بيروت، شارك الفنانة صباح بطولة فيلم «شارع الضباب» — أول سعودي يدخل عالم السينما. وفي عام ١٩٦٣ حلّ أولًا في أول استفتاء إذاعي وطني للغناء.",
        song: "ماذا أقول"
      }
    },
    {
      id: "homeland", year: 1966, mood: "land", oud: "ebony",
      track: { youtube: "5NJh6gNmWOU" },
      photo: "hail-tv", more: ["riyadh-1986", "janadriyah"],
      en: {
        yearLabel: "1966", era: "Riyadh", title: "Songs for the homeland",
        body: "He co-founded the record label Riyadh Phone and became the first to commission poets for patriotic songs. “Watani al-Habib” — My Beloved Homeland — is still sung across the kingdom.",
        song: "Watani al-Habib"
      },
      ar: {
        yearLabel: "١٣٨٦هـ", era: "الرياض", title: "أغانٍ للوطن",
        body: "شارك في تأسيس شركة «رياض فون» للتسجيلات، وكان أول من كلّف الشعراء بكتابة الأغاني الوطنية. وما زالت «وطني الحبيب» تُغنّى في أرجاء المملكة.",
        song: "وطني الحبيب"
      }
    },
    {
      id: "discoveries", year: 1968, mood: "discover", oud: "ebony",
      track: { youtube: "6k4lfc0QdW0" },
      photo: "tv-stage", more: ["with-oud"],
      en: {
        yearLabel: "Late 1960s", era: "Jeddah", title: "The voices he found",
        body: "He heard a teenage oud player, Abadi Al-Johar, took him under his wing, gave him an oud and named him “the Octopus of the Oud”; their first work together was “Ya Ghazal”. He also discovered Khairiya Qurban Abdulhadi, composed for her and gave her the name Ibtisam Lutfi — hoping time would smile on her. She became the first Saudi woman to sing on the radio.",
        song: "Ya Ghazal"
      },
      ar: {
        yearLabel: "أواخر الستينيات", era: "جدة", title: "الأصوات التي اكتشفها",
        body: "سمع عازف عود في سنّ المراهقة اسمه عبادي الجوهر، فاحتضنه وأهداه عودًا ولقّبه بـ«أخطبوط العود»، وكان أول تعاون بينهما «يا غزال». واكتشف صوت خيرية قربان عبدالهادي، فلحّن لها ومنحها اسم ابتسام لطفي، لعلّ الزمن يبتسم لها — فصارت أول صوت نسائي سعودي في الإذاعة.",
        song: "يا غزال"
      }
    },
    {
      id: "quartet", year: 1971, mood: "night", oud: "ebony",
      track: { youtube: "6eUxD2sMUEA" },
      photo: "samt-clip", more: ["qatar-tape", "qatar-1975"],
      en: {
        yearLabel: "Early 1970s", era: "The golden quartet", title: "Time of silence",
        body: "With Prince Badr bin Abdulmohsen, Prince Mohammed Al-Abdullah Al-Faisal and composer Siraj Omar, he formed one of the great creative circles of Gulf song. Badr's words became “Zaman al-Samt”.",
        song: "Zaman al-Samt"
      },
      ar: {
        yearLabel: "مطلع السبعينيات", era: "الرباعي الذهبي", title: "زمان الصمت",
        body: "مع الأمير بدر بن عبدالمحسن والأمير محمد العبدالله الفيصل والملحن سراج عمر، شكّل واحدة من أعظم الدوائر الإبداعية في الأغنية الخليجية. وصارت كلمات البدر «زمان الصمت».",
        song: "زمان الصمت"
      }
    },
    {
      id: "maqadeer", year: 1975, mood: "stage", oud: "ebony",
      track: { youtube: "nE633bnaoyg" },
      photo: "cairo-maqadeer", more: ["maqadeer-album", "khaizarana"],
      en: {
        yearLabel: "1970s", era: "Cairo", title: "Destinies",
        body: "“Maqadeer” premiered in Cairo before some 40,000 people and became his first pan-Arab hit. Mohammed Abdel Wahab named him “Zaryab”; the Arab world called him the Voice of the Land.",
        song: "Maqadeer"
      },
      ar: {
        yearLabel: "السبعينيات", era: "القاهرة", title: "مقادير",
        body: "قُدّمت «مقادير» لأول مرة في القاهرة أمام نحو أربعين ألفًا، فكانت أول نجاحاته على امتداد الوطن العربي. لقّبه محمد عبدالوهاب بـ«زرياب»، وسمّاه العرب صوت الأرض.",
        song: "مقادير"
      }
    },
    {
      id: "eighties", year: 1984, mood: "travel", oud: "ebony",
      track: { youtube: "X1j6KhG1YrA" },
      photo: "jazirah-1983", more: ["riyadh-1986b", "cairo-1989", "paris"],
      en: {
        yearLabel: "1980s", era: "London · Morocco · Taif", title: "The wanderer returns",
        body: "He spent years between London and Morocco, then came home to sing at the opening of the Arab Championship in Taif in 1985. King Fahd awarded him the Order of Merit — one of many honours he received across the Arab world.",
        song: "Aghrab (Strangers)"
      },
      ar: {
        yearLabel: "الثمانينيات", era: "لندن · المغرب · الطائف", title: "عودة المسافر",
        body: "أمضى سنوات متنقّلًا بين لندن والمغرب، ثم عاد ليغني في افتتاح البطولة العربية في الطائف عام ١٩٨٥. ومنحه الملك فهد وسام الاستحقاق — أحد أوسمة كثيرة نالها في أنحاء العالم العربي.",
        song: "أغراب"
      }
    },
    {
      id: "nineties", year: 1995, mood: "gold", oud: "honey",
      track: { youtube: "54_ao51OW0g" },
      photo: "rajie-album", more: ["abha-1999", "abha-1999b"],
      en: {
        yearLabel: "1990s", era: "Jeddah · Abha · Janadriyah", title: "Gold",
        body: "Albums like “Ana Rajie Ashoofak”, “Dhahab” and “Al-Itr” returned to the old songs and found new ones. By now he had composed more than a thousand songs, and Mohammed Abdo called him “the teacher of us all”.",
        song: "Ana Rajie Ashoofak"
      },
      ar: {
        yearLabel: "التسعينيات", era: "جدة · أبها · الجنادرية", title: "ذهب",
        body: "ألبومات مثل «أنا راجع أشوفك» و«ذهب» و«العطر» أعادت الأغاني القديمة وأضافت إليها الجديد. وكان قد لحّن أكثر من ألف أغنية، ولقّبه محمد عبده بـ«أستاذ الجميع».",
        song: "أنا راجع أشوفك"
      }
    },
    {
      id: "farewell", year: 2000, mood: "farewell", oud: "honey", final: true,
      track: { youtube: "XMMcvZewZ6I" },
      photo: "last-2000", more: ["jeddah-2000", "layali-2000", "durra-2000"],
      en: {
        yearLabel: "11 August 2000", era: "Al-Miftaha Theatre, Abha", title: "The last song",
        body: "Before more than three thousand people, live on national television, he was singing “Allah Yerod Khatak” — May God Bring You Home — when his heart stopped, his oud still in his arms. He was sixty. He was prayed over at the Grand Mosque in Mecca and laid to rest in Al-Mu'alla, in the city where he was born.",
        song: "Allah Yerod Khatak",
        coda: "The voice is silent. The land still sings."
      },
      ar: {
        yearLabel: "١١ أغسطس ٢٠٠٠", era: "مسرح المفتاحة، أبها", title: "الأغنية الأخيرة",
        body: "أمام أكثر من ثلاثة آلاف من محبيه، وعلى الهواء مباشرة، كان يغني «الله يرد خطاك» حين توقّف قلبه وعوده بين ذراعيه. كان في الستين. صُلّي عليه في المسجد الحرام، ودُفن في مقبرة المعلاة، في المدينة التي وُلد فيها.",
        song: "الله يرد خطاك",
        coda: "صمت الصوت، وما زالت الأرض تغنّي. رحمه الله."
      }
    }
  ]
};
