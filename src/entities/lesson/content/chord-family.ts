import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const chordFamily: Lesson = {
  id: 'chord-family',
  title: { en: 'The chord family of a key', ru: 'Аккорды тональности' },
  summary: {
    en: 'One scale, seven chords: their Roman numerals, the three that carry most songs, and their 7th chords.',
    ru: 'Одна гамма — семь аккордов: их римские цифры, три главных и их септаккорды.',
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
            en: 'Build a triad on each note of the C major scale using only the scale’s notes, and you get the key’s family of chords: three major, three minor and one diminished.',
            ru: 'Постройте трезвучие на каждой ноте гаммы до мажор, беря только её ноты, — получится семья аккордов тональности: три мажорных, три минорных и одно уменьшённое.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'] },
      ],
    },
    {
      heading: { en: 'Roman numerals', ru: 'Римские цифры' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each chord is named by its degree: upper case for major (I, IV, V), lower case for minor (ii, iii, vi), ° for diminished (vii°). The pattern is the same in every major key, so I–IV–V is C–F–G in C and G–C–D in G.',
            ru: 'Каждый аккорд называют по ступени: заглавной цифрой — мажорный (I, IV, V), строчной — минорный (ii, iii, vi), ° — уменьшённый (vii°). Схема одинакова во всех мажорных тональностях: I–IV–V — это C–F–G в до мажоре и G–C–D в соль мажоре.',
          },
        },
        { kind: 'chords', symbols: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'] },
      ],
    },
    {
      heading: { en: 'The primary chords', ru: 'Главные трезвучия' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'I, IV and V between them hold every note of the scale, so any melody note fits one of them. Many hymns and folk songs use little else.',
            ru: 'I, IV и V вместе содержат все ноты гаммы, поэтому любая нота мелодии ложится хотя бы на один из них. Многие гимны и народные песни почти ничего другого и не используют.',
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
            en: 'Add a 3rd from the scale to each triad: Imaj7, ii7, iii7, IVmaj7, V7, vi7 and viiø7. Only V is a dominant 7th.',
            ru: 'Добавьте к каждому трезвучию терцию из гаммы: Imaj7, ii7, iii7, IVmaj7, V7, vi7 и viiø7. Доминантсептаккорд только один — на V.',
          },
        },
        { kind: 'chords', symbols: ['CMaj7', 'Dm7', 'Em7', 'FMaj7', 'G7', 'Am7', 'Bm7♭5'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play the V chord of G major.', ru: 'Сыграйте V ступень соль мажора.' },
          answer: { chord: 'D' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play the ii chord of F major.', ru: 'Сыграйте ii ступень фа мажора.' },
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
