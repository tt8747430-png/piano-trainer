import type { Lesson } from '@/entities/lesson'

/** The bass clef: its F, the notes on the staff from G2 to A3, and middle C between the staves. */
const theBassClef: Lesson = {
  id: 'the-bass-clef',
  title: { en: 'The bass clef', ru: 'Басовый ключ' },
  summary: {
    en: 'Read every note on the bass staff and find middle C.',
    ru: 'Читать любую ноту басового стана и находить до первой октавы.',
  },
  sections: [
    {
      heading: { en: 'The F clef', ru: 'Ключ фа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The bass clef', ru: 'Басовый ключ' },
          text: {
            en: '(the F clef) puts its two dots either side of the fourth line. That line is F3, the F below middle C.',
            ru: '(ключ фа) ставит две точки по сторонам четвёртой линейки. На ней стоит фа малой октавы.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3/1' },
      ],
    },
    {
      heading: { en: 'The five lines', ru: 'Пять линеек' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom, the lines are G, B, D, F, A: Good Boys Do Fine Always.',
            ru: 'Снизу вверх на линейках: соль и си большой октавы, ре, фа и ля малой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2/2 B2/2 D3/2 F3/2 A3/1' },
      ],
    },
    {
      heading: { en: 'The four spaces', ru: 'Четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom, the spaces are A, C, E, G: All Cows Eat Grass.',
            ru: 'Снизу вверх в промежутках: ля большой октавы, до, ми и соль малой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2/2 C3/2 E3/2 G3/2' },
      ],
    },
    {
      heading: { en: 'Three landmarks', ru: 'Три ориентира' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Know three on sight: G2 on the bottom line, C3 in the second space, F3 on the clef’s line. C3 is an octave below middle C.',
            ru: 'Узнавайте сразу три ноты: соль на нижней линейке, до во втором промежутке, фа на линейке ключа. Это до — октавой ниже до первой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2/2 C3/2 F3/1' },
      ],
    },
    {
      heading: { en: 'Middle C between the staves', ru: 'До первой октавы между станами' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The grand staff', ru: 'Фортепианная система' },
          text: {
            en: 'joins the two staves with a brace. Middle C is one key on a ledger line between them, written from either staff.',
            ru: '— два стана, соединённые скобкой. До первой октавы — одна клавиша на добавочной линейке между ними, её пишут на любом стане.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A3 B3 C4/2' },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 D4 E4' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 G3 E3 F3 A3 G3/2 B2 D3 F3 D3 C3/1' },
        {
          kind: 'text',
          text: {
            en: 'Find G2, C3 and F3 first, then read the rest as steps and skips from them.',
            ru: 'Сначала найдите соль, до и фа, затем читайте остальное шагами и скачками от них.',
          },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the bass staff’s middle line.',
            ru: 'Сыграйте ноту на средней линейке басового стана.',
          },
          answer: { notes: ['D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the five bass line notes, bottom to top.',
            ru: 'Сыграйте пять нот на линейках басового стана снизу вверх.',
          },
          answer: { notes: ['G', 'B', 'D', 'F', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the four space notes, bottom to top.',
            ru: 'Сыграйте четыре ноты в промежутках снизу вверх.',
          },
          answer: { notes: ['A', 'C', 'E', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: {
            en: 'Read both staves of Yankee Doodle',
            ru: 'Прочитайте оба стана «Янки Дудл»',
          },
          target: { opens: 'piece', piece: 'yankee-doodle' },
        },
      ],
    },
  ],
}

export default theBassClef
