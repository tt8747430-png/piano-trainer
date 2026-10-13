import type { Lesson } from '../model/types'

/** Called to Play's lesson 9: sixths up and down the scale, the right hand's last technique. */
const rightHandSixths: Lesson = {
  id: 'right-hand-sixths',
  title: { en: 'Right-hand techniques: sixths', ru: 'Техники правой руки: сексты' },
  summary: {
    en: 'Called to Play, lesson 9: sixths moving up or down the scale, then a song with your own plan.',
    ru: 'Called to Play, урок 9: сексты вверх или вниз по гамме, затем песня по своему плану.',
  },
  level: 2,
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'Sixths up and down', ru: 'Сексты вверх и вниз' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sixth', ru: 'Секста' },
          text: {
            en: 'spans six letter names, counting both ends: E up to C is a sixth. These techniques move sixths up or down the scale.',
            ru: 'охватывает шесть ступеней, считая обе крайние: от ми вверх до до. Эти техники ведут сексты вверх или вниз по гамме.',
          },
        },
        { kind: 'pattern', pattern: 's6u', piece: 'ex9' },
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
              en: 'Play Dm – Gm – A – Dm – D – Gm – A – Dm in sixths.',
              ru: 'Сыграйте Dm – Gm – A – Dm – D – Gm – A – Dm секстами.',
            },
            {
              en: 'Learn «Face to Face with Christ» by its plan.',
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
            en: 'Make your own plan for «I Lift My Eyes to Heaven», with the earlier songs as a model.',
            ru: 'Составьте свой план для «I Lift My Eyes to Heaven», по образцу прежних песен.',
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
          kind: 'quiz',
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
