import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const intervals: Lesson = {
  id: 'intervals',
  title: { en: 'Intervals', ru: 'Интервалы' },
  summary: {
    en: 'The distance between two notes: counted in letters, measured in half steps, heard as calm or tense.',
    ru: 'Расстояние между двумя нотами: его считают буквами, меряют полутонами и слышат как покой или напряжение.',
  },
  level: 1,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Letters and half steps', ru: 'Буквы и полутоны' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'An interval’s number counts letters, both ends included: C to E is C D E, a 3rd. Its quality counts half steps: a major 3rd spans four, a minor 3rd three. Both are 3rds, since both span three letters.',
            ru: 'Число интервала считает буквы, включая обе крайние: от до до ми — до, ре, ми, терция. Его качество считает полутоны: в большой терции их четыре, в малой три. Обе — терции, потому что обе охватывают три буквы.',
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
          text: {
            en: 'The unison, the 4th, the 5th and the octave are called perfect: in a major scale they come in one size only. The 5th is the frame of every major and minor chord.',
            ru: 'Прима, кварта, квинта и октава называются чистыми: в мажорной гамме они бывают только одного размера. Квинта — остов каждого мажорного и минорного аккорда.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P5' },
      ],
    },
    {
      heading: { en: 'Calm and tense', ru: 'Покой и напряжение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Perfect intervals sound open and still; 3rds and 6ths sound warm and full (the imperfect consonances); 2nds and 7ths rub and want to move (the dissonances).',
            ru: 'Чистые интервалы звучат открыто и спокойно; терции и сексты — тепло и полно (несовершенные консонансы); секунды и септимы трутся и хотят разрешиться (диссонансы).',
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
          answer: { notes: ['D', 'A'] },
        },
        {
          kind: 'quiz',
          ask: {
            en: 'Play A and the minor 3rd above it.',
            ru: 'Сыграйте ля и малую терцию вверх от неё.',
          },
          answer: { notes: ['A', 'C'] },
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
