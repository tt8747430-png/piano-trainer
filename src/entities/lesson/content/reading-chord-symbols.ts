import type { Lesson } from '../model/types'

const readingChordSymbols: Lesson = {
  id: 'reading-chord-symbols',
  title: { en: 'How to read chord symbols', ru: 'Как читать буквенные обозначения' },
  summary: {
    en: 'What each part of a chord symbol says, what its numbers mean, and how to name any chord.',
    ru: 'Что говорит каждая часть обозначения аккорда, что значат его числа и как назвать любой аккорд.',
  },
  level: 1,
  category: 'chords',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Reading chord symbols', ru: 'Чтение обозначений аккордов' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'Left part = triad, right part = extras.',
            ru: 'Левая часть — трезвучие, правая — добавки.',
          },
          text: {
            en: 'C is major, Cm or C− is minor, C° or Cdim is diminished, C+ or Caug is augmented.',
            ru: 'C — мажор, Cm или C− — минор, C° или Cdim — уменьшённое, C+ или Caug — увеличенное.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'C°', 'C+'] },
        {
          kind: 'text',
          lead: {
            en: 'Numbers are steps of the major scale built on the chord’s own root,',
            ru: 'Числа — ступени мажорной гаммы от основного тона аккорда,',
          },
          text: {
            en: 'whatever key the song is in.',
            ru: 'в какой бы тональности ни была песня.',
          },
        },
        {
          kind: 'text',
          lead: {
            en: '7 means a minor 7th. Maj7, M7 or Δ means a major 7th.',
            ru: '7 — малая септима. Maj7, M7 или Δ — большая септима.',
          },
          text: {
            en: 'Cm(maj7) is a minor chord with a major 7th.',
            ru: 'Cm(maj7) — минорный аккорд с большой септимой.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'CMaj7', 'Cm(maj7)'] },
        {
          kind: 'text',
          lead: { en: '6 is always a major 6th,', ru: '6 — всегда большая секста,' },
          text: { en: 'also in Cm6.', ru: 'и в Cm6 тоже.' },
        },
        { kind: 'chords', symbols: ['C6', 'Cm6'] },
        {
          kind: 'text',
          lead: { en: 'sus means no 3rd.', ru: 'sus — без терции.' },
          text: {
            en: 'sus2 uses the 2nd instead, sus4 the 4th.',
            ru: 'В sus2 вместо неё секунда, в sus4 — кварта.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'Csus4'] },
        {
          kind: 'text',
          lead: { en: 'Slash chords:', ru: 'Аккорды через дробь:' },
          text: {
            en: 'C/D means a C chord over a D bass note.',
            ru: 'C/D — аккорд C с басом D.',
          },
        },
        { kind: 'chords', symbols: ['C/D'] },
        {
          kind: 'text',
          lead: { en: 'Alterations combine freely,', ru: 'Альтерации сочетаются свободно,' },
          text: { en: 'for example C7(♭9#5).', ru: 'например C7(♭9#5).' },
        },
        { kind: 'chords', symbols: ['C7♭9#5'] },
      ],
    },
    {
      heading: {
        en: 'Chord numbers: 2 or 9? 6 or 13?',
        ru: 'Числа в аккордах: 2 или 9? 6 или 13?',
      },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The same note has two numbers:', ru: 'У одной ноты два числа:' },
          text: {
            en: '2 = 9, 4 = 11, 6 = 13. 8, 10, 12 and 14 never appear: they are 1, 3, 5 and 7 again.',
            ru: '2 = 9, 4 = 11, 6 = 13. 8, 10, 12 и 14 не встречаются: это снова 1, 3, 5 и 7.',
          },
        },
        {
          kind: 'text',
          lead: {
            en: 'add, 2, 4 or 6 adds only that note:',
            ru: 'add, 2, 4 или 6 добавляют только эту ноту:',
          },
          text: {
            en: 'C2 = Cadd2 = Cadd9 = C D E G. C6 = C E G A.',
            ru: 'C2 = Cadd2 = Cadd9 = C D E G. C6 = C E G A.',
          },
        },
        { kind: 'chords', symbols: ['C2', 'Cadd9', 'C6'] },
        {
          kind: 'text',
          lead: {
            en: 'A number above 7 includes everything below it:',
            ru: 'Число больше 7 включает всё, что ниже:',
          },
          text: { en: 'C9 = C E G B♭ D.', ru: 'C9 = C E G B♭ D.' },
        },
        { kind: 'chords', symbols: ['C9'] },
        {
          kind: 'text',
          lead: {
            en: '13 chords usually leave out the 11,',
            ru: 'В аккордах с 13 обычно нет 11,',
          },
          text: {
            en: 'which clashes with the major 3rd. C13 = C E G B♭ D A.',
            ru: 'она спорит с большой терцией. C13 = C E G B♭ D A.',
          },
        },
        { kind: 'chords', symbols: ['C13'] },
      ],
    },
    {
      heading: { en: 'Naming any chord in 7 steps', ru: 'Как назвать любой аккорд за 7 шагов' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Put the notes in letter order, then stack them in thirds (every other letter).',
              ru: 'Расставьте ноты по порядку букв и сложите их терциями (через букву).',
            },
            {
              en: 'Find the three notes that form the core triad.',
              ru: 'Найдите три ноты основного трезвучия.',
            },
            {
              en: 'Decide its quality: major, minor, diminished, augmented or sus4.',
              ru: 'Определите его вид: мажор, минор, уменьшённое, увеличенное или sus4.',
            },
            {
              en: 'Is there a 4th note that works as the 6th or 7th?',
              ru: 'Есть ли 4-я нота — секста или септима?',
            },
            {
              en: 'Is there a 5th note that works as the 9th (or ♭9, #9)?',
              ru: 'Есть ли 5-я нота — нона (или ♭9, #9)?',
            },
            {
              en: 'Is there a 6th note that works as the 11th (or #11)?',
              ru: 'Есть ли 6-я нота — ундецима (или #11)?',
            },
            {
              en: 'Is there a 7th note that works as the 13th (or ♭13)?',
              ru: 'Есть ли 7-я нота — терцдецима (или ♭13)?',
            },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'The same notes can have two names: D F A C is Dm7, and also F6 over D.',
            ru: 'Одни и те же ноты могут называться по-разному: D F A C — это Dm7, а также F6 с басом D.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'F6/D'] },
      ],
    },
  ],
}

export default readingChordSymbols
