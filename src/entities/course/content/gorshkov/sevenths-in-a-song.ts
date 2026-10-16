import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

/** Gorshkov's lesson 1, its practice sheet «Септаккорды»: 7th chords on «Ромашковые поля», and Exercise 1. */
const seventhsInASong: Lesson = {
  id: 'sevenths-in-a-song',
  title: { en: 'Seventh chords in a song', ru: 'Септаккорды в песне' },
  summary: {
    en: 'Turn a song’s triads into the 7th chords that fit.',
    ru: 'Превращайте трезвучия песни в подходящие септаккорды.',
  },
  sections: [
    {
      heading: { en: 'Three main 7th chords', ru: 'Три основных септаккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A 7th chord keeps the harmony and adds colour and tension. The main three: the minor 7th, the major 7th and the dominant 7th.',
            ru: 'Септаккорд сохраняет гармонию и добавляет краску и напряжение. Три основных: малый минорный, большой мажорный и доминантовый.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cm7', degrees: '1 | 1 ♭3 5 ♭7', hands: 'C3 | C4 E♭4 G4 B♭4' },
            { symbol: 'CMaj7', degrees: '1 | 1 3 5 7', hands: 'C3 | C4 E4 G4 B4' },
            { symbol: 'C7', degrees: '1 | 1 3 5 ♭7', hands: 'C3 | C4 E4 G4 B♭4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Which 7th a triad takes', ru: 'Какой септаккорд выбрать' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'A minor triad becomes a minor 7th: Dm to Dm7.',
              ru: 'Минорное трезвучие становится малым минорным септаккордом: Dm в Dm7.',
            },
            {
              en: 'A major triad at rest takes Maj7.',
              ru: 'Устойчивое мажорное трезвучие получает Maj7.',
            },
            {
              en: 'A major triad that pushes forward takes 7.',
              ru: 'Мажорное трезвучие, которое движет вперёд, получает 7.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm7', 'Gm7', 'D7', 'FMaj7'] },
        {
          kind: 'note',
          text: {
            en: 'Only where it truly fits the song.',
            ru: 'Только там, где это действительно уместно.',
          },
        },
      ],
    },
    {
      heading: { en: 'On “Ромашковые поля”', ru: 'На песне «Ромашковые поля»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The verse’s triads, grown into 7th chords where they sound right.',
            ru: 'Трезвучия куплета, ставшие септаккордами там, где это звучит уместно.',
          },
        },
        {
          kind: 'chords',
          symbols: [
            'Dm7',
            'Gm7',
            'Asus4',
            'Dm7',
            'Gm7',
            'Csus4',
            'Am7',
            'D7',
            'Gm7',
            'C7',
            'FMaj7',
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Sus4 suits the place of a major triad, or comes just before one. Here it sounds better than sus2.',
            ru: 'Sus4 хорошо встаёт вместо мажорного трезвучия или перед ним. Здесь он звучит лучше, чем sus2.',
          },
        },
        {
          kind: 'link',
          title: { en: '“Ромашковые поля” in the Player', ru: '«Ромашковые поля» в плеере' },
          target: { opens: 'piece', piece: 'romashki' },
        },
      ],
    },
    {
      heading: { en: 'Exercise 1: by semitones', ru: 'Упражнение 1: по полутонам' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play each 7th chord up and down by semitones, with its bass. Step 1 is the minor 7th, step 2 the major, step 3 the dominant.',
            ru: 'Играйте каждый септаккорд по полутонам вверх и вниз, с басом. Шаг 1 — малый минорный, шаг 2 — большой мажорный, шаг 3 — доминантовый.',
          },
        },
        { kind: 'chords', symbols: ['Cm7', 'C♯m7', 'Dm7', 'E♭m7'], apart: true },
        {
          kind: 'link',
          title: { en: 'Step 1: the minor 7th', ru: 'Шаг 1: малый минорный' },
          target: { opens: 'player', numerals: 'i7', key: C_MINOR, walk: 'semitones-up-down' },
        },
        {
          kind: 'link',
          title: { en: 'Step 2: the major 7th', ru: 'Шаг 2: большой мажорный' },
          target: { opens: 'player', numerals: 'Imaj7', key: C_MAJOR, walk: 'semitones-up-down' },
        },
        {
          kind: 'link',
          title: { en: 'Step 3: the dominant 7th', ru: 'Шаг 3: доминантовый' },
          target: { opens: 'player', numerals: 'I7', key: C_MAJOR, walk: 'semitones-up-down' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play Dm7.', ru: 'Сыграйте Dm7.' },
          answer: { chord: 'Dm7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play FMaj7.', ru: 'Сыграйте FMaj7.' },
          answer: { chord: 'FMaj7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play D7.', ru: 'Сыграйте D7.' },
          answer: { chord: 'D7' },
        },
        {
          kind: 'link',
          title: { en: 'Seventh chords in Chords', ru: 'Септаккорды в разделе «Аккорды»' },
          target: { opens: 'chords', chord: 'CMaj7' },
        },
      ],
    },
  ],
}

export default seventhsInASong
