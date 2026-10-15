import type { Lesson } from '../model/types'

const bassClef: Lesson = {
  id: 'bass-clef',
  title: { en: 'The bass clef and the grand staff', ru: 'Басовый ключ и большой нотный стан' },
  summary: {
    en: 'Read the left hand’s notes, then both staves together, with middle C between them.',
    ru: 'Читайте ноты левой руки, затем оба стана вместе, с до первой октавы между ними.',
  },
  sections: [
    {
      heading: { en: 'The bass clef marks F', ru: 'Басовый ключ отмечает фа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The bass clef', ru: 'Басовый ключ' },
          text: {
            en: 'puts its two dots round the fourth line: the F below middle C. The left hand reads it.',
            ru: 'ставит две точки вокруг четвёртой линейки — фа малой октавы. По нему читает левая рука.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3/1' },
        {
          kind: 'question',
          ask: { en: 'Play the bass clef’s F.', ru: 'Сыграйте фа басового ключа.' },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'Lines and spaces', ru: 'Линейки и промежутки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The lines read G B D F A from the bottom. The spaces read A C E G.',
            ru: 'Линейки снизу: соль, си, ре, фа, ля. Промежутки: ля, до, ми, соль.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2 B2 D3 F3 A3/1' },
        { kind: 'notes', clef: 'bass', notes: 'A2 C3 E3 G3' },
      ],
    },
    {
      heading: { en: 'Bass landmarks', ru: 'Ориентиры в басу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Know middle C above the staff, F on the fourth line and C3 in the second space. Read the rest as steps from them.',
            ru: 'Запомните до первой октавы над станом, фа на четвёртой линейке и до малой октавы во втором промежутке. Остальное читайте шагами от них.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C4/2 F3/2 C3/1' },
      ],
    },
    {
      heading: { en: 'The grand staff', ru: 'Большой нотный стан' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The grand staff', ru: 'Большой нотный стан' },
          text: {
            en: 'joins the treble and bass staves with a brace. Middle C sits on a ledger line between them, in either staff.',
            ru: 'соединяет скрипичный и басовый станы скобкой. До первой октавы стоит на добавочной линейке между ними, в любом из станов.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | C4' },
            { symbol: 'C', hands: 'C4 | C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Reading both hands', ru: 'Чтение двух рук' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Read the bass note first, then the right hand above it. The bass tells you the chord.',
            ru: 'Сначала читайте басовую ноту, потом правую руку над ней. Бас подсказывает аккорд.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | E4 G4' },
            { symbol: 'F', hands: 'F2 | F4 A4' },
            { symbol: 'G', hands: 'G2 | D4 G4' },
            { symbol: 'C', hands: 'C3 | E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note in the bass staff’s top space.',
            ru: 'Сыграйте ноту в верхнем промежутке басового стана.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass staff’s lines, bottom to top.',
            ru: 'Сыграйте линейки басового стана снизу вверх.',
          },
          answer: { notes: ['G', 'B', 'D', 'F', 'A'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default bassClef
