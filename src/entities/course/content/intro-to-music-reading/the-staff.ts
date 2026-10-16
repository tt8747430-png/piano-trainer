import type { Lesson } from '@/entities/lesson'

/** The staff as a picture of pitch: lines and spaces, steps, skips and repeats. */
const theStaff: Lesson = {
  id: 'the-staff',
  title: { en: 'The staff', ru: 'Нотный стан' },
  summary: {
    en: 'Read steps, skips and repeats on the staff.',
    ru: 'Читать на стане шаги, скачки и повторы.',
  },
  sections: [
    {
      heading: { en: 'Five lines, four spaces', ru: 'Пять линеек, четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The staff', ru: 'Нотный стан' },
          text: {
            en: 'is five lines with four spaces between them, counted from the bottom. These notes sit on the lines.',
            ru: '— пять линеек и четыре промежутка, их считают снизу. Эти ноты стоят на линейках.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F5/2 D5/2 B4/2 G4/2 E4/1' },
      ],
    },
    {
      heading: { en: 'Lines and spaces', ru: 'Линейки и промежутки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A line note has the line through its middle. A space note sits between two lines.',
            ru: 'Через ноту на линейке проходит линейка. Нота в промежутке лежит между двумя линейками.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/2 A4/2 B4/2 C5/2' },
      ],
    },
    {
      heading: {
        en: 'Higher on the page, higher on the keys',
        ru: 'Выше на стане — выше на клавишах',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A note higher on the staff is a key further right.',
            ru: 'Чем выше нота на стане, тем правее клавиша.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 G4 A4 B4 C5/1' },
      ],
    },
    {
      heading: { en: 'Steps', ru: 'Шаги' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A step', ru: 'Шаг' },
          text: {
            en: 'goes from a line to the next space, or a space to the next line: the next white key.',
            ru: '— с линейки в соседний промежуток или из промежутка на соседнюю линейку: соседняя белая клавиша.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 D5 E5 D5 C5/1' },
      ],
    },
    {
      heading: { en: 'Skips', ru: 'Скачки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A skip', ru: 'Скачок' },
          text: {
            en: 'goes from a line to the next line, or a space to the next space. It leaves one white key out.',
            ru: '— с линейки на соседнюю линейку или из промежутка в соседний. Одна белая клавиша пропускается.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 A4 C5 A4 F4/1' },
      ],
    },
    {
      heading: { en: 'Step, skip or repeat', ru: 'Шаг, скачок или повтор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A repeat', ru: 'Повтор' },
          text: {
            en: 'stays on the same line or space: the same key again. Name each move below before you play.',
            ru: '— та же линейка или промежуток, то есть та же клавиша. Назовите каждое движение, прежде чем играть.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 F4 A4 G4 E4 G4/2 A4 A4 C5 B4 A4/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play E, then a step up.', ru: 'Сыграйте ми, затем шаг вверх.' },
          answer: { notes: ['E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play G, then a skip up.', ru: 'Сыграйте соль, затем скачок вверх.' },
          answer: { notes: ['G', 'B'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play A, then skip up twice.', ru: 'Сыграйте ля, затем два скачка вверх.' },
          answer: { notes: ['A', 'C', 'E'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: {
            en: 'Follow the steps and skips of Oh! Susanna',
            ru: 'Следите за шагами и скачками в «О, Сюзанна»',
          },
          target: { opens: 'piece', piece: 'oh-susanna' },
        },
      ],
    },
  ],
}

export default theStaff
