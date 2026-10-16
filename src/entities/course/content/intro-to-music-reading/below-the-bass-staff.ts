import type { Lesson } from '@/entities/lesson'

/** Below the bass staff: F2 in the space underneath, then ledger lines down to C2. */
const belowTheBassStaff: Lesson = {
  id: 'below-the-bass-staff',
  title: { en: 'Notes below the bass staff', ru: 'Ноты под басовым станом' },
  summary: {
    en: 'Read the low notes below the bass staff, down to C2.',
    ru: 'Читать низкие ноты под басовым станом, до до большой октавы.',
  },
  sections: [
    {
      heading: { en: 'Under the bottom line', ru: 'Под нижней линейкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G2 is the bottom line. One step lower, F2 hangs just under the staff.',
            ru: 'Соль большой октавы — на нижней линейке. На шаг ниже, прямо под станом, — фа.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 G2 F2/2' },
      ],
    },
    {
      heading: { en: 'E2 and D2', ru: 'Ми и ре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Ledger lines work below the staff as above it. E2 sits on the first, D2 hangs just under it.',
            ru: 'Под станом добавочные линейки работают так же, как над ним. Ми — на первой, ре — прямо под ней.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2/2 E2/2 D2/1' },
      ],
    },
    {
      heading: { en: 'C2 on two ledger lines', ru: 'До на двух добавочных' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C2 takes a second ledger line, two octaves below middle C.',
            ru: 'До большой октавы — на второй добавочной линейке, на две октавы ниже до первой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C2/1' },
      ],
    },
    {
      heading: { en: 'Down and back', ru: 'Вниз и обратно' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count the ledger lines before naming the note. One line is E, two lines are C.',
            ru: 'Сначала сосчитайте добавочные линейки. Одна — ми, две — до.',
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
            en: 'C3 in the second space is an octave above C2. G2 on the bottom line is a 5th above it.',
            ru: 'До во втором промежутке — октавой выше до большой октавы. Соль на нижней линейке — квинтой выше неё.',
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
            en: 'Play the note on the first ledger line below the bass staff.',
            ru: 'Сыграйте ноту на первой добавочной линейке под басовым станом.',
          },
          answer: { notes: ['E'] },
        },
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
