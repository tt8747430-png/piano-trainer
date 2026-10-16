import type { Lesson } from '../model/types'

/** Three 9th chords, each two triads stacked over the bass, in two positions. */
const ninthChords: Lesson = {
  id: 'ninth-chords',
  title: { en: 'Ninth chords', ru: 'Нонаккорды' },
  summary: {
    en: 'Build minor, major and dominant 9ths and voice them two ways.',
    ru: 'Строить минорный, мажорный и доминантовый нонаккорды в двух расположениях.',
  },
  sections: [
    {
      heading: { en: 'A 7th chord and one more 3rd', ru: 'Септаккорд и ещё одна терция' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 9th chord', ru: 'Нонаккорд' },
          text: {
            en: 'is a 7th chord with one more 3rd on top.',
            ru: '— септаккорд и ещё одна терция сверху.',
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
      heading: { en: 'Bass left, two positions', ru: 'Бас слева, два расположения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the root in the left hand and the other four notes in the right. Then move the top 3rd down an octave.',
            ru: 'Основной тон играйте левой рукой, остальные четыре ноты — правой. Затем перенесите верхнюю терцию на октаву вниз.',
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
            en: 'A quick way to the second position: split the triad’s root into its two neighbours, the 7th and the 9th.',
            ru: 'Быстрый путь ко второму расположению: расщепите основной тон трезвучия на два соседних звука, септиму и нону.',
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
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play Gm9.', ru: 'Сыграйте Gm9.' },
          answer: { chord: 'Gm9' },
        },
        {
          kind: 'question',
          ask: { en: 'Play CMaj9.', ru: 'Сыграйте CMaj9.' },
          answer: { chord: 'CMaj9' },
        },
        {
          kind: 'question',
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
