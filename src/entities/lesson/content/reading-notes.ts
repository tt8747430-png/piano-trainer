import type { Lesson } from '../model/types'

const readingNotes: Lesson = {
  id: 'reading-notes',
  title: { en: 'The staff and the treble clef', ru: 'Нотный стан и скрипичный ключ' },
  summary: {
    en: 'Read the right hand’s notes: lines and spaces, three landmarks to read from, and notes above the staff.',
    ru: 'Читайте ноты правой руки: линейки и промежутки, три ориентира и ноты над станом.',
  },
  sections: [
    {
      heading: { en: 'Line, space, line', ru: 'Линейка, промежуток, линейка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The staff', ru: 'Нотный стан' },
          text: {
            en: 'is five lines. Each step up, line to space, is the next letter and the next white key.',
            ru: '— пять линеек. Каждый шаг вверх, с линейки на промежуток, — следующая буква и следующая белая клавиша.',
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
            en: 'curls round the second line: the G above middle C. The right hand reads it.',
            ru: 'обвивает вторую линейку — соль первой октавы. По нему читает правая рука.',
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
            en: 'The lines read E G B D F from the bottom. The spaces spell F A C E.',
            ru: 'Линейки снизу: ми, соль, си, ре, фа. Промежутки: фа, ля, до, ми.',
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
            en: 'Know middle C below the staff, G on the second line, C5 in the third space. Read other notes from the nearest.',
            ru: 'Запомните до первой октавы под станом, соль на второй линейке и до второй октавы в третьем промежутке. Остальное читайте шагами от ближайшего.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 G4/2 C5/1' },
        {
          kind: 'note',
          text: {
            en: 'Line to line skips a key, as does space to space.',
            ru: 'С линейки на линейку и с промежутка на промежуток — через клавишу.',
          },
        },
      ],
    },
    {
      heading: { en: 'Above the staff', ru: 'Над станом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A ledger line', ru: 'Добавочная линейка' },
          text: {
            en: 'is a short line for a note beyond the staff. Count on in steps: G5 above the staff, A5 on the first ledger line.',
            ru: '— короткая линейка для ноты за пределами стана. Считайте дальше шагами: соль над станом, ля на первой добавочной.',
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
            en: 'Reading gets fast by naming many notes quickly. Name each note below, then play it.',
            ru: 'Чтение ускоряется, когда называешь много нот быстро. Назовите каждую ноту ниже и сыграйте её.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 E4 C5 A4 F4 D5 B4 C4' },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
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
      ],
    },
  ],
}

export default readingNotes
