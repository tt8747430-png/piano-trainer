import type { Lesson } from '../model/types'

const readingChordSymbols: Lesson = {
  id: 'reading-chord-symbols',
  title: { en: 'How to read chord symbols', ru: 'Как читать буквенные обозначения' },
  summary: {
    en: 'Read a chord symbol from left to right, play what it says, and name the chords you play.',
    ru: 'Читать обозначение аккорда слева направо, играть то, что в нём записано, и называть сыгранные аккорды.',
  },
  sections: [
    {
      heading: { en: 'Reading chord symbols', ru: 'Чтение обозначений аккордов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord symbol', ru: 'Обозначение аккорда' },
          text: {
            en: 'has two parts: the triad on the left, extras on the right. C is major, Cm or C− minor, C° or Cdim diminished, C+ or Caug augmented.',
            ru: 'состоит из двух частей: слева трезвучие, справа добавки. C — мажор, Cm или C− — минор, C° или Cdim — уменьшённое, C+ или Caug — увеличенное.',
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
          lead: { en: 'A number', ru: 'Число' },
          text: {
            en: 'counts up the major scale from the root. 7 is the exception: a plain 7 is the minor 7th. Maj7, M7 or Δ is the major 7th.',
            ru: 'отсчитывает ступени мажорной гаммы от основного тона. Исключение — 7: просто 7 означает малую септиму. Maj7, M7 или Δ — большую.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'CMaj7', 'Cm(maj7)'] },
      ],
    },
    {
      heading: { en: 'Sixth chords', ru: 'Аккорды с секстой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '6 always adds the major 6th, even to a minor chord. In C that note is A.',
            ru: '6 всегда добавляет большую сексту, даже к минорному аккорду. От до это ля.',
          },
        },
        { kind: 'chords', symbols: ['C6', 'Cm6'] },
        {
          kind: 'text',
          text: { en: 'Play both and find the A.', ru: 'Сыграйте оба и найдите ля.' },
        },
      ],
    },
    {
      heading: { en: 'Sus chords', ru: 'Аккорды sus' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Sus', ru: 'Sus' },
          text: {
            en: 'means the 3rd is replaced. sus2 plays the 2nd instead, sus4 the 4th.',
            ru: 'означает, что терции нет. В sus2 вместо неё секунда, в sus4 — кварта.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'Csus4'] },
        {
          kind: 'text',
          text: {
            en: 'Play C, then each sus chord. Only the middle note moves.',
            ru: 'Сыграйте C, затем каждый sus. Меняется только средний звук.',
          },
        },
      ],
    },
    {
      heading: { en: 'Slash chords', ru: 'Аккорды через дробь' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A slash chord', ru: 'Аккорд через дробь' },
          text: {
            en: 'puts a chord over a bass note. C/D is a C chord with D in the bass.',
            ru: '— это аккорд над нотой в басу. C/D — аккорд C с ре в басу.',
          },
        },
        { kind: 'chords', symbols: ['C/D'] },
        {
          kind: 'text',
          text: {
            en: 'Left hand D, right hand C E G.',
            ru: 'Левая рука — ре, правая — до, ми, соль.',
          },
        },
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
            en: '2 = 9, 4 = 11, 6 = 13. A symbol with add, 2 or 6 adds only that note, with no 7th.',
            ru: '2 = 9, 4 = 11, 6 = 13. Обозначение с add, 2 или 6 добавляет только эту ноту, без септимы.',
          },
        },
        { kind: 'chords', symbols: ['C2', 'Cadd9', 'C6'] },
      ],
    },
    {
      heading: { en: '9ths and 13ths', ru: 'Ноны и терцдецимы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A number above 7', ru: 'Число больше 7' },
          text: {
            en: 'includes the 7th and every number below it. C9 adds both the 7th and the 9th.',
            ru: 'включает септиму и все числа ниже. C9 добавляет и септиму, и нону.',
          },
        },
        { kind: 'chords', symbols: ['C9', 'C13'] },
        {
          kind: 'note',
          text: {
            en: '13 chords usually leave out the 11. It clashes with the 3rd.',
            ru: 'В аккордах с 13 обычно нет 11: она резко звучит с терцией.',
          },
        },
      ],
    },
    {
      heading: { en: 'Alterations', ru: 'Альтерации' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An alteration', ru: 'Альтерация' },
          text: {
            en: 'raises (♯) or lowers (♭) a note by a half step. You can combine several in one chord.',
            ru: 'повышает (♯) или понижает (♭) звук на полутон. В одном аккорде их может быть несколько.',
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
            en: 'Dm7 and F6/D: the same notes, two names.',
            ru: 'Dm7 и F6/D: одни и те же ноты, два названия.',
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
          target: { opens: 'quiz', trainer: 'chords', drill: 'quiz' },
        },
      ],
    },
  ],
}

export default readingChordSymbols
