import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelReharmonisation: Lesson = {
  id: 'gospel-reharmonisation',
  title: { en: 'Gospel reharmonisation', ru: 'Госпел-реармонизация' },
  summary: {
    en: 'Keep a hymn’s tune and give it fuller gospel chords: 9ths, sus chords, IV over V and the minor iv.',
    ru: 'Сохраните мелодию гимна и дайте ей более полные госпел-аккорды: нонаккорды, sus, IV над V и минорную iv.',
  },
  sections: [
    {
      heading: { en: 'Plain chords made fuller', ru: 'Простые аккорды полнее' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Reharmonisation', ru: 'Реармонизация' },
          text: {
            en: 'means playing fuller chords under the same tune. Compare the plain row with this one: a major 9th on I and IV, a dominant 9th on V.',
            ru: '— это более полные аккорды под той же мелодией. Сравните простой ряд с этим: большой нонаккорд на I и IV, доминантнонаккорд на V.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
        { kind: 'chords', symbols: ['CMaj9', 'FMaj9', 'G9'] },
      ],
    },
    {
      heading: { en: 'From sus to the dominant', ru: 'От sus к доминанте' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sus4 chord', ru: 'Аккорд sus4' },
          text: {
            en: 'has a 4th in place of the 3rd. Hold the 4th, C, over the dominant, then let it fall to the 3rd, B.',
            ru: '— это аккорд с квартой вместо терции. Задержите кварту до над доминантой, затем опустите её в терцию си.',
          },
        },
        { kind: 'chords', symbols: ['G7sus4', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'IV over V', ru: 'IV над V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the IV chord over the dominant’s root: F/G. It works as a soft dominant. It has no B, the 3rd that pushes toward home.',
            ru: 'Сыграйте аккорд IV над основным тоном доминанты: F/G. Он звучит как мягкая доминанта. В нём нет си, терции, которая толкает домой.',
          },
        },
        { kind: 'chords', symbols: ['F/G', 'C'] },
      ],
    },
    {
      heading: { en: 'The minor iv', ru: 'Минорная iv' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Borrow iv from C minor: F, then Fm, then C. The A♭ in Fm falls to G. It sounds like an Amen.',
            ru: 'Возьмите iv из до минора: F, затем Fm, затем C. Ля-бемоль из Fm спускается в соль. Это звучит как «аминь».',
          },
        },
        { kind: 'chords', symbols: ['F', 'Fm', 'C'] },
      ],
    },
    {
      heading: { en: 'The tensions', ru: 'Тенсии' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Tensions', ru: 'Тенсии' },
          text: {
            en: 'are 9ths, 11ths and 13ths added above a 7th chord. A dominant 7th takes more of them than any other chord, plain or altered.',
            ru: '— это ноны, ундецимы и терцдецимы над септаккордом. Доминантсептаккорд принимает их больше всех, простых и альтерированных.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'G9', 'G13', 'G7♭9'] },
        {
          kind: 'link',
          title: { en: 'Explore G7’s tensions', ru: 'Тенсии G7' },
          target: { opens: 'tensions', chord: 'd7', root: note('G') },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play IV over V in C major.',
            ru: 'Сыграйте IV над V в до мажоре.',
          },
          answer: { chord: 'F/G' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C major’s iv chord, borrowed from the minor.',
            ru: 'Сыграйте аккорд iv ступени до мажора, взятый из минора.',
          },
          answer: { chord: 'Fm' },
        },
        {
          kind: 'link',
          title: { en: 'Find chords under the note C', ru: 'Аккорды под нотой до' },
          target: { opens: 'harmonise', key: C_MAJOR, note: note('C') },
        },
      ],
    },
  ],
}

export default gospelReharmonisation
