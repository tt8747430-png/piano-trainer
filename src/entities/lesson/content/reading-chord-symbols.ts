import type { Lesson } from '../model/types'

const readingChordSymbols: Lesson = {
  id: 'reading-chord-symbols',
  title: { en: 'How to read chord symbols', ru: 'Как читать буквенные обозначения' },
  summary: {
    en: 'What each part of a chord symbol says, what its numbers mean, and how to name any chord.',
    ru: 'Что говорит каждая часть обозначения аккорда, что значат числа и как назвать любой аккорд.',
  },
  sections: [
    {
      heading: { en: 'Reading chord symbols', ru: 'Чтение обозначений аккордов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord symbol has two parts:', ru: 'У обозначения аккорда две части:' },
          text: {
            en: 'the triad on the left, extras on the right. C is major, Cm or C− minor, C° or Cdim diminished, C+ or Caug augmented.',
            ru: 'слева трезвучие, справа добавки. C — мажор, Cm или C− — минор, C° или Cdim — уменьшённое, C+ или Caug — увеличенное.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'C°', 'C+'] },
      ],
    },
    {
      heading: { en: 'Numbers and 7ths', ru: 'Числа и септимы' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'Numbers count up the major scale from the chord’s root.',
            ru: 'Числа отсчитывают ступени мажорной гаммы от основного тона аккорда.',
          },
          text: {
            en: 'Only 7 breaks the rule: it means a minor 7th. Maj7, M7 or Δ is a major 7th.',
            ru: 'Исключение одно — 7: это малая септима. Maj7, M7 или Δ — большая септима.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'CMaj7', 'Cm(maj7)'] },
      ],
    },
    {
      heading: { en: '6, sus and slash chords', ru: '6, sus и аккорды через дробь' },
      blocks: [
        {
          kind: 'text',
          lead: { en: '6 is always a major 6th,', ru: '6 — всегда большая секста,' },
          text: { en: 'even in Cm6.', ru: 'даже в Cm6.' },
        },
        { kind: 'chords', symbols: ['C6', 'Cm6'] },
        {
          kind: 'text',
          lead: { en: 'sus means no 3rd:', ru: 'sus — без терции:' },
          text: {
            en: 'sus2 takes the 2nd, sus4 the 4th.',
            ru: 'в sus2 вместо неё секунда, в sus4 — кварта.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'Csus4'] },
        {
          kind: 'text',
          lead: { en: 'A slash chord', ru: 'Аккорд через дробь' },
          text: {
            en: 'is a chord over a bass note: C/D.',
            ru: '— аккорд над нотой в басу: C/D.',
          },
        },
        { kind: 'chords', symbols: ['C/D'] },
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
          lead: { en: 'Three notes have two numbers:', ru: 'У трёх нот по два числа:' },
          text: {
            en: '2 = 9, 4 = 11, 6 = 13. Add, 2 or 6 adds just that note.',
            ru: '2 = 9, 4 = 11, 6 = 13. add, 2 или 6 добавляют только эту ноту.',
          },
        },
        { kind: 'chords', symbols: ['C2', 'Cadd9', 'C6'] },
        {
          kind: 'note',
          text: {
            en: 'A plain 4, as in C4, usually means sus4.',
            ru: 'Просто 4, как в C4, обычно значит sus4.',
          },
        },
      ],
    },
    {
      heading: { en: '9ths, 13ths and alterations', ru: 'Ноны, терцдецимы и альтерации' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A number above 7', ru: 'Число больше 7' },
          text: {
            en: 'includes the 7th and everything below it.',
            ru: 'включает септиму и всё, что ниже.',
          },
        },
        { kind: 'chords', symbols: ['C9', 'C13'] },
        {
          kind: 'note',
          text: {
            en: '13 chords usually leave out the 11: it clashes with the 3rd.',
            ru: 'В аккордах с 13 обычно нет 11: она резко звучит с терцией.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'Alterations', ru: 'Альтерации' },
          text: {
            en: 'raise or lower a note a half step, and combine freely.',
            ru: 'повышают или понижают ноту на полутон и свободно сочетаются.',
          },
        },
        { kind: 'chords', symbols: ['C7♭9#5'] },
      ],
    },
    {
      heading: { en: 'Naming any chord', ru: 'Как назвать любой аккорд' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Stack the notes in 3rds.', ru: 'Сложите ноты терциями.' },
            { en: 'The lowest three name the triad.', ru: 'Нижние три называют трезвучие.' },
            { en: 'A 4th note is the 6th or 7th.', ru: 'Четвёртая нота — секста или септима.' },
            {
              en: 'Then come the 9th, 11th and 13th.',
              ru: 'Дальше идут нона, ундецима и терцдецима.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm7', 'F6/D'] },
        {
          kind: 'note',
          text: {
            en: 'The same notes can have two names.',
            ru: 'У одних и тех же нот может быть два названия.',
          },
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
          ask: { en: 'Play G7.', ru: 'Сыграйте G7.' },
          answer: { chord: 'G7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play FMaj7.', ru: 'Сыграйте FMaj7.' },
          answer: { chord: 'FMaj7' },
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

export default readingChordSymbols
