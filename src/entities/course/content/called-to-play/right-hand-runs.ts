import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 6: runs down to the root and up 1–2–3–5. */
const rightHandRuns: Lesson = {
  id: 'right-hand-runs',
  title: { en: 'Right-hand techniques: runs', ru: 'Техники правой руки: пассажи' },
  summary: {
    en: 'A run down to the root and a run up 1–2–3–5, then a song with your own plan.',
    ru: 'Пассаж вниз к основному тону и пассаж вверх 1–2–3–5, затем песня по своему плану.',
  },
  sections: [
    {
      heading: { en: 'Down and up', ru: 'Вниз и вверх' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The third technique runs down to the root in pairs. The fourth runs up the chord’s 1, 2, 3 and 5.',
            ru: 'Третья техника спускается к основному тону парами. Четвёртая поднимается по 1, 2, 3 и 5 ступеням аккорда.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'ex6' },
        { kind: 'pattern', pattern: 't4', piece: 'ex6' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play G – C – D – Em – Am – D – G with both runs.',
              ru: 'Сыграйте G – C – D – Em – Am – D – G обоими пассажами.',
            },
            {
              en: 'Learn «What a Fellowship» by its plan.',
              ru: 'Выучите «What a Fellowship» по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['G', 'C', 'D', 'Em', 'Am', 'D', 'G'] },
        {
          kind: 'link',
          title: { en: 'The lesson’s study', ru: 'Этюд урока' },
          target: { opens: 'piece', piece: 'ex6' },
        },
        {
          kind: 'link',
          title: { en: 'What a Fellowship', ru: 'What a Fellowship' },
          target: { opens: 'piece', piece: 'fellow' },
        },
      ],
    },
    {
      heading: { en: 'Your own plan', ru: 'Свой план' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Make a plan for «You Came for Me, O Saviour» yourself: a way or a technique on each chord, as the earlier songs do.',
            ru: 'Составьте план для «You Came for Me, O Saviour» сами: способ или технику на каждый аккорд, как в прежних песнях.',
          },
        },
        { kind: 'chords', symbols: ['G', 'C', 'D', 'G'] },
        {
          kind: 'link',
          title: { en: 'You Came for Me, O Saviour', ru: 'You Came for Me, O Saviour' },
          target: { opens: 'piece', piece: 'came' },
        },
      ],
    },
  ],
}

export default rightHandRuns
