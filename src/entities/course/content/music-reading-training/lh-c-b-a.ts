import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left thumb on C3, fingers 2 and 3 on B2 and A2, on the bass staff. */
const lhCBA: Lesson = {
  id: 'lh-c-b-a',
  title: { en: 'C, B and A in the left hand', ru: 'До, си и ля в левой руке' },
  summary: {
    en: 'Sight-read C, B and A in the left hand.',
    ru: 'Читать с листа и играть левой рукой до, си и ля.',
  },
  sections: [
    {
      heading: { en: 'Thumb on C3', ru: 'Первый палец на до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Left thumb on C3 in the second space, finger 2 on B2 on the second line, 3 on A2 in the first space.',
            ru: 'Левый первый палец на до во втором промежутке, второй — на си на второй линейке, третий — на ля в первом промежутке.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 B2 C3 B2 A2/1' },
      ],
    },
    {
      heading: { en: 'Up on the staff, toward the thumb', ru: 'Вверх по стану — к первому пальцу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In the left hand, going up the staff moves toward the thumb, going down toward finger 5.',
            ru: 'В левой руке вверх по стану — к первому пальцу, вниз — к пятому.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 B2 C3/2 C3 B2 A2/2 B2 C3 B2 A2 C3/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 B2 A2 B2 C3/2 B2/2 A2 B2 C3 B2 A2/1' },
      ],
    },
    {
      heading: { en: 'The skip from A to C', ru: 'Скачок от ля к до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A2 to C3 is a skip, space to space. Fingers 3 and 1 play it, 2 waits over B.',
            ru: 'Ля — до — скачок из промежутка в промежуток. Его играют третий и первый пальцы, второй ждёт над си.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 C3 A2 C3 B2/2 A2/2 C3 A2 B2 C3 A2/1' },
      ],
    },
    {
      heading: { en: 'Repeated notes', ru: 'Повторяющиеся ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play each repeat with the same finger, from the key’s surface.',
            ru: 'Каждый повтор играйте тем же пальцем, не отрывая его от клавиши.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 C3 B2 B2 A2 A2 C3/2 B2 B2 A2 B2 C3/1' },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Read the bass staff by its own lines, not the treble’s.',
            ru: 'Читайте басовый стан по его линейкам, а не по скрипичным.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 B2 A2 B2 C3 C3 C3/2 B2 B2 C3 B2 A2/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'A2 B2 C3 B2/2 A2 C3/2 B2 A2/2.' },
        { kind: 'notes', clef: 'bass', notes: 'B2 A2 B2 C3 A2/2 C3/2 B2 B2 A2 A2 C3/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the note on the second line.', ru: 'Сыграйте ноту на второй линейке.' },
          answer: { notes: ['B'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note in the second space of the bass staff.',
            ru: 'Сыграйте ноту во втором промежутке басового стана.',
          },
          answer: { notes: ['C'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play A, then skip up to C.', ru: 'Сыграйте ля, затем скачком до.' },
          answer: { notes: ['A', 'C'], rising: true },
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

export default lhCBA
