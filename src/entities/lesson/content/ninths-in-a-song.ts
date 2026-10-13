import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MAJOR = { tonic: note('G'), minor: false }
const G_MINOR = { tonic: note('G'), minor: true }
const D_MINOR = { tonic: note('D'), minor: true }
const C_MAJOR = { tonic: note('C'), minor: false }

/** Gorshkov's lesson 2, its practice sheet: Exercise 2, the 9ths on «Ромашковые поля», the dominant 9th. */
const ninthsInASong: Lesson = {
  id: 'ninths-in-a-song',
  title: { en: 'Ninth chords in a song', ru: 'Нонаккорды в песне' },
  summary: {
    en: 'Gorshkov’s lesson 2, practice: 9th chords by semitones, on «Ромашковые поля», and the dominant 9th’s way into the next chord.',
    ru: 'Урок 2 Горшкова, практика: нонаккорды по полутонам, на «Ромашковых полях» и разрешение доминантового нонаккорда.',
  },
  level: 3,
  module: 'gorshkov',
  sections: [
    {
      heading: { en: 'Exercise 2: by semitones', ru: 'Упражнение 2: по полутонам' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Step 1: minor 9ths up by semitones. Step 2: major 9ths. Step 3: dominant 9ths, up and down.',
            ru: 'Шаг 1: малые минорные нонаккорды вверх по полутонам. Шаг 2: большие мажорные. Шаг 3: доминантовые, вверх и вниз.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Gm9', degrees: '1 1 | ♭3 5 ♭7 9', hands: 'G2 G3 | B♭3 D4 F4 A4' },
            { symbol: 'G♯m9', degrees: '1 1 | ♭3 5 ♭7 9', hands: 'G♯2 G♯3 | B3 D♯4 F♯4 A♯4' },
            { symbol: 'Am9', degrees: '1 1 | ♭3 5 ♭7 9', hands: 'A2 A3 | C4 E4 G4 B4' },
          ],
        },
        {
          kind: 'link',
          title: { en: 'Step 1: minor 9ths', ru: 'Шаг 1: малые минорные нонаккорды' },
          target: {
            place: 'player',
            numerals: 'i',
            key: G_MINOR,
            size: 'ninths',
            walk: 'semitones-up',
          },
        },
        {
          kind: 'link',
          title: { en: 'Step 2: major 9ths', ru: 'Шаг 2: большие мажорные нонаккорды' },
          target: {
            place: 'player',
            numerals: 'I',
            key: G_MAJOR,
            size: 'ninths',
            walk: 'semitones-up',
          },
        },
        {
          kind: 'link',
          title: { en: 'Step 3: dominant 9ths', ru: 'Шаг 3: доминантовые нонаккорды' },
          target: {
            place: 'player',
            numerals: 'V',
            key: C_MAJOR,
            size: 'ninths',
            walk: 'semitones-up',
          },
        },
      ],
    },
    {
      heading: { en: 'Every 7th chord can grow', ru: 'Любой септаккорд может вырасти' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Any 7th chord of the song can become a 9th: add one more 3rd on top.',
            ru: 'Любой септаккорд песни можно превратить в нонаккорд: добавьте ещё одну терцию сверху.',
          },
        },
        {
          kind: 'voicings',
          key: D_MINOR,
          voicings: [
            { symbol: 'Dm7', degrees: '1 | 1 ♭3 5 ♭7', hands: 'D3 | D4 F4 A4 C5' },
            { symbol: 'Dm9', degrees: '1 | ♭3 5 ♭7 9', hands: 'D3 | F4 A4 C5 E5' },
            { symbol: 'Gm7', degrees: '1 | 1 ♭3 5 ♭7', hands: 'G3 | G4 B♭4 D5 F5' },
            { symbol: 'Gm9', degrees: '1 | ♭3 5 ♭7 9', hands: 'G3 | B♭4 D5 F5 A5' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Mix the root and close positions for smoother voice leading.',
            ru: 'Чередуйте основное и тесное расположения, и голосоведение станет плавнее.',
          },
        },
        {
          kind: 'voicings',
          key: D_MINOR,
          voicings: [
            { symbol: 'Dm9', degrees: '1 | ♭3 5 ♭7 9', hands: 'D3 | F4 A4 C5 E5' },
            { symbol: 'Gm9', degrees: '1 | ♭7 9 ♭3 5', hands: 'G3 | F4 A4 B♭4 D5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'The dominant 9th into minor', ru: 'Доминантовый нонаккорд в минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Into a minor chord, the dominant takes the flat 9th: D7, D7♭9, Gm9.',
            ru: 'В минорный аккорд доминанта идёт с пониженной ноной: D7, D7♭9, Gm9.',
          },
        },
        {
          kind: 'voicings',
          key: G_MINOR,
          voicings: [
            { symbol: 'D7', degrees: '1 | 3 5 ♭7', hands: 'D3 | F♯4 A4 C5' },
            { symbol: 'D7♭9', degrees: '1 | 3 5 ♭7 ♭9', hands: 'D3 | F♯4 A4 C5 E♭5' },
            { symbol: 'Gm9', degrees: '1 | ♭7 9 ♭3 5', hands: 'G3 | F4 A4 B♭4 D5' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Over the bass, D7♭9 is a diminished 7th on its 3rd: F♯ A C E♭, all minor 3rds.',
            ru: 'Над басом D7♭9 — это уменьшённый септаккорд от терции: F♯ A C E♭, все терции малые.',
          },
        },
      ],
    },
    {
      heading: { en: 'The dominant 9th into major', ru: 'Доминантовый нонаккорд в мажор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Into a major chord, either 9th works: D9 or D7♭9 into GMaj9.',
            ru: 'В мажорный аккорд подходят обе ноны: D9 или D7♭9 в GMaj9.',
          },
        },
        {
          kind: 'voicings',
          key: G_MAJOR,
          voicings: [
            { symbol: 'D9', degrees: '1 | 3 5 ♭7 9', hands: 'D3 | F♯4 A4 C5 E5' },
            { symbol: 'GMaj9', degrees: '1 | 7 9 3 5', hands: 'G2 | F♯4 A4 B4 D5' },
            { symbol: 'D7♭9', degrees: '1 | 3 5 ♭7 ♭9', hands: 'D3 | F♯4 A4 C5 E♭5' },
            { symbol: 'GMaj9', degrees: '1 | 7 9 3 5', hands: 'G2 | F♯4 A4 B4 D5' },
          ],
        },
        {
          kind: 'link',
          title: { en: '«Ромашковые поля» in the Player', ru: '«Ромашковые поля» в плеере' },
          target: { place: 'piece', piece: 'romashki' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play Dm9.', ru: 'Сыграйте Dm9.' },
          answer: { chord: 'Dm9' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play D7♭9.', ru: 'Сыграйте D7♭9.' },
          answer: { chord: 'D7♭9' },
        },
        {
          kind: 'link',
          title: { en: 'V7♭9 into i in Progressions', ru: 'V7♭9 в i в последовательностях' },
          target: { place: 'progressions', numerals: 'V7♭9 i', key: G_MINOR },
        },
      ],
    },
  ],
}

export default ninthsInASong
