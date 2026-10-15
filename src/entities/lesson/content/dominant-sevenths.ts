import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const dominantSevenths: Lesson = {
  id: 'dominant-sevenths',
  title: { en: 'The dominant 7th and where it pulls', ru: 'Доминантсептаккорд и его тяготение' },
  summary: {
    en: 'Why V7 wants to resolve, how its two leading notes move, and the secondary dominants that lead to any chord of the key.',
    ru: 'Почему V7 стремится разрешиться, как движутся два его неустойчивых звука, и побочные доминанты, ведущие к любому аккорду тональности.',
  },
  sections: [
    {
      heading: {
        en: 'V7: a major triad and a minor 7th',
        ru: 'V7: мажорное трезвучие и малая септима',
      },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The dominant 7th', ru: 'Доминантсептаккорд' },
          text: {
            en: 'is the major triad on degree 5 with a minor 7th on top. In C: G B D F.',
            ru: '— мажорное трезвучие на пятой ступени с малой септимой сверху. В до мажоре: соль, си, ре, фа.',
          },
        },
        { kind: 'chords', symbols: ['G7'] },
      ],
    },
    {
      heading: { en: 'The tritone resolves', ru: 'Тритон разрешается' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Its 3rd and 7th, B and F, clash a tritone apart. B rises to C, F falls to E, and the clash is gone.',
            ru: 'Его терция и септима, си и фа, звучат напряжённо, на расстоянии тритона. Си поднимается в до, фа опускается в ми, и напряжение снимается.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'G7', degrees: '1 | ♭7 3', hands: 'G2 | F4 B4' },
            { symbol: 'C', degrees: '1 | 3 1', hands: 'C3 | E4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Close to the next chord', ru: 'Рядом со следующим аккордом' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Take G7 in the position nearest C. Two keys move a half step, the others stay or step.',
            ru: 'Возьмите G7 в положении, ближайшем к до мажору. Две клавиши сдвигаются на полутон, остальные стоят или делают шаг.',
          },
        },
        { kind: 'chords', symbols: ['C', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'A V7 for any chord', ru: 'V7 к любому аккорду' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
          text: {
            en: 'is the V7 of a chord other than I. A7 leads to Dm as G7 leads to C. It is written V7/ii.',
            ru: '— V7 к аккорду, который не является I. A7 ведёт в Dm, как G7 ведёт в C. Её пишут V7/ii.',
          },
        },
        { kind: 'progression', numerals: 'I V7/ii ii V7 I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Round the key', ru: 'По всей тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each major and minor chord of the key can take its own dominant before it.',
            ru: 'Перед каждым мажорным и минорным аккордом тональности может стоять его собственная доминанта.',
          },
        },
        {
          kind: 'progression',
          numerals: 'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I',
          key: C_MAJOR,
        },
        {
          kind: 'link',
          title: {
            en: 'Lead into each chord on Progressions',
            ru: 'Вводные доминанты в разделе «Последовательности»',
          },
          target: { opens: 'progressions', numerals: 'I IV V vi', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Spot them in a chart', ru: 'Найдите их в аккордах песни' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A 7th chord whose root is a 5th above the next chord is a dominant: E7 to Am, D7 to G.',
            ru: 'Септаккорд, корень которого на квинту выше следующего аккорда, — доминанта: E7 в Am, D7 в G.',
          },
        },
        { kind: 'chords', symbols: ['C', 'E7', 'Am', 'D7', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play G7.', ru: 'Сыграйте G7.' },
          answer: { chord: 'G7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the dominant 7th that leads to Dm.',
            ru: 'Сыграйте доминантсептаккорд, который ведёт в Dm.',
          },
          answer: { chord: 'A7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the dominant 7th that leads to F.',
            ru: 'Сыграйте доминантсептаккорд, который ведёт в F.',
          },
          answer: { chord: 'C7' },
        },
      ],
    },
  ],
}

export default dominantSevenths
