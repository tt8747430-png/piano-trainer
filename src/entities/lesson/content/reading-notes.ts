import type { Lesson } from '../model/types'

const readingNotes: Lesson = {
  id: 'reading-notes',
  title: { en: 'The staff and reading notes', ru: 'Нотный стан и чтение нот' },
  summary: {
    en: 'Lines and spaces, the treble and bass clefs, ledger lines, sharps and flats.',
    ru: 'Линейки и промежутки, скрипичный и басовый ключи, добавочные линейки, диезы и бемоли.',
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
          text: {
            en: 'Music is written on a staff of five lines. A note sits on a line or in the space between two. Each step up the staff is the next letter and the next white key: the higher a note on the staff, the higher it is on the piano.',
            ru: 'Музыку записывают на нотном стане из пяти линеек. Нота стоит на линейке или в промежутке между двумя. Каждый шаг вверх по стану — следующая буква и следующая белая клавиша: чем выше нота на стане, тем выше она на клавиатуре.',
          },
        },
      ],
    },
    {
      heading: { en: 'The treble clef', ru: 'Скрипичный ключ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The treble, or G, clef', ru: 'Скрипичный ключ, ключ соль,' },
          text: {
            en: 'curls around the second line from the bottom: that line is the G above middle C. The right hand mostly reads it. Its lines from the bottom are E G B D F, its spaces F A C E.',
            ru: 'обвивает вторую снизу линейку: на ней соль первой октавы. По нему читает в основном правая рука. Его линейки снизу вверх — ми, соль, си, ре, фа, промежутки — фа, ля, до, ми.',
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
          lead: { en: 'The bass, or F, clef', ru: 'Басовый ключ, ключ фа,' },
          text: {
            en: 'puts its two dots either side of the fourth line: that line is the F below middle C. The left hand mostly reads it. Its lines from the bottom are G B D F A, its spaces A C E G.',
            ru: 'ставит свои две точки по сторонам четвёртой линейки: на ней фа малой октавы. По нему читает в основном левая рука. Его линейки снизу вверх — соль, си, ре, фа, ля, промежутки — ля, до, ми, соль.',
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
          text: {
            en: 'A note beyond the staff gets a short line of its own, a ledger line. Middle C sits on one: just below the treble staff, and just above the bass staff. It is the same key either way.',
            ru: 'Нота за пределами стана получает свою короткую линейку — добавочную. До первой октавы стоит на такой линейке: сразу под скрипичным станом и сразу над басовым. В обоих случаях это одна и та же клавиша.',
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
          text: {
            en: 'A sharp (♯) raises a note to the very next key up, a flat (♭) lowers it to the very next key down, and a natural (♮) cancels either. An accidental holds for the rest of its bar.',
            ru: 'Диез (♯) повышает ноту до соседней клавиши вверх, бемоль (♭) понижает до соседней клавиши вниз, а бекар (♮) отменяет и то и другое. Случайный знак действует до конца такта.',
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
