import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 6: runs down to the root and up 1–2–3–5. */
const rightHandRuns: Lesson = {
  id: 'right-hand-runs',
  title: { en: 'Right-hand techniques: runs', ru: 'Техники правой руки: пассажи' },
  summary: {
    en: 'Add the 2nd to a chord and play two runs with it: down to the root and up 1–2–3–5.',
    ru: 'Добавьте к аккорду вторую ступень и сыграйте с ней два пассажа: вниз к основному тону и вверх 1–2–3–5.',
  },
  sections: [
    {
      heading: { en: '♬: a run down to the root', ru: '♬: пассаж вниз к основному тону' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The 2nd is the note just above the root: D in C. Take the 2nd and 5th together, then play the 3rd, 2nd and root. Repeat an octave lower.',
            ru: 'Вторая ступень — звук сразу над основным тоном: ре в до мажоре. Возьмите вместе секунду и квинту, затем сыграйте терцию, секунду и основной тон. Повторите октавой ниже.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'ex6' },
      ],
    },
    {
      heading: { en: '♫: a run up 1–2–3–5', ru: '♫: пассаж вверх 1–2–3–5' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the root, 2nd, 3rd and 5th with fingers 1, 2, 3 and 5. Then play them again an octave higher, all in eighths.',
            ru: 'Сыграйте основной тон, секунду, терцию и квинту пальцами 1, 2, 3 и 5. Затем повторите октавой выше, всё восьмыми.',
          },
        },
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
              en: 'Play this row of chords with ♬, then with ♫.',
              ru: 'Сыграйте эту цепочку аккордов пассажем ♬, затем ♫.',
            },
            { en: 'Play the lesson’s study.', ru: 'Сыграйте этюд урока.' },
            {
              en: 'Learn “What a Fellowship” by its plan.',
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
            en: 'Now write the plan yourself for “You Came for Me, O Saviour”. Choose a way or a technique for each chord.',
            ru: 'Теперь составьте план сами для «You Came for Me, O Saviour». Выберите способ или технику для каждого аккорда.',
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
