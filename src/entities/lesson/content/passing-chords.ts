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
      heading: {
        en: 'The next chord’s dominant 7th',
        ru: 'Доминантсептаккорд к следующему аккорду',
      },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A passing chord', ru: 'Проходящий аккорд' },
          text: {
            en: 'sits between two of a hymn’s chords and leads into the second.',
            ru: 'стоит между двумя аккордами гимна и ведёт во второй.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'A dominant 7th', ru: 'Доминантсептаккорд' },
          text: {
            en: 'is a major chord with a minor 7th, built a 5th above the chord it leads to.',
            ru: '— мажорное трезвучие с малой септимой. Он строится на квинту выше аккорда, в который ведёт.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The simplest passing chord is the second chord’s own dominant 7th. C7 leads into F: its E rises to F, and its B♭ falls to A. Tap the row below.',
            ru: 'Самый простой проходящий аккорд — доминантсептаккорд второго аккорда. C7 ведёт в F: ми поднимается в фа, си-бемоль спускается в ля. Нажмите аккорды ниже.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'link',
          title: { en: 'C to F in Passing chords', ru: 'Из C в F в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'F' },
        },
      ],
    },
    {
      heading: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
          text: {
            en: 'is the V7 of a chord other than I. Any chord of the key can be led into by its own V7.',
            ru: '— это V7 к аккорду тональности, кроме I. В любой аккорд тональности можно войти через его собственный V7.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Between C and Dm, play A7, the dominant of Dm. Its C♯ rises to D.',
            ru: 'Между C и Dm сыграйте A7 — доминанту Dm. Его до-диез поднимается в ре.',
          },
        },
        { kind: 'chords', symbols: ['C', 'A7', 'Dm'] },
        {
          kind: 'link',
          title: { en: 'C to Dm in Passing chords', ru: 'Из C в Dm в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'Dm' },
        },
      ],
    },
    {
      heading: { en: 'The diminished 7th', ru: 'Уменьшённый септаккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A diminished 7th', ru: 'Уменьшённый септаккорд' },
          text: {
            en: 'is four notes a minor 3rd apart. A half step below the next chord, it climbs into it.',
            ru: '— четыре звука через малую терцию. Если он стоит на полутон ниже следующего аккорда, он поднимается в него.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Between F and G, play F♯°7. Its F♯ rises to G.',
            ru: 'Между F и G сыграйте F♯°7. Его фа-диез поднимается в соль.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'G'] },
        {
          kind: 'link',
          title: { en: 'F to G in Passing chords', ru: 'Из F в G в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'F', to: 'G' },
        },
      ],
    },
    {
      heading: { en: 'The chromatic approach', ru: 'Хроматический подход' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chromatic approach', ru: 'Хроматический подход' },
          text: {
            en: 'slides into the next chord by half steps.',
            ru: 'ведёт в следующий аккорд по полутонам.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Between C and Am, the bass walks down C, B, B♭, A. Each step between takes a dominant 7th: B7, then B♭7.',
            ru: 'Между C и Am бас спускается: до, си, си-бемоль, ля. На каждой ступени между ними — доминантсептаккорд: B7, затем B♭7.',
          },
        },
        { kind: 'chords', symbols: ['C', 'B7', 'B♭7', 'Am'] },
        {
          kind: 'link',
          title: { en: 'C to Am in Passing chords', ru: 'Из C в Am в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'Am' },
        },
      ],
    },
    {
      heading: { en: 'Where to use them', ru: 'Где их ставить' },
      blocks: [
        {
          kind: 'note',
          text: {
            en: 'A passing chord takes a beat or half a bar from the chord before it. Use one where the melody holds a long note. Don’t put one under every change.',
            ru: 'Проходящий аккорд забирает долю или полтакта у предыдущего аккорда. Ставьте его там, где мелодия тянет долгую ноту. Не ставьте его на каждую смену.',
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
