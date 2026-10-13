import type { Lesson } from '../model/types'

const readingNotes: Lesson = {
  id: 'reading-notes',
  title: { en: 'The staff and reading notes', ru: 'Нотный стан и чтение нот' },
  summary: {
    en: 'Read notes on the staff in the treble and bass clefs, on ledger lines, with sharps and flats.',
    ru: 'Ноты на стане в скрипичном и басовом ключах, на добавочных линейках, с диезами и бемолями.',
  },
  level: 1,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Five lines, four spaces', ru: 'Пять линеек, четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The staff', ru: 'Нотный стан' },
          text: {
            en: 'is five lines. Each step up, line to space to line, is the next letter and the next white key.',
            ru: '— пять линеек. Каждый шаг вверх, с линейки на промежуток и снова на линейку, — следующая буква и следующая белая клавиша.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4 A4 B4 C5 D5 E5' },
      ],
    },
    {
      heading: { en: 'The treble clef', ru: 'Скрипичный ключ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The treble clef', ru: 'Скрипичный ключ' },
          text: {
            en: 'curls round the second line, the G above middle C. Its lines are E G B D F, spaces F A C E. The right hand mostly reads it.',
            ru: 'обвивает вторую линейку — соль первой октавы. Линейки: ми, соль, си, ре, фа, промежутки: фа, ля, до, ми. По нему читает в основном правая рука.',
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
          lead: { en: 'The bass clef', ru: 'Басовый ключ' },
          text: {
            en: 'puts its dots round the fourth line, the F below middle C. Its lines are G B D F A, spaces A C E G. The left hand mostly reads it.',
            ru: 'ставит две точки вокруг четвёртой линейки — фа малой октавы. Линейки: соль, си, ре, фа, ля, промежутки: ля, до, ми, соль. По нему читает в основном левая рука.',
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
            en: 'is a short line for a note beyond the staff. Middle C sits on one: just below the treble staff, just above the bass staff.',
            ru: '— короткая линейка для ноты за пределами стана. До первой октавы стоит на одной: сразу под скрипичным станом и сразу над басовым.',
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
            en: 'move a note: a sharp (♯) to the next key up, a flat (♭) to the next key down. A natural (♮) cancels them. Each holds to the end of its bar.',
            ru: 'сдвигают ноту: диез (♯) на соседнюю клавишу вверх, бемоль (♭) — вниз. Бекар (♮) их отменяет. Знак действует до конца такта.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 F#4 F4/2 B4 B♭4 B4/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the treble staff’s middle line.',
            ru: 'Сыграйте ноту на средней линейке скрипичного стана.',
          },
          answer: { notes: ['B'] },
        },
        {
          kind: 'question',
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
