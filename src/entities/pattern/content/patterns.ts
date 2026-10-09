import type { MethodBookId } from '@/entities/book'
import type { LocalText } from '@/shared/i18n'
import type { EventPattern, Pattern } from '@/shared/lib/arrangement'
import {
  PATTERN_IDS,
  type LeftFigureId,
  type PatternEntry,
  type PatternGroup,
  type PatternId,
  type RightFigureId,
} from '../model/types'
import { LEFT_FIGURES, RIGHT_FIGURES } from './figures'

/** A group's own name, without its book's: a list that mixes the books says the book first. */
export const PATTERN_GROUP_NAMES: Readonly<Record<PatternGroup, LocalText>> = {
  'lesson-3': { en: 'The 5 ways (lesson 3)', ru: '5 способов (урок 3)' },
  techniques: { en: 'Right-hand techniques', ru: 'Техники правой руки' },
  'seven-types': { en: 'The 7 types of accompaniment', ru: '7 типов аккомпанемента' },
  genres: { en: 'Rhythm styles', ru: 'Ритмические стили' },
}

/** The method book that teaches a group's patterns; the rhythm styles are no book's. */
export const PATTERN_GROUP_BOOK: Readonly<Record<PatternGroup, MethodBookId | null>> = {
  'lesson-3': 'called-to-play',
  techniques: 'called-to-play',
  'seven-types': 'seven-types',
  genres: null,
}

type WrittenPattern = Omit<PatternEntry, 'pattern'>

