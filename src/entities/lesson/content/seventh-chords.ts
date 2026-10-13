import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const seventhChords: Lesson = {
  id: 'seventh-chords',
  title: { en: 'Seventh chords', ru: 'Септаккорды' },
  summary: {
    en: 'A triad with a 7th on top: the five common kinds, and the one that leads to the tonic.',
    ru: 'Трезвучие с септимой сверху: пять распространённых видов и тот, что ведёт к тонике.',
  },
  level: 2,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'A triad and a 7th', ru: 'Трезвучие и септима' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A seventh chord', ru: 'Септаккорд' },
          text: {
            en: 'is a triad with one more 3rd on top: four notes, the top a 7th above the root.',
            ru: '— трезвучие с ещё одной терцией сверху: четыре ноты, верхняя в септиме от основного тона.',
          },
        },
        { kind: 'chords', symbols: ['CMaj7', 'C7', 'Cm7', 'Cm7♭5', 'C°7'] },
        {
          kind: 'text',
          text: {
            en: 'These five cover most music: major 7th, dominant 7th, minor 7th, half-diminished, diminished 7th.',
            ru: 'Эти пять покрывают бо́льшую часть музыки: большой мажорный, доминантсептаккорд, малый минорный, полууменьшённый и уменьшённый.',
          },
        },
      ],
    },
    {
      heading: { en: 'The dominant 7th leads home', ru: 'Доминантсептаккорд ведёт к тонике' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The dominant 7th', ru: 'Доминантсептаккорд' },
          text: {
            en: 'sits on the 5th degree: G7 in C major. Its B and F, a tritone apart, are tense. B rises to C, F falls to E.',
            ru: 'строят на пятой ступени: в до мажоре это G7. Его си и фа, тритон, звучат напряжённо. Си поднимается к до, фа спускается к ми.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'C'] },
        { kind: 'interval', root: note('F'), interval: 'A4' },
      ],
    },
    {
      heading: { en: 'On every root', ru: 'От каждой ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The dominant 7th and the minor 7th on all twelve roots.',
            ru: 'Доминантсептаккорд и малый минорный септаккорд от всех двенадцати нот.',
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
