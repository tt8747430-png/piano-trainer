import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

/** Gorshkov's lesson 1, its theory sheet «Джазовые обозначения»: how the course writes notes and chords. */
const jazzChordSymbols: Lesson = {
  id: 'jazz-chord-symbols',
  title: { en: 'Jazz chord symbols', ru: 'Джазовые обозначения' },
  summary: {
    en: 'Gorshkov’s lesson 1, theory: letters for notes, signs for triads, and numbers that count up the major scale.',
    ru: 'Урок 1 Горшкова, теория: буквы для нот, знаки для трезвучий и цифры — ступени мажорной гаммы.',
  },
  level: 2,
  category: 'chords',
  module: 'gorshkov',
  sections: [
    {
      heading: { en: 'Notes by letter', ru: 'Ноты буквами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The course names notes by letter. B is B, never H. Sharps and flats are ♯ and ♭.',
            ru: 'В курсе ноты называют буквами. Си — это B, а не H. Диезы и бемоли — ♯ и ♭.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        {
          kind: 'note',
          text: {
            en: 'Dur, moll, es and is are not used.',
            ru: 'Обозначения dur, moll, es и is не используются.',
          },
        },
      ],
    },
    {
      heading: { en: 'Triads by their sign', ru: 'Трезвучия по знаку' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A capital letter alone is major. m or − makes it minor, ° or dim diminished, + or aug augmented.',
            ru: 'Заглавная буква — мажор. m или «−» делают его минорным, ° или dim — уменьшённым, + или aug — увеличенным.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'C°', 'C+'], apart: true },
      ],
    },
    {
      heading: { en: 'Sus chords', ru: 'Sus-аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Sus leaves out the 3rd. A 2nd takes its place in sus2, a 4th in sus4.',
            ru: 'Sus означает, что терции нет. Её место занимает секунда в sus2 или кварта в sus4.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'Fsus2', 'E♭sus4', 'Bsus4'], apart: true },
      ],
    },
    {
      heading: { en: 'Numbers are degrees', ru: 'Цифры — это ступени' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A number counts up the major scale from the chord’s own root, whatever the key. 8, 10, 14 and 15 are not used.',
            ru: 'Цифра считает ступени мажорной гаммы от основного тона самого аккорда, в любой тональности. 8, 10, 14 и 15 не используются.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
        {
          kind: 'note',
          text: {
            en: 'D9 is a chord stacked in 3rds up to the 9th.',
            ru: 'D9 — аккорд, построенный по терциям до ноны.',
          },
        },
      ],
    },
    {
      heading: { en: 'The triad, then the rest', ru: 'Трезвучие, затем остальное' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Read a symbol in two halves: the triad on the left, the rest on the right. Cm7♭5 is Cm, then 7♭5.',
            ru: 'Читайте обозначение по половинам: слева трезвучие, справа остальное. Cm7♭5 — это Cm, затем 7♭5.',
          },
        },
        { kind: 'chords', symbols: ['Cm', 'Cm7♭5'], apart: true },
      ],
    },
    {
      heading: { en: '7 and Maj7', ru: '7 и Maj7' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '7 adds the minor 7th to the triad: C7, Cm7. Maj7 adds the major 7th: CMaj7. Maj means the 7th, not major.',
            ru: '7 добавляет к трезвучию малую септиму: C7, Cm7. Maj7 добавляет большую: CMaj7. Maj — это септима, а не мажор.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'Cm7', 'CMaj7'], apart: true },
        {
          kind: 'note',
          text: {
            en: 'C7 is also called the dominant 7th.',
            ru: 'C7 называют также доминантсептаккордом.',
          },
        },
      ],
    },
    {
      heading: { en: 'Half-diminished and diminished', ru: 'Полууменьшённый и уменьшённый' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A diminished triad with a minor 7th is Cm7♭5, the half-diminished 7th. With a diminished 7th it is C°7.',
            ru: 'Уменьшённое трезвучие с малой септимой — Cm7♭5, полууменьшённый септаккорд. С уменьшённой септимой — C°7.',
          },
        },
        { kind: 'chords', symbols: ['Cm7♭5', 'C°7'], apart: true },
        {
          kind: 'note',
          text: {
            en: 'Jazz simplifies enharmonics: double flats and sharps are rare.',
            ru: 'Джаз упрощает энгармонизмы: дубль-бемоли и дубль-диезы почти не встречаются.',
          },
        },
      ],
    },
    {
      heading: { en: 'Sixth chords', ru: 'Секстаккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In jazz, 6 adds the major 6th to a triad: C6, Cm6. In classical harmony a sixth chord is a first inversion.',
            ru: 'В джазе 6 добавляет к трезвучию большую сексту: C6, Cm6. В классической гармонии секстаккорд — это первое обращение.',
          },
        },
        { kind: 'chords', symbols: ['C6', 'Cm6'], apart: true },
        {
          kind: 'note',
          text: { en: 'The 6th is always major.', ru: 'Секста всегда большая.' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play Cm7.', ru: 'Сыграйте Cm7.' },
          answer: { chord: 'Cm7' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play C6.', ru: 'Сыграйте C6.' },
          answer: { chord: 'C6' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play Cm7♭5.', ru: 'Сыграйте Cm7♭5.' },
          answer: { chord: 'Cm7♭5' },
        },
        {
          kind: 'link',
          title: { en: 'How to read chord symbols', ru: 'Как читать обозначения аккордов' },
          target: { place: 'lesson', lesson: 'reading-chord-symbols' },
        },
      ],
    },
  ],
}

export default jazzChordSymbols
