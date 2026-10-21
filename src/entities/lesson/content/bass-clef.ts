import type { Lesson } from '../model/types'

const bassClef: Lesson = {
  id: 'bass-clef',
  title: { en: 'The bass clef and the grand staff', ru: 'Басовый ключ и большой нотный стан' },
  summary: {
    en: 'Read the left hand’s notes in the bass clef, then both hands on the grand staff.',
    ru: 'Читайте ноты левой руки в басовом ключе, а затем обе руки на большом нотном стане.',
  },
  sections: [
    {
      heading: { en: 'The bass clef marks F', ru: 'Басовый ключ отмечает фа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The bass clef', ru: 'Басовый ключ' },
          text: {
            en: 'is the sign at the start of the left hand’s staff. Its two dots sit either side of the fourth line. That line is F, the F below middle C.',
            ru: '— знак в начале нотного стана левой руки. Две его точки стоят по бокам четвёртой линейки. Это фа малой октавы, ниже до первой октавы.',
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
      heading: { en: 'The five lines', ru: 'Пять линеек' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom, the lines are G B D F A. One way to remember them: Good Boys Do Fine Always.',
            ru: 'Снизу вверх на линейках стоят соль, си, ре, фа, ля. Каждая следующая на терцию выше.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2 B2 D3 F3 A3/1' },
      ],
    },
    {
      heading: { en: 'The four spaces', ru: 'Четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom, the spaces are A C E G. One way to remember them: All Cows Eat Grass.',
            ru: 'Снизу вверх в промежутках стоят ля, до, ми, соль. Каждая нота — между двумя соседними линейками.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 C3 E3 G3' },
      ],
    },
    {
      heading: { en: 'Bass landmarks', ru: 'Ориентиры в басу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Learn three notes by sight: middle C just above the staff, F on the fourth line, and the C in the second space. Find any other note by counting steps from the nearest one.',
            ru: 'Выучите три ноты наизусть: до первой октавы над станом, фа на четвёртой линейке и до малой октавы во втором промежутке. Любую другую находите шагами от ближайшей.',
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
            en: 'is the treble staff over the bass staff, joined by a brace. Middle C sits between them on a short extra line, written in either staff.',
            ru: '— это скрипичный стан над басовым, соединённые скобкой. До первой октавы стоит между ними на короткой добавочной линейке и пишется в любом из станов.',
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
            en: 'Read from the bottom up. First the bass note, which usually names the chord. Then the right hand’s notes above it.',
            ru: 'Читайте снизу вверх. Сначала басовую ноту: обычно она называет аккорд. Потом ноты правой руки над ней.',
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
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default bassClef
