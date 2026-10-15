import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const passingChords: Lesson = {
  id: 'passing-chords',
  title: { en: 'Passing chords', ru: 'Проходящие аккорды' },
  summary: {
    en: 'A chord slipped in to lead into the next: a dominant 7th, a diminished 7th, a chromatic approach.',
    ru: 'Аккорд, который ведёт в следующий: доминантсептаккорд, уменьшённый септаккорд, хроматический подход.',
  },
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
            en: 'leads into the next chord. The simplest is its dominant 7th: a major chord with a minor 7th, a 5th above.',
            ru: 'ведёт в следующий аккорд. Самый простой — его доминантсептаккорд: мажорное трезвучие с малой септимой, на квинту выше.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'note',
          text: {
            en: 'C7’s E rises to F, its B♭ falls to A.',
            ru: 'Ми в C7 поднимается в фа, а си-бемоль спускается в ля.',
          },
        },
        {
          kind: 'link',
          title: { en: 'C to F in Passing chords', ru: 'Из C в F в «Проходящих аккордах»' },
          target: { opens: 'between', key: C_MAJOR, from: 'C', to: 'F' },
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
            en: 'is the V7 of a chord other than I. A7 leads into Dm, its C♯ rising to D.',
            ru: '— это V7 к аккорду тональности, кроме I. A7 ведёт в Dm: его до-диез поднимается в ре.',
          },
        },
        { kind: 'chords', symbols: ['C', 'A7', 'Dm'] },
        {
          kind: 'link',
          title: { en: 'C to Dm in Passing chords', ru: 'Из C в Dm в «Проходящих аккордах»' },
          target: { opens: 'between', key: C_MAJOR, from: 'C', to: 'Dm' },
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
            en: 'is four notes a minor 3rd apart. A half step below the next chord, it climbs into it: F♯°7 into G.',
            ru: '— четыре звука через малую терцию. На полутон ниже следующего аккорда он поднимается в него: F♯°7 в G.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'G'] },
        {
          kind: 'link',
          title: { en: 'F to G in Passing chords', ru: 'Из F в G в «Проходящих аккордах»' },
          target: { opens: 'between', key: C_MAJOR, from: 'F', to: 'G' },
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
            en: 'slides in by half steps. From C to Am the bass walks down, with a dominant 7th on each step between.',
            ru: 'ведёт в аккорд по полутонам. Из C в Am бас спускается, и на каждой ступени между ними — доминантсептаккорд.',
          },
        },
        { kind: 'chords', symbols: ['C', 'B7', 'B♭7', 'Am'] },
        {
          kind: 'link',
          title: { en: 'C to Am in Passing chords', ru: 'Из C в Am в «Проходящих аккордах»' },
          target: { opens: 'between', key: C_MAJOR, from: 'C', to: 'Am' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the dominant 7th that leads into F.',
            ru: 'Сыграйте доминантсептаккорд, который ведёт в F.',
          },
          answer: { chord: 'C7' },
        },
        {
          kind: 'note',
          text: {
            en: 'A passing chord takes a beat or half a bar from the chord before it. Use one under a long melody note, not under every change.',
            ru: 'Проходящий аккорд забирает долю или полтакта у предыдущего. Ставьте его под долгую ноту мелодии, а не на каждую смену.',
          },
        },
        {
          kind: 'link',
          title: { en: 'Chords by ear in the Quiz', ru: 'Аккорды на слух в тестах' },
          target: { opens: 'quiz', trainer: 'chords-by-ear' },
        },
      ],
    },
  ],
}

export default passingChords
