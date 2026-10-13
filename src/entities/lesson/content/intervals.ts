import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const intervals: Lesson = {
  id: 'intervals',
  title: { en: 'Intervals', ru: 'Интервалы' },
  summary: {
    en: 'The distance between two notes: counted in letters, measured in half steps, heard as calm or tense.',
    ru: 'Расстояние между нотами: в буквах, в полутонах, на слух — покой или напряжение.',
  },
  level: 1,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Letters and half steps', ru: 'Буквы и полутоны' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An interval', ru: 'Интервал' },
          text: {
            en: 'is the distance between two notes. Its number counts letters, both ends included: C D E is a 3rd. Its quality counts half steps: four in a major 3rd, three in a minor.',
            ru: '— расстояние между двумя нотами. Число считает буквы вместе с крайними: до, ре, ми — терция. Качество считает полутоны: в большой терции четыре, в малой три.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'm3' },
        { kind: 'interval', root: note('C'), interval: 'M3' },
      ],
    },
    {
      heading: { en: 'Perfect intervals', ru: 'Чистые интервалы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Perfect intervals', ru: 'Чистые интервалы' },
          text: {
            en: 'are the unison, the 4th, the 5th and the octave. Turned upside down, they stay perfect: C–G becomes G–C. The 5th frames every major and minor chord.',
            ru: '— прима, кварта, квинта и октава. Перевёрнутые, они остаются чистыми: до–соль становится соль–до. Квинта — остов каждого мажорного и минорного аккорда.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P5' },
        { kind: 'interval', root: note('G'), interval: 'P4' },
      ],
    },
    {
      heading: { en: 'Calm and tense', ru: 'Покой и напряжение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Perfect intervals sound open and still. 3rds and 6ths sound warm: the imperfect consonances. 2nds and 7ths clash and want to move: the dissonances.',
            ru: 'Чистые интервалы звучат открыто и спокойно. Терции и сексты — тепло: это несовершенные консонансы. Секунды и септимы резки и хотят разрешиться: это диссонансы.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M6' },
        { kind: 'interval', root: note('C'), interval: 'm2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play D and the perfect 5th above it.',
            ru: 'Сыграйте ре и чистую квинту вверх от неё.',
          },
          answer: { notes: ['D', 'A'], rising: true },
        },
        {
          kind: 'quiz',
          ask: {
            en: 'Play A and the minor 3rd above it.',
            ru: 'Сыграйте ля и малую терцию вверх от неё.',
          },
          answer: { notes: ['A', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Every interval', ru: 'Все интервалы' },
          target: { place: 'intervals' },
        },
      ],
    },
  ],
}

export default intervals
