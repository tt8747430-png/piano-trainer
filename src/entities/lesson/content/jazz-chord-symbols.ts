import type { Lesson } from '../model/types'

/** The jazz way of writing notes and chords: letters, signs for triads, the 7th and its other signs. */
const jazzChordSymbols: Lesson = {
  id: 'jazz-chord-symbols',
  title: { en: 'Jazz chord symbols', ru: 'Джазовые обозначения' },
  summary: {
    en: 'Read any jazz chord symbol, in every way books write it.',
    ru: 'Читать любое джазовое обозначение аккорда в любой записи.',
  },
  sections: [
    {
      heading: { en: 'Notes by letter', ru: 'Ноты буквами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Jazz names notes by letter. B is B, never H.',
            ru: 'В джазе ноты называют буквами. Си — это B, а не H.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'Triads by their sign', ru: 'Трезвучия по знаку' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A letter alone is major. m or − makes it minor, ° or dim diminished, + or aug augmented.',
            ru: 'Буква без знака — мажор. m или «−» — минор, ° или dim — уменьшённое, + или aug — увеличенное.',
          },
        },
        {
          kind: 'chords',
          symbols: ['C', 'Cm', 'E♭−', 'C°', 'E♭dim', 'C+', 'E♭aug'],
          apart: true,
        },
      ],
    },
    {
      heading: { en: 'The triad, then the rest', ru: 'Трезвучие, затем остальное' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Read a symbol in two halves: the triad on the left, the rest on the right. Cm7♭5 is Cm, then 7♭5.',
            ru: 'Читайте обозначение по половинам: слева трезвучие, справа остальное. Cm7♭5 — это Cm, затем 7♭5.',
          },
        },
        { kind: 'chords', symbols: ['Cm', 'Cm7♭5'], apart: true },
      ],
    },
    {
      heading: { en: '7 and Maj7', ru: '7 и Maj7' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '7 adds the minor 7th: C7, Cm7. Maj7 adds the major 7th: CMaj7. Maj names the 7th, not the triad.',
            ru: '7 добавляет малую септиму: C7, Cm7. Maj7 добавляет большую: CMaj7. Maj говорит о септиме, а не о трезвучии.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'Cm7', 'CMaj7'], apart: true },
      ],
    },
    {
      heading: { en: 'Half-diminished and diminished', ru: 'Полууменьшённый и уменьшённый' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A diminished triad with a minor 7th is Cm7♭5, the half-diminished 7th. With a diminished 7th it is C°7.',
            ru: 'Уменьшённое трезвучие с малой септимой — Cm7♭5, полууменьшённый септаккорд. С уменьшённой септимой — C°7.',
          },
        },
        { kind: 'chords', symbols: ['Cm7♭5', 'C°7'], apart: true },
      ],
    },
    {
      heading: { en: 'Maj7 on other triads', ru: 'Maj7 на других трезвучиях' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'On a minor triad Maj7 makes the minor-major 7th, 1 ♭3 5 7. On an augmented one, 1 3 ♯5 7.',
            ru: 'На минорном трезвучии Maj7 даёт минорный с большой септимой, 1 ♭3 5 7. На увеличенном — 1 3 ♯5 7.',
          },
        },
        { kind: 'chords', symbols: ['Cm(maj7)', 'C+Maj7'], apart: true },
      ],
    },
    {
      heading: { en: 'Sixth chords', ru: 'Аккорды с секстой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '6 adds the major 6th to a triad, major or minor: C6, Cm6.',
            ru: '6 добавляет к трезвучию, мажорному или минорному, большую сексту: C6, Cm6.',
          },
        },
        { kind: 'chords', symbols: ['C6', 'Cm6'], apart: true },
      ],
    },
    {
      heading: { en: 'Other signs', ru: 'Другие обозначения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Books also write Δ for Maj7, − for m, ø for m7♭5, sus for sus4 and (−9) for ♭9.',
            ru: 'В нотах пишут и так: Δ вместо Maj7, «−» вместо m, ø вместо m7♭5, sus вместо sus4, (−9) вместо ♭9.',
          },
        },
        { kind: 'chords', symbols: ['CΔ7', 'C−7', 'Cø', 'Csus', 'C7(−9)'], apart: true },
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
