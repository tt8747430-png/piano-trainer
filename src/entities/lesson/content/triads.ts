import type { Lesson } from '../model/types'

const triads: Lesson = {
  id: 'triads',
  title: { en: 'Triads', ru: 'Трезвучия' },
  summary: {
    en: 'Three notes stacked in thirds, and the four kinds they come in.',
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
          text: {
            en: 'A triad stacks two 3rds on a note, its root: the root, the 3rd above it and the 5th. On the white keys it is every other key: C, skip D, E, skip F, G.',
            ru: 'Трезвучие складывает две терции на ноте — основном тоне: основной тон, терция над ним и квинта. На белых клавишах это клавиши через одну: до, (ре), ми, (фа), соль.',
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
          text: {
            en: 'A major 3rd with a minor 3rd on top makes a major triad (1 3 5), bright; a minor 3rd with a major 3rd on top makes a minor triad (1 ♭3 5), darker. Only the middle note differs.',
            ru: 'Большая терция и над ней малая дают мажорное трезвучие (1 3 5) — светлое; малая терция и над ней большая — минорное (1 ♭3 5), более тёмное. Отличается только средняя нота.',
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
          text: {
            en: 'Two minor 3rds make a diminished triad (1 ♭3 ♭5), tense and narrow; two major 3rds make an augmented triad (1 3 ♯5), wide and unsettled.',
            ru: 'Две малые терции дают уменьшённое трезвучие (1 ♭3 ♭5) — напряжённое и тесное; две большие — увеличенное (1 3 ♯5), широкое и неустойчивое.',
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
