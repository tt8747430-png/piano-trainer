import type { Lesson } from '../model/types'

const readingChordSymbols: Lesson = {
  id: 'reading-chord-symbols',
  title: { en: 'How to read chord symbols', ru: 'Как читать буквенные обозначения' },
  summary: {
    en: 'What each part of a chord symbol says, what its numbers mean, and how to name any chord.',
    ru: 'Что говорит каждая часть обозначения аккорда, что значат числа и как назвать любой аккорд.',
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
            en: 'A chord symbol has two parts.',
            ru: 'У обозначения аккорда две части.',
          },
          text: {
            en: 'The left part names the triad. The right part adds extras.',
            ru: 'Левая часть называет трезвучие. Правая — добавки.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'C is major. Cm or C− is minor. C° or Cdim is diminished. C+ or Caug is augmented. Play all four below.',
            ru: 'C — мажор. Cm или C− — минор. C° или Cdim — уменьшённое. C+ или Caug — увеличенное. Сыграйте все четыре ниже.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'C°', 'C+'] },
        {
          kind: 'text',
          lead: {
            en: 'Numbers are steps of the major scale built on the chord’s own root.',
            ru: 'Числа — ступени мажорной гаммы от основного тона аккорда.',
          },
          text: {
            en: 'The key of the song does not change them. The one exception is 7.',
            ru: 'Тональность песни их не меняет. Исключение одно — 7.',
          },
        },
        {
          kind: 'text',
          lead: {
            en: '7 means a minor 7th.',
            ru: '7 — малая септима.',
          },
          text: {
            en: 'Maj7, M7 or Δ means a major 7th. Cm(maj7) is a minor chord with a major 7th. Play all three below.',
            ru: 'Maj7, M7 или Δ — большая септима. Cm(maj7) — минорный аккорд с большой септимой. Сыграйте все три ниже.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'CMaj7', 'Cm(maj7)'] },
        {
          kind: 'text',
          lead: { en: '6 is always a major 6th.', ru: '6 — всегда большая секста.' },
          text: { en: 'Cm6 has a major 6th too.', ru: 'В Cm6 тоже большая.' },
        },
        { kind: 'chords', symbols: ['C6', 'Cm6'] },
        {
          kind: 'text',
          lead: { en: 'sus means no 3rd.', ru: 'sus — без терции.' },
          text: {
            en: 'sus2 has the 2nd in its place, sus4 the 4th.',
            ru: 'В sus2 вместо неё секунда, в sus4 — кварта.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'Csus4'] },
        {
          kind: 'text',
          lead: { en: 'A slash chord', ru: 'Аккорд через дробь' },
          text: {
            en: 'puts a chord over another bass note. C/D means a C chord over a D bass note.',
            ru: '— аккорд над другой нотой в басу. C/D — аккорд C с басом D.',
          },
        },
        { kind: 'chords', symbols: ['C/D'] },
        {
          kind: 'text',
          lead: { en: 'Alterations', ru: 'Альтерации' },
          text: {
            en: 'raise or lower a note by a half step: ♭9, #5. They combine freely, as in C7(♭9#5).',
            ru: 'повышают или понижают ноту на полутон: ♭9, #5. Их можно свободно сочетать, например C7(♭9#5).',
          },
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
          lead: { en: 'Three notes have two numbers each:', ru: 'У трёх нот по два числа:' },
          text: {
            en: '2 = 9, 4 = 11, 6 = 13. 8, 10, 12 and 14 never appear. They are 1, 3, 5 and 7 again.',
            ru: '2 = 9, 4 = 11, 6 = 13. 8, 10, 12 и 14 не встречаются: это снова 1, 3, 5 и 7.',
          },
        },
        {
          kind: 'text',
          lead: {
            en: 'add, 2 or 6 adds only that note.',
            ru: 'add, 2 или 6 добавляют только эту ноту.',
          },
          text: {
            en: 'C2 = Cadd2 = Cadd9 = C D E G. C6 = C E G A. A plain 4, as in C4, usually means sus4.',
            ru: 'C2 = Cadd2 = Cadd9 = C D E G. C6 = C E G A. Просто 4, как в C4, обычно значит sus4.',
          },
        },
        { kind: 'chords', symbols: ['C2', 'Cadd9', 'C6'] },
        {
          kind: 'text',
          lead: {
            en: 'A number above 7 includes the 7th and everything below it.',
            ru: 'Число больше 7 включает септиму и всё, что ниже.',
          },
          text: { en: 'C9 = C E G B♭ D.', ru: 'C9 = C E G B♭ D.' },
        },
        { kind: 'chords', symbols: ['C9'] },
        {
          kind: 'text',
          lead: {
            en: '13 chords usually leave out the 11.',
            ru: 'В аккордах с 13 обычно нет 11.',
          },
          text: {
            en: 'The 11 clashes with the major 3rd. C13 = C E G B♭ D A.',
            ru: '11 звучит резко рядом с большой терцией. C13 = C E G B♭ D A.',
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
              en: 'Put the notes in letter order. Then stack them in 3rds, every other letter.',
              ru: 'Расставьте ноты по порядку букв. Затем сложите их терциями — через букву.',
            },
            {
              en: 'Find the three notes that make the core triad.',
              ru: 'Найдите три ноты основного трезвучия.',
            },
            {
              en: 'Name its kind: major, minor, diminished, augmented or sus4.',
              ru: 'Определите его вид: мажор, минор, уменьшённое, увеличенное или sus4.',
            },
            {
              en: 'If there is a 4th note, it is the 6th or the 7th.',
              ru: 'Если есть 4-я нота, это секста или септима.',
            },
            {
              en: 'If there is a 5th note, it is the 9th (or ♭9, #9).',
              ru: 'Если есть 5-я нота, это нона (или ♭9, #9).',
            },
            {
              en: 'If there is a 6th note, it is the 11th (or #11).',
              ru: 'Если есть 6-я нота, это ундецима (или #11).',
            },
            {
              en: 'If there is a 7th note, it is the 13th (or ♭13).',
              ru: 'Если есть 7-я нота, это терцдецима (или ♭13).',
            },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'The same notes can have two names. D F A C is Dm7, and also F6 over D. Play both below.',
            ru: 'Одни и те же ноты могут называться по-разному. D F A C — это Dm7, а также F6 с басом D. Сыграйте оба ниже.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'F6/D'] },
      ],
    },
  ],
}

export default readingChordSymbols
