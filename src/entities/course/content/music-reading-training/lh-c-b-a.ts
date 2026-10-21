import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left thumb on C3, fingers 2 and 3 on B2 and A2, on the bass staff. */
const lhCBA: Lesson = {
  id: 'lh-c-b-a',
  title: { en: 'C, B and A in the left hand', ru: 'До, си и ля в левой руке' },
  summary: {
    en: 'Read C, B and A on the bass staff and play them with left-hand fingers 1, 2 and 3.',
    ru: 'Читать до, си и ля в басовом ключе и играть их первым, вторым и третьим пальцами левой руки.',
  },
  sections: [
    {
      heading: { en: 'Thumb on C3', ru: 'Первый палец на до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand is numbered like the right, thumb 1 to little finger 5. Thumb on C3, the second space. Finger 2 on B2, the second line. Finger 3 on A2, the first space.',
            ru: 'Пальцы левой руки нумеруют так же: от большого (1) до мизинца (5). Первый палец на до во втором промежутке, второй на си на второй линейке, третий на ля в первом промежутке.',
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
            en: 'In the left hand the thumb plays the highest note. So notes going up the staff move toward the thumb, and notes going down move toward finger 5.',
            ru: 'В левой руке первый палец играет самую высокую ноту. Поэтому вверх по стану — к первому пальцу, вниз — к пятому.',
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
            en: 'A2 to C3 is a skip, from space to space. Fingers 3 and 1 play it. Finger 2 waits over B.',
            ru: 'Ля — до — скачок из промежутка в промежуток. Его играют третий и первый пальцы, а второй ждёт над си.',
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
            en: 'Play a repeated note with the same finger. Keep the finger close to the key between the two notes.',
            ru: 'Повторённую ноту играйте тем же пальцем. Между нотами держите палец у самой клавиши.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 C3 B2 B2 A2 A2 C3/2 B2 B2 A2 B2 C3/1' },
      ],
    },
    {
      heading: { en: 'Sight-reading', ru: 'Чтение с листа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The bass staff names its lines differently from the treble staff. Read each note from the bass staff’s own landmarks, such as C in the second space.',
            ru: 'Линейки басового стана называются иначе, чем скрипичного. Читайте каждую ноту от ориентиров басового стана, например от до во втором промежутке.',
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
          ask: {
            en: 'Play the note on the bass staff’s second line.',
            ru: 'Сыграйте ноту на второй линейке басового стана.',
          },
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
          ask: { en: 'Play A, then skip up to C.', ru: 'Сыграйте ля, затем скачком вверх до.' },
          answer: { notes: ['A', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default lhCBA
