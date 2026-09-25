import type { EventFigure, Figure } from '@/shared/lib/arrangement'
import {
  eventFigure,
  type FigureEntry,
  type LeftFigureId,
  type RightFigureId,
} from '../model/types'

// Figure notation: see docs/CONTENT.md. The melody figures fall back to r4 (and `ends` plays r4b
// between a line's ends), so those two are written first.
const R4 = eventFigure('6/2 v1,8/2 v3,10/2 v2,12/2 v4,14/2 v3', {
  inThree: '6/2 v1,8/2 v3,10/2 v2',
})
const R4B = eventFigure('0/2 v1,2/2 v3,4/2 v2,6/2 v3,8/2 v1,10/2 v3,12/2 v2,14/2 v3')

export const RIGHT_FIGURES: Readonly<Record<RightFigureId, FigureEntry<Figure>>> = {
  b1: {
    name: { en: 'Chord on every beat', ru: 'Аккорд на каждую долю' },
    figure: eventFigure('0/4 C,4/4 C,8/4 C,12/4 C'),
  },
  b2: {
    name: { en: 'Broken chord: 3rd+5th, root', ru: 'Ломаный аккорд: терция+квинта, основной тон' },
    figure: eventFigure('0/2 U,2/2 1^1,4/2 U,6/2 1^1,8/2 U,10/2 1^1,12/2 U,14/2 1^1'),
  },
  b3: {
    name: { en: 'Arpeggio: 3rd, then 5th + octave', ru: 'Арпеджио: терция, затем квинта + октава' },
    figure: eventFigure('6/2 3^1,8/8 5^2+8^5'),
  },
  b4: {
    name: { en: 'Arpeggio 3–5–8–5–3', ru: 'Арпеджио 3–5–8–5–3' },
    figure: eventFigure('6/2 3^1,8/2 5^2,10/2 8^5,12/2 5^2,14/2 3^1'),
  },
  t1: {
    name: { en: '♪♩ Chord, then octave jumps', ru: '♪♩ Аккорд, затем скачки на октаву' },
    figure: eventFigure('0/6 T,6/2 8^1,8/4 15^5,12/4 8^1'),
  },
  t2: {
    name: { en: '♪♪♪♪ Arpeggio up two octaves', ru: '♪♪♪♪ Арпеджио вверх на две октавы' },
    figure: eventFigure('0/2 1^1,2/2 3^2,4/2 5^3,6/2 8^5,8/2 8^1,10/2 10^2,12/2 12^3,14/2 15^5'),
  },
  t3: {
    name: { en: '♬ Runs down from the top', ru: '♬ Пассажи вниз от верхнего звука' },
    figure: eventFigure(
      '0/2 8^2+12^5,2/2 10^3,4/2 9^2,6/2 8^1,8/2 1^2+5^5,10/2 3^3,12/2 2^2,14/2 1^1',
    ),
  },
  t4: {
    name: { en: '♬ Fast arpeggio up, then chord', ru: '♬ Быстрое арпеджио вверх, затем аккорд' },
    figure: eventFigure(
      '0/1 1^1,1/1 3^2,2/1 5^3,3/1 8^5,4/1 8^1,5/1 10^2,6/1 12^3,7/1 15^5,8/8 T8',
    ),
  },
  t5: {
    name: {
      en: '♩.♪♩ Dotted chords through inversions',
      ru: '♩.♪♩ Пунктирные аккорды по обращениям',
    },
    figure: eventFigure('0/6 T,6/2 T1,8/8 T2'),
  },
  c3: {
    name: {
      en: '3 chords climbing (last one rolled)',
      ru: '3 аккорда вверх (последний арпеджирован)',
    },
    figure: eventFigure('0/4 T,4/4 T1,8/8 T2~'),
  },
  inv: {
    name: { en: 'Inversions: root, 1st, 2nd', ru: 'Обращения: основной вид, 1-е, 2-е' },
    figure: eventFigure('0/8 T,8/4 T1,12/4 T2'),
  },
  p51: {
    name: { en: '5.1 Root steps down to ♭7', ru: '5.1 Основной тон спускается к ♭7' },
    figure: eventFigure('0/4 T,4/4 T,8/4 _b7+3+5,12/4 _b7+3+5'),
  },
  p52: {
    name: { en: '5.2 Falling line 1–7–♭7–6', ru: '5.2 Нисходящая линия 1–7–♭7–6' },
    figure: eventFigure('0/4 T,4/4 _7+3+5,8/4 _b7+3+5,12/4 _6+3+5', {
      onMajor: '0/4 T,4/4 _7+3+5,8/4 _b7+3+5,12/4 _b7+3+5',
    }),
  },
  p53: {
    name: { en: '5.3 The 3rd moves 3–2–4–3', ru: '5.3 Терция движется 3–2–4–3' },
    figure: eventFigure('0/4 T,4/4 1+2+5,8/4 1+4+5,12/4 T'),
  },
  s6u: {
    name: { en: '6th↑ Rising sixths', ru: 'Сексты ↑ Восходящие сексты' },
    figure: eventFigure('0/2 s2+s7,2/2 s3+s8,4/2 s3+s8,6/2 s4+s9,8/8 5+8'),
  },
  s6d: {
    name: { en: '6th↓ Falling sixths', ru: 'Сексты ↓ Нисходящие сексты' },
    figure: eventFigure('0/2 s4+s9,2/2 s3+s8,4/2 s3+s8,6/2 s2+s7,8/8 s2+s7'),
  },
  r1: {
    name: { en: 'Held chords (half notes)', ru: 'Выдержанные аккорды (половинные)' },
    figure: eventFigure('0/8 C,8/8 C'),
  },
  r2: {
    name: { en: 'Chord on the off-beats', ru: 'Аккорд на слабые доли' },
    figure: eventFigure('4/4 C,12/4 C', { inThree: '4/4 C,8/4 C' }),
  },
  r3: {
    name: { en: 'Pulsing chords (8ths)', ru: 'Пульсирующие аккорды (восьмые)' },
    figure: eventFigure('0/2 C!,2/2 C,4/2 C,6/2 C,8/2 C!,10/2 C,12/2 C,14/2 C'),
  },
  r4: {
    name: { en: 'Figuration 1–3–2–4–3', ru: 'Фигурация 1–3–2–4–3' },
    figure: R4,
  },
  r4b: {
    name: { en: 'Broken arpeggio 1–3–2–3', ru: 'Ломаное арпеджио 1–3–2–3' },
    figure: R4B,
  },
  mel: {
    name: { en: 'Melody (doubling the tune)', ru: 'Мелодия (дублирование напева)' },
    figure: { kind: 'melody', use: 'double', withoutMelody: R4 },
  },
  melE: {
    name: { en: 'Melody at phrase starts and ends', ru: 'Мелодия в начале и в конце фраз' },
    figure: { kind: 'melody', use: 'ends', between: R4B, withoutMelody: R4 },
  },
  melH: {
    name: { en: 'Melody with chord notes under it', ru: 'Мелодия с аккордовыми звуками под ней' },
    figure: { kind: 'melody', use: 'harmony', withoutMelody: R4 },
  },
  x1: {
    name: { en: 'Whole-note chord', ru: 'Аккорд целыми нотами' },
    figure: eventFigure('0/16 C'),
  },
  flow: {
    name: { en: 'Chord flow: I–IV–I–V–I shapes', ru: 'Chord flow: обороты I–IV–I–V–I' },
    figure: eventFigure('0/4 Ka,4/2 Kb,6/2 Ka,8/2 Kc,10/6 Ka'),
  },
  sync: {
    name: { en: 'Syncopated chords', ru: 'Синкопированные аккорды' },
    figure: eventFigure('0/3 C,3/3 C,6/4 C,10/3 C,13/3 C'),
  },
  bal: {
    name: { en: 'Ballad arpeggio', ru: 'Арпеджио баллады' },
    figure: eventFigure('2/2 v1,4/2 v2,6/2 v3,8/2 v4,10/2 v3,12/2 v2,14/2 v1'),
  },
  rock: {
    name: { en: 'Rock 8ths', ru: 'Рок-восьмые' },
    figure: eventFigure('0/2 C!,2/2 C,4/2 C!,6/2 C,8/2 C!,10/2 C,12/2 C!,14/2 C'),
  },
  blu: {
    name: { en: 'Blues shuffle stabs', ru: 'Короткие аккорды блюз-шаффла' },
    figure: eventFigure('3/6 C,9/3 C', { triplets: true }),
  },
  rnb: {
    name: { en: 'R&B chords', ru: 'Аккорды R&B' },
    figure: eventFigure('0/3 C,3/3 C,6/4 C,10/2 C,12/4 C'),
  },
  jaz: {
    name: { en: 'Charleston', ru: 'Чарльстон' },
    figure: eventFigure('0/6 C,6/10 C'),
  },
  hip: {
    name: { en: 'Hip-hop chords', ru: 'Аккорды хип-хопа' },
    figure: eventFigure('0/3 C,3/3 C,6/8 C,14/2 C'),
  },
  sal: {
    name: { en: 'Salsa montuno', ru: 'Монтуно сальсы' },
    figure: eventFigure('0/2 v1,2/2 v3,4/2 v2,6/1 v3,7/2 v1,9/2 v3,11/2 v2,13/1 v3,14/2 v1'),
  },
  fun: {
    name: { en: 'Funk stabs', ru: 'Короткие фанковые аккорды' },
    figure: eventFigure('1/2 C,3/3 C,6/3 C,9/2 C,11/3 C,14/2 C'),
  },
  cty: {
    name: { en: 'Country off-beats', ru: 'Кантри: слабые доли' },
    figure: eventFigure('4/8 C,12/4 C'),
  },
}

