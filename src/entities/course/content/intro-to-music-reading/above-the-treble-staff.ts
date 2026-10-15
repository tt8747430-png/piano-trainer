import type { Lesson } from '@/entities/lesson'

/** Above the treble staff: G5 in the space on top, then ledger lines up to C6. */
const aboveTheTrebleStaff: Lesson = {
  id: 'above-the-treble-staff',
  title: { en: 'Notes above the treble staff', ru: 'Ноты над скрипичным станом' },
  summary: {
    en: 'Past the top line the staff goes on with ledger lines. Read G5, A5, B5 and C6, two octaves above middle C.',
    ru: 'Выше верхней линейки стан продолжается добавочными линейками. Читайте соль, ля, си второй октавы и до третьей.',
  },
  sections: [
    {
      heading: { en: 'Past the top line', ru: 'Выше верхней линейки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F5 is the top line. One step higher, G5 sits in the space just over the staff.',
            ru: 'Фа второй октавы стоит на верхней линейке. На шаг выше, прямо над станом, лежит соль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E5 F5 G5/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just above the top line.',
            ru: 'Сыграйте ноту сразу над верхней линейкой.',
          },
          answer: { notes: ['G'] },
        },
      ],
    },
    {
      heading: { en: 'Ledger lines', ru: 'Добавочные линейки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A ledger line', ru: 'Добавочная линейка' },
          text: {
            en: 'is a short line drawn for one note beyond the staff. It carries on the staff’s lines and spaces.',
            ru: '— короткая линейка, которую пишут для одной ноты за пределами стана. Она продолжает линейки и промежутки стана.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G5/2 A5/2' },
        {
          kind: 'note',
          text: {
            en: 'A5 sits on the first ledger line above the staff.',
            ru: 'Ля второй октавы стоит на первой добавочной линейке над станом.',
          },
        },
      ],
    },
    {
      heading: { en: 'B5 on top of the ledger line', ru: 'Си над добавочной линейкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'B5 sits just above the first ledger line, as a space note would. It is the white key below C6.',
            ru: 'Си второй октавы лежит прямо над первой добавочной линейкой, как нота в промежутке. Это белая клавиша под до третьей октавы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'A5/2 B5/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just above the first ledger line.',
            ru: 'Сыграйте ноту прямо над первой добавочной линейкой.',
          },
          answer: { notes: ['B'] },
        },
      ],
    },
    {
      heading: { en: 'C6 on two ledger lines', ru: 'До на двух добавочных' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C6 takes a second ledger line. It is two octaves above middle C.',
            ru: 'До третьей октавы стоит на второй добавочной линейке. Она на две октавы выше до первой октавы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C6/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the second ledger line above the staff.',
            ru: 'Сыграйте ноту на второй добавочной линейке над станом.',
          },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'Up and back', ru: 'Вверх и обратно' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count the ledger lines before naming the note. One line is A, two lines is C.',
            ru: 'Сначала сосчитайте добавочные линейки. Одна — это ля, две — до.',
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
            en: 'Read a high note from the nearest landmark. C5 in the third space is an octave below C6.',
            ru: 'Высокую ноту читайте от ближайшего ориентира. До в третьем промежутке на октаву ниже до третьей октавы.',
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
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
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
