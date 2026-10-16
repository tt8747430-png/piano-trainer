import type { Lesson } from '../model/types'

const triads: Lesson = {
  id: 'triads',
  title: { en: 'Triads', ru: 'Трезвучия' },
  summary: {
    en: 'Stack three notes in 3rds to build the four kinds of triad on any note.',
    ru: 'Складывать три ноты терциями и строить четыре вида трезвучий от любой ноты.',
  },
  sections: [
    {
      heading: { en: 'Three notes in thirds', ru: 'Три ноты по терциям' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A triad', ru: 'Трезвучие' },
          text: {
            en: 'is three notes stacked in 3rds: root, 3rd and 5th. On white keys, play every other key: C, E, G.',
            ru: '— это три ноты, сложенные терциями: основной тон, терция и квинта. На белых клавишах берите через одну: до, ми, соль.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
        {
          kind: 'text',
          text: {
            en: 'Right hand: fingers 1, 3 and 5.',
            ru: 'Правая рука: пальцы 1, 3 и 5.',
          },
        },
      ],
    },
    {
      heading: { en: 'Major and minor', ru: 'Мажорное и минорное' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Only the middle note differs. Major has a major 3rd below a minor 3rd: 1 3 5, bright. Minor swaps them: 1 ♭3 5, darker.',
            ru: 'Отличается только средняя нота. В мажорном внизу большая терция, над ней малая: 1 3 5, светло. В минорном наоборот: 1 ♭3 5, темнее.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm'] },
        {
          kind: 'text',
          text: {
            en: 'Play C, then Cm. Only E moves, down to E♭.',
            ru: 'Сыграйте C, затем Cm. Двигается только ми, вниз на ми-бемоль.',
          },
        },
      ],
    },
    {
      heading: { en: 'Every other letter', ru: 'Через букву' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A triad’s letters always skip one: D, F, A. Then sharps or flats set its kind. D major is D, F♯, A.',
            ru: 'Буквы трезвучия всегда идут через одну: ре, фа, ля. Затем диезы или бемоли задают его вид. Ре мажор — ре, фа-диез, ля.',
          },
        },
        { kind: 'chords', symbols: ['D', 'Dm'] },
      ],
    },
    {
      heading: { en: 'On every root', ru: 'От каждой ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Here are all twelve major triads, then all twelve minor ones. Play along each row.',
            ru: 'Здесь все двенадцать мажорных трезвучий, затем все двенадцать минорных. Сыграйте каждый ряд подряд.',
          },
        },
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
            en: 'stack two 3rds of the same size. Diminished is two minor 3rds, 1 ♭3 ♭5: tense. Augmented is two major 3rds, 1 3 ♯5: unsettled.',
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
