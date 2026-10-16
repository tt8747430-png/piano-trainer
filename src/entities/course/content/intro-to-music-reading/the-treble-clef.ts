import type { Lesson } from '@/entities/lesson'

/** The treble clef: its G, the notes on the staff from E4 to F5, and three landmarks to read from. */
const theTrebleClef: Lesson = {
  id: 'the-treble-clef',
  title: { en: 'The treble clef', ru: 'Скрипичный ключ' },
  summary: {
    en: 'Name every note on the treble staff, starting from three notes you know on sight.',
    ru: 'Называть любую ноту скрипичного стана, отталкиваясь от трёх нот, которые узнаёте сразу.',
  },
  sections: [
    {
      heading: { en: 'The G clef', ru: 'Ключ соль' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The treble clef', ru: 'Скрипичный ключ' },
          text: {
            en: 'is also called the G clef. Its curl wraps round the second line, and that line is G4, the G just above middle C. The right hand usually reads it.',
            ru: 'называют ещё ключом соль. Его завиток обвивает вторую линейку, и на ней стоит соль первой октавы. Обычно по нему читает правая рука.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/1' },
      ],
    },
    {
      heading: { en: 'The five lines', ru: 'Пять линеек' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom up, the lines are E, G, B, D, F. Remember them as Every Good Boy Does Fine.',
            ru: 'Снизу вверх на линейках стоят ми, соль, си первой октавы, ре и фа второй. Каждая следующая — через одну белую клавишу.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/2 G4/2 B4/2 D5/2 F5/1' },
      ],
    },
    {
      heading: { en: 'The four spaces', ru: 'Четыре промежутка' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the bottom up, the spaces spell the word FACE: F, A, C, E.',
            ru: 'Снизу вверх в промежутках стоят фа, ля первой октавы, до и ми второй.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4/2 A4/2 C5/2 E5/2' },
      ],
    },
    {
      heading: { en: 'Three landmarks', ru: 'Три ориентира' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A landmark note', ru: 'Нота-ориентир' },
          text: {
            en: 'is a note you know on sight. Learn three: G4 on the second line, C5 in the third space and F5 on the top line.',
            ru: '— нота, которую узнаёте сразу. Выучите три: соль на второй линейке, до в третьем промежутке и фа на верхней линейке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/2 C5/2 F5/1' },
      ],
    },
    {
      heading: { en: 'Read from a landmark', ru: 'Читайте от ориентира' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Find the nearest landmark, then count steps or skips from it. A4 is a step above G4. E5 is a step below F5.',
            ru: 'Найдите ближайший ориентир и отсчитайте от него шаги или скачки. Ля — шаг над соль. Ми второй октавы — шаг под фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 A4 G4 B4 C5 D5 C5 E5 F5 E5 F5/2' },
      ],
    },
    {
      heading: { en: 'Just below the staff', ru: 'Под станом' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D4 hangs just under the bottom line. Middle C sits one step lower, on a short extra line of its own.',
            ru: 'Ре первой октавы висит прямо под нижней линейкой. На шаг ниже, на своей короткой линейке, стоит до первой октавы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'E4 G4 C5 B4 A4 F4 G4/2 D5 C5 B4 D5 C5/1' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the landmarks first: G, C and F.',
              ru: 'Сначала найдите ориентиры: соль, до и фа.',
            },
            { en: 'Name the other notes from them.', ru: 'Назовите остальные ноты от них.' },
            {
              en: 'Play the line slowly, without stopping.',
              ru: 'Сыграйте строку медленно, без остановок.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the five line notes, bottom to top.',
            ru: 'Сыграйте пять нот на линейках снизу вверх.',
          },
          answer: { notes: ['E', 'G', 'B', 'D', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note in the third space.',
            ru: 'Сыграйте ноту в третьем промежутке.',
          },
          answer: { notes: ['C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just under the bottom line.',
            ru: 'Сыграйте ноту сразу под нижней линейкой.',
          },
          answer: { notes: ['D'] },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'Read the tune of Yankee Doodle', ru: 'Прочитайте мелодию «Янки Дудл»' },
          target: { opens: 'piece', piece: 'yankee-doodle' },
        },
      ],
    },
  ],
}

export default theTrebleClef
