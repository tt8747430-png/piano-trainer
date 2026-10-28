import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const passingChords: Lesson = {
  id: 'passing-chords',
  after: ['progressions-in-order'],
  title: { en: 'Passing chords', ru: 'Проходящие аккорды' },
  summary: {
    en: 'Lead into a chord with a short chord just before it: its dominant 7th, a diminished 7th, or a chromatic slide.',
    ru: 'Вести в аккорд коротким аккордом прямо перед ним: его доминантсептаккордом, уменьшённым септаккордом или хроматическим сползанием.',
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
            en: 'is a short chord that leads into the next one. The simplest is the next chord’s dominant 7th, a 5th above it.',
            ru: '— это короткий аккорд, который ведёт в следующий. Самый простой — доминантсептаккорд к нему, на квинту выше.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'note',
          text: {
            en: 'C7’s E rises to F. Its B♭ falls to A.',
            ru: 'Ми в C7 поднимается в фа. Си-бемоль спускается в ля.',
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
            en: 'is the V7 of a chord other than I. A7 is the V7 of Dm. Its C♯ rises to D.',
            ru: '— это V7 к аккорду тональности, кроме I. A7 — это V7 к Dm. Его до-диез поднимается в ре.',
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
            en: 'is four notes, each a minor 3rd apart. Build it a half step below the next chord, and it climbs into it: F♯°7 into G.',
            ru: '— это четыре звука через малую терцию. Постройте его на полутон ниже следующего аккорда, и он поднимется в него: F♯°7 в G.',
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
            en: 'slides into a chord by half steps. From C to Am the bass walks down B, B♭, A, with a dominant 7th on each step between.',
            ru: 'ведёт в аккорд по полутонам. Из C в Am бас спускается си, си-бемоль, ля, и на каждом шаге между ними — доминантсептаккорд.',
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
            en: 'A passing chord takes a beat from the chord before. Save it for a long melody note.',
            ru: 'Проходящий аккорд забирает долю у предыдущего. Берегите его для долгой ноты мелодии.',
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
