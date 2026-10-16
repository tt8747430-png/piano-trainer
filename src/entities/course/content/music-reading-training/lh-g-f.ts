import type { Lesson } from '@/entities/lesson'

/** Reading drill: fingers 4 and 5 on G2 and F2 complete the left hand's position from F2 to C3. */
const lhGF: Lesson = {
  id: 'lh-g-f',
  title: { en: 'G and F in the left hand', ru: 'Соль и фа в левой руке' },
  summary: {
    en: 'Read and play the left hand’s five notes from F to C.',
    ru: 'Читать и играть пять нот левой руки от фа до до.',
  },
  sections: [
    {
      heading: { en: 'G and F on the staff', ru: 'Соль и фа на стане' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Thumb on C3. Finger 4 takes G2 on the bottom line, finger 5 takes F2 just under the staff.',
            ru: 'Первый палец на до. Четвёртый берёт соль на нижней линейке, пятый — фа прямо под станом.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2 G2 A2 B2 C3/1' },
      ],
    },
    {
      heading: { en: 'Steps down to F', ru: 'Шаги до фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Finger 5 plays the lowest note. Let it rest on the key, firm and curved.',
            ru: 'Пятый палец играет самую низкую ноту. Пусть он лежит на клавише уверенно и округло.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 G2 F2/2 F2 G2 A2/2 G2 F2 G2 A2 B2/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 B2 A2 G2 F2/2 A2/2 G2 A2 G2 F2 F2/1' },
      ],
    },
    {
      heading: { en: 'Skips in the position', ru: 'Скачки в позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F–A and A–C go space to space, G–B line to line. Each leaves one finger out.',
            ru: 'Фа — ля и ля — до — из промежутка в промежуток, соль — си — с линейки на линейку. Каждый скачок пропускает палец.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2 A2 C3/2 A2 C3 A2 F2 G2 B2 G2 B2 A2/1' },
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
        {
          kind: 'text',
          text: {
            en: 'Keep the eyes on the page, not on the hand.',
            ru: 'Смотрите в ноты, а не на руку.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 A2 B2 G2 A2 F2 G2/2 F2 G2 A2 B2 C3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'F2 G2 A2 G2/2 F2 A2 C3 A2 F2/2.' },
        { kind: 'notes', clef: 'bass', notes: 'G2 G2 A2 B2 C3/2 A2/2 G2 F2 G2 A2 F2/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note just under the bass staff.',
            ru: 'Сыграйте ноту прямо под басовым станом.',
          },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play G, then skip up to B.', ru: 'Сыграйте соль, затем скачком си.' },
          answer: { notes: ['G', 'B'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C with the thumb, then step down to F.',
            ru: 'Сыграйте до первым пальцем, затем шагами вниз до фа.',
          },
          answer: { notes: ['C', 'B', 'A', 'G', 'F'] },
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
