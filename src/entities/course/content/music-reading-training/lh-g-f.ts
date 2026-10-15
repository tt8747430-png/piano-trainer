import type { Lesson } from '@/entities/lesson'

/** Reading drill: fingers 4 and 5 on G2 and F2 complete the left hand's position from F2 to C3. */
const lhGF: Lesson = {
  id: 'lh-g-f',
  title: { en: 'G and F in the left hand', ru: 'Соль и фа в левой руке' },
  summary: {
    en: 'Fingers 4 and 5 take G2 and F2, completing the left hand’s five notes from F2 to C3. Read them on the bass staff and play on sight.',
    ru: 'Четвёртый и пятый пальцы берут соль и фа, и пять нот левой руки от фа до до готовы. Читайте их на басовом стане и играйте с листа.',
  },
  sections: [
    {
      heading: { en: 'Five fingers, five notes', ru: 'Пять пальцев, пять нот' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the thumb on C3. Finger 4 takes G2 on the bottom line, finger 5 takes F2 just under the staff.',
            ru: 'Первый палец остаётся на до. Четвёртый берёт соль на нижней линейке, пятый — фа прямо под станом.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2 G2 A2 B2 C3/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play the five notes from F up to C, fingers 5 to 1.',
            ru: 'Сыграйте пять нот от фа вверх до до, пальцами с пятого по первый.',
          },
          answer: { notes: ['F', 'G', 'A', 'B', 'C'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'G and F on the staff', ru: 'Соль и фа на стане' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G2 sits on the bottom line, a landmark of the bass staff. F2 hangs in the space under it.',
            ru: 'Соль стоит на нижней линейке — это ориентир басового стана. Фа висит в промежутке под ней.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 G2 F2 G2 A2 G2 F2/2' },
        {
          kind: 'question',
          ask: { en: 'Play the note on the bottom line.', ru: 'Сыграйте ноту на нижней линейке.' },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just under the bass staff.',
            ru: 'Сыграйте ноту прямо под басовым станом.',
          },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'Steps down to F', ru: 'Шаги до фа' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'A2 G2 F2/2 F2 G2 A2/2 G2 F2 G2 A2 B2/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 B2 A2 G2 F2/2 A2/2 G2 A2 G2 F2 F2/1' },
        {
          kind: 'note',
          text: {
            en: 'Finger 5 of the left hand plays the lowest note. Let it rest on the key, firm and curved.',
            ru: 'Пятый палец левой руки играет самую низкую ноту. Пусть он лежит на клавише уверенно и округло.',
          },
        },
      ],
    },
    {
      heading: { en: 'Skips in the position', ru: 'Скачки в позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F–A and A–C are space to space. G–B is line to line. Each leaves one finger out.',
            ru: 'Фа — ля и ля — до — из промежутка в промежуток. Соль — си — с линейки на линейку. Каждый скачок пропускает палец.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2 A2 C3/2 A2 C3 A2 F2 G2 B2 G2 B2 A2/1' },
        {
          kind: 'question',
          ask: { en: 'Play G, then skip up to B.', ru: 'Сыграйте соль, затем скачком си.' },
          answer: { notes: ['G', 'B'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'F to C', ru: 'От фа к до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F2 to C3 spans the whole hand, finger 5 to thumb: from under the staff to the second space.',
            ru: 'Фа — до охватывает всю руку, от пятого пальца до первого: из-под стана во второй промежуток.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2/2 C3/2 C3 A2 F2/2 F2 C3 B2 G2 F2/1' },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'C3 A2 B2 G2 A2 F2 G2/2 F2 G2 A2 B2 C3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'F2 G2 A2 G2/2 F2 A2 C3 A2 F2/2.' },
        { kind: 'notes', clef: 'bass', notes: 'G2 G2 A2 B2 C3/2 A2/2 G2 F2 G2 A2 F2/1' },
        {
          kind: 'note',
          text: {
            en: 'Keep the eyes on the page, not on the hand.',
            ru: 'Смотрите в ноты, а не на руку.',
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
            en: 'Play C with the thumb, then step down to F.',
            ru: 'Сыграйте до первым пальцем, затем шагами вниз до фа.',
          },
          answer: { notes: ['C', 'B', 'A', 'G', 'F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play F, A and C: under the staff, first space, second space.',
            ru: 'Сыграйте фа, ля и до: под станом, первый промежуток, второй промежуток.',
          },
          answer: { notes: ['F', 'A', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bottom line, then the second line.',
            ru: 'Сыграйте ноту на нижней линейке, затем на второй.',
          },
          answer: { notes: ['G', 'B'], rising: true },
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

export default lhGF
