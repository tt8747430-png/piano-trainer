import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const intervals: Lesson = {
  id: 'intervals',
  title: { en: 'Intervals', ru: 'Интервалы' },
  summary: {
    en: 'The distance between two notes. Count it in letters, measure it in half steps, hear it as calm or tense.',
    ru: 'Расстояние между двумя нотами. Его считают буквами, измеряют полутонами и слышат как покой или напряжение.',
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
          lead: { en: 'An interval', ru: 'Интервал' },
          text: {
            en: 'is the distance between two notes.',
            ru: '— расстояние между двумя нотами.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Its number counts letters, both ends included. C to E is C D E: three letters, a 3rd.',
            ru: 'Число интервала — количество букв, считая обе крайние. От до до ми — до, ре, ми: три буквы, терция.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Its quality counts half steps. A major 3rd spans four, a minor 3rd three. Both are 3rds, because both span three letters. Play the minor 3rd below, then the major 3rd.',
            ru: 'Качество интервала считает полутоны. В большой терции их четыре, в малой — три. Обе — терции: обе охватывают три буквы. Сыграйте ниже малую терцию, затем большую.',
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
            en: 'are the unison (one note twice), the 4th, the 5th and the octave.',
            ru: '— прима (одна нота дважды), кварта, квинта и октава.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'They are the same in major and in minor. Turn a perfect interval upside down, and it stays perfect.',
            ru: 'Они одинаковы в мажоре и в миноре. Если перевернуть чистый интервал, он останется чистым.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The 5th is the frame of every major and minor chord. Play C–G below.',
            ru: 'Квинта — остов каждого мажорного и минорного аккорда. Сыграйте до–соль ниже.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P5' },
      ],
    },
    {
      heading: { en: 'Calm and tense', ru: 'Покой и напряжение' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Perfect intervals sound open and still.',
              ru: 'Чистые интервалы звучат открыто и спокойно.',
            },
            {
              en: '3rds and 6ths sound warm and full. They are the imperfect consonances.',
              ru: 'Терции и сексты звучат тепло и полно. Это несовершенные консонансы.',
            },
            {
              en: '2nds and 7ths clash and want to move. They are the dissonances.',
              ru: 'Секунды и септимы звучат резко и хотят разрешиться. Это диссонансы.',
            },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Play the 6th below, then the 2nd, and compare.',
            ru: 'Сыграйте ниже сексту, затем секунду, и сравните.',
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
