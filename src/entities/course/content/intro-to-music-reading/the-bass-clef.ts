import type { Lesson } from '@/entities/lesson'

/** The bass clef: its F, the notes on the staff from G2 to A3, and middle C between the staves. */
const theBassClef: Lesson = {
  id: 'the-bass-clef',
  title: { en: 'The bass clef', ru: 'Басовый ключ' },
  summary: {
    en: 'Name every note on the bass staff, and see how middle C joins it to the treble staff.',
    ru: 'Называть любую ноту басового стана и видеть, как до первой октавы связывает его со скрипичным.',
  },
  sections: [
    {
      heading: { en: 'The F clef', ru: 'Ключ фа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The bass clef', ru: 'Басовый ключ' },
          text: {
            en: 'is also called the F clef. Its two dots sit either side of the fourth line, and that line is F3, the F below middle C. The left hand usually reads it.',
            ru: 'называют ещё ключом фа. Его две точки стоят по сторонам четвёртой линейки, и на ней стоит фа малой октавы. Обычно по нему читает левая рука.',
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
            en: 'From the bottom up, the lines are G, B, D, F, A. Remember them as Good Boys Do Fine Always.',
            ru: 'Снизу вверх на линейках стоят соль и си большой октавы, ре, фа и ля малой.',
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
            en: 'From the bottom up, the spaces are A, C, E, G. Remember them as All Cows Eat Grass.',
            ru: 'Снизу вверх в промежутках стоят ля большой октавы, до, ми и соль малой.',
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
            en: 'Learn three on sight: G2 on the bottom line, C3 in the second space and F3 on the clef’s line. C3 is an octave below middle C.',
            ru: 'Выучите три ориентира: соль на нижней линейке, до во втором промежутке и фа на линейке ключа. Это до на октаву ниже до первой октавы.',
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
            en: 'is the treble and bass staves joined by a brace. Middle C sits on a ledger line between them. Either staff can write it, and it is the same key.',
            ru: '— скрипичный и басовый станы, соединённые скобкой. До первой октавы стоит на добавочной линейке между ними. Её можно записать на любом стане, клавиша та же.',
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
            en: 'Find the landmarks G2, C3 and F3 first. Then read the other notes as steps and skips from them.',
            ru: 'Сначала найдите ориентиры: соль, до и фа. Остальные ноты читайте шагами и скачками от них.',
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
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
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
