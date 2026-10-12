import type { Lesson } from '../model/types'

const readingNotes: Lesson = {
  id: 'reading-notes',
  title: { en: 'The staff and reading notes', ru: 'Нотный стан и чтение нот' },
  summary: {
    en: 'Read notes on the staff in the treble and bass clefs, on ledger lines, with sharps and flats.',
    ru: 'Как читать ноты на стане в скрипичном и басовом ключах, на добавочных линейках, с диезами и бемолями.',
  },
  level: 1,
  category: 'reading',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Five lines, four spaces', ru: 'Пять линеек, четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The staff', ru: 'Нотный стан' },
          text: {
            en: 'is the five lines music is written on. A note sits on a line or in the space between two lines.',
            ru: '— пять линеек, на которых записывают музыку. Нота стоит на линейке или в промежутке между двумя линейками.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Each step up the staff is the next letter and the next white key. The higher a note sits on the staff, the higher it sounds.',
            ru: 'Каждый шаг вверх по стану — следующая буква и следующая белая клавиша. Чем выше нота на стане, тем выше она звучит.',
          },
        },
      ],
    },
    {
      heading: { en: 'The treble clef', ru: 'Скрипичный ключ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The treble clef, or G clef,', ru: 'Скрипичный ключ, или ключ соль,' },
          text: {
            en: 'curls around the second line from the bottom. That line is the G above middle C. The right hand mostly reads this clef.',
            ru: 'обвивает вторую снизу линейку. На ней стоит соль первой октавы. По этому ключу читает в основном правая рука.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Its lines from the bottom are E G B D F. Its spaces are F A C E. Play the lines below, then the spaces.',
            ru: 'Его линейки снизу вверх — ми, соль, си, ре, фа. Промежутки — фа, ля, до, ми. Сыграйте ниже сначала линейки, потом промежутки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 G4 B4 D5 F5/1' },
        { kind: 'notes', clef: 'treble', notes: 'F4 A4 C5 E5' },
      ],
    },
    {
      heading: { en: 'The bass clef', ru: 'Басовый ключ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The bass clef, or F clef,', ru: 'Басовый ключ, или ключ фа,' },
          text: {
            en: 'puts its two dots either side of the fourth line. That line is the F below middle C. The left hand mostly reads this clef.',
            ru: 'ставит две точки по обе стороны четвёртой линейки. На ней стоит фа малой октавы. По этому ключу читает в основном левая рука.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Its lines from the bottom are G B D F A. Its spaces are A C E G. Play the lines below, then the spaces.',
            ru: 'Его линейки снизу вверх — соль, си, ре, фа, ля. Промежутки — ля, до, ми, соль. Сыграйте ниже сначала линейки, потом промежутки.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2 B2 D3 F3 A3/1' },
        { kind: 'notes', clef: 'bass', notes: 'A2 C3 E3 G3' },
      ],
    },
    {
      heading: { en: 'Middle C and ledger lines', ru: 'До первой октавы и добавочные линейки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A ledger line', ru: 'Добавочная линейка' },
          text: {
            en: 'is a short line of its own for a note beyond the staff.',
            ru: '— короткая линейка для ноты за пределами стана.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Middle C sits on one ledger line. In the treble clef it is just below the staff. In the bass clef it is just above. It is the same key either way. Play both lines below.',
            ru: 'До первой октавы стоит на одной добавочной линейке. В скрипичном ключе она сразу под станом, в басовом — сразу над ним. В обоих случаях это одна клавиша. Сыграйте обе строки ниже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'B3 C4 D4/2' },
        { kind: 'notes', clef: 'bass', notes: 'B3 C4 D4/2' },
      ],
    },
    {
      heading: { en: 'Sharps, flats and naturals', ru: 'Диезы, бемоли и бекары' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Accidentals', ru: 'Случайные знаки' },
          text: {
            en: 'are signs before a note that change it.',
            ru: '— знаки перед нотой, которые её меняют.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'A sharp (♯) raises a note to the very next key up.',
              ru: 'Диез (♯) повышает ноту до соседней клавиши вверх.',
            },
            {
              en: 'A flat (♭) lowers a note to the very next key down.',
              ru: 'Бемоль (♭) понижает ноту до соседней клавиши вниз.',
            },
            {
              en: 'A natural (♮) cancels a sharp or a flat.',
              ru: 'Бекар (♮) отменяет диез или бемоль.',
            },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'An accidental holds for the rest of its bar. Play the line below.',
            ru: 'Случайный знак действует до конца такта. Сыграйте строку ниже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 F#4 F4/2 B4 B♭4 B4/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the note on the treble staff’s middle line.',
            ru: 'Сыграйте ноту на средней линейке скрипичного стана.',
          },
          answer: { notes: ['B'] },
        },
        {
          kind: 'quiz',
          ask: {
            en: 'Play the note in the bass staff’s top space.',
            ru: 'Сыграйте ноту в верхнем промежутке басового стана.',
          },
          answer: { notes: ['G'] },
        },
      ],
    },
  ],
}

export default readingNotes
