import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

/** Gorshkov's lesson 1, its practice sheet «Септаккорды»: 7th chords on «Ромашковые поля», and Exercise 1. */
const seventhsInASong: Lesson = {
  id: 'sevenths-in-a-song',
  title: { en: 'Seventh chords in a song', ru: 'Септаккорды в песне' },
  summary: {
    en: 'Gorshkov’s lesson 1, practice: the three main 7th chords, which one a song’s triad takes, and each up and down by semitones.',
    ru: 'Урок 1 Горшкова, практика: три основных септаккорда, какой взять вместо трезвучия песни, и каждый по полутонам вверх и вниз.',
  },
  level: 2,
  module: 'gorshkov',
  sections: [
    {
      heading: { en: 'Three main 7th chords', ru: 'Три основных септаккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Jazz standards are full of 7th chords. The harmony stays, with a new colour and more tension: C becomes CMaj7.',
            ru: 'В джазовых стандартах много септаккордов. Гармония та же, но с новой краской и большим напряжением: C становится CMaj7.',
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
        {
          kind: 'note',
          text: {
            en: 'The minor 7th, the major 7th and the dominant 7th.',
            ru: 'Малый минорный, большой мажорный и малый мажорный, доминантовый.',
          },
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
      heading: { en: 'On «Ромашковые поля»', ru: 'На песне «Ромашковые поля»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each triad of the verse can grow into a 7th chord where it sounds right.',
            ru: 'Каждое трезвучие куплета может стать септаккордом там, где это звучит уместно.',
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
          title: { en: '«Ромашковые поля» in the Player', ru: '«Ромашковые поля» в плеере' },
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
            en: 'Play each 7th chord up and down by semitones, the bass under it. Step 1 is the minor 7th, Step 2 the major, Step 3 the dominant.',
            ru: 'Играйте каждый септаккорд по полутонам вверх и вниз, с басом. Шаг 1 — малый минорный, шаг 2 — большой мажорный, шаг 3 — доминантовый.',
          },
        },
        { kind: 'chords', symbols: ['Cm7', 'C♯m7', 'Dm7', 'E♭m7'], apart: true },
        {
          kind: 'link',
          title: { en: 'Step 1: the minor 7th', ru: 'Шаг 1: малый минорный' },
          target: { opens: 'player', numerals: 'i7', key: C_MINOR, walk: 'semitones-up' },
        },
        {
          kind: 'link',
          title: { en: 'Step 2: the major 7th', ru: 'Шаг 2: большой мажорный' },
          target: { opens: 'player', numerals: 'Imaj7', key: C_MAJOR, walk: 'semitones-up' },
        },
        {
          kind: 'link',
          title: { en: 'Step 3: the dominant 7th', ru: 'Шаг 3: доминантовый' },
          target: { opens: 'player', numerals: 'I7', key: C_MAJOR, walk: 'semitones-up' },
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