export const LEFT_FIGURES: Readonly<Record<LeftFigureId, FigureEntry<EventFigure>>> = {
  o: {
    name: { en: 'Octave, whole note', ru: 'Октава целой нотой' },
    figure: eventFigure('0/16 L1+L8'),
  },
  r: {
    name: { en: 'Root, whole note', ru: 'Основной тон целой нотой' },
    figure: eventFigure('0/16 L1'),
  },
  h: {
    name: { en: 'Octave on beats 1 and 3', ru: 'Октава на 1-ю и 3-ю доли' },
    figure: eventFigure('0/8 L1+L8,8/8 L1+L8'),
  },
  dot: {
    name: { en: 'Dotted octaves ♩. ♪', ru: 'Пунктирные октавы ♩. ♪' },
    figure: eventFigure('0/6 L1+L8,6/2 L1+L8,8/6 L1+L8,14/2 L1+L8'),
  },
  arp: {
    name: { en: 'Arpeggio 1–5–8 (held)', ru: 'Арпеджио 1–5–8 (с задержкой звуков)' },
    figure: eventFigure('0/16 L1^5,2/14 L5^2,4/12 L8^1'),
  },
  wide: {
    name: { en: 'Wide arpeggio 1–5–8–10–12–10', ru: 'Широкое арпеджио 1–5–8–10–12–10' },
    figure: eventFigure('0/2 L1^5,2/2 L5^2,4/2 L8^1,6/2 L10^2,8/4 L12^1,12/4 L10^2'),
  },
  q: {
    name: { en: '1–5–8–5 in quarters', ru: '1–5–8–5 четвертями' },
    figure: eventFigure('0/4 L1^5,4/4 L5^2,8/4 L8^1,12/4 L5^2'),
  },
  alt: {
    name: {
      en: 'Bass on beats 1 and 3 (root, 5th)',
      ru: 'Бас на 1-ю и 3-ю доли (основной тон, квинта)',
    },
    figure: eventFigure('0/4 L1,8/4 L5', { inThree: '0/4 L1' }),
  },
  walk: {
    name: { en: 'Walking the triad 1–3–5–3', ru: 'Ход по трезвучию 1–3–5–3' },
    figure: eventFigure('0/4 L1^5,4/4 L3^3,8/4 L5^1,12/4 L3^3'),
  },
  fig: {
    name: { en: 'Figuration 1–5–8 (no 3rd)', ru: 'Фигурация 1–5–8 (без терции)' },
    figure: eventFigure('0/2 L1^5,2/2 L5^2,4/2 L8^1'),
  },
  bro: {
    name: { en: 'Broken chord 1–5–10–5', ru: 'Ломаный аккорд 1–5–10–5' },
    figure: eventFigure(
      '0/2 L1^5,2/2 L5^2,4/2 L10^1,6/2 L5^2,8/2 L1^5,10/2 L5^2,12/2 L10^1,14/2 L5^2',
    ),
  },
  pop: {
    name: { en: 'Root on beats 1 and 3', ru: 'Основной тон на 1-ю и 3-ю доли' },
    figure: eventFigure('0/8 L1,8/8 L1'),
  },
  sync: {
    name: { en: 'Syncopated root', ru: 'Синкопированный основной тон' },
    figure: eventFigure('0/6 L1,6/2 L1,8/8 L1'),
  },
  bal: {
    name: { en: 'Root, then 5th', ru: 'Основной тон, затем квинта' },
    figure: eventFigure('0/8 L1,8/8 L5'),
  },
  rock: {
    name: { en: 'Driving octaves (8ths)', ru: 'Напористые октавы (восьмые)' },
    figure: eventFigure(
      '0/2 L1+L8,2/2 L1+L8,4/2 L1+L8,6/2 L1+L8,8/2 L1+L8,10/2 L1+L8,12/2 L1+L8,14/2 L1+L8',
    ),
  },
  shuf: {
    name: { en: 'Shuffle 1–5–6–5', ru: 'Шаффл 1–5–6–5' },
    figure: eventFigure('0/2 L1,2/1 L5,3/2 L6,5/1 L5,6/2 L1,8/1 L5,9/2 L6,11/1 L5', {
      triplets: true,
    }),
  },
  rnb: {
    name: { en: 'R&B bass', ru: 'Бас R&B' },
    figure: eventFigure('0/10 L1,10/3 L1,13/3 L1'),
  },
  sal: {
    name: { en: 'Salsa tumbao', ru: 'Тумбао сальсы' },
    figure: eventFigure('6/6 L1,12/4 L5'),
  },
  fun: {
    name: { en: 'Funk bass', ru: 'Фанк-бас' },
    figure: eventFigure('0/3 L1,3/3 L1,6/4 L1,10/2 L1,12/4 L8'),
  },
  gos: {
    name: { en: 'Gospel octaves', ru: 'Госпел-октавы' },
    figure: eventFigure('0/3 L1+L8,3/3 L1+L8,6/4 L1+L8,10/3 L1+L8,13/3 L1+L8'),
  },
}
