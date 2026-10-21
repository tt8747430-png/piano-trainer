import type { Lesson } from '@/entities/lesson'

/** Below the bass staff: F2 in the space underneath, then ledger lines down to C2. */
const belowTheBassStaff: Lesson = {
  id: 'below-the-bass-staff',
  title: { en: 'Notes below the bass staff', ru: 'Ноты под басовым станом' },
  summary: {
    en: 'Read the low notes below the bass staff, from F2 down to C2, using ledger lines.',
    ru: 'Читать низкие ноты под басовым станом, от фа до до большой октавы, по добавочным линейкам.',
  },
  sections: [
    {
      heading: { en: 'Under the bottom line', ru: 'Под нижней линейкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G2 sits on the bottom line. The note a step lower, F2, hangs just under the staff, touching the bottom line.',
            ru: 'Соль большой октавы стоит на нижней линейке. Нота на шаг ниже, фа, висит прямо под станом и касается нижней линейки.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 G2 F2/2' },
      ],
    },
    {
      heading: { en: 'Ledger lines below: E2 and D2', ru: 'Добавочные линейки внизу: ми и ре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Lower notes need ledger lines, the short lines that extend the staff. E2 sits on the first ledger line below. D2 hangs just under it.',
            ru: 'Для нот ниже нужны добавочные линейки — короткие линейки, продолжающие стан. Ми стоит на первой добавочной снизу. Ре висит прямо под ней.',
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
            en: 'C2 sits on a second ledger line below the staff. It is two octaves below middle C.',
            ru: 'До большой октавы стоит на второй добавочной линейке под станом. Это на две октавы ниже до первой октавы.',
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
            en: 'Count the ledger lines before you name a note. A note on one line is E. A note on two lines is C.',
            ru: 'Прежде чем назвать ноту, сосчитайте добавочные линейки. Нота на одной линейке — ми, на двух — до.',
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
            en: 'Leap to a low note from a landmark you know. C3 in the second space is an octave above C2. G2 on the bottom line is a 5th above C2.',
            ru: 'Скачок к низкой ноте делайте от знакомого ориентира. До во втором промежутке на октаву выше до большой октавы. Соль на нижней линейке на квинту выше него.',
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
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
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
