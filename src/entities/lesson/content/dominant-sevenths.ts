import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const dominantSevenths: Lesson = {
  id: 'dominant-sevenths',
  title: { en: 'The dominant 7th and where it pulls', ru: 'Доминантсептаккорд и его тяготение' },
  summary: {
    en: 'Build the dominant 7th, hear why it pulls home, and use it to lead into any chord of the key.',
    ru: 'Постройте доминантсептаккорд, услышьте, почему он тянет домой, и подводите им к любому аккорду тональности.',
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
            en: 'is the chord on the key’s 5th note: a major triad with a minor 7th on top. In C major it is G B D F.',
            ru: '— аккорд на пятой ступени: мажорное трезвучие с малой септимой сверху. В до мажоре это соль, си, ре, фа.',
          },
        },
        { kind: 'chords', symbols: ['G7'] },
      ],
    },
    {
      heading: { en: 'Why it pulls: the tritone', ru: 'Почему он тянет: тритон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tritone', ru: 'Тритон' },
          text: {
            en: 'is three whole steps. G7’s 3rd and 7th, B and F, are a tritone apart and clash. B rises to C, F falls to E, and the clash resolves.',
            ru: '— это интервал в три тона. Терция и септима G7, си и фа, стоят на тритон друг от друга и звучат остро. Си поднимается в до, фа опускается в ми, и напряжение уходит.',
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
      heading: { en: 'A V7 for any chord', ru: 'V7 к любому аккорду' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
          text: {
            en: 'is the V7 of a chord other than I. A7 leads to Dm the way G7 leads to C. It is written V7/ii, five of two.',
            ru: '— это V7 к аккорду, который не является I. A7 ведёт в Dm так же, как G7 ведёт в C. Её пишут V7/ii: доминанта ко второй ступени.',
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
            en: 'Every major and minor chord of the key can have its own dominant in front of it. Here each one gets its dominant in turn.',
            ru: 'Перед каждым мажорным и минорным аккордом тональности может стоять своя доминанта. Здесь каждый получает её по очереди.',
          },
        },
        {
          kind: 'progression',
          numerals: 'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I',
          key: C_MAJOR,
        },
      ],
    },
    {
      heading: { en: 'Spot them in a song', ru: 'Найдите их в песне' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In a song’s chords, look for a 7th chord whose root is a 5th above the next chord. It is a dominant: E7 to Am, D7 to G.',
            ru: 'В аккордах песни ищите септаккорд, основной тон которого на квинту выше следующего аккорда. Это доминанта: E7 в Am, D7 в G.',
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
        {
          kind: 'link',
          title: {
            en: 'Lead into each chord in Progressions',
            ru: 'Подвести к каждому аккорду в последовательностях',
          },
          target: { opens: 'progressions', numerals: 'I IV V vi', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
      ],
    },
  ],
}

export default dominantSevenths
