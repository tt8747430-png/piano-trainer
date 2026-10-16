import type { Lesson } from '@/entities/lesson'

/** Above the treble staff: G5 in the space on top, then ledger lines up to C6. */
const aboveTheTrebleStaff: Lesson = {
  id: 'above-the-treble-staff',
  title: { en: 'Notes above the treble staff', ru: 'Ноты над скрипичным станом' },
  summary: {
    en: 'Read the high notes above the treble staff, from G5 up to C6, using ledger lines.',
    ru: 'Читать высокие ноты над скрипичным станом, от соль до до третьей октавы, по добавочным линейкам.',
  },
  sections: [
    {
      heading: { en: 'Past the top line', ru: 'Выше верхней линейки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F5 sits on the top line. The note a step higher, G5, sits on top of the staff, touching the top line.',
            ru: 'Фа второй октавы стоит на верхней линейке. Нота на шаг выше, соль, лежит прямо над станом и касается верхней линейки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E5 F5 G5/2' },
      ],
    },
    {
      heading: { en: 'Ledger lines', ru: 'Добавочные линейки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A ledger line', ru: 'Добавочная линейка' },
          text: {
            en: 'is a short line that extends the staff for one note. Notes above G5 need them. A5 sits on the first ledger line above the staff.',
            ru: '— короткая линейка, которая продолжает стан для одной ноты. Ноты выше соль пишут на них. Ля второй октавы стоит на первой добавочной линейке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G5/2 A5/2' },
      ],
    },
    {
      heading: { en: 'B5 and C6', ru: 'Си и до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'B5 sits just above the first ledger line. C6 sits on a second ledger line. It is two octaves above middle C.',
            ru: 'Си лежит над первой добавочной линейкой. До третьей октавы стоит на второй добавочной. Это на две октавы выше до первой октавы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'A5/2 B5/2 C6/1' },
      ],
    },
    {
      heading: { en: 'Up and back', ru: 'Вверх и обратно' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count the ledger lines before you name a note. A note on one line is A. A note on two lines is C.',
            ru: 'Прежде чем назвать ноту, сосчитайте добавочные линейки. Нота на одной линейке — ля, на двух — до.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F5 G5 A5 B5 C6/1 C6 B5 A5 G5 F5/1' },
      ],
    },
    {
      heading: { en: 'Leaps to the high notes', ru: 'Скачки к высоким нотам' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'For a leap up to a high note, start from a landmark you know. C5 in the third space is exactly an octave below C6.',
            ru: 'Для скачка к высокой ноте отталкивайтесь от знакомого ориентира. До в третьем промежутке ровно на октаву ниже до третьей октавы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/2 C6/2 F5/2 A5/2 G5 A5 B5 G5 C6/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the first ledger line above the staff.',
            ru: 'Сыграйте ноту на первой добавочной линейке над станом.',
          },
          answer: { notes: ['A'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play from the top line up to the second ledger line, step by step.',
            ru: 'Сыграйте шагами от верхней линейки до второй добавочной.',
          },
          answer: { notes: ['F', 'G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the third space, then the C an octave above it.',
            ru: 'Сыграйте ноту в третьем промежутке, затем до октавой выше.',
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
          title: { en: 'Read Oh! Susanna', ru: 'Прочитайте «О, Сюзанна»' },
          target: { opens: 'piece', piece: 'oh-susanna' },
        },
      ],
    },
  ],
}

export default aboveTheTrebleStaff
