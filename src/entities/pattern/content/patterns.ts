import type { PatternEntry, PatternGroup, PatternGroupEntry, PatternId } from '../model/types'

export const PATTERN_GROUP_ENTRIES: Readonly<Record<PatternGroup, PatternGroupEntry>> = {
  'five-ways': {
    name: { en: 'The five ways (lesson 3)', ru: 'Пять способов (урок 3)' },
    book: 'called-to-play',
  },
  techniques: {
    name: { en: 'Right-hand techniques', ru: 'Техники правой руки' },
    book: 'called-to-play',
  },
  octaves: {
    name: { en: 'Octaves and chords (level 2)', ru: 'Октавы и аккорды (уровень 2)' },
    book: 'called-to-play-2',
  },
  'seven-types': {
    name: { en: 'The seven types of accompaniment', ru: 'Семь видов аккомпанемента' },
    book: 'seven-types',
  },
  gorshkov: {
    name: { en: 'Arranging the accompaniment', ru: 'Аранжировка аккомпанемента' },
    book: 'gorshkov',
  },
  genres: { name: { en: 'Rhythm styles', ru: 'Ритмические стили' }, book: null },
}

export const PATTERNS: Readonly<Record<PatternId, PatternEntry>> = {
  M1: {
    group: 'five-ways',
    name: { en: '1 · Bass + chords', ru: '1 · Бас + аккорды' },
    idea: {
      en: 'The right hand plays the chord on every beat over an octave held in the left.',
      ru: 'Правая рука играет аккорд на каждую долю над октавой, которую держит левая.',
    },
    description: {
      en: 'The left hand plays the bass note as an octave and holds it through the bar. The right hand plays the full chord on every beat: four times in a bar of 4/4.',
      ru: 'Левая рука берёт басовый звук октавой и держит его весь такт. Правая играет полный аккорд на каждую долю: в такте 4/4 это четыре раза.',
    },
    rh: 'b1',
    lh: 'o',
  },
  M2: {
    group: 'five-ways',
    name: { en: '2 · Broken chords', ru: '2 · Ломаные аккорды' },
    idea: {
      en: 'Over a held octave, the right hand rocks between the chord’s upper notes and its lowest note.',
      ru: 'Над выдержанной октавой правая рука качается между верхними звуками аккорда и нижним.',
    },
    description: {
      en: 'The left hand holds the octave. The right hand keeps its chord under the fingers and rocks in 8ths: the upper notes together, then the lowest note alone. For a G chord after C, that is D and G together, then B.',
      ru: 'Левая рука держит октаву. Правая держит аккорд под пальцами и качается восьмыми: верхние звуки вместе, затем нижний отдельно. Для G после C это ре и соль вместе, затем си.',
    },
    rh: 'b2',
    lh: 'o',
  },
  M3: {
    group: 'five-ways',
    name: {
      en: '3 · Arpeggio (3rd, then 5th + octave)',
      ru: '3 · Арпеджио (терция, затем квинта + октава)',
    },
    idea: {
      en: 'The left hand plays 1–5–8 up the chord, then the right hand adds the 3rd and holds the 5th and octave.',
      ru: 'Левая рука играет 1–5–8 вверх по аккорду, затем правая добавляет терцию и держит квинту с октавой.',
    },
    description: {
      en: 'One arpeggio shared by both hands. The left hand plays the root, the 5th and the octave (1–5–8) with fingers 5, 2 and 1. The right hand goes on with the 3rd, then plays the 5th and the octave together and holds them.',
      ru: 'Одно арпеджио на две руки. Левая играет основной тон, квинту и октаву (1–5–8) пальцами 5, 2 и 1. Правая продолжает терцией, затем берёт вместе квинту и октаву и держит их.',
    },
    rh: 'b3',
    lh: 'fig',
  },
  M4: {
    group: 'five-ways',
    name: { en: '4 · Arpeggio 1–5–8 · 3–5–8–5–3', ru: '4 · Арпеджио 1–5–8 · 3–5–8–5–3' },
    idea: {
      en: 'One arpeggio in 8ths climbs from the left hand into the right and comes back down.',
      ru: 'Одно арпеджио восьмыми поднимается из левой руки в правую и спускается обратно.',
    },
    description: {
      en: 'The left hand plays 1–5–8 and the right hand carries on with 3–5–8–5–3, so the arpeggio rises through both hands and falls back. Every note is an 8th.',
      ru: 'Левая рука играет 1–5–8, правая продолжает 3–5–8–5–3: арпеджио поднимается через обе руки и возвращается вниз. Все ноты восьмые.',
    },
    rh: 'b4',
    lh: 'fig',
  },
  M5: {
    group: 'five-ways',
    name: { en: '5 · Bass + chords (dotted bass)', ru: '5 · Бас + аккорды (пунктирный бас)' },
    idea: {
      en: 'The right hand plays the chord on every beat over left-hand octaves in a long, short rhythm.',
      ru: 'Правая рука играет аккорд на каждую долю над октавами левой в ритме «длинная, короткая».',
    },
    description: {
      en: 'The right hand plays as in way 1: the chord on every beat. The left hand plays octaves in a dotted rhythm, a dotted quarter and then an 8th (♩. ♪).',
      ru: 'Правая рука играет как в способе 1: аккорд на каждую долю. Левая играет октавы пунктиром: четверть с точкой, затем восьмая (♩. ♪).',
    },
    rh: 'b1',
    lh: 'dot',
  },
  t1: {
    group: 'techniques',
    name: { en: '♪♩ Chord, then octave jumps', ru: '♪♩ Аккорд, затем скачки на октаву' },
    idea: {
      en: 'The chord, then its root alone, jumping up one octave and then two.',
      ru: 'Аккорд, затем один его основной тон, со скачком на октаву и на две вверх.',
    },
    description: {
      en: 'Technique 1. Play the chord as a dotted quarter. Then play its root alone: an octave higher as an 8th, two octaves higher as a quarter, and back to one octave higher as a quarter.',
      ru: 'Техника 1. Сыграйте аккорд четвертью с точкой. Затем один основной тон: октавой выше восьмой, на две октавы выше четвертью и снова октавой выше четвертью.',
    },
    rh: 't1',
    lh: 'o',
  },
  t2: {
    group: 'techniques',
    name: { en: '♪♪♪♪ Arpeggio up two octaves', ru: '♪♪♪♪ Арпеджио вверх на две октавы' },
    idea: {
      en: 'Over a held bass, the right hand runs up the chord for two octaves.',
      ru: 'Над выдержанным басом правая рука поднимается по аккорду на две октавы.',
    },
    description: {
      en: 'Technique 2. The right hand plays the arpeggio 1–3–5–8 with fingers 1–2–3–5, then the same an octave higher. All 8ths.',
      ru: 'Техника 2. Правая рука играет арпеджио 1–3–5–8 пальцами 1–2–3–5, затем то же октавой выше. Всё восьмыми.',
    },
    rh: 't2',
    lh: 'o',
  },
  t3: {
    group: 'techniques',
    name: { en: '♬ Runs down to the root', ru: '♬ Пассажи вниз к основному тону' },
    idea: {
      en: 'The 2nd and 5th together, then a run down 3, 2, 1 to the root; twice, an octave apart.',
      ru: 'Секунда и квинта вместе, затем пассаж вниз 3, 2, 1 к основному тону; дважды, через октаву.',
    },
    description: {
      en: 'Technique 3. Play the 2nd and the 5th together with fingers 2 and 5. Then run down the 3rd, the 2nd and the root with fingers 3, 2 and 1. Play it all in 8ths, then again an octave lower.',
      ru: 'Техника 3. Возьмите вместе секунду и квинту пальцами 2 и 5. Затем сыграйте вниз терцию, секунду и основной тон пальцами 3, 2 и 1. Всё восьмыми, затем то же октавой ниже.',
    },
    rh: 't3',
    lh: 'o',
  },
  t4: {
    group: 'techniques',
    name: { en: '♫ Run up 1–2–3–5', ru: '♫ Пассаж вверх 1–2–3–5' },
    idea: {
      en: 'The root, 2nd, 3rd and 5th in 8ths, climbing two octaves.',
      ru: 'Основной тон, секунда, терция и квинта восьмыми, вверх на две октавы.',
    },
    description: {
      en: 'Technique 4. Play the root, the 2nd, the 3rd and the 5th with fingers 1, 2, 3 and 5. Then play the same four notes an octave higher. All 8ths.',
      ru: 'Техника 4. Сыграйте основной тон, секунду, терцию и квинту пальцами 1, 2, 3 и 5. Затем те же четыре звука октавой выше. Всё восьмыми.',
    },
    rh: 't4',
    lh: 'o',
  },
  t5: {
    group: 'techniques',
    name: { en: '♩.♪♩ Dotted chords', ru: '♩.♪♩ Пунктирные аккорды' },
    idea: {
      en: 'A dotted chord, then the same chord an octave higher and held, over a wide arpeggio.',
      ru: 'Аккорд с точкой, затем тот же аккорд октавой выше и выдержанный, над широким арпеджио.',
    },
    description: {
      en: 'Technique 5. The right hand plays the chord as a dotted quarter, then an octave higher as an 8th and a half note. The chord can be in root position or an inversion. The left hand plays a wide arpeggio with fingers 5–2–1–2–1–2.',
      ru: 'Техника 5. Правая рука играет аккорд четвертью с точкой, затем октавой выше восьмой и половинной. Аккорд можно брать в основном виде или в обращении. Левая рука играет широкое арпеджио пальцами 5–2–1–2–1–2.',
    },
    rh: 't5',
    lh: 'wide',
  },
  c3: {
    group: 'techniques',
    name: { en: '3 chords', ru: '3 аккорда' },
    idea: {
      en: 'The same chord in three octaves, climbing, over a wide arpeggio.',
      ru: 'Один аккорд в трёх октавах, снизу вверх, над широким арпеджио.',
    },
    description: {
      en: 'Technique 6. Play the chord, then the same chord an octave higher, then two octaves higher. Hold the last one for a half note.',
      ru: 'Техника 6. Сыграйте аккорд, затем тот же аккорд октавой выше, затем на две октавы выше. Последний держите половинной.',
    },
    rh: 'c3',
    lh: 'wide',
  },
  inv: {
    group: 'techniques',
    name: { en: 'Inversions: root, 1st, 2nd', ru: 'Обращения: основной вид, 1-е, 2-е' },
    idea: {
      en: 'The chord in root position, then its 1st and 2nd inversions, over an arpeggio up to the 12th.',
      ru: 'Аккорд в основном виде, затем его 1-е и 2-е обращения, над арпеджио до дуодецимы.',
    },
    description: {
      en: 'Technique 7. An inversion is the same chord with another of its notes at the bottom. The right hand holds the chord in root position for a half note, then plays its 1st and 2nd inversions. The left hand plays 1–5–8–10 and holds the 12th, with fingers 5–2–1–2–1.',
      ru: 'Техника 7. Обращение — тот же аккорд, но внизу другой его звук. Правая рука держит аккорд в основном виде половинной, затем играет 1-е и 2-е обращения. Левая играет 1–5–8–10 и держит дуодециму, пальцы 5–2–1–2–1.',
    },
    rh: 'inv',
    lh: 'climb',
  },
  p51: {
    group: 'techniques',
    name: { en: '5.1 · The ♭7 under the root', ru: '5.1 · ♭7 под основным тоном' },
    idea: {
      en: 'The chord twice, then twice with its ♭7 added under the root, over dotted octaves.',
      ru: 'Аккорд дважды, затем дважды с ♭7 под основным тоном, над пунктирными октавами.',
    },
    description: {
      en: 'Technique 8. Play the chord on beats 1 and 2. On beats 3 and 4, add the ♭7, a whole tone under the root, at the bottom. Dm becomes Dm7.',
      ru: 'Техника 8. Сыграйте аккорд на 1-ю и 2-ю доли. На 3-ю и 4-ю добавьте снизу ♭7, на целый тон ниже основного тона. Так Dm становится Dm7.',
    },
    rh: 'p51',
    lh: 'dot',
  },
  p52: {
    group: 'techniques',
    name: { en: '5.2 · Falling line 1–7–♭7–6', ru: '5.2 · Нисходящая линия 1–7–♭7–6' },
    idea: {
      en: 'The lowest note of the chord falls by semitones: 1, 7, ♭7, 6.',
      ru: 'Нижний звук аккорда спускается по полутонам: 1, 7, ♭7, 6.',
    },
    description: {
      en: 'Technique 9. The 3rd and the 5th stay. Under them the root falls a semitone at a time, one note per beat: 1, 7, ♭7, 6. Over a major chord, play only the first three and hold the last.',
      ru: 'Техника 9. Терция и квинта остаются на месте. Под ними основной тон спускается по полутонам, по звуку на долю: 1, 7, ♭7, 6. На мажорном аккорде играйте только первые три и держите последний.',
    },
    rh: 'p52',
    lh: 'dot',
  },
  p53: {
    group: 'techniques',
    name: { en: '5.3 · The 3rd moves 3–2–4–3', ru: '5.3 · Терция движется 3–2–4–3' },
    idea: {
      en: 'The 3rd steps to the 2nd, up to the 4th and back, over dotted octaves.',
      ru: 'Терция уходит на секунду, затем на кварту и обратно, над пунктирными октавами.',
    },
    description: {
      en: 'Technique 10. Play a chord on every beat, keeping the root and the 5th. Only the middle note moves: from the 3rd to the 2nd, to the 4th and back. On D minor that is Dm, Dsus2, Dsus4, Dm.',
      ru: 'Техника 10. Аккорд на каждую долю, основной тон и квинта остаются. Двигается только средний звук: с терции на секунду, на кварту и обратно. В ре миноре это Dm, Dsus2, Dsus4, Dm.',
    },
    rh: 'p53',
    lh: 'dot',
  },
  s6u: {
    group: 'techniques',
    name: { en: 'Rising sixths', ru: 'Восходящие сексты' },
    idea: {
      en: 'Pairs of notes a 6th apart climb from the 3rd to the 5th over a 1–5–8–5 bass.',
      ru: 'Пары звуков через сексту поднимаются от терции к квинте над басом 1–5–8–5.',
    },
    description: {
      en: 'Technique 11, going up. The right hand plays sixths in 8ths, moving up the scale. It starts with the 3rd under the root and ends with the 5th under the 3rd, which it holds.',
      ru: 'Техника 11, вверх. Правая рука играет сексты восьмыми и поднимается по гамме. Начинает с терции под основным тоном и заканчивает квинтой под терцией, которую держит.',
    },
    rh: 's6u',
    lh: 'q',
  },
  s6d: {
    group: 'techniques',
    name: { en: 'Falling sixths', ru: 'Нисходящие сексты' },
    idea: {
      en: 'Pairs of notes a 6th apart fall from the 5th to the 3rd over a 1–5–8–5 bass.',
      ru: 'Пары звуков через сексту спускаются от квинты к терции над басом 1–5–8–5.',
    },
    description: {
      en: 'Technique 11, going down. The right hand plays sixths in 8ths, moving down the scale. It starts with the 5th under the 3rd and ends with the 3rd under the root, which it holds.',
      ru: 'Техника 11, вниз. Правая рука играет сексты восьмыми и спускается по гамме. Начинает с квинты под терцией и заканчивает терцией под основным тоном, которую держит.',
    },
    rh: 's6d',
    lh: 'q',
  },
  oct: {
    group: 'octaves',
    name: { en: 'Octaves', ru: 'Октавы' },
    idea: {
      en: 'Over a held octave bass, the right hand plays 1–2–3–5 in octaves, twice, climbing.',
      ru: 'Над выдержанной октавой в басу правая рука играет октавами 1–2–3–5, дважды, вверх.',
    },
    description: {
      en: 'Level 2, lesson 2, on the notes of the chord. Play octaves in 8ths with a loose wrist. On black keys the top note is usually taken with the 4th finger.',
      ru: 'Уровень 2, урок 2, по звукам аккорда. Играйте октавы восьмыми свободной кистью. На чёрных клавишах верхний звук чаще берут 4-м пальцем.',
    },
    rh: 'oc',
    lh: 'o',
  },
  octs: {
    group: 'octaves',
    name: { en: 'Octaves (scale)', ru: 'Октавы (гамма)' },
    idea: {
      en: 'Over a held octave bass, the right hand climbs the scale in octaves.',
      ru: 'Над выдержанной октавой в басу правая рука поднимается по гамме октавами.',
    },
    description: {
      en: 'Level 2, lesson 2, on the scale. Play eight octaves in 8ths, from the chord’s root up to its octave.',
      ru: 'Уровень 2, урок 2, по гамме. Сыграйте восемь октав восьмыми, от основного тона аккорда до его октавы.',
    },
    rh: 'ocs',
    lh: 'o',
  },
  chd: {
    group: 'octaves',
    name: { en: 'Chords', ru: 'Аккорды' },
    idea: {
      en: 'Four-note chords on every beat, the outer notes stepping up and back, over a climbing arpeggio.',
      ru: 'Четырёхзвучные аккорды на каждую долю, крайние звуки шагают вверх и обратно, над восходящим арпеджио.',
    },
    description: {
      en: 'Level 2, lesson 2. Play the chord with its octave on top. Then move the bottom and top notes up a step while the middle stays, play that twice, and step back.',
      ru: 'Уровень 2, урок 2. Сыграйте аккорд с октавой сверху. Затем поднимите нижний и верхний звуки на ступень, а средние оставьте, сыграйте так дважды и вернитесь.',
    },
    rh: 'chd',
    lh: 'climb',
  },
  r1: {
    group: 'seven-types',
    name: { en: '1 · Harmonic basis', ru: '1 · Гармоническая основа' },
    idea: {
      en: 'Chords and bass together in long, even notes, like a chorale.',
      ru: 'Аккорды и бас вместе долгими ровными нотами, как хорал.',
    },
    description: {
      en: 'Both hands play together in long, even notes: a chorale texture. It supports a choir or an ensemble. Use it for prayer hymns and for the start or the end of a song.',
      ru: 'Обе руки играют вместе долгими ровными нотами: хоральная фактура. Она поддерживает хор и ансамбль. Подходит для молитвенных гимнов, для начала или конца песни.',
    },
    rh: 'r1',
    lh: 'h',
  },
  r2: {
    group: 'seven-types',
    name: { en: '2 · Bass–chord alternation', ru: '2 · Чередование бас-аккорд' },
    idea: {
      en: 'The bass on the strong beats, the chord on the beats between.',
      ru: 'Бас на сильных долях, аккорд на долях между ними.',
    },
    description: {
      en: 'The left hand alternates the root and the 5th. The right hand answers with the chord between the bass notes. This gives a clear pulse, best for praise and joyful hymns. Play the chords lightly, with the top note a little louder.',
      ru: 'Левая рука чередует основной тон и квинту. Правая отвечает аккордом между звуками баса. Пульсация получается ясной, лучше всего для хвалы и радостных гимнов. Аккорды играйте легко, верхний звук чуть громче.',
    },
    rh: 'r2',
    lh: 'alt',
  },
  r3: {
    group: 'seven-types',
    name: { en: '3 · Chord pulse', ru: '3 · Аккордовая пульсация' },
    idea: {
      en: 'The chord repeats in 8ths over a bass on beats 1 and 3.',
      ru: 'Аккорд повторяется восьмыми над басом на 1-ю и 3-ю доли.',
    },
    description: {
      en: 'The right hand repeats the chord and the bass comes less often. Played slowly, it sounds calm and thoughtful. Played fast, it sounds excited. Use it for words that need emotion.',
      ru: 'Правая рука повторяет аккорд, бас звучит реже. Медленно это звучит спокойно и вдумчиво, быстро звучит взволнованно. Подходит для слов, которым нужна эмоция.',
    },
    rh: 'r3',
    lh: 'alt',
  },
  r4: {
    group: 'seven-types',
    name: { en: '4 · Harmonic figuration', ru: '4 · Гармоническая фигурация' },
    idea: {
      en: 'A flowing arpeggio passed from the left hand to the right, which plays chord notes 1–3–2–4–3 from the bottom.',
      ru: 'Плавное арпеджио переходит из левой руки в правую, которая играет звуки аккорда 1–3–2–4–3 снизу.',
    },
    description: {
      en: 'The left hand plays 1–5–8, with no 3rd. The right hand carries on with the chord’s notes in the order 1–3–2–4–3, counted from its lowest note. This is the type used most in church: it keeps the song moving and singing.',
      ru: 'Левая рука играет 1–5–8, без терции. Правая продолжает звуками аккорда в порядке 1–3–2–4–3, считая от нижнего. Это самый употребительный тип в церкви: он даёт песне движение и певучесть.',
    },
    rh: 'r4',
    lh: 'fig',
  },
  r4b: {
    group: 'seven-types',
    name: { en: '4b · Broken arpeggios', ru: '4б · Ломаные арпеджио' },
    idea: {
      en: 'Over a moving bass, the right hand breaks the chord: its lowest, top, middle and top notes.',
      ru: 'Над движущимся басом правая рука разбивает аккорд: нижний, верхний, средний и снова верхний звук.',
    },
    description: {
      en: 'The left hand alternates the root and the 5th. The right hand plays the chord one note at a time instead of all at once.',
      ru: 'Левая рука чередует основной тон и квинту. Правая играет аккорд по одному звуку, а не весь сразу.',
    },
    rh: 'r4b',
    lh: 'alt',
  },
  r5: {
    group: 'seven-types',
    name: { en: '5 · Melody doubling', ru: '5 · Дублирование мелодии' },
    idea: {
      en: 'The right hand plays the tune; the left hand breaks the chord under it.',
      ru: 'Правая рука играет мелодию, левая разбивает аккорд под ней.',
    },
    description: {
      en: 'The right hand doubles the tune the singers sing, and the left hand accompanies. This helps children and unsure singers. It also works for intros, interludes and endings.',
      ru: 'Правая рука дублирует мелодию, которую поют, а левая аккомпанирует. Это помогает детям и неуверенным певцам. Подходит и для вступлений, проигрышей и окончаний.',
    },
    rh: 'mel',
    lh: 'bro',
  },
  r6: {
    group: 'seven-types',
    name: { en: '6 · Elements of the melody', ru: '6 · С элементами мелодии' },
    idea: {
      en: 'The tune at the start and end of each phrase, with figuration between.',
      ru: 'Мелодия в начале и в конце каждой фразы, между ними фигурация.',
    },
    description: {
      en: 'The tune sounds only at the start and the end of each phrase, as anchor points. Figuration, the chord played as a moving pattern, fills the rest.',
      ru: 'Мелодия звучит только в начале и в конце каждой фразы, как опорные точки для певцов. Остальное заполняет фигурация: аккорд в виде подвижного рисунка.',
    },
    rh: 'melE',
    lh: 'fig',
  },
  r7: {
    group: 'seven-types',
    name: { en: '7 · Harmony in the melody', ru: '7 · Гармония в мелодии' },
    idea: {
      en: 'The tune on top, with chord notes added under its long notes.',
      ru: 'Мелодия сверху, под её долгими нотами добавлены звуки аккорда.',
    },
    description: {
      en: 'The tune is the top voice. Under its long notes, add up to two notes of the chord. Leave short notes single. The sound is full and bright, good for a whole congregation singing.',
      ru: 'Мелодия звучит верхним голосом. Под её долгими нотами добавьте до двух звуков аккорда. Короткие ноты оставьте одиночными. Звучит полно и ярко, хорошо для общего пения.',
    },
    rh: 'melH',
    lh: 'q',
  },
  g1: {
    group: 'gorshkov',
    name: { en: '1 · Chord pulse', ru: '1 · Аккордовая пульсация' },
    idea: {
      en: 'The chord on every beat over the held root, with beats 1 and 4 brighter.',
      ru: 'Аккорд на каждую долю над выдержанным басом, 1-я и 4-я доли ярче.',
    },
    description: {
      en: 'The simplest kind of movement: the harmony stays the same and is placed in time. The chord does not sound the same all bar. Beats 1 and 4 are brighter, beats 2 and 3 softer.',
      ru: 'Самый простой вид движения: гармония не меняется и распределяется во времени. Аккорд звучит в такте неодинаково. 1-я и 4-я доли ярче, 2-я и 3-я мягче.',
    },
    rh: 'g1',
    lh: 'r',
  },
  g2: {
    group: 'gorshkov',
    name: { en: '2 · Pulse with the 2nd', ru: '2 · Пульсация с секундой' },
    idea: {
      en: 'Each chord gets its 2nd, D in C major, and pulses on every beat over the root.',
      ru: 'Каждый аккорд получает секунду, ре в до мажоре, и пульсирует на каждую долю над басом.',
    },
    description: {
      en: 'A fourth note keeps the pulse from sounding plain. A major triad adds its 2nd (add2). A minor triad grows to its 9th.',
      ru: 'Четвёртый звук не даёт пульсации звучать плоско. Мажорное трезвучие получает секунду (add2). Минорное расширяется до ноны.',
    },
    rh: 'g2',
    lh: 'r',
  },
  g3: {
    group: 'gorshkov',
    name: { en: '3 · Broken in 8ths', ru: '3 · Ломаные аккорды восьмыми' },
    idea: {
      en: 'In 8ths: the 3rd and 5th together, then the 2nd under them. A new texture for a new section.',
      ru: 'Восьмыми: терция и квинта вместе, затем секунда под ними. Новая фактура для нового раздела.',
    },
    description: {
      en: 'Songs are built from phrases of 4, 8 or 16 bars. Mark a new section with a new texture, for example by moving from chords in quarters to broken chords in 8ths.',
      ru: 'Песни строятся из фраз по 4, 8 или 16 тактов. Новый раздел отмечают новой фактурой, например переходом от аккордов четвертями к ломаным аккордам восьмыми.',
    },
    rh: 'g3',
    lh: 'r',
  },
  g4: {
    group: 'gorshkov',
    name: { en: '4 · Harmonic figuration', ru: '4 · Гармоническая фигурация' },
    idea: {
      en: 'Sixteenths through the chord: its 5th, then up 1, 2 and 3.',
      ru: 'Шестнадцатые по звукам аккорда: квинта, затем вверх 1, 2 и 3.',
    },
    description: {
      en: 'The chord’s notes one after another. Use it to keep the song moving once broken chords have had their turn.',
      ru: 'Звуки аккорда по очереди. Так песню ведут дальше, когда ломаные аккорды уже прозвучали.',
    },
    rh: 'g4',
    lh: 'r',
  },
  g5: {
    group: 'gorshkov',
    name: { en: '5 · Pulse, then a run', ru: '5 · Пульсация, затем пассаж' },
    idea: {
      en: 'The chord on beats 1 to 3, then a run down 5, 3, 2, 1 on beat 4.',
      ru: 'Аккорд на 1–3-ю доли, затем пассаж вниз 5, 3, 2, 1 на 4-ю долю.',
    },
    description: {
      en: 'Chord pulse and figuration in one bar. The chord pulses on the first three beats. On the fourth, a short run leads into the next bar.',
      ru: 'Аккордовая пульсация и фигурация в одном такте. Аккорд пульсирует первые три доли. На четвёртую короткий пассаж ведёт в следующий такт.',
    },
    rh: 'g5',
    lh: 'r',
  },
  g6: {
    group: 'gorshkov',
    name: { en: '6 · A line on beats 3 and 4', ru: '6 · Линия на 3-ю и 4-ю доли' },
    idea: {
      en: 'The chord for two beats, then a line down its 9th, 7th, 5th and 3rd.',
      ru: 'Аккорд на две доли, затем линия вниз по ноне, септиме, квинте и терции.',
    },
    description: {
      en: 'The simplest melodic figuration. The harmony sits on the strong beats. Then a short line leads out into the next bar, down the notes of a 9th chord.',
      ru: 'Самая простая мелодическая фигурация. Гармония стоит на сильных долях. Затем короткая линия ведёт в следующий такт, вниз по звукам нонаккорда.',
    },
    rh: 'g6',
    lh: 'r',
  },
  block: {
    group: 'genres',
    name: { en: 'Whole notes', ru: 'Целые ноты' },
    idea: {
      en: 'The whole chord held for the bar over its root.',
      ru: 'Весь аккорд, выдержанный на такт, над основным тоном.',
    },
    rh: 'x1',
    lh: 'r',
  },
  flow: {
    group: 'genres',
    name: { en: 'Chord flow (I–IV–I–V–I shapes)', ru: 'Смена аккордов (обороты I–IV–I–V–I)' },
    idea: {
      en: 'Over a held root, the right hand moves through the key’s I, IV, I, V and back to I.',
      ru: 'Над выдержанным басом правая рука движется по аккордам тональности: I, IV, I, V и снова I.',
    },
    rh: 'flow',
    lh: 'r',
  },
  pop8: {
    group: 'genres',
    name: { en: 'Pop 8ths', ru: 'Поп-восьмые' },
    idea: {
      en: 'Steady chords in 8ths over a root on beats 1 and 3.',
      ru: 'Ровные аккорды восьмыми над басом на 1-ю и 3-ю доли.',
    },
    rh: 'r3',
    lh: 'pop',
  },
  popSync: {
    group: 'genres',
    name: { en: 'Pop syncopated', ru: 'Поп с синкопами' },
    idea: {
      en: 'Chords that land just ahead of the beat over a syncopated root.',
      ru: 'Аккорды чуть раньше доли над синкопированным басом.',
    },
    rh: 'sync',
    lh: 'sync',
  },
  ballad: {
    group: 'genres',
    name: { en: 'Ballad arpeggio', ru: 'Арпеджио баллады' },
    idea: {
      en: 'A gentle arpeggio over the root and 5th.',
      ru: 'Мягкое арпеджио над основным тоном и квинтой.',
    },
    rh: 'bal',
    lh: 'bal',
  },
  rock: {
    group: 'genres',
    name: { en: 'Rock', ru: 'Рок' },
    idea: {
      en: 'Driving chords in 8ths over octaves in 8ths.',
      ru: 'Напористые аккорды восьмыми над октавами восьмыми.',
    },
    rh: 'rock',
    lh: 'rock',
  },
  blues: {
    group: 'genres',
    name: { en: 'Blues shuffle', ru: 'Блюз-шаффл' },
    idea: {
      en: 'Short shuffled chords over a 1–5–6–5 boogie bass.',
      ru: 'Короткие аккорды в ритме шаффла над буги-басом 1–5–6–5.',
    },
    rh: 'blu',
    lh: 'shuf',
  },
  rnb: {
    group: 'genres',
    name: { en: 'R&B', ru: 'R&B' },
    idea: {
      en: 'Relaxed chords over a syncopated R&B bass.',
      ru: 'Неспешные аккорды над синкопированным R&B-басом.',
    },
    rh: 'rnb',
    lh: 'rnb',
  },
  jazz: {
    group: 'genres',
    name: { en: 'Jazz Charleston', ru: 'Джазовый чарльстон' },
    idea: {
      en: 'The Charleston rhythm, on beat 1 and just before beat 3, over the root and 5th.',
      ru: 'Ритм чарльстона, на 1-ю долю и чуть раньше 3-й, над основным тоном и квинтой.',
    },
    rh: 'jaz',
    lh: 'bal',
  },
  hiphop: {
    group: 'genres',
    name: { en: 'Hip-hop', ru: 'Хип-хоп' },
    idea: {
      en: 'A few syncopated chords over a held root.',
      ru: 'Редкие синкопированные аккорды над выдержанным басом.',
    },
    rh: 'hip',
    lh: 'r',
  },
  salsa: {
    group: 'genres',
    name: { en: 'Salsa montuno', ru: 'Монтуно сальсы' },
    idea: {
      en: 'The montuno, a broken chord that pushes across the beat, over a tumbao bass.',
      ru: 'Монтуно, ломаный аккорд со сдвигом относительно доли, над басом тумбао.',
    },
    rh: 'sal',
    lh: 'sal',
  },
  funk: {
    group: 'genres',
    name: { en: 'Funk', ru: 'Фанк' },
    idea: {
      en: 'Short, sharp chords over a busy funk bass.',
      ru: 'Короткие резкие аккорды над подвижным фанк-басом.',
    },
    rh: 'fun',
    lh: 'fun',
  },
  gospel: {
    group: 'genres',
    name: { en: 'Gospel', ru: 'Госпел' },
    idea: {
      en: 'Syncopated chords over gospel octaves.',
      ru: 'Синкопированные аккорды над госпел-октавами.',
    },
    rh: 'sync',
    lh: 'gos',
  },
  country: {
    group: 'genres',
    name: { en: 'Country', ru: 'Кантри' },
    idea: {
      en: 'Chords on the off-beats over a bass that alternates the root and 5th.',
      ru: 'Аккорды на слабые доли над басом, который чередует основной тон и квинту.',
    },
    rh: 'cty',
    lh: 'bal',
  },
}
