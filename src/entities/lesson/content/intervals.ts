import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const intervals: Lesson = {
  id: 'intervals',
  title: { en: 'Intervals', ru: 'Интервалы' },
  summary: {
    en: 'Measure the distance between two notes by letter names and half steps, and learn how it sounds.',
    ru: 'Измеряйте расстояние между двумя нотами по названиям и полутонам и узнавайте, как оно звучит.',
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
            ru: '— расстояние между двумя нотами. Число считает названия нот вместе с крайними: до, ре, ми — терция. Качество зависит от числа полутонов.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'm3' },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        {
          kind: 'note',
          text: {
            en: 'A major 3rd has four, a minor three.',
            ru: 'В большой терции четыре полутона, в малой три.',
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
            en: 'are the unison, the 4th, the 5th and the octave. They have no major or minor form. The 5th is the frame of every major and minor chord.',
            ru: '— прима, кварта, квинта и октава. Больших и малых среди них нет. Квинта — остов каждого мажорного и минорного аккорда.',
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
            en: 'Perfect intervals sound open and hollow. 3rds and 6ths sound warm. 2nds and 7ths clash and want to move on.',
            ru: 'Чистые интервалы звучат открыто и пусто. Терции и сексты звучат тепло. Секунды и септимы резкие и хотят разрешиться.',
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
          title: { en: 'Hear intervals in the Quiz', ru: 'Интервалы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'intervals', drill: 'ear' },
        },
        {
          kind: 'link',
          title: { en: 'See every interval', ru: 'Все интервалы' },
          target: { opens: 'intervals' },
        },
      ],
    },
  ],
}

export default intervals