const WRITTEN: Readonly<Record<PatternId, WrittenPattern>> = {
  M1: {
    group: 'lesson-3',
    name: { en: '1 · Bass + chords', ru: '1 · Бас + аккорды' },
    idea: {
      en: 'The chord on every beat over a held octave bass.',
      ru: 'Аккорд на каждую долю над выдержанной октавой в басу.',
    },
    description: {
      en: 'Left hand holds the bass in octaves, right hand plays the chord on every beat.',
      ru: 'Левая рука держит бас октавами, правая играет аккорд на каждую долю.',
    },
    rh: 'b1',
    lh: 'o',
  },
  M2: {
    group: 'lesson-3',
    name: { en: '2 · Broken chords', ru: '2 · Ломаные аккорды' },
    idea: {
      en: "The right hand rocks between the chord's upper notes and its lowest over a held octave.",
      ru: 'Правая рука качается между верхними звуками аккорда и нижним над выдержанной октавой.',
    },
    description: {
      en: 'Left hand holds the octave. Right hand rocks in 8ths between the upper notes of the chord it holds and its lowest: a G after C is B, then D and G.',
      ru: 'Левая рука держит октаву. Правая восьмыми чередует верхние звуки аккорда, который держит, и нижний: G после C — си, затем ре и соль.',
    },
    rh: 'b2',
    lh: 'o',
  },
  M3: {
    group: 'lesson-3',
    name: {
      en: '3 · Arpeggio (3rd, then 5th + octave)',
      ru: '3 · Арпеджио (терция, затем квинта + октава)',
    },
    idea: {
      en: 'A 1–5–8 arpeggio in the left hand, the 3rd and a held 5th and octave in the right.',
      ru: 'Арпеджио 1–5–8 в левой руке, в правой — терция, затем выдержанные квинта и октава.',
    },
    description: {
      en: 'Left hand 1–5–8 (fingers 5–2–1), right hand continues with the 3rd and holds the 5th and octave.',
      ru: 'Левая рука 1–5–8 (пальцы 5–2–1), правая продолжает терцией и держит квинту с октавой.',
    },
    rh: 'b3',
    lh: 'arp',
  },
  M4: {
    group: 'lesson-3',
    name: { en: '4 · Arpeggio 1–5–8 · 3–5–8–5–3', ru: '4 · Арпеджио 1–5–8 · 3–5–8–5–3' },
    idea: {
      en: 'One arpeggio climbs through both hands in 8ths and comes back down.',
      ru: 'Одно арпеджио восьмыми поднимается через обе руки и спускается обратно.',
    },
    description: {
      en: 'The arpeggio runs up through the left hand and on through the right hand, then comes back down. All 8ths.',
      ru: 'Арпеджио поднимается через левую руку, продолжается в правой и возвращается вниз. Всё восьмыми.',
    },
    rh: 'b4',
    lh: 'arp',
  },
  M5: {
    group: 'lesson-3',
    name: { en: '5 · Bass + chords (dotted bass)', ru: '5 · Бас + аккорды (пунктирный бас)' },
    idea: {
      en: 'The chord on every beat over octaves in a long–short rhythm.',
      ru: 'Аккорд на каждую долю над октавами в ритме «долго–коротко».',
    },
    description: {
      en: 'Right hand plays the chord on every beat, left hand plays octaves in a long–short (♩. ♪) rhythm.',
      ru: 'Правая рука играет аккорд на каждую долю, левая — октавы в ритме «долго–коротко» (♩. ♪).',
    },
    rh: 'b1',
    lh: 'dot',
  },
  t1: {
    group: 'techniques',
    name: { en: '♪♩ Chord, then octave jumps', ru: '♪♩ Аккорд, затем скачки на октаву' },
    idea: {
      en: 'The chord, then its root jumping up one and two octaves.',
      ru: 'Аккорд, затем его основной тон прыгает на одну и две октавы вверх.',
    },
    description: {
      en: 'Technique 1: the chord, then the root one and two octaves higher and back.',
      ru: 'Техника 1: аккорд, затем основной тон на одну и две октавы выше и обратно.',
    },
    rh: 't1',
    lh: 'o',
  },
  t2: {
    group: 'techniques',
    name: { en: '♪♪♪♪ Arpeggio up two octaves', ru: '♪♪♪♪ Арпеджио вверх на две октавы' },
    idea: {
      en: 'A right-hand arpeggio climbing two octaves over a held bass.',
      ru: 'Арпеджио правой руки на две октавы вверх над выдержанным басом.',
    },
    description: {
      en: 'Technique 2: right hand arpeggio 1–3–5–8 twice, fingers 1–2–3–5.',
      ru: 'Техника 2: арпеджио правой рукой 1–3–5–8 дважды, пальцы 1–2–3–5.',
    },
    rh: 't2',
    lh: 'o',
  },
  t3: {
    group: 'techniques',
    name: { en: '♬ Runs down to the root', ru: '♬ Пассажи вниз к основному тону' },
    idea: {
      en: 'The 2nd and 5th together, then down 3–2–1 to the root, twice an octave apart.',
      ru: 'Секунда и квинта вместе, затем вниз 3–2–1 к основному тону, дважды через октаву.',
    },
    description: {
      en: 'Technique 3: the 2nd and 5th together (fingers 2 and 5), then the 3rd, the 2nd and the root (3–2–1), all in 8ths; then the same an octave lower.',
      ru: 'Техника 3: секунда и квинта вместе (пальцы 2 и 5), затем терция, секунда и основной тон (3–2–1), всё восьмыми; затем то же октавой ниже.',
    },
    rh: 't3',
    lh: 'o',
  },
  t4: {
    group: 'techniques',
    name: { en: '♫ Run up 1–2–3–5', ru: '♫ Пассаж вверх 1–2–3–5' },
    idea: {
      en: 'The root, 2nd, 3rd and 5th up two octaves in 8ths.',
      ru: 'Основной тон, секунда, терция и квинта вверх на две октавы восьмыми.',
    },
    description: {
      en: 'Technique 4: the root, 2nd, 3rd and 5th (fingers 1–2–3–5), then again an octave higher, all in 8ths.',
      ru: 'Техника 4: основной тон, секунда, терция и квинта (пальцы 1–2–3–5), затем ещё раз октавой выше, всё восьмыми.',
    },
    rh: 't4',
    lh: 'o',
  },
  t5: {
    group: 'techniques',
    name: { en: '♩.♪♩ Dotted chords', ru: '♩.♪♩ Пунктирные аккорды' },
    idea: {
      en: 'The chord dotted, then an octave higher and held, over a wide arpeggio.',
      ru: 'Аккорд с точкой, затем октавой выше и выдержанный, над широким арпеджио.',
    },
    description: {
      en: 'Technique 5: the chord as a dotted quarter, then an octave higher as an 8th and a half note; it may be played in root position or an inversion. Left hand wide arpeggio (fingers 5–2–1–2–1–2).',
      ru: 'Техника 5: аккорд четвертью с точкой, затем октавой выше восьмой и половинной; его можно играть в основном виде или в обращении. Левая рука — широкое арпеджио (пальцы 5–2–1–2–1–2).',
    },
    rh: 't5',
    lh: 'wide',
  },
  c3: {
    group: 'techniques',
    name: { en: '3 chords', ru: '3 аккорда' },
    idea: {
      en: 'The chord in three octaves, climbing, over a wide arpeggio.',
      ru: 'Аккорд в трёх октавах, вверх, над широким арпеджио.',
    },
    description: {
      en: 'Technique 6: the chord, then an octave and two octaves higher, the last one held for a half note.',
      ru: 'Техника 6: аккорд, затем на октаву и на две октавы выше, последний выдержан половинной.',
    },
    rh: 'c3',
    lh: 'wide',
  },
  inv: {
    group: 'techniques',
    name: { en: 'Invers. · Inversions', ru: 'Обращ. · Обращения' },
    idea: {
      en: 'Root position held, then the 1st and 2nd inversion, over an arpeggio to the 12th.',
      ru: 'Основной вид с задержкой, затем 1-е и 2-е обращения, над арпеджио до дуодецимы.',
    },
    description: {
      en: 'Technique 7: the chord in root position for a half note, then its 1st and 2nd inversion. Left hand 1–5–8–10, then the 12th held (fingers 5–2–1–2–1).',
      ru: 'Техника 7: аккорд в основном виде половинной, затем в 1-м и 2-м обращении. Левая рука 1–5–8–10, затем выдержанная дуодецима (пальцы 5–2–1–2–1).',
    },
    rh: 'inv',
    lh: 'climb',
  },
  p51: {
    group: 'techniques',
    name: { en: '5.1 · The ♭7 under the root', ru: '5.1 · ♭7 под основным тоном' },
    idea: {
      en: 'The chord twice, then twice with its ♭7 under the root, over dotted octaves.',
      ru: 'Аккорд дважды, затем дважды с ♭7 под основным тоном, над пунктирными октавами.',
    },
    description: {
      en: 'Technique 8: the chord on beats 1 and 2, then with the ♭7 a whole tone under its root on 3 and 4 (Dm → Dm7).',
      ru: 'Техника 8: аккорд на 1-ю и 2-ю доли, затем с ♭7 на целый тон ниже основного тона на 3-ю и 4-ю (Dm → Dm7).',
    },
    rh: 'p51',
    lh: 'dot',
  },
  p52: {
    group: 'techniques',
    name: { en: '5.2 · Falling line 1–7–♭7–6', ru: '5.2 · Нисходящая линия 1–7–♭7–6' },
    idea: {
      en: 'The lowest voice falls by half steps: 1, 7, ♭7, 6.',
      ru: 'Нижний голос спускается по полутонам: 1, 7, ♭7, 6.',
    },
    description: {
      en: 'Technique 9: the root falls by half steps under the chord: 1, 7, ♭7, 6. A major chord plays only the first three, the last held.',
      ru: 'Техника 9: основной тон спускается по полутонам под аккордом: 1, 7, ♭7, 6. Мажорный аккорд играет только первые три, последний выдержан.',
    },
    rh: 'p52',
    lh: 'dot',
  },
  p53: {
    group: 'techniques',
    name: { en: '5.3 · The 3rd moves 3–2–4–3', ru: '5.3 · Терция движется 3–2–4–3' },
    idea: {
      en: 'The 3rd moves to the 2nd, the 4th and back, over dotted octaves.',
      ru: 'Терция уходит во вторую ступень, в четвёртую и обратно над пунктирными октавами.',
    },
    description: {
      en: 'Technique 10: the 3rd moves to the 2nd, the 4th and back.',
      ru: 'Техника 10: терция переходит в секунду, в кварту и обратно.',
    },
    rh: 'p53',
    lh: 'dot',
  },
  s6u: {
    group: 'techniques',
    name: { en: '6th↑ · Rising sixths', ru: 'Сексты ↑ · Восходящие сексты' },
    idea: {
      en: 'Parallel sixths climb from the 3rd to the 5th over a 1–5–8–5 bass.',
      ru: 'Параллельные сексты поднимаются от терции к квинте над басом 1–5–8–5.',
    },
    description: {
      en: 'Technique 11, up: sixths in 8ths, the 3rd under the root, then up the scale to the 5th under the 3rd, held.',
      ru: 'Техника 11, вверх: сексты восьмыми, терция под основным тоном, затем вверх по гамме до квинты под терцией, с задержкой.',
    },
    rh: 's6u',
    lh: 'q',
  },
  s6d: {
    group: 'techniques',
    name: { en: '6th↓ · Falling sixths', ru: 'Сексты ↓ · Нисходящие сексты' },
    idea: {
      en: 'Parallel sixths fall from the 5th to the 3rd over a 1–5–8–5 bass.',
      ru: 'Параллельные сексты спускаются от квинты к терции над басом 1–5–8–5.',
    },
    description: {
      en: 'Technique 11, down: sixths in 8ths, the 5th under the 3rd, then down the scale to the 3rd under the root, held.',
      ru: 'Техника 11, вниз: сексты восьмыми, квинта под терцией, затем вниз по гамме до терции под основным тоном, с задержкой.',
    },
    rh: 's6d',
    lh: 'q',
  },
  r1: {
    group: 'seven-types',
    name: { en: '1 · Harmonic basis', ru: '1 · Гармоническая основа' },
    idea: {
      en: 'Chords and bass together in long, even notes: a chorale.',
      ru: 'Аккорды и бас вместе долгими ровными нотами — хорал.',
    },
    description: {
      en: 'Chords and bass together in long, even notes (chorale texture). Supports choirs and ensembles; good for prayer hymns and for the start or the end of a song.',
      ru: 'Аккорды и бас вместе, долгими ровными нотами (хоральная фактура). Поддерживает хор и ансамбль; подходит для молитвенных гимнов, для начала или конца песни.',
    },
    rh: 'r1',
    lh: 'h',
  },
  r2: {
    group: 'seven-types',
    name: { en: '2 · Bass–chord alternation', ru: '2 · Чередование бас-аккорд' },
    idea: {
      en: 'The bass on the strong beats, the chord between them.',
      ru: 'Бас на сильных долях, аккорд между ними.',
    },
    description: {
      en: 'The bass moves through the notes of the triad. A clear pulse, best for praise and joyful hymns. Play the chords lightly, the top note a little louder.',
      ru: 'Бас движется по звукам трезвучия. Ясная пульсация, лучше всего для хвалы и радостных гимнов. Аккорды играйте легко, верхний звук чуть громче.',
    },
    rh: 'r2',
    lh: 'alt',
  },
  r3: {
    group: 'seven-types',
    name: { en: '3 · Chord pulse', ru: '3 · Аккордовая пульсация' },
    idea: {
      en: 'The chord pulses in 8ths over a bass on beats 1 and 3.',
      ru: 'Аккорд пульсирует восьмыми над басом на 1-ю и 3-ю доли.',
    },
    description: {
      en: 'The right hand repeats the chord, the bass comes less often. Slow is calm and thoughtful, fast is excited: for words that need emotion.',
      ru: 'Правая рука повторяет аккорд, бас звучит реже. Медленно — спокойно и вдумчиво, быстро — взволнованно: для слов, которым нужна эмоция.',
    },
    rh: 'r3',
    lh: 'alt',
  },
  r4: {
    group: 'seven-types',
    name: { en: '4 · Harmonic figuration', ru: '4 · Гармонические фигурации' },
    idea: {
      en: 'A flowing arpeggio from the left hand into the right, 1–3–2–4–3.',
      ru: 'Плавное арпеджио из левой руки в правую, 1–3–2–4–3.',
    },
    description: {
      en: 'The arpeggio passes from the left hand (1–5–8, without the 3rd) into the right hand, which plays the chord notes in the order 1–3–2–4–3. The most used type in church: it brings movement and sings.',
      ru: 'Арпеджио переходит из левой руки (1–5–8, без терции) в правую, которая играет звуки аккорда в порядке 1–3–2–4–3. Самый употребительный тип в церкви: даёт движение и певучесть.',
    },
    rh: 'r4',
    lh: 'fig',
  },
  r4b: {
    group: 'seven-types',
    name: { en: '4b · Broken arpeggios', ru: '4b · Ломаные арпеджио' },
    idea: {
      en: 'The right hand breaks the chord 1–3–2–3 over a moving bass.',
      ru: 'Правая рука разбивает аккорд 1–3–2–3 над движущимся басом.',
    },
    description: {
      en: 'The right hand breaks the chord while the bass moves through the triad.',
      ru: 'Правая рука играет ломаное арпеджио, а бас движется по трезвучию.',
    },
    rh: 'r4b',
    lh: 'alt',
  },
  r5: {
    group: 'seven-types',
    name: { en: '5 · Melody doubling', ru: '5 · Дублирование мелодии' },
    idea: {
      en: 'The right hand plays the tune, the left breaks the chord under it.',
      ru: 'Правая рука играет мелодию, левая разбивает аккорд под ней.',
    },
    description: {
      en: 'The right hand plays the tune, the left hand accompanies. Helps children and unsure singers; good for intros, interludes and endings too.',
      ru: 'Правая рука играет мелодию, левая аккомпанирует. Помогает детям и неуверенным певцам; хорошо и для вступлений, проигрышей и окончаний.',
    },
    rh: 'mel',
    lh: 'bro',
  },
  r6: {
    group: 'seven-types',
    name: { en: '6 · Elements of the melody', ru: '6 · С элементами мелодии' },
    idea: {
      en: "The tune at each phrase's start and end, figuration between.",
      ru: 'Мелодия в начале и конце фраз, между ними — фигурация.',
    },
    description: {
      en: 'The melody sounds only at the start and the end of each phrase, as anchor points. Figuration fills the rest.',
      ru: 'Мелодия звучит только в начале и в конце каждой фразы, как опорные точки. Остальное заполняет фигурация.',
    },
    rh: 'melE',
    lh: 'fig',
  },
  r7: {
    group: 'seven-types',
    name: { en: '7 · Harmony in the melody', ru: '7 · Гармония в мелодии' },
    idea: {
      en: 'The tune on top with chord notes under its long notes.',
      ru: 'Мелодия сверху, под её долгими нотами — звуки аккорда.',
    },
    description: {
      en: 'The melody is the top voice; up to two chord notes join it under long notes, short notes stay single. Full and bright for congregational singing.',
      ru: 'Мелодия — верхний голос; под долгими нотами к ней добавляются до двух звуков аккорда, короткие остаются одиночными. Полно и ярко для общего пения.',
    },
    rh: 'melH',
    lh: 'q',
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
    name: { en: 'Chord flow (I–IV–V shapes)', ru: 'Chord flow (обороты I–IV–V)' },
    idea: {
      en: "The key's I, IV and V shapes moving under a held root.",
      ru: 'Обороты I, IV и V тональности над выдержанным басом.',
    },
    rh: 'flow',
    lh: 'r',
  },
  pop8: {
    group: 'genres',
    name: { en: 'Pop 8ths', ru: 'Поп-восьмые' },
    idea: {
      en: 'Steady 8th-note chords over a root on beats 1 and 3.',
      ru: 'Ровные аккорды восьмыми над басом на 1-ю и 3-ю доли.',
    },
    rh: 'r3',
    lh: 'pop',
  },
  popSync: {
    group: 'genres',
    name: { en: 'Pop syncopated', ru: 'Поп с синкопами' },
    idea: {
      en: 'Chords pushed ahead of the beat over a syncopated root.',
      ru: 'Аккорды, опережающие долю, над синкопированным басом.',
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
      en: 'Driving 8th-note chords over octaves in 8ths.',
      ru: 'Напористые аккорды восьмыми над октавами восьмыми.',
    },
    rh: 'rock',
    lh: 'rock',
  },
  blues: {
    group: 'genres',
    name: { en: 'Blues shuffle', ru: 'Блюз-шаффл' },
    idea: {
      en: 'Shuffled stabs over a 1–5–6–5 boogie bass.',
      ru: 'Шаффл-аккорды над буги-басом 1–5–6–5.',
    },
    rh: 'blu',
    lh: 'shuf',
  },
  rnb: {
    group: 'genres',
    name: { en: 'R&B', ru: 'R&B' },
    idea: {
      en: 'Laid-back chords over a syncopated R&B bass.',
      ru: 'Неспешные аккорды над синкопированным R&B-басом.',
    },
    rh: 'rnb',
    lh: 'rnb',
  },
  jazz: {
    group: 'genres',
    name: { en: 'Jazz Charleston', ru: 'Джазовый чарльстон' },
    idea: {
      en: 'The Charleston rhythm: on 1 and just before 3, over root and 5th.',
      ru: 'Ритм чарльстона: на 1 и перед 3-й долей, над основным тоном и квинтой.',
    },
    rh: 'jaz',
    lh: 'bal',
  },
  hiphop: {
    group: 'genres',
    name: { en: 'Hip-hop', ru: 'Хип-хоп' },
    idea: {
      en: 'Sparse, syncopated chords over a held root.',
      ru: 'Редкие синкопированные аккорды над выдержанным басом.',
    },
    rh: 'hip',
    lh: 'r',
  },
  salsa: {
    group: 'genres',
    name: { en: 'Salsa montuno', ru: 'Монтуно сальсы' },
    idea: {
      en: "The montuno's off-beat chords over a tumbao bass.",
      ru: 'Аккорды монтуно мимо долей над басом тумбао.',
    },
    rh: 'sal',
    lh: 'sal',
  },
  funk: {
    group: 'genres',
    name: { en: 'Funk', ru: 'Фанк' },
    idea: {
      en: 'Short, sharp stabs over a busy funk bass.',
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
      en: 'Chords on the off-beats over an alternating root and 5th.',
      ru: 'Аккорды на слабые доли над чередованием основного тона и квинты.',
    },
    rh: 'cty',
    lh: 'bal',
  },
}

