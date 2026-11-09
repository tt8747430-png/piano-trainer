import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }

/** My Practice Plan, lesson 3: the key's chords by number, voice leading, four progressions to know. */
const chordsByNumber: Lesson = {
  id: 'chords-by-number',
  title: { en: 'Chords by number', ru: 'Аккорды по ступеням' },
  summary: {
    en: 'Name a key’s chords by number so every progression moves to any key, and join them by the nearest notes.',
    ru: 'Называйте аккорды тональности по ступеням, чтобы любой оборот переходил в любую тональность, и соединяйте их ближайшими звуками.',
  },
  after: ['chord-shapes'],
  sections: [
    {
      heading: { en: 'The key’s chords', ru: 'Аккорды тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each note of the scale carries a chord, numbered I to vii. In every major key, I, IV and V are major, and ii, iii and vi are minor.',
            ru: 'Каждый звук гаммы несёт аккорд, от I до vii. В любом мажоре I, IV и V мажорные, а ii, iii и vi минорные.',
          },
        },
        { kind: 'progression', numerals: 'I ii iii IV V vi vii°', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'The nearest notes', ru: 'Ближайшие звуки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Voice leading', ru: 'Голосоведение' },
          text: {
            en: 'moves each note to the nearest note of the next chord. Notes the chords share stay where they are.',
            ru: 'ведёт каждый звук к ближайшему звуку следующего аккорда. Общие звуки остаются на месте.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
            { symbol: 'F', degrees: '1 | 5 1 3', hands: 'F2 | C4 F4 A4' },
            { symbol: 'G', degrees: '1 | 3 5 1', hands: 'G2 | B3 D4 G4' },
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
          ],
        },
      ],
      takeaway: {
        en: 'The right hand hardly moves while the bass goes where it likes.',
        ru: 'Правая рука почти не двигается, а бас идёт куда хочет.',
      },
    },
    {
      heading: { en: 'Four progressions to know', ru: 'Четыре оборота, которые надо знать' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'I – IV – V – I: hymns.', ru: 'I – IV – V – I: гимны.' },
            {
              en: 'I – V – vi – IV: worship songs.',
              ru: 'I – V – vi – IV: песни прославления.',
            },
            {
              en: 'ii – V – I: jazz and gospel.',
              ru: 'ii – V – I: джаз и госпел.',
            },
            {
              en: 'I – vi – IV – V: the fifties.',
              ru: 'I – vi – IV – V: пятидесятые.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I V vi IV', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'Same numbers, new key', ru: 'Те же ступени, новая тональность' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Numbers travel. In G, I – V – vi – IV is G, D, Em, C. Play it in C, F and D the same day.',
            ru: 'Ступени переносятся. В соль мажоре I – V – vi – IV — это G, D, Em, C. Сыграйте его в тот же день в до, фа и ре.',
          },
        },
        { kind: 'chords', symbols: ['G', 'D', 'Em', 'C'] },
      ],
      takeaway: {
        en: 'Think in numbers and you can play a song in any key.',
        ru: 'Думайте ступенями — и сыграете песню в любой тональности.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play chord vi in F major.', ru: 'Сыграйте аккорд vi в фа мажоре.' },
          answer: { chord: 'Dm' },
        },
        {
          kind: 'question',
          ask: { en: 'Play chord V in D major.', ru: 'Сыграйте аккорд V в ре мажоре.' },
          answer: { chord: 'A' },
        },
        {
          kind: 'link',
          title: {
            en: 'I – V – vi – IV round the circle of fifths',
            ru: 'I – V – vi – IV по квинтовому кругу',
          },
          target: { opens: 'player', numerals: 'I V vi IV', key: C_MAJOR, walk: 'fifths' },
        },
        {
          kind: 'link',
          title: { en: 'Progressions by ear: Quiz', ru: 'Обороты на слух: викторина' },
          target: { opens: 'quiz', trainer: 'progressions-by-ear' },
        },
      ],
    },
  ],
}

export default chordsByNumber
