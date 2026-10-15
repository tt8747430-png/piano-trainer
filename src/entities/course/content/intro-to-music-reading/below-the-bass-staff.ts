import type { Lesson } from '@/entities/lesson'

/** Below the bass staff: F2 in the space underneath, then ledger lines down to C2. */
const belowTheBassStaff: Lesson = {
  id: 'below-the-bass-staff',
  title: { en: 'Notes below the bass staff', ru: 'Ноты под басовым станом' },
  summary: {
    en: 'Under the bottom line the bass staff goes on with ledger lines. Read F2, E2, D2 and C2, two octaves below middle C.',
    ru: 'Ниже нижней линейки басовый стан продолжается добавочными линейками. Читайте фа, ми, ре и до большой октавы.',
  },
  sections: [
    {
      heading: { en: 'Under the bottom line', ru: 'Под нижней линейкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G2 is the bottom line. One step lower, F2 hangs in the space just under the staff.',
            ru: 'Соль большой октавы стоит на нижней линейке. На шаг ниже, прямо под станом, висит фа.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 G2 F2/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just under the bottom line.',
            ru: 'Сыграйте ноту сразу под нижней линейкой.',
          },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'E2 on a ledger line', ru: 'Ми на добавочной линейке' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Ledger lines work below the staff just as above it. E2 sits on the first ledger line below.',
            ru: 'Под станом добавочные линейки работают так же, как над ним. Ми большой октавы стоит на первой добавочной снизу.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2/2 E2/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the first ledger line below the bass staff.',
            ru: 'Сыграйте ноту на первой добавочной линейке под басовым станом.',
          },
          answer: { notes: ['E'] },
        },
      ],
    },
    {
      heading: { en: 'D2 under the ledger line', ru: 'Ре под добавочной линейкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D2 hangs just under the first ledger line, as a space note would.',
            ru: 'Ре большой октавы висит прямо под первой добавочной линейкой, как нота в промежутке.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'E2/2 D2/2' },
      ],
    },
    {
      heading: { en: 'C2 on two ledger lines', ru: 'До на двух добавочных' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C2 takes a second ledger line below. It is two octaves below middle C.',
            ru: 'До большой октавы стоит на второй добавочной линейке снизу. Она на две октавы ниже до первой октавы.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C2/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the second ledger line below the staff.',
            ru: 'Сыграйте ноту на второй добавочной линейке под станом.',
          },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'Down and back', ru: 'Вниз и обратно' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count the ledger lines below before naming the note. One line is E, two lines is C.',
            ru: 'Сначала сосчитайте добавочные линейки снизу. Одна — это ми, две — до.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2 F2 E2 D2 C2/1 C2 D2 E2 F2 G2/1' },
      ],
    },
    {
      heading: { en: 'Low notes from landmarks', ru: 'Низкие ноты от ориентиров' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C3 in the second space is an octave above C2. G2 on the bottom line is a fifth above it.',
            ru: 'До во втором промежутке на октаву выше до большой октавы. Соль на нижней линейке — на квинту выше неё.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/2 C2/2 G2/2 E2/2 D2 F2 E2 G2 C2/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play from C2 up to the bottom line, step by step.',
            ru: 'Сыграйте шагами от до большой октавы до нижней линейки.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just under the first ledger line below.',
            ru: 'Сыграйте ноту прямо под первой добавочной линейкой снизу.',
          },
          answer: { notes: ['D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C2, then the C in the second space.',
            ru: 'Сыграйте до большой октавы, затем до во втором промежутке.',
          },
          answer: { notes: ['C', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: {
            en: 'Read the left hand of Oh! Susanna',
            ru: 'Прочитайте партию левой руки «О, Сюзанна»',
          },
          target: { opens: 'piece', piece: 'oh-susanna' },
        },
      ],
    },
  ],
}

export default belowTheBassStaff
