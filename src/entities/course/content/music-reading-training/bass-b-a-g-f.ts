import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left hand up to F3, reading F3, G3, A3 and B3 at the top of the bass staff. */
const bassBAGF: Lesson = {
  id: 'bass-b-a-g-f',
  title: { en: 'B, A, G and F on the bass staff', ru: 'Си, ля, соль и фа на басовом стане' },
  summary: {
    en: 'Sight-read the bass staff from F up to middle C.',
    ru: 'Читать и играть верх басового стана, от фа до до первой октавы.',
  },
  sections: [
    {
      heading: { en: 'Finger 5 on F3', ru: 'Пятый палец на фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Finger 5 on F3, between the clef’s dots. G3 fills the top space, A3 the top line, B3 sits above. The thumb takes middle C.',
            ru: 'Пятый палец на фа, между точками ключа. Соль — в верхнем промежутке, ля — на верхней линейке, си — над станом. Первый палец — на до.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3 G3 A3 B3 C4/1' },
      ],
    },
    {
      heading: { en: 'Steps', ru: 'Шаги' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Check each line note against F, the clef’s own line.',
            ru: 'Сверяйте каждую ноту на линейке с фа — линейкой ключа.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3 G3 A3/2 A3 G3 F3/2 G3 A3 B3 A3 G3/1' },
        { kind: 'notes', clef: 'bass', notes: 'B3 A3 G3 F3 G3/2 A3/2 B3 A3 G3 A3 F3/1' },
      ],
    },
    {
      heading: { en: 'Skips', ru: 'Скачки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F3 to A3 is line to line. G3 to B3 goes from the top space to just above the staff, leaving A out.',
            ru: 'Фа — ля — с линейки на линейку. Соль — си — из верхнего промежутка за пределы стана, через ля.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3 A3 F3 A3 G3 B3 G3/2 A3 F3 G3 B3 A3/1' },
      ],
    },
    {
      heading: { en: 'Up to middle C', ru: 'До первой октавы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The thumb reaches middle C on the ledger line above the staff: the key the right thumb took.',
            ru: 'Первый палец достаёт до первой октавы на добавочной линейке над станом — ту же клавишу, что у правой руки.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A3 B3 C4/2 C4 A3 F3/2 G3 B3 C4 A3 F3/1' },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'G3 A3 B3 G3 A3 F3 G3/2 B3 A3 G3 F3 G3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'F3 A3 G3 B3/2 A3 G3 F3 A3 F3/2.' },
        { kind: 'notes', clef: 'bass', notes: 'A3/2 B3 A3 G3 F3 G3/2 B3 B3 A3 G3 F3/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the note on the top line.', ru: 'Сыграйте ноту на верхней линейке.' },
          answer: { notes: ['A'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just above the bass staff.',
            ru: 'Сыграйте ноту прямо над басовым станом.',
          },
          answer: { notes: ['B'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play F, A and C: fourth line, top line, ledger line.',
            ru: 'Сыграйте фа, ля и до: четвёртая, верхняя и добавочная линейки.',
          },
          answer: { notes: ['F', 'A', 'C'], rising: true },
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

export default bassBAGF
