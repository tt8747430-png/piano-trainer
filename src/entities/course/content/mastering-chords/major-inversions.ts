import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

/** Mastering Chords, lesson 3: a major chord's three positions, and the nearest one. */
const majorInversions: Lesson = {
  id: 'major-inversions',
  title: { en: 'Major chord inversions', ru: 'Обращения мажорного аккорда' },
  summary: {
    en: 'Play a major chord in its three positions, tell them apart and move to the nearest one.',
    ru: 'Играйте мажорное трезвучие в трёх видах, различайте их и переходите к ближайшему.',
  },
  sections: [
    {
      heading: { en: 'Root position', ru: 'Основной вид' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Root position', ru: 'Основной вид' },
          text: {
            en: 'puts the root at the bottom, with the 3rd and the 5th above it. This is how you built chords in the first two lessons.',
            ru: '— основной тон внизу, над ним терция и квинта. Так вы строили трезвучия в первых двух уроках.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 3 5', hands: 'C4 E4 G4' },
            { symbol: 'F', degrees: '1 3 5', hands: 'F4 A4 C5' },
            { symbol: 'G', degrees: '1 3 5', hands: 'G4 B4 D5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'First inversion', ru: 'Первое обращение' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'keeps a chord’s notes but puts a different one at the bottom. For first inversion, move the root up an octave. The 3rd is now lowest: E, G, C.',
            ru: '— те же звуки аккорда, но внизу другой. Для первого обращения (секстаккорда) перенесите основной тон на октаву вверх. Внизу теперь терция: ми, соль, до.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/E', degrees: '3 5 1', hands: 'E4 G4 C5' },
            { symbol: 'F/A', degrees: '3 5 1', hands: 'A4 C5 F5' },
            { symbol: 'G/B', degrees: '3 5 1', hands: 'B3 D4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Second inversion', ru: 'Второе обращение' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Second inversion', ru: 'Второе обращение (квартсекстаккорд)' },
          text: {
            en: 'moves the 3rd up an octave as well. Now the 5th is at the bottom: G, C, E.',
            ru: '— перенесите вверх ещё и терцию. Теперь внизу квинта: соль, до, ми.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/G', degrees: '5 1 3', hands: 'G3 C4 E4' },
            { symbol: 'F/C', degrees: '5 1 3', hands: 'C4 F4 A4' },
            { symbol: 'G/D', degrees: '5 1 3', hands: 'D4 G4 B4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Find the root', ru: 'Найдите основной тон' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'D', degrees: '1 3 5', hands: 'D4 F♯4 A4' },
            { symbol: 'D/F♯', degrees: '3 5 1', hands: 'F♯4 A4 D5' },
            { symbol: 'D/A', degrees: '5 1 3', hands: 'A3 D4 F♯4' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'In an inversion, two neighbouring notes sit a 4th apart, five semitones. The upper note of the 4th is the root. A 4th on top means first inversion, at the bottom second.',
            ru: 'В обращении два соседних звука стоят через кварту, пять полутонов. Верхний звук кварты — основной тон. Кварта сверху — первое обращение, снизу — второе.',
          },
        },
      ],
    },
    {
      heading: { en: 'The nearest inversion', ru: 'Ближайшее обращение' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
            { symbol: 'F', degrees: '1 | 5 1 3', hands: 'F2 | C4 F4 A4' },
            { symbol: 'G', degrees: '1 | 3 5 1', hands: 'G2 | B3 D4 G4' },
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Inversions let the right hand move as little as possible. Keep the note two chords share and move the others by step. The left hand plays each root below.',
            ru: 'Обращения позволяют правой руке двигаться как можно меньше. Оставьте общий звук двух аккордов, остальные сдвиньте на ступень. Левая рука берёт основной тон внизу.',
          },
        },
        {
          kind: 'link',
          title: { en: 'I–IV–V–I in the Player', ru: 'I–IV–V–I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C major in first inversion.',
            ru: 'Сыграйте до мажор в первом обращении.',
          },
          answer: { notes: ['E', 'G', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play F major in second inversion.',
            ru: 'Сыграйте фа мажор во втором обращении.',
          },
          answer: { notes: ['C', 'F', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play D major in second inversion.',
            ru: 'Сыграйте ре мажор во втором обращении.',
          },
          answer: { notes: ['A', 'D', 'F#'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Inversions of C in the Player', ru: 'Обращения до мажора в плеере' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('C'), quality: 'maj' },
        },
        {
          kind: 'link',
          title: { en: 'Name chords in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
        {
          kind: 'link',
          title: { en: 'I–IV–V–I through every key', ru: 'I–IV–V–I во всех тональностях' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths' },
        },
      ],
    },
  ],
}

export default majorInversions
