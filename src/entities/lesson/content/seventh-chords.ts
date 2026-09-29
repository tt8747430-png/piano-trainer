import type { Lesson } from '../model/types'

const seventhChords: Lesson = {
  id: 'seventh-chords',
  title: { en: 'Seventh chords', ru: 'Септаккорды' },
  summary: {
    en: 'A triad with a 7th on top: the five common kinds, and the one that leads home.',
    ru: 'Трезвучие с септимой сверху: пять распространённых видов и тот, что ведёт к тонике.',
  },
  level: 2,
  category: 'chords',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'A triad and a 7th', ru: 'Трезвучие и септима' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Stack one more 3rd on a triad and the top note is a 7th above the root: a seventh chord of four notes. Five kinds cover most music:',
            ru: 'Добавьте к трезвучию ещё одну терцию — верхняя нота окажется в септиме от основного тона: получится септаккорд из четырёх нот. Пять видов покрывают почти всю музыку:',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Major 7th, CMaj7: 1 3 5 7, a major triad with a major 7th, soft and dreamy.',
              ru: 'Большой мажорный, CMaj7: 1 3 5 7 — мажорное трезвучие с большой септимой, мягкий и мечтательный.',
            },
            {
              en: 'Dominant 7th, C7: 1 3 5 ♭7, a major triad with a minor 7th, pulling onward.',
              ru: 'Малый мажорный (доминантсептаккорд), C7: 1 3 5 ♭7 — мажорное трезвучие с малой септимой, тянет дальше.',
            },
            {
              en: 'Minor 7th, Cm7: 1 ♭3 5 ♭7, a minor triad with a minor 7th, mellow.',
              ru: 'Малый минорный, Cm7: 1 ♭3 5 ♭7 — минорное трезвучие с малой септимой, мягкий.',
            },
            {
              en: 'Half-diminished, Cm7♭5: 1 ♭3 ♭5 ♭7, a diminished triad with a minor 7th.',
              ru: 'Полууменьшённый, Cm7♭5: 1 ♭3 ♭5 ♭7 — уменьшённое трезвучие с малой септимой.',
            },
            {
              en: 'Diminished 7th, C°7: 1 ♭3 ♭5 𝄫7, minor 3rds all the way up.',
              ru: 'Уменьшённый, C°7: 1 ♭3 ♭5 𝄫7 — одни малые терции.',
            },
          ],
        },
        { kind: 'chords', symbols: ['CMaj7', 'C7', 'Cm7', 'Cm7♭5', 'C°7'] },
      ],
    },
    {
      heading: { en: 'The dominant 7th leads home', ru: 'Доминантсептаккорд ведёт домой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Built on a key’s 5th degree, the dominant 7th holds the tritone B–F in C, and it wants to resolve: B rises to C, F falls to E, and G7 lands on C.',
            ru: 'Построенный на пятой ступени, доминантсептаккорд содержит тритон си–фа (в до мажоре) и стремится разрешиться: си поднимается к до, фа спускается к ми, и G7 приходит в C.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'C'] },
      ],
    },
    {
      heading: { en: 'On every root', ru: 'От каждой ноты' },
      blocks: [
        { kind: 'grid', quality: 'd7' },
        { kind: 'grid', quality: 'm7' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play D7.', ru: 'Сыграйте D7.' },
          answer: { chord: 'D7' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play Am7.', ru: 'Сыграйте Am7.' },
          answer: { chord: 'Am7' },
        },
        {
          kind: 'link',
          title: { en: 'What a 7th chord takes on top', ru: 'Что звучит поверх септаккорда' },
          target: { place: 'tensions', chord: 'd7' },
        },
      ],
    },
  ],
}

export default seventhChords
