import type { Lesson } from '../model/types'

const triads: Lesson = {
  id: 'triads',
  title: { en: 'Triads', ru: 'Трезвучия' },
  summary: {
    en: 'Build the four kinds of triad on any note.',
    ru: 'Строить четыре вида трезвучий от любой ноты.',
  },
  sections: [
    {
      heading: { en: 'Three notes in thirds', ru: 'Три ноты по терциям' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A triad', ru: 'Трезвучие' },
          text: {
            en: 'is three notes stacked in 3rds: the root, the 3rd and the 5th. On the white keys, take every other key.',
            ru: '— три ноты, сложенные терциями: основной тон, терция и квинта. На белых клавишах берите клавиши через одну.',
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
      heading: { en: 'Every other letter', ru: 'Через букву' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A triad’s letters always skip one: D F A. Sharps and flats then set its kind: D major is D F♯ A.',
            ru: 'Буквы трезвучия всегда идут через одну: ре, фа, ля. Диезы и бемоли задают его вид: ре мажор — ре, фа-диез, ля.',
          },
        },
        { kind: 'chords', symbols: ['D', 'Dm'] },
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
            en: 'stack two 3rds of one size. Diminished is two minor 3rds, 1 ♭3 ♭5: tense. Augmented is two major 3rds, 1 3 ♯5: unsettled.',
            ru: 'складывают две одинаковые терции. Уменьшённое — две малые, 1 ♭3 ♭5: напряжённо. Увеличенное — две большие, 1 3 ♯5: неустойчиво.',
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
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
        {
          kind: 'link',
          title: { en: 'Chords by ear in the Quiz', ru: 'Аккорды на слух в тестах' },
          target: { opens: 'quiz', trainer: 'chords-by-ear' },
        },
      ],
    },
  ],
}

export default triads
