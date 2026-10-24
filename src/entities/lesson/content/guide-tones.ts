import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const guideTones: Lesson = {
  id: 'guide-tones',
  title: { en: 'Guide tones through the changes', ru: 'Направляющие тоны по гармонии' },
  summary: {
    en: 'Find the two notes that define each chord in a ii V I, and use them for voicings and melodies.',
    ru: 'Найдите две ноты, которые определяют каждый аккорд в ii–V–I, и стройте на них аккорды и мелодии.',
  },
  sections: [
    {
      heading: { en: 'The 3rd and the 7th', ru: 'Терция и септима' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Guide tones', ru: 'Направляющие тоны' },
          text: {
            en: 'are a chord’s 3rd and 7th. These two notes tell you whether the chord is major, minor or dominant.',
            ru: '— терция и септима аккорда. Именно эти две ноты показывают, мажорный аккорд, минорный или доминантовый.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm7', degrees: '1 | ♭3 ♭7', hands: 'D3 | F4 C5' },
            { symbol: 'G7', degrees: '1 | ♭7 3', hands: 'G2 | F4 B4' },
            { symbol: 'CMaj7', degrees: '1 | 3 7', hands: 'C3 | E4 B4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Move a step, or stay', ru: 'Шаг или на месте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Guide tones barely move. Dm7 to G7: F stays, C falls to B. G7 to CMaj7: F falls to E, B stays.',
            ru: 'Направляющие тоны почти не двигаются. От Dm7 к G7 фа стоит, до опускается в си. От G7 к CMaj7 фа опускается в ми, си стоит.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'Shells in the left hand', ru: 'Шеллы в левой руке' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A shell', ru: 'Шелл' },
          text: {
            en: 'is the root with only its 3rd or its 7th. The left hand holds the harmony with it, so the right hand is free for a melody.',
            ru: '— это основной тон только с терцией или только с септимой. Левая рука держит им гармонию, а правая свободна для мелодии.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm7', degrees: '1 ♭7 | ♭3', hands: 'D3 C4 | F4' },
            { symbol: 'G7', degrees: '1 3 | ♭7', hands: 'G2 B3 | F4' },
            { symbol: 'CMaj7', degrees: '1 7 | 3', hands: 'C3 B3 | E4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'A guide-tone line', ru: 'Линия направляющих тонов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Take one guide tone from each chord and hold it for a bar: C, B, B. This slow line outlines the chords on its own.',
            ru: 'Возьмите по одному направляющему тону от каждого аккорда и держите его такт: до, си, си. Эта медленная линия сама рисует аккорды.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/1 B4/1 B4/1' },
      ],
    },
    {
      heading: { en: 'Decorate the line', ru: 'Украсьте линию' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep a guide tone on beat 1 of each bar. Fill the other beats with notes of the scale.',
            ru: 'Оставьте направляющий тон на первой доле каждого такта. Остальные доли заполните нотами гаммы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 D5 E5 C5 B4 A4 G4 F4 E4/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the 3rd and 7th of Dm7.', ru: 'Сыграйте терцию и септиму Dm7.' },
          answer: { notes: ['F', 'C'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play the 3rd and 7th of G7.', ru: 'Сыграйте терцию и септиму G7.' },
          answer: { notes: ['B', 'F'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play the 3rd and 7th of CMaj7.', ru: 'Сыграйте терцию и септиму CMaj7.' },
          answer: { notes: ['E', 'B'] },
        },
        {
          kind: 'link',
          title: {
            en: 'Practise ii–V–I through the keys in the Player',
            ru: 'ii–V–I по тональностям в плеере',
          },
          target: {
            opens: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'tones-down',
          },
        },
        {
          kind: 'link',
          title: { en: 'Name chords in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
      ],
    },
  ],
}

export default guideTones
