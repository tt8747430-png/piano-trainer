import type { Lesson } from '@/entities/lesson'

/** The bass clef: its F, the notes on the staff from G2 to A3, and middle C between the staves. */
const theBassClef: Lesson = {
  id: 'the-bass-clef',
  title: { en: 'The bass clef', ru: 'Басовый ключ' },
  summary: {
    en: 'The F clef names the left hand’s staff. Read its lines and spaces from G2 to A3, and find middle C between the staves.',
    ru: 'Ключ фа даёт имена нотам стана левой руки. Читайте его линейки и промежутки от соль большой октавы до ля малой и найдите до первой октавы между станами.',
  },
  sections: [
    {
      heading: { en: 'The F clef', ru: 'Ключ фа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The bass clef', ru: 'Басовый ключ' },
          text: {
            en: 'is also called the F clef. Its two dots sit either side of the fourth line, so that line is F3, the F below middle C.',
            ru: 'ещё называют ключом фа. Его две точки стоят по обе стороны четвёртой линейки, и на ней стоит фа малой октавы.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3/1' },
        {
          kind: 'question',
          ask: { en: 'Play the clef’s F.', ru: 'Сыграйте фа, которую отмечает ключ.' },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'The five lines', ru: 'Пять линеек' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom, the bass lines are G2, B2, D3, F3 and A3. Remember them as Good Boys Do Fine Always.',
            ru: 'Снизу вверх на линейках басового ключа стоят соль и си большой октавы, ре, фа и ля малой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2/2 B2/2 D3/2 F3/2 A3/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the middle line.',
            ru: 'Сыграйте ноту на средней линейке.',
          },
          answer: { notes: ['D'] },
        },
      ],
    },
    {
      heading: { en: 'The four spaces', ru: 'Четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The spaces, from the bottom, are A2, C3, E3 and G3. Remember them as All Cows Eat Grass.',
            ru: 'В промежутках снизу вверх стоят ля большой октавы, до, ми и соль малой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2/2 C3/2 E3/2 G3/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play the four space notes, bottom to top.',
            ru: 'Сыграйте четыре ноты в промежутках снизу вверх.',
          },
          answer: { notes: ['A', 'C', 'E', 'G'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Three landmarks', ru: 'Три ориентира' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Know three bass notes on sight: G2 on the bottom line, C3 in the second space, F3 on the clef’s line.',
            ru: 'Узнавайте с первого взгляда три ноты: соль на нижней линейке, до во втором промежутке, фа на линейке ключа.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2/2 C3/2 F3/1' },
        {
          kind: 'note',
          text: {
            en: 'C3 is an octave below middle C.',
            ru: 'До малой октавы на октаву ниже до первой.',
          },
        },
      ],
    },
    {
      heading: { en: 'Middle C between the staves', ru: 'До первой октавы между станами' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The grand staff', ru: 'Фортепианная система' },
          text: {
            en: 'joins the treble and bass staves with a brace. Middle C sits on one ledger line between them.',
            ru: '— скрипичный и басовый станы, соединённые фигурной скобкой. До первой октавы стоит между ними на одной добавочной линейке.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A3 B3 C4/2' },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 D4 E4' },
        {
          kind: 'note',
          text: {
            en: 'The same key: above the bass staff, or below the treble staff.',
            ru: 'Это одна клавиша: над басовым станом или под скрипичным.',
          },
        },
      ],
    },
    {
      heading: { en: 'Read a bass line', ru: 'Прочитайте басовую партию' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 G3 E3 F3 A3 G3/2 B2 D3 F3 D3 C3/1' },
        {
          kind: 'text',
          text: {
            en: 'Find G2, C3 and F3 first, then read the others as steps and skips from them.',
            ru: 'Сначала найдите соль, до и фа, затем читайте остальные ноты шагами и скачками от них.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the bottom line of the bass staff.',
            ru: 'Сыграйте ноту на нижней линейке басового стана.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the top line of the bass staff.',
            ru: 'Сыграйте ноту на верхней линейке басового стана.',
          },
          answer: { notes: ['A'] },
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
            en: 'Play the second space, then the C an octave above it.',
            ru: 'Сыграйте ноту во втором промежутке, затем до октавой выше.',
          },
          answer: { notes: ['C', 'C'], rising: true },
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
