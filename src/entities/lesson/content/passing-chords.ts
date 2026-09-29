import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const passingChords: Lesson = {
  id: 'passing-chords',
  title: { en: 'Passing chords', ru: 'Проходящие аккорды' },
  summary: {
    en: 'A chord slipped between two of a hymn’s chords to lead into the second: its dominant 7th, a diminished 7th, a chromatic approach.',
    ru: 'Аккорд между двумя аккордами гимна, который ведёт во второй: его доминантсептаккорд, уменьшённый септаккорд, хроматический подход.',
  },
  level: 3,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'Between two chords', ru: 'Между двумя аккордами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A passing chord sits between two of a hymn’s chords and leads into the second. The simplest is the second chord’s own dominant 7th: C7 leads into F, because its E rises to F and its B♭ falls to A.',
            ru: 'Проходящий аккорд стоит между двумя аккордами гимна и ведёт во второй. Самый простой — доминантсептаккорд второго аккорда: C7 ведёт в F, потому что его ми поднимается в фа, а си-бемоль спускается в ля.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'link',
          title: { en: 'C to F in Passing chords', ru: 'Из C в F в проходящих аккордах' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'F' },
        },
      ],
    },
    {
      heading: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Any chord of the key can be led into by its own V7. Between C and Dm, A7 is Dm’s dominant: its C♯ rises to D.',
            ru: 'В любой аккорд тональности можно войти через его собственный V7. Между C и Dm аккорд A7 — доминанта Dm: его до-диез поднимается в ре.',
          },
        },
        { kind: 'chords', symbols: ['C', 'A7', 'Dm'] },
        {
          kind: 'link',
          title: { en: 'C to Dm in Passing chords', ru: 'Из C в Dm в проходящих аккордах' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'Dm' },
        },
      ],
    },
    {
      heading: { en: 'The diminished 7th', ru: 'Уменьшённый септаккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A diminished 7th a half step below the next chord climbs into it: F♯°7 between F and G, its F♯ rising to G.',
            ru: 'Уменьшённый септаккорд на полтона ниже следующего аккорда поднимается в него: F♯°7 между F и G, его фа-диез поднимается в соль.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'G'] },
        {
          kind: 'link',
          title: { en: 'F to G in Passing chords', ru: 'Из F в G в проходящих аккордах' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'F', to: 'G' },
        },
      ],
    },
    {
      heading: { en: 'The chromatic approach', ru: 'Хроматический подход' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A chromatic approach slides into the next chord by half steps. Between C and Am the bass walks down C, B, B♭, A, a dominant 7th on each step: C, B7, B♭7, Am.',
            ru: 'Хроматический подход соскальзывает в следующий аккорд по полутонам. Между C и Am бас спускается до, си, си-бемоль, ля, с доминантсептаккордом на каждой ступени: C, B7, B♭7, Am.',
          },
        },
        { kind: 'chords', symbols: ['C', 'B7', 'B♭7', 'Am'] },
        {
          kind: 'link',
          title: { en: 'C to Am in Passing chords', ru: 'Из C в Am в проходящих аккордах' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'Am' },
        },
      ],
    },
    {
      heading: { en: 'Where to use them', ru: 'Где их использовать' },
      blocks: [
        {
          kind: 'note',
          text: {
            en: 'A passing chord takes a beat or half a bar from the chord before it. Use one where the melody holds a long note, not under every change.',
            ru: 'Проходящий аккорд забирает долю или полтакта у предыдущего аккорда. Ставьте его там, где мелодия тянет долгую ноту, а не на каждую смену.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the dominant 7th that leads into F.',
            ru: 'Сыграйте доминантсептаккорд, который ведёт в F.',
          },
          answer: { chord: 'C7' },
        },
      ],
    },
  ],
}

export default passingChords