function eventPattern(id: string, rh: RightFigureId, lh: LeftFigureId): EventPattern {
  const right = RIGHT_FIGURES[rh].figure
  if (right.kind !== 'events') throw new Error(`Pattern ${id}: ${rh} plays the tune`)
  return { id, rh: right, lh: LEFT_FIGURES[lh].figure }
}

/** What a pattern that plays the tune plays, both hands, on a piece with no melody. */
const WITHOUT_MELODY = eventPattern('r4', WRITTEN.r4.rh, WRITTEN.r4.lh)

/**
 * The pattern `arrange` plays for a figure in each hand, under `id`: a right hand that plays the tune
 * falls back to Harmonic figuration (r4) on a piece with no melody.
 */
export function figurePattern(id: string, rh: RightFigureId, lh: LeftFigureId): Pattern {
  const right = RIGHT_FIGURES[rh].figure
  if (right.kind === 'events') return eventPattern(id, rh, lh)
  return { id, rh: right, lh: LEFT_FIGURES[lh].figure, withoutMelody: WITHOUT_MELODY }
}

const patternOf = (id: PatternId): Pattern =>
  id === WITHOUT_MELODY.id ? WITHOUT_MELODY : figurePattern(id, WRITTEN[id].rh, WRITTEN[id].lh)

export const PATTERNS = Object.fromEntries(
  PATTERN_IDS.map((id) => [id, { ...WRITTEN[id], pattern: patternOf(id) }]),
) as Readonly<Record<PatternId, PatternEntry>>
