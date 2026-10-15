import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left thumb on C3, fingers 2 and 3 on B2 and A2, on the bass staff. */
const lhCBA: Lesson = {
  id: 'lh-c-b-a',
  title: { en: 'C, B and A in the left hand', ru: 'До, си и ля в левой руке' },
  summary: {
    en: 'Left thumb on C3: read C3, B2 and A2 on the bass staff, the left hand stepping down from the thumb, and play them on sight.',
    ru: 'Первый палец левой руки на до малой октавы: читайте до, си и ля на басовом стане, шагая вниз от первого пальца, и играйте с листа.',
  },
  sections: [
    {
      heading: { en: 'Thumb on C3', ru: 'Первый палец на до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Put the left thumb on C3, an octave below middle C. Fingers 2 and 3 fall on B2 and A2, to its left.',
            ru: 'Поставьте первый палец левой руки на до малой октавы. Второй и третий ложатся на си и ля большой октавы, левее.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/2 B2/2 A2/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play C3 with your left thumb.',
            ru: 'Сыграйте до малой октавы первым пальцем левой руки.',
          },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'Where each note sits', ru: 'Где стоит каждая нота' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C3 is in the second space of the bass staff. B2 sits on the second line, A2 in the first space.',
            ru: 'До — во втором промежутке басового стана. Си — на второй линейке, ля — в первом промежутке.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 B2 C3 B2 A2/1' },
        {
          kind: 'question',
          ask: { en: 'Play the note on the second line.', ru: 'Сыграйте ноту на второй линейке.' },
          answer: { notes: ['B'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note in the first space.',
            ru: 'Сыграйте ноту в первом промежутке.',
          },
          answer: { notes: ['A'] },
        },
      ],
    },
    {
      heading: { en: 'Up on the staff, toward the thumb', ru: 'Вверх по стану — к первому пальцу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In the left hand, going up the staff moves toward the thumb. Going down moves toward finger 5.',
            ru: 'В левой руке движение вверх по стану идёт к первому пальцу. Вниз — к пятому.',
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
            en: 'A2 to C3 is a skip, space to space. Fingers 3 and 1 play it, finger 2 waiting over B.',
            ru: 'Ля — до — скачок из промежутка в промежуток. Его играют третий и первый пальцы, второй ждёт над си.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 C3 A2 C3 B2/2 A2/2 C3 A2 B2 C3 A2/1' },
        {
          kind: 'question',
          ask: { en: 'Play A, then skip up to C.', ru: 'Сыграйте ля, затем скачком до.' },
          answer: { notes: ['A', 'C'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Repeated notes', ru: 'Повторяющиеся ноты' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'C3 C3 B2 B2 A2 A2 C3/2 B2 B2 A2 B2 C3/1' },
        {
          kind: 'text',
          text: {
            en: 'Play each repeat with the same finger, from the key’s surface.',
            ru: 'Каждый повтор играйте тем же пальцем, не отрывая его далеко от клавиши.',
          },
        },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'C3 B2 A2 B2 C3 C3 C3/2 B2 B2 C3 B2 A2/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'A2 B2 C3 B2/2 A2 C3/2 B2 A2/2.' },
        { kind: 'notes', clef: 'bass', notes: 'B2 A2 B2 C3 A2/2 C3/2 B2 B2 A2 A2 C3/1' },
        {
          kind: 'note',
          text: {
            en: 'Read the bass staff by its own lines, not the treble’s.',
            ru: 'Читайте басовый стан по его линейкам, а не по скрипичным.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play A, B and C with fingers 3, 2 and 1.',
            ru: 'Сыграйте ля, си и до третьим, вторым и первым пальцами.',
          },
          answer: { notes: ['A', 'B', 'C'], rising: true },
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
          ask: {
            en: 'Play C, then step down twice.',
            ru: 'Сыграйте до, затем два шага вниз.',
          },
          answer: { notes: ['C', 'B', 'A'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the second line, then the space above it.',
            ru: 'Сыграйте ноту на второй линейке, затем в промежутке над ней.',
          },
          answer: { notes: ['B', 'C'], rising: true },
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
