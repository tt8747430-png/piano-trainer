import type { Lesson } from '../model/types'

const seventhChords: Lesson = {
  id: 'seventh-chords',
  title: { en: 'Seventh chords', ru: 'Септаккорды' },
  summary: {
    en: 'A triad with a 7th on top: the five common kinds, and the one that leads to the tonic.',
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
          lead: { en: 'A seventh chord', ru: 'Септаккорд' },
          text: {
            en: 'is a triad with one more 3rd on top. Its top note is a 7th above the root, so it has four notes.',
            ru: '— трезвучие с ещё одной терцией сверху. Верхняя нота стоит в септиме от основного тона, поэтому в аккорде четыре ноты.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Five kinds cover most music. Read each one, then play it below.',
            ru: 'Пять видов покрывают бо́льшую часть музыки. Прочитайте о каждом и сыграйте его ниже.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Major 7th, CMaj7: 1 3 5 7. A major triad with a major 7th. Soft and dreamy.',
              ru: 'Большой мажорный, CMaj7: 1 3 5 7. Мажорное трезвучие с большой септимой. Звучит мягко и мечтательно.',
            },
            {
              en: 'Dominant 7th, C7: 1 3 5 ♭7. A major triad with a minor 7th. It pulls onward.',
              ru: 'Малый мажорный (доминантсептаккорд), C7: 1 3 5 ♭7. Мажорное трезвучие с малой септимой. Тянет дальше.',
            },
            {
              en: 'Minor 7th, Cm7: 1 ♭3 5 ♭7. A minor triad with a minor 7th. Mellow.',
              ru: 'Малый минорный, Cm7: 1 ♭3 5 ♭7. Минорное трезвучие с малой септимой. Звучит тепло и приглушённо.',
            },
            {
              en: 'Half-diminished, Cm7♭5: 1 ♭3 ♭5 ♭7. A diminished triad with a minor 7th.',
              ru: 'Полууменьшённый, Cm7♭5: 1 ♭3 ♭5 ♭7. Уменьшённое трезвучие с малой септимой.',
            },
            {
              en: 'Diminished 7th, C°7: 1 ♭3 ♭5 𝄫7. Minor 3rds all the way up.',
              ru: 'Уменьшённый, C°7: 1 ♭3 ♭5 𝄫7. Одни малые терции снизу доверху.',
            },
          ],
        },
        { kind: 'chords', symbols: ['CMaj7', 'C7', 'Cm7', 'Cm7♭5', 'C°7'] },
      ],
    },
    {
      heading: { en: 'The dominant 7th leads home', ru: 'Доминантсептаккорд ведёт к тонике' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The dominant 7th', ru: 'Доминантсептаккорд' },
          text: {
            en: 'is built on the 5th degree of a key: the 5th note of its scale. In C major it is G7.',
            ru: 'строят на пятой ступени тональности — пятой ноте её гаммы. В до мажоре это G7.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'G7 holds B and F, a tritone apart: three whole steps. The tritone is tense and wants to resolve, to move to a stable chord.',
            ru: 'В G7 есть си и фа. Между ними тритон — три целых тона. Тритон звучит напряжённо и стремится разрешиться — перейти в устойчивый аккорд.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Play G7, then C below. Listen to where the tritone goes:',
            ru: 'Сыграйте ниже G7, затем C. Послушайте, куда идёт тритон:',
          },
        },
        {
          kind: 'steps',
          steps: [
            { en: 'B rises to C.', ru: 'Си поднимается к до.' },
            { en: 'F falls to E.', ru: 'Фа спускается к ми.' },
            { en: 'G7 lands on C.', ru: 'G7 приходит в C.' },
          ],
        },
        { kind: 'chords', symbols: ['G7', 'C'] },
      ],
    },
    {
      heading: { en: 'On every root', ru: 'От каждой ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Below are the dominant 7th and the minor 7th on all twelve roots. Play any of them.',
            ru: 'Ниже — доминантсептаккорд и малый минорный септаккорд от всех двенадцати нот. Сыграйте любой.',
          },
        },
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
          title: {
            en: 'Notes to add on top of a 7th chord',
            ru: 'Какие ноты добавить поверх септаккорда',
          },
          target: { place: 'tensions', chord: 'd7' },
        },
      ],
    },
  ],
}

export default seventhChords
