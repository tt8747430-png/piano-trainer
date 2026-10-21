import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left hand up to F3, reading F3, G3, A3 and B3 at the top of the bass staff. */
const bassBAGF: Lesson = {
  id: 'bass-b-a-g-f',
  title: { en: 'B, A, G and F on the bass staff', ru: 'Си, ля, соль и фа на басовом стане' },
  summary: {
    en: 'Move the left hand to the top of the bass staff and read from F up to middle C.',
    ru: 'Перенести левую руку в верхнюю часть басового стана и читать от фа до до первой октавы.',
  },
  sections: [
    {
      heading: { en: 'A new position: finger 5 on F3', ru: 'Новая позиция: пятый палец на фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Finger 5 on F3, the line between the clef’s dots. G3 is in the top space, A3 on the top line, B3 just above. The thumb plays middle C.',
            ru: 'Пятый палец на фа, на линейке между точками ключа. Соль в верхнем промежутке, ля на верхней линейке, си прямо над станом. Первый палец играет до.',
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
            en: 'F3 is your landmark here: the clef’s own line. Read each note as a step up or down from it.',
            ru: 'Здесь ваш ориентир — фа на линейке ключа. Читайте каждую ноту как шаг вверх или вниз от него.',
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
            en: 'F3 to A3 is a skip from line to line. G3 to B3 skips from the top space to just above the staff, leaving out A.',
            ru: 'Фа — ля — скачок с линейки на линейку. Соль — си — скачок из верхнего промежутка за пределы стана, через ля.',
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
            en: 'The left thumb reaches middle C, on a ledger line above the bass staff. It is the same key the right thumb played in the treble staff.',
            ru: 'Первый палец левой руки достаёт до первой октавы на добавочной линейке над басовым станом. Это та же клавиша, которую правая рука играла в скрипичном ключе.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A3 B3 C4/2 C4 A3 F3/2 G3 B3 C4 A3 F3/1' },
      ],
    },
    {
      heading: { en: 'Sight-reading', ru: 'Чтение с листа' },
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
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default bassBAGF
