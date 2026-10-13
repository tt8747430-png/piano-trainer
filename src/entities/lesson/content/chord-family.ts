import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const chordFamily: Lesson = {
  id: 'chord-family',
  title: { en: 'The chord family of a key', ru: 'Аккорды тональности' },
  summary: {
    en: 'One scale, seven chords: their Roman numerals, the three main ones and the key’s 7th chords.',
    ru: 'Одна гамма — семь аккордов: их римские цифры, три главных и септаккорды тональности.',
  },
  level: 2,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'One scale, seven chords', ru: 'Одна гамма — семь аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Build a triad on each note of C major, from the scale’s notes only. You get three major, three minor and one diminished.',
            ru: 'Постройте трезвучие на каждой ноте до мажора только из нот гаммы. Получатся три мажорных, три минорных и одно уменьшённое.',
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
            en: 'Each chord is named by its degree: upper case for major, lower case for minor, ° for diminished. The numerals are the same in every major key.',
            ru: 'Каждый аккорд называют цифрой его ступени: заглавной — мажорный, строчной — минорный, со знаком ° — уменьшённый. Цифры одни для всех мажорных тональностей.',
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
            en: 'are I, IV and V. Together they hold every note of the scale, so any melody note fits one of them.',
            ru: '— это I, IV и V. Вместе они содержат все ноты гаммы, поэтому любая нота мелодии ложится хотя бы на один из них.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
        {
          kind: 'text',
          text: {
            en: 'Many hymns and folk songs use little else.',
            ru: 'Многим гимнам и народным песням других почти не нужно.',
          },
        },
      ],
    },
    {
      heading: { en: 'The key’s 7th chords', ru: 'Септаккорды тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Add one more scale 3rd to each triad: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. Only V7 is a dominant 7th.',
            ru: 'Добавьте к каждому трезвучию ещё одну терцию из гаммы: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. Доминантсептаккорд среди них один — V7.',
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
          target: { opens: 'scales', root: note('C'), scale: 'major', show: 'chords' },
        },
      ],
    },
  ],
}

export default chordFamily
