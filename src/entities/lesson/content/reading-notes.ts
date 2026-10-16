import type { Lesson } from '../model/types'

const readingNotes: Lesson = {
  id: 'reading-notes',
  title: { en: 'The staff and the treble clef', ru: 'Нотный стан и скрипичный ключ' },
  summary: {
    en: 'Read the notes of the treble staff, from three landmarks, and find each one on the keys.',
    ru: 'Читать ноты в скрипичном ключе от трёх ориентиров и находить каждую на клавиатуре.',
  },
  sections: [
    {
      heading: { en: 'Line, space, line', ru: 'Линейка, промежуток, линейка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The staff', ru: 'Нотный стан' },
          text: {
            en: 'is five lines with spaces between. Each step up, from a line to the space above, is the next letter and the next white key.',
            ru: '— это пять линеек с промежутками между ними. Каждый шаг вверх, с линейки на промежуток, — следующая буква и следующая белая клавиша.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4 A4 B4 C5 D5 E5' },
      ],
    },
    {
      heading: { en: 'The treble clef marks G', ru: 'Скрипичный ключ отмечает соль' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The treble clef', ru: 'Скрипичный ключ' },
          text: {
            en: 'is the sign at the start of the staff. It curls round the second line, marking it as G above middle C.',
            ru: '— знак в начале стана. Он обвивает вторую линейку и отмечает её как соль первой октавы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/1' },
        {
          kind: 'question',
          ask: { en: 'Play the treble clef’s G.', ru: 'Сыграйте соль скрипичного ключа.' },
          answer: { notes: ['G'] },
        },
      ],
    },
    {
      heading: { en: 'Lines and spaces', ru: 'Линейки и промежутки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom, the lines are E G B D F. The spaces spell F A C E. Each line to the next skips one white key.',
            ru: 'Линейки снизу: ми, соль, си, ре, фа. Промежутки: фа, ля, до, ми. От линейки к линейке — через одну белую клавишу.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 G4 B4 D5 F5/1' },
        { kind: 'notes', clef: 'treble', notes: 'F4 A4 C5 E5' },
      ],
    },
    {
      heading: { en: 'Read from three landmarks', ru: 'Читайте от трёх ориентиров' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Learn three notes by sight: middle C below the staff, G on the second line, C in the third space. Count from the nearest one.',
            ru: 'Запомните три ноты: до под станом, соль на второй линейке, до в третьем промежутке. Остальные считайте от ближайшей.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 G4/2 C5/1' },
      ],
    },
    {
      heading: { en: 'Above the staff', ru: 'Над станом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A ledger line', ru: 'Добавочная линейка' },
          text: {
            en: 'is a short extra line for a note above or below the staff. Keep counting steps: G sits above the top line, A on the first ledger line.',
            ru: '— короткая линейка для ноты выше или ниже стана. Считайте шаги дальше: соль над верхней линейкой, ля на первой добавочной.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F5 G5 A5 B5 C6/1' },
      ],
    },
    {
      heading: { en: 'Practise reading', ru: 'Тренируйте чтение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Name each note below aloud, then play it. Repeat the line a little faster each time.',
            ru: 'Назовите каждую ноту вслух и сыграйте её. Повторяйте строчку, каждый раз чуть быстрее.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 E4 C5 A4 F4 D5 B4 C4' },
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
            en: 'Play the notes in the four spaces, bottom to top.',
            ru: 'Сыграйте ноты в четырёх промежутках снизу вверх.',
          },
          answer: { notes: ['F', 'A', 'C', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the first ledger line above the staff.',
            ru: 'Сыграйте ноту на первой добавочной линейке над станом.',
          },
          answer: { notes: ['A'] },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default readingNotes
