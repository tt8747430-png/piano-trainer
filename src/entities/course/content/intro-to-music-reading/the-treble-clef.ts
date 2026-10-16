import type { Lesson } from '@/entities/lesson'

/** The treble clef: its G, the notes on the staff from E4 to F5, and three landmarks to read from. */
const theTrebleClef: Lesson = {
  id: 'the-treble-clef',
  title: { en: 'The treble clef', ru: 'Скрипичный ключ' },
  summary: {
    en: 'Read every note on the treble staff from three landmarks.',
    ru: 'Читать любую ноту скрипичного стана от трёх ориентиров.',
  },
  sections: [
    {
      heading: { en: 'The G clef', ru: 'Ключ соль' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The treble clef', ru: 'Скрипичный ключ' },
          text: {
            en: '(the G clef) curls round the second line. That line is G4, the G above middle C.',
            ru: '(ключ соль) обвивает вторую линейку. На ней стоит соль первой октавы.',
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
            en: 'From the bottom, the lines are E, G, B, D, F: Every Good Boy Does Fine.',
            ru: 'Снизу вверх на линейках: ми, соль, си первой октавы, ре и фа второй.',
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
            en: 'From the bottom, the spaces spell FACE.',
            ru: 'Снизу вверх в промежутках: фа, ля первой октавы, до и ми второй.',
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
            en: 'is one you know on sight: G4 on the second line, C5 in the third space, F5 on the top line.',
            ru: '— нота, которую узнаёте сразу: соль на второй линейке, до в третьем промежутке, фа на верхней.',
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
            en: 'Read any other note as a step or skip from the nearest landmark. A4 is a step above G.',
            ru: 'Любую другую ноту читайте шагом или скачком от ближайшего ориентира. Ля — шаг над соль.',
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
            en: 'D4 hangs under the bottom line. Middle C sits below it, on a short line of its own.',
            ru: 'Ре первой октавы висит под нижней линейкой. Ниже, на своей короткой линейке, — до первой октавы.',
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
            { en: 'Find the landmarks first.', ru: 'Сначала найдите ориентиры.' },
            { en: 'Name the other notes from them.', ru: 'Назовите остальные ноты от них.' },
            { en: 'Play it slowly, without stopping.', ru: 'Сыграйте медленно, без остановок.' },
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
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
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
