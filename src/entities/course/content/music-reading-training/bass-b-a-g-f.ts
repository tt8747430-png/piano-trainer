import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left hand up to F3, reading F3, G3, A3 and B3 at the top of the bass staff. */
const bassBAGF: Lesson = {
  id: 'bass-b-a-g-f',
  title: { en: 'B, A, G and F on the bass staff', ru: 'Си, ля, соль и фа на басовом стане' },
  summary: {
    en: 'Finger 5 on F3, the clef’s line: read F3, G3, A3 and B3 at the top of the bass staff, up to middle C, and play them on sight.',
    ru: 'Пятый палец на фа малой октавы, линейке ключа: читайте фа, соль, ля и си в верхней части басового стана до до первой октавы и играйте с листа.',
  },
  sections: [
    {
      heading: { en: 'Finger 5 on F3', ru: 'Пятый палец на фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the left hand up so finger 5 sits on F3. Fingers 4, 3 and 2 fall on G3, A3 and B3, the thumb on middle C.',
            ru: 'Переместите левую руку выше: пятый палец на фа малой октавы. Четвёртый, третий и второй — на соль, ля и си, первый — на до.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3 G3 A3 B3 C4/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play F, G, A and B with fingers 5, 4, 3 and 2.',
            ru: 'Сыграйте фа, соль, ля и си пятым, четвёртым, третьим и вторым пальцами.',
          },
          answer: { notes: ['F', 'G', 'A', 'B'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Where each note sits', ru: 'Где стоит каждая нота' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F3 is the fourth line, between the clef’s dots. G3 fills the top space, A3 the top line. B3 sits just above the staff.',
            ru: 'Фа — четвёртая линейка, между точками ключа. Соль — в верхнем промежутке, ля — на верхней линейке. Си — прямо над станом.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3 G3 A3 B3 A3 G3 F3/2' },
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
      ],
    },
    {
      heading: { en: 'Steps', ru: 'Шаги' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'F3 G3 A3/2 A3 G3 F3/2 G3 A3 B3 A3 G3/1' },
        { kind: 'notes', clef: 'bass', notes: 'B3 A3 G3 F3 G3/2 A3/2 B3 A3 G3 A3 F3/1' },
        {
          kind: 'note',
          text: {
            en: 'Check each line note against F, the clef’s own line.',
            ru: 'Сверяйте каждую ноту на линейке с фа — линейкой ключа.',
          },
        },
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
        {
          kind: 'question',
          ask: { en: 'Play F, then skip up to A.', ru: 'Сыграйте фа, затем скачком ля.' },
          answer: { notes: ['F', 'A'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Up to middle C', ru: 'До первой октавы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The thumb reaches middle C, on the ledger line above the bass staff. It is the same key the right thumb took.',
            ru: 'Первый палец достаёт до первой октавы на добавочной линейке над басовым станом. Это та же клавиша, что у правой руки.',
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
          ask: {
            en: 'Play the note between the bass clef’s dots.',
            ru: 'Сыграйте ноту между точками басового ключа.',
          },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the top space, then the top line.',
            ru: 'Сыграйте верхний промежуток, затем верхнюю линейку.',
          },
          answer: { notes: ['G', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play B above the staff, then step down to F.',
            ru: 'Сыграйте си над станом, затем шагами вниз до фа.',
          },
          answer: { notes: ['B', 'A', 'G', 'F'] },
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
