import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const chordFamily: Lesson = {
  id: 'chord-family',
  title: { en: 'The chord family of a key', ru: 'Аккорды тональности' },
  summary: {
    en: 'One scale, seven chords: how Roman numerals name them, the three main chords, and the key’s 7th chords.',
    ru: 'Одна гамма — семь аккордов: как их называют римскими цифрами, три главных аккорда и септаккорды тональности.',
  },
  level: 2,
  category: 'chords',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'One scale, seven chords', ru: 'Одна гамма — семь аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Build a triad on each note of the C major scale. Use only the scale’s notes.',
            ru: 'Постройте трезвучие на каждой ноте гаммы до мажора. Берите только её ноты.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'You get the key’s family of chords: three major, three minor and one diminished. Tap each one below.',
            ru: 'Получатся аккорды тональности: три мажорных, три минорных и одно уменьшённое трезвучие. Нажмите каждый аккорд ниже.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'], apart: true },
      ],
    },
    {
      heading: { en: 'Roman numerals', ru: 'Римские цифры' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each chord is named by its degree, in Roman numerals.',
            ru: 'Каждый аккорд называют римской цифрой его ступени.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Upper case for major: I, IV, V.',
              ru: 'Заглавная цифра — мажорный: I, IV, V.',
            },
            {
              en: 'Lower case for minor: ii, iii, vi.',
              ru: 'Строчная — минорный: ii, iii, vi.',
            },
            { en: 'A ° for diminished: vii°.', ru: 'Знак ° — уменьшённый: vii°.' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'The numerals are the same in every major key. I–IV–V is C–F–G in C and G–C–D in G. Below are G major’s seven chords.',
            ru: 'Схема одна для всех мажорных тональностей. I–IV–V — это C–F–G в до мажоре и G–C–D в соль мажоре. Ниже — семь аккордов соль мажора.',
          },
        },
        { kind: 'chords', symbols: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'], apart: true },
      ],
    },
    {
      heading: { en: 'Three main chords: I, IV, V', ru: 'Главные трезвучия: I, IV, V' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The primary chords', ru: 'Главные трезвучия' },
          text: {
            en: 'are I, IV and V. Together they hold every note of the scale. So any melody note fits at least one of them.',
            ru: '— это I, IV и V. Вместе они содержат все ноты гаммы. Поэтому любая нота мелодии ложится хотя бы на один из них.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Many hymns and folk songs use little else. Play C, F and G below.',
            ru: 'Многие гимны и народные песни почти ничего другого не используют. Сыграйте C, F и G ниже.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
      ],
    },
    {
      heading: { en: 'The key’s 7th chords', ru: 'Септаккорды тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Add one more 3rd from the scale to each triad. You get Imaj7, ii7, iii7, IVmaj7, V7, vi7 and viiø7.',
            ru: 'Добавьте к каждому трезвучию ещё одну терцию из гаммы. Получатся Imaj7, ii7, iii7, IVmaj7, V7, vi7 и viiø7.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Only V is a dominant 7th.',
            ru: 'Доминантсептаккорд среди них один — на V.',
          },
        },
        {
          kind: 'chords',
          symbols: ['CMaj7', 'Dm7', 'Em7', 'FMaj7', 'G7', 'Am7', 'Bm7♭5'],
          apart: true,
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play the V chord of G major.', ru: 'Сыграйте аккорд V ступени соль мажора.' },
          answer: { chord: 'D' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play the ii chord of F major.', ru: 'Сыграйте аккорд ii ступени фа мажора.' },
          answer: { chord: 'Gm' },
        },
        {
          kind: 'link',
          title: { en: 'C major’s chords in Scales', ru: 'Аккорды до мажора в гаммах' },
          target: { place: 'scales', root: note('C'), scale: 'major', show: 'chords' },
        },
      ],
    },
  ],
}

export default chordFamily
