import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

const alteredDominants: Lesson = {
  id: 'altered-dominants',
  title: {
    en: 'Altered dominants and the tritone sub',
    ru: 'Альтерированные доминанты и тритоновая замена',
  },
  summary: {
    en: 'A dominant with its 5th or 9th raised or lowered pulls harder into the next chord. A dominant a tritone away can replace it.',
    ru: 'Доминанта с повышенной или пониженной квинтой или ноной сильнее тянет в следующий аккорд. Её может заменить доминанта на тритон дальше.',
  },
  sections: [
    {
      heading: { en: 'Raise or lower the 5th and 9th', ru: 'Повысьте или понизьте квинту и нону' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An altered dominant', ru: 'Альтерированная доминанта' },
          text: {
            en: 'moves its 5th or 9th by a half step. Each altered note lies a half step from a note of the next chord.',
            ru: 'сдвигает квинту или нону на полутон. Каждая альтерированная нота лежит в полутоне от звука следующего аккорда.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'G7♭9', 'C'] },
      ],
    },
    {
      heading: { en: '♭9 leads to minor', ru: '♭9 ведёт в минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In a minor key V7 takes the ♭9 from the scale. G7♭9’s A♭ falls to G.',
            ru: 'В миноре V7 берёт ♭9 из самой гаммы. Ля-бемоль в G7♭9 опускается в соль.',
          },
        },
        { kind: 'progression', numerals: 'V7♭9 i', key: C_MINOR },
      ],
    },
    {
      heading: { en: '♯9: the blues dominant', ru: '♯9: блюзовая доминанта' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7♯9 sounds the major 3rd, B, under B♭ on top. Major and minor at once: the blues.',
            ru: 'G7♯9 звучит с большой терцией, си, под си-бемолем наверху. Мажор и минор одновременно: это блюз.',
          },
        },
        { kind: 'chords', symbols: ['G7#9'] },
      ],
    },
    {
      heading: { en: '♯5 rises to the 3rd', ru: '♯5 поднимается в терцию' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7♯5 raises D to D♯, which rises on to E, the 3rd of C.',
            ru: 'G7♯5 повышает ре до ре-диеза, который поднимается дальше в ми, терцию до мажора.',
          },
        },
        { kind: 'chords', symbols: ['G7#5', 'C'] },
      ],
    },
    {
      heading: { en: 'The altered chord', ru: 'Альтерированный аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7alt takes ♭9, ♯9, ♭5 and ♭13 together. Its scale is A♭ melodic minor played from G.',
            ru: 'G7alt берёт ♭9, ♯9, ♭5 и ♭13 сразу. Его гамма — ля-бемоль мелодический минор от соль.',
          },
        },
        { kind: 'chords', symbols: ['G7alt', 'C'] },
        { kind: 'scale', root: note('A', -1), scale: 'melodic' },
      ],
    },
    {
      heading: { en: 'The tritone substitute', ru: 'Тритоновая замена' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tritone substitute', ru: 'Тритоновая замена' },
          text: {
            en: 'shares the dominant’s tritone. D♭7 holds G7’s F and B, so it can replace G7, its bass falling a half step to C.',
            ru: 'имеет тот же тритон, что и доминанта. В D♭7 есть фа и си из G7, поэтому он может заменить G7, а бас спускается на полутон в до.',
          },
        },
        { kind: 'progression', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR },
        {
          kind: 'link',
          title: {
            en: 'The tritone sub on Progressions',
            ru: 'Тритоновая замена в «Последовательностях»',
          },
          target: { opens: 'progressions', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play G7♭9.', ru: 'Сыграйте G7♭9.' },
          answer: { chord: 'G7♭9' },
        },
        {
          kind: 'question',
          ask: { en: 'Play G7♯9.', ru: 'Сыграйте G7♯9.' },
          answer: { chord: 'G7#9' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the tritone substitute for G7.',
            ru: 'Сыграйте тритоновую замену для G7.',
          },
          answer: { chord: 'D♭7' },
        },
        {
          kind: 'link',
          title: { en: 'Build a chord in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
        {
          kind: 'link',
          title: { en: 'ii–V–I through the keys', ru: 'ii–V–I по всем тональностям' },
          target: {
            opens: 'player',
            numerals: 'ii V I',
            key: { tonic: note('C'), minor: false },
            size: 'sevenths',
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default alteredDominants
