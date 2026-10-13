import type { Lesson } from '../model/types'

/** Gorshkov's lesson 2, «Нонаккорды»: three 9th chords, as two triads, in his two positions. */
const ninthChords: Lesson = {
  id: 'ninth-chords',
  title: { en: 'Ninth chords', ru: 'Нонаккорды' },
  summary: {
    en: 'Gorshkov’s lesson 2: three 9th chords, each two triads stacked, played over the bass alone, in two positions.',
    ru: 'Урок 2 Горшкова: три нонаккорда, каждый — два трезвучия друг на друге, над одним басом, в двух расположениях.',
  },
  level: 3,
  module: 'gorshkov',
  sections: [
    {
      heading: { en: 'A 7th chord and one more 3rd', ru: 'Септаккорд и ещё одна терция' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A 9th chord is a 7th chord with one more 3rd on top. It is no new chord, only a richer one.',
            ru: 'Нонаккорд — это септаккорд и ещё одна терция сверху. Это не новый аккорд, а его расширение, более насыщенное.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Gm9', degrees: '1 1 | ♭3 5 ♭7 9', hands: 'G2 G3 | B♭3 D4 F4 A4' },
            { symbol: 'GMaj9', degrees: '1 1 | 3 5 7 9', hands: 'G2 G3 | B3 D4 F♯4 A4' },
            { symbol: 'G9', degrees: '1 1 | 3 5 ♭7 9', hands: 'G2 G3 | B3 D4 F4 A4' },
            { symbol: 'G7♭9', degrees: '1 1 | 3 5 ♭7 ♭9', hands: 'G2 G3 | B3 D4 F4 A♭4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: '9 means the minor 7th is there too. Maj9 means the major 7th.',
            ru: '9 означает, что малая септима тоже есть. Maj9 — что есть большая.',
          },
        },
      ],
    },
    {
      heading: { en: 'Two triads stacked', ru: 'Два трезвучия вместе' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Minor and minor: Gm and Dm make Gm9.',
              ru: 'Минорное и минорное: Gm и Dm дают Gm9.',
            },
            {
              en: 'Major and major: G and D make GMaj9.',
              ru: 'Мажорное и мажорное: G и D дают GMaj9.',
            },
            {
              en: 'Major and minor: G and Dm make G9.',
              ru: 'Мажорное и минорное: G и Dm дают G9.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Gm9', 'GMaj9', 'G9'], apart: true },
        {
          kind: 'note',
          text: {
            en: 'The second triad starts on the first one’s 5th.',
            ru: 'Второе трезвучие строится от квинты первого.',
          },
        },
      ],
    },
    {
      heading: { en: 'Bass left, 7th chord right', ru: 'Бас слева, септаккорд справа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The two triads are only a shortcut. Think of a 7th chord and a 3rd: the bass in the left hand, the other four notes in the right.',
            ru: 'Два трезвучия — лишь шпаргалка. Думайте о септаккорде и терции: бас в левой руке, остальные четыре ноты в правой.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cm9', degrees: '1 | ♭3 5 ♭7 9', hands: 'C3 | E♭4 G4 B♭4 D5' },
            { symbol: 'CMaj9', degrees: '1 | 3 5 7 9', hands: 'C3 | E4 G4 B4 D5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'The second position', ru: 'Второе расположение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the top 3rd down an octave. These two positions are the core of pop and jazz accompaniment.',
            ru: 'Перенесите верхнюю терцию на октаву вниз. Эти два расположения — основа эстрадно-джазового аккомпанемента.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cm9', degrees: '1 | ♭3 5 ♭7 9', hands: 'C3 | E♭4 G4 B♭4 D5' },
            { symbol: 'Cm9', degrees: '1 | ♭7 9 ♭3 5', hands: 'C3 | B♭3 D4 E♭4 G4' },
            { symbol: 'CMaj9', degrees: '1 | 3 5 7 9', hands: 'C3 | E4 G4 B4 D5' },
            { symbol: 'CMaj9', degrees: '1 | 7 9 3 5', hands: 'C3 | B3 D4 E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Split the root', ru: 'Расщепите основной тон' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A quick way to the close 9th: take the triad and split its root into its two neighbours in the scale.',
            ru: 'Быстрый путь к нонаккорду в тесном расположении: возьмите трезвучие и расщепите основной тон на два соседних звука гаммы.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cm', degrees: '1 | 1 ♭3 5', hands: 'C3 | C4 E♭4 G4' },
            { symbol: 'Cm9', degrees: '1 | ♭7 9 ♭3 5', hands: 'C3 | B♭3 D4 E♭4 G4' },
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
            { symbol: 'CMaj9', degrees: '1 | 7 9 3 5', hands: 'C3 | B3 D4 E4 G4' },
            { symbol: 'C9', degrees: '1 | ♭7 9 3 5', hands: 'C3 | B♭3 D4 E4 G4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'The root steps down to the 7th and up to the 9th.',
            ru: 'Основной тон уходит вниз к септиме и вверх к ноне.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play Gm9.', ru: 'Сыграйте Gm9.' },
          answer: { chord: 'Gm9' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play CMaj9.', ru: 'Сыграйте CMaj9.' },
          answer: { chord: 'CMaj9' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play G9.', ru: 'Сыграйте G9.' },
          answer: { chord: 'G9' },
        },
        {
          kind: 'link',
          title: { en: 'G9 in Chords', ru: 'G9 в разделе «Аккорды»' },
          target: { opens: 'chords', chord: 'G9' },
        },
      ],
    },
  ],
}

export default ninthChords
