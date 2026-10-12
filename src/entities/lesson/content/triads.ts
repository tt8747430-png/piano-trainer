import type { Lesson } from '../model/types'

const triads: Lesson = {
  id: 'triads',
  title: { en: 'Triads', ru: 'Трезвучия' },
  summary: {
    en: 'Three notes stacked in 3rds, and the four kinds of triad.',
    ru: 'Три ноты, сложенные терциями, и четыре вида трезвучий.',
  },
  level: 1,
  category: 'chords',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Three notes in thirds', ru: 'Три ноты по терциям' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A triad', ru: 'Трезвучие' },
          text: {
            en: 'is three notes stacked in 3rds. On the white keys, take every other key: C, skip D, E, skip F, G.',
            ru: '— три ноты, сложенные терциями. На белых клавишах возьмите клавиши через одну: до, (ре), ми, (фа), соль.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The bottom note, C, is the root. E is the 3rd above it, and G is the 5th. Play the chord below.',
            ru: 'Нижняя нота, до, — основной тон. Ми — терция над ним, соль — квинта. Сыграйте аккорд ниже.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
      ],
    },
    {
      heading: { en: 'Major and minor', ru: 'Мажорное и минорное' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A major triad', ru: 'Мажорное трезвучие' },
          text: {
            en: 'is a major 3rd with a minor 3rd on top: 1 3 5. It sounds bright.',
            ru: '— большая терция и над ней малая: 1 3 5. Оно звучит светло.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'A minor triad', ru: 'Минорное трезвучие' },
          text: {
            en: 'is a minor 3rd with a major 3rd on top: 1 ♭3 5. It sounds darker.',
            ru: '— малая терция и над ней большая: 1 ♭3 5. Оно звучит темнее.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Only the middle note differs. Play C, then Cm, and listen to it move. The grids below show each triad on all twelve roots.',
            ru: 'Отличается только средняя нота. Сыграйте C, затем Cm и послушайте, как она сдвигается. Ниже — каждое трезвучие от всех двенадцати нот.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm'] },
        { kind: 'grid', quality: 'maj' },
        { kind: 'grid', quality: 'min' },
      ],
    },
    {
      heading: { en: 'Diminished and augmented', ru: 'Уменьшённое и увеличенное' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A diminished triad', ru: 'Уменьшённое трезвучие' },
          text: {
            en: 'is two minor 3rds: 1 ♭3 ♭5. It sounds tense and narrow.',
            ru: '— две малые терции: 1 ♭3 ♭5. Оно звучит напряжённо и сжато.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'An augmented triad', ru: 'Увеличенное трезвучие' },
          text: {
            en: 'is two major 3rds: 1 3 ♯5. It sounds wide and unsettled. Play both below.',
            ru: '— две большие терции: 1 3 ♯5. Оно звучит широко и неустойчиво. Сыграйте оба ниже.',
          },
        },
        { kind: 'chords', symbols: ['C°', 'C+'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play E major.', ru: 'Сыграйте ми мажор.' },
          answer: { chord: 'E' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play B diminished.', ru: 'Сыграйте уменьшённое трезвучие от си.' },
          answer: { chord: 'B°' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play F augmented.', ru: 'Сыграйте увеличенное трезвучие от фа.' },
          answer: { chord: 'F+' },
        },
      ],
    },
  ],
}

export default triads
