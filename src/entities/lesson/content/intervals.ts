import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const intervals: Lesson = {
  id: 'intervals',
  title: { en: 'Intervals', ru: 'Интервалы' },
  summary: {
    en: 'Count an interval by letters and half steps, and hear it.',
    ru: 'Считайте интервал по буквам и полутонам и узнавайте его на слух.',
  },
  sections: [
    {
      heading: { en: 'Letters and half steps', ru: 'Буквы и полутоны' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An interval', ru: 'Интервал' },
          text: {
            en: 'is the distance between two notes. Its number counts letters, both ends included: C D E is a 3rd. Its quality counts half steps.',
            ru: '— расстояние между двумя нотами. Число считает буквы вместе с крайними: до, ре, ми — терция. Качество считает полутоны.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'm3' },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        {
          kind: 'note',
          text: {
            en: 'A major 3rd has four, a minor 3rd three.',
            ru: 'В большой терции их четыре, в малой — три.',
          },
        },
      ],
    },
    {
      heading: { en: 'Perfect intervals', ru: 'Чистые интервалы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Perfect intervals', ru: 'Чистые интервалы' },
          text: {
            en: 'are the unison, the 4th, the 5th and the octave. The 5th frames every major and minor chord.',
            ru: '— прима, кварта, квинта и октава. Квинта — остов каждого мажорного и минорного аккорда.',
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
            en: 'Perfect intervals sound open. 3rds and 6ths sound warm. 2nds and 7ths clash and want to move.',
            ru: 'Чистые интервалы звучат открыто. Терции и сексты — тепло. Секунды и септимы резки и хотят разрешиться.',
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
          kind: 'question',
          ask: {
            en: 'Play D and the perfect 5th above it.',
            ru: 'Сыграйте ре и чистую квинту вверх от неё.',
          },
          answer: { notes: ['D', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play A and the minor 3rd above it.',
            ru: 'Сыграйте ля и малую терцию вверх от неё.',
          },
          answer: { notes: ['A', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Intervals by ear in the Quiz', ru: 'Интервалы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'intervals-by-ear' },
        },
        {
          kind: 'link',
          title: { en: 'Every interval', ru: 'Все интервалы' },
          target: { opens: 'intervals' },
        },
      ],
    },
  ],
}

export default intervals
