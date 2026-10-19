import type { Lesson } from '../model/types'

/** The jazz way of writing notes and chords: letters, signs for triads, the 7th and its other signs. */
const jazzChordSymbols: Lesson = {
  id: 'jazz-chord-symbols',
  title: { en: 'Jazz chord symbols', ru: 'Джазовые обозначения аккордов' },
  summary: {
    en: 'Read a jazz chord symbol in two halves, and know the other signs books use for the same chord.',
    ru: 'Читать джазовое обозначение аккорда по двум половинам и узнавать другие знаки для того же аккорда.',
  },
  sections: [
    {
      heading: { en: 'Notes by letter', ru: 'Ноты буквами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Jazz writes each note as a letter from A to G. The note before C is B, never H.',
            ru: 'В джазе каждую ноту пишут буквой от A до G. Нота перед до — это B, а не H.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        {
          kind: 'text',
          text: {
            en: 'Play the line and say each letter aloud.',
            ru: 'Сыграйте строчку и называйте каждую букву вслух.',
          },
        },
      ],
    },
    {
      heading: { en: 'The sign after the letter', ru: 'Знак после буквы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A letter alone means a major triad. m or − means minor. ° or dim means diminished. + or aug means augmented.',
            ru: 'Буква без знака — мажорное трезвучие. m или «−» — минорное. ° или dim — уменьшённое. + или aug — увеличенное.',
          },
        },
        {
          kind: 'chords',
          symbols: ['C', 'Cm', 'E♭−', 'C°', 'E♭dim', 'C+', 'E♭aug'],
          apart: true,
        },
        {
          kind: 'text',
          text: {
            en: 'Play the row. Two signs for one triad sound the same.',
            ru: 'Сыграйте ряд. Два знака одного трезвучия звучат одинаково.',
          },
        },
      ],
    },
    {
      heading: { en: 'Read it in two halves', ru: 'Читайте по половинам' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Split a long symbol in two. The left half is the triad. The right half adds to it. Cm7♭5 is Cm, then 7♭5.',
            ru: 'Делите длинное обозначение надвое. Левая половина — трезвучие. Правая что-то к нему добавляет. Cm7♭5 — это Cm, затем 7♭5.',
          },
        },
        { kind: 'chords', symbols: ['Cm', 'Cm7♭5'], apart: true },
        {
          kind: 'text',
          text: {
            en: 'Play Cm, then Cm7♭5, and hear what the right half adds.',
            ru: 'Сыграйте Cm, затем Cm7♭5 и послушайте, что добавила правая половина.',
          },
        },
      ],
    },
    {
      heading: { en: '7 and Maj7', ru: '7 и Maj7' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A plain 7 adds the minor 7th: C7, Cm7. Maj7 adds the major 7th: CMaj7. Maj describes the 7th, not the triad.',
            ru: 'Простая 7 добавляет малую септиму: C7, Cm7. Maj7 добавляет большую: CMaj7. Maj говорит о септиме, а не о трезвучии.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'Cm7', 'CMaj7'], apart: true },
        {
          kind: 'text',
          text: {
            en: 'Play C7 and CMaj7. Only the top note moves, by one key.',
            ru: 'Сыграйте C7 и CMaj7. Меняется только верхний звук, на одну клавишу.',
          },
        },
      ],
    },
    {
      heading: {
        en: 'Half-diminished and diminished 7ths',
        ru: 'Полууменьшённый и уменьшённый септаккорды',
      },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The half-diminished 7th', ru: 'Полууменьшённый септаккорд' },
          text: {
            en: 'is a diminished triad with a minor 7th: Cm7♭5. With a diminished 7th instead, it is the diminished 7th chord, C°7.',
            ru: '— это уменьшённое трезвучие с малой септимой: Cm7♭5. С уменьшённой септимой получается уменьшённый септаккорд, C°7.',
          },
        },
        { kind: 'chords', symbols: ['Cm7♭5', 'C°7'], apart: true },
        {
          kind: 'text',
          text: {
            en: 'Play both. C°7 lowers the top note one more key.',
            ru: 'Сыграйте оба. В C°7 верхний звук ниже ещё на клавишу.',
          },
        },
      ],
    },
    {
      heading: { en: 'Maj7 on other triads', ru: 'Maj7 на других трезвучиях' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Maj7 fits any triad. On a minor triad it makes the minor-major 7th, 1 ♭3 5 7. On an augmented triad, 1 3 ♯5 7.',
            ru: 'Maj7 ставят на любое трезвучие. На минорном получается минорный с большой септимой, 1 ♭3 5 7. На увеличенном — 1 3 ♯5 7.',
          },
        },
        { kind: 'chords', symbols: ['Cm(maj7)', 'C+Maj7'], apart: true },
        {
          kind: 'text',
          text: {
            en: 'Play each and find the major 7th, B.',
            ru: 'Сыграйте каждый и найдите большую септиму, си.',
          },
        },
      ],
    },
    {
      heading: { en: 'Sixth chords', ru: 'Аккорды с секстой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '6 adds the major 6th to a major or minor triad: C6, Cm6. In C the 6th is A.',
            ru: '6 добавляет большую сексту к мажорному или минорному трезвучию: C6, Cm6. От до секста — ля.',
          },
        },
        { kind: 'chords', symbols: ['C6', 'Cm6'], apart: true },
        {
          kind: 'text',
          text: {
            en: 'Play both and find the A in each.',
            ru: 'Сыграйте оба и найдите ля в каждом.',
          },
        },
      ],
    },
    {
      heading: { en: 'Other signs, same chords', ru: 'Другие знаки, те же аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Books also write Δ for Maj7, − for m, ø for m7♭5, sus for sus4 and (−9) for ♭9.',
            ru: 'В нотах пишут и так: Δ вместо Maj7, «−» вместо m, ø вместо m7♭5, sus вместо sus4, (−9) вместо ♭9.',
          },
        },
        { kind: 'chords', symbols: ['CΔ7', 'C−7', 'Cø', 'Csus', 'C7(−9)'], apart: true },
        {
          kind: 'text',
          text: {
            en: 'Play each and name it the long way.',
            ru: 'Сыграйте каждый и назовите его полной записью.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C−7.', ru: 'Сыграйте C−7.' },
          answer: { chord: 'Cm7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Cø.', ru: 'Сыграйте Cø.' },
          answer: { chord: 'Cm7♭5' },
        },
        {
          kind: 'question',
          ask: { en: 'Play E♭Δ7.', ru: 'Сыграйте E♭Δ7.' },
          answer: { chord: 'E♭Maj7' },
        },
        {
          kind: 'link',
          title: { en: 'Name chords in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
      ],
    },
  ],
}

export default jazzChordSymbols
