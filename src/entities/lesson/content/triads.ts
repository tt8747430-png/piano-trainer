import type { Lesson } from '../model/types'

const triads: Lesson = {
  id: 'triads',
  title: { en: 'Triads', ru: 'Трезвучия' },
  summary: {
    en: 'Three notes stacked in 3rds, and the four kinds of triad.',
    ru: 'Три ноты, сложенные терциями, и четыре вида трезвучий.',
  },
  level: 1,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Three notes in thirds', ru: 'Три ноты по терциям' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A triad', ru: 'Трезвучие' },
          text: {
            en: 'is three notes stacked in 3rds: the root, the 3rd above it and the 5th.',
            ru: '— три ноты, сложенные терциями: основной тон, терция над ним и квинта.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
        {
          kind: 'text',
          text: {
            en: 'On the white keys, take every other key.',
            ru: 'На белых клавишах берите клавиши через одну.',
          },
        },
      ],
    },
    {
      heading: { en: 'Major and minor', ru: 'Мажорное и минорное' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Major and minor', ru: 'Мажорное и минорное' },
          text: {
            en: 'differ in the middle note. Major is a major 3rd, then a minor 3rd: 1 3 5, bright. Minor is the reverse: 1 ♭3 5, darker.',
            ru: 'трезвучия различаются средней нотой. Мажорное — большая терция, над ней малая: 1 3 5, светло. Минорное — наоборот: 1 ♭3 5, темнее.',
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
          lead: {
            en: 'Diminished and augmented triads',
            ru: 'Уменьшённое и увеличенное трезвучия',
          },
          text: {
            en: 'stack two 3rds of one size. Diminished is two minor 3rds, 1 ♭3 ♭5: tense. Augmented is two major 3rds, 1 3 ♯5: wide and unsettled.',
            ru: 'складывают две одинаковые терции. Уменьшённое — две малые, 1 ♭3 ♭5: напряжённо. Увеличенное — две большие, 1 3 ♯5: широко и неустойчиво.',
          },
        },
        { kind: 'chords', symbols: ['C°', 'C+'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play E major.', ru: 'Сыграйте ми мажор.' },
          answer: { chord: 'E' },
        },
        {
          kind: 'question',
          ask: { en: 'Play B diminished.', ru: 'Сыграйте уменьшённое трезвучие от си.' },
          answer: { chord: 'B°' },
        },
        {
          kind: 'question',
          ask: { en: 'Play F augmented.', ru: 'Сыграйте увеличенное трезвучие от фа.' },
          answer: { chord: 'F+' },
        },
      ],
    },
  ],
}

export default triads
