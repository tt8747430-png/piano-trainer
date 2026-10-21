import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 9: sixths up and down the scale, the right hand's last technique. */
const rightHandSixths: Lesson = {
  id: 'right-hand-sixths',
  title: { en: 'Right-hand techniques: sixths', ru: 'Техники правой руки: сексты' },
  summary: {
    en: 'Move a pair of notes a sixth apart up and down the scale over a chord.',
    ru: 'Ведите пару звуков на расстоянии сексты вверх и вниз по гамме над аккордом.',
  },
  sections: [
    {
      heading: { en: 'Sixths up', ru: 'Сексты вверх' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sixth', ru: 'Секста' },
          text: {
            en: 'spans six letter names, counting both ends: E, F, G, A, B, C. Here the right hand plays sixths that climb the scale from the chord’s 3rd to its 5th.',
            ru: 'охватывает шесть ступеней, считая обе крайние: ми, фа, соль, ля, си, до. Здесь правая рука ведёт сексты вверх по гамме от терции аккорда к квинте.',
          },
        },
        { kind: 'pattern', pattern: 's6u', piece: 'ex9' },
      ],
    },
    {
      heading: { en: 'Sixths down', ru: 'Сексты вниз' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same pairs in reverse: the sixths fall from the chord’s 5th back to its 3rd. The left hand plays 1–5–8–5 under both.',
            ru: 'Те же пары в обратную сторону: сексты спускаются от квинты аккорда к терции. Левая рука в обоих случаях играет 1–5–8–5.',
          },
        },
        { kind: 'pattern', pattern: 's6d', piece: 'ex9' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords in sixths, up and then down.',
              ru: 'Сыграйте эту цепочку аккордов секстами, вверх, затем вниз.',
            },
            { en: 'Play the lesson’s study.', ru: 'Сыграйте этюд урока.' },
            {
              en: 'Learn “Face to Face with Christ” by its plan.',
              ru: 'Выучите «Face to Face with Christ» по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm', 'Gm', 'A', 'Dm', 'D', 'Gm', 'A', 'Dm'] },
        {
          kind: 'link',
          title: { en: 'The lesson’s study', ru: 'Этюд урока' },
          target: { opens: 'piece', piece: 'ex9' },
        },
        {
          kind: 'link',
          title: { en: 'Face to Face with Christ', ru: 'Face to Face with Christ' },
          target: { opens: 'piece', piece: 'face' },
        },
      ],
    },
    {
      heading: { en: 'Your own plan', ru: 'Свой план' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Write your own plan for “I Lift My Eyes to Heaven”. Use the plans of the earlier songs as a model.',
            ru: 'Составьте свой план для «I Lift My Eyes to Heaven». Образцом пусть будут планы прежних песен.',
          },
        },
        { kind: 'chords', symbols: ['Dm', 'Gm', 'A', 'Dm', 'C', 'F', 'A'] },
        {
          kind: 'link',
          title: { en: 'I Lift My Eyes to Heaven', ru: 'I Lift My Eyes to Heaven' },
          target: { opens: 'piece', piece: 'lift' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the sixth from E up to C: E, then the C above it.',
            ru: 'Сыграйте сексту ми–до: сначала ми, затем до над ней.',
          },
          answer: { notes: ['E', 'C'], rising: true },
        },
      ],
    },
  ],
}

export default rightHandSixths
