import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const guideTones: Lesson = {
  id: 'guide-tones',
  title: { en: 'Guide tones through the changes', ru: 'Направляющие тоны по гармонии' },
  summary: {
    en: 'The 3rd and 7th of each chord make a line that moves by a step or not at all. Voice with them, solo along them.',
    ru: 'Терции и септимы аккордов образуют линию, которая движется на шаг или стоит на месте. Стройте на них голосоведение и соло.',
  },
  sections: [
    {
      heading: { en: 'The 3rd and the 7th', ru: 'Терция и септима' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Guide tones', ru: 'Направляющие тоны' },
          text: {
            en: 'are a chord’s 3rd and 7th. They say whether it is major, minor or dominant.',
            ru: '— терция и септима аккорда. Они говорят, мажорный он, минорный или доминантовый.',
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
      heading: { en: 'A step or nothing', ru: 'Шаг или на месте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From Dm7 to G7, F stays and C falls to B. From G7 to CMaj7, F falls to E and B stays.',
            ru: 'От Dm7 к G7 фа стоит, а до опускается в си. От G7 к CMaj7 фа опускается в ми, а си стоит.',
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
            en: 'is the root with the 3rd or the 7th. The left hand holds the harmony, the right is free to play.',
            ru: '— основной тон с терцией или септимой. Левая рука держит гармонию, правая свободна для мелодии.',
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
            en: 'Join one guide tone of each chord into a slow melody: C, B, B. It traces the changes by itself.',
            ru: 'Соедините по одному направляющему тону каждого аккорда в медленную мелодию: до, си, си. Она сама рисует гармонию.',
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
            en: 'Keep the guide tones on beat 1 and fill the beats between with scale notes.',
            ru: 'Оставьте направляющие тоны на первой доле, а доли между ними заполните нотами гаммы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 D5 E5 C5 B4 A4 G4 F4 E4/1' },
        {
          kind: 'link',
          title: {
            en: 'ii–V–I through the keys in the Player',
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
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the 3rd and 7th of G7.', ru: 'Сыграйте терцию и септиму G7.' },
          answer: { notes: ['B', 'F'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play the 3rd and 7th of Dm7.', ru: 'Сыграйте терцию и септиму Dm7.' },
          answer: { notes: ['F', 'C'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play the 3rd and 7th of CMaj7.', ru: 'Сыграйте терцию и септиму CMaj7.' },
          answer: { notes: ['E', 'B'] },
        },
        {
          kind: 'link',
          title: { en: 'Name a chord in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
      ],
    },
  ],
}

export default guideTones
