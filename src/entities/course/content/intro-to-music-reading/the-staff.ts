import type { Lesson } from '@/entities/lesson'

/** The staff as a picture of pitch: lines and spaces, steps, skips and repeats. */
const theStaff: Lesson = {
  id: 'the-staff',
  title: { en: 'The staff', ru: 'Нотный стан' },
  summary: {
    en: 'See how the staff shows pitch, and read steps, skips and repeats.',
    ru: 'Как стан показывает высоту звука и как читать шаги, скачки и повторы.',
  },
  sections: [
    {
      heading: { en: 'Five lines, four spaces', ru: 'Пять линеек, четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The staff', ru: 'Нотный стан' },
          text: {
            en: 'is five lines with four spaces between them, counted from the bottom up. Every note sits on a line or in a space. These five sit on the lines.',
            ru: '— пять линеек и четыре промежутка между ними. Их считают снизу вверх. Каждая нота стоит на линейке или в промежутке. Эти пять — на линейках.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F5/2 D5/2 B4/2 G4/2 E4/1' },
      ],
    },
    {
      heading: { en: 'Line notes and space notes', ru: 'Ноты на линейках и в промежутках' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A line note has a line running through its middle. A space note sits between two lines. Here they take turns: line, space, line, space.',
            ru: 'Нота на линейке перечёркнута линейкой посередине. Нота в промежутке лежит между двумя линейками. Здесь они чередуются: линейка, промежуток, линейка, промежуток.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/2 A4/2 B4/2 C5/2' },
      ],
    },
    {
      heading: {
        en: 'Higher on the staff, higher on the keys',
        ru: 'Выше на стане — выше на клавишах',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The staff is a picture of pitch. A note higher on the staff sounds higher, so it is a key further to the right. Play these and watch them climb.',
            ru: 'Стан — это картинка высоты звука. Чем выше нота на стане, тем выше она звучит и тем правее клавиша. Сыграйте и проследите, как ноты поднимаются.',
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
            en: 'moves from a line to the next space, or from a space to the next line. On the piano it is the next white key.',
            ru: '— переход с линейки в соседний промежуток или из промежутка на соседнюю линейку. На фортепиано это соседняя белая клавиша.',
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
            en: 'moves from a line to the next line, or from a space to the next space. On the piano it jumps over one white key.',
            ru: '— переход с линейки на соседнюю линейку или из промежутка в соседний промежуток. На фортепиано одна белая клавиша пропускается.',
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
            en: 'stays on the same line or space, so you play the same key again. Before you play this line, name each move: step, skip or repeat.',
            ru: '— нота на той же линейке или в том же промежутке: та же клавиша ещё раз. Прежде чем играть, назовите каждое движение: шаг, скачок или повтор.',
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
          ask: {
            en: 'Play E, then the note a step up.',
            ru: 'Сыграйте ми, затем ноту на шаг выше.',
          },
          answer: { notes: ['E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G, then the note a skip up.',
            ru: 'Сыграйте соль, затем ноту на скачок выше.',
          },
          answer: { notes: ['G', 'B'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play A, then skip up twice.', ru: 'Сыграйте ля, затем два скачка вверх.' },
          answer: { notes: ['A', 'C', 'E'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
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
