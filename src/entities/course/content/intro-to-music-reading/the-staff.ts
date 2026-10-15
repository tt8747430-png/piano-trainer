import type { Lesson } from '@/entities/lesson'

/** The staff as a picture of pitch: lines and spaces, steps, skips and repeats. */
const theStaff: Lesson = {
  id: 'the-staff',
  title: { en: 'The staff', ru: 'Нотный стан' },
  summary: {
    en: 'Five lines and four spaces picture pitch. Tell line notes from space notes, and read steps, skips and repeats.',
    ru: 'Пять линеек и четыре промежутка изображают высоту звука. Отличайте ноты на линейках от нот в промежутках и читайте шаги, скачки и повторы.',
  },
  sections: [
    {
      heading: { en: 'Five lines, four spaces', ru: 'Пять линеек, четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The staff', ru: 'Нотный стан' },
          text: {
            en: 'is five lines with four spaces between them. Lines and spaces are counted from the bottom up.',
            ru: '— пять линеек и четыре промежутка между ними. Линейки и промежутки считают снизу вверх.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F5/2 D5/2 B4/2 G4/2 E4/1' },
        {
          kind: 'note',
          text: {
            en: 'These notes sit on the five lines, top to bottom. The clef comes next lesson.',
            ru: 'Эти ноты стоят на пяти линейках, сверху вниз. Ключ в начале стана — тема следующего урока.',
          },
        },
      ],
    },
    {
      heading: { en: 'Line notes and space notes', ru: 'Ноты на линейках и в промежутках' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A line note has the line running through its middle. A space note sits between two lines, touching both.',
            ru: 'Через середину ноты на линейке проходит линейка. Нота в промежутке лежит между двумя линейками и касается обеих.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/2 A4/2 B4/2 C5/2' },
        {
          kind: 'note',
          text: {
            en: 'Line, space, line, space: each one is the next white key up.',
            ru: 'Линейка, промежуток, линейка, промежуток: каждая следующая нота — следующая белая клавиша вверх.',
          },
        },
      ],
    },
    {
      heading: {
        en: 'Higher on the page, higher on the keys',
        ru: 'Выше на стане — выше на клавиатуре',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The staff is a picture of pitch. A note higher on the staff is a key further right.',
            ru: 'Нотный стан — картина высоты звука. Чем выше нота на стане, тем правее клавиша.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 G4 A4 B4 C5/1' },
        { kind: 'notes', clef: 'treble', notes: 'C5 B4 A4 G4 F4/1' },
      ],
    },
    {
      heading: { en: 'Steps', ru: 'Шаги' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A step', ru: 'Шаг' },
          text: {
            en: 'goes from a line to the next space, or a space to the next line. On the keys it is the next white key.',
            ru: '— переход с линейки в соседний промежуток или из промежутка на соседнюю линейку. На клавиатуре это соседняя белая клавиша.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 D5 E5 D5 C5/1' },
        {
          kind: 'question',
          ask: { en: 'Play E, then a step up.', ru: 'Сыграйте ми, затем шаг вверх.' },
          answer: { notes: ['E', 'F'], rising: true },
        },
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
            ru: '— переход с линейки на соседнюю линейку или из промежутка в соседний промежуток. Одна белая клавиша пропускается.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 A4 C5 A4 F4/1' },
        {
          kind: 'question',
          ask: { en: 'Play G, then a skip up.', ru: 'Сыграйте соль, затем скачок вверх.' },
          answer: { notes: ['G', 'B'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Step, skip or repeat', ru: 'Шаг, скачок или повтор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A repeat', ru: 'Повтор' },
          text: {
            en: 'stays on the same line or space, so the same key plays again. Name each move below before you play.',
            ru: '— нота на той же линейке или в том же промежутке, то есть та же клавиша ещё раз. Назовите каждое движение, прежде чем играть.',
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
          ask: { en: 'Play D, then a skip up.', ru: 'Сыграйте ре, затем скачок вверх.' },
          answer: { notes: ['D', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C, then step up three times.',
            ru: 'Сыграйте до, затем три шага вверх.',
          },
          answer: { notes: ['C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play A, then skip up twice.',
            ru: 'Сыграйте ля, затем два скачка вверх.',
          },
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
