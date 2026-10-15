import type { Lesson } from '../model/types'

const sixthAndSusChords: Lesson = {
  id: 'sixth-and-sus-chords',
  title: {
    en: '6th, added and suspended chords',
    ru: 'Аккорды с секстой, добавленными тонами и задержанием',
  },
  summary: {
    en: 'Colours added to a triad: the 6th, the added 9th, and the suspended chords that hold back the 3rd.',
    ru: 'Краски, добавленные к трезвучию: секста, добавленная нона и задержания, которые откладывают терцию.',
  },
  sections: [
    {
      heading: { en: 'The 6th chord', ru: 'Аккорд с секстой' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 6th chord (C6)', ru: 'Аккорд с секстой (C6)' },
          text: {
            en: 'adds the 6th to a major triad: C E G A. It ends a song warmly, with no pull onward.',
            ru: 'добавляет к мажорному трезвучию сексту: до, ми, соль, ля. Он тепло завершает песню и никуда не тянет.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C6'] },
      ],
    },
    {
      heading: { en: 'The minor 6th', ru: 'Минорный с секстой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cm6 adds the major 6th to a minor triad: C E♭ G A. Gospel and jazz minors use it.',
            ru: 'Cm6 добавляет к минорному трезвучию большую сексту: до, ми-бемоль, соль, ля. Он звучит в госпеле и джазе.',
          },
        },
        { kind: 'chords', symbols: ['Cm', 'Cm6'] },
      ],
    },
    {
      heading: { en: 'Added 9th and 6/9', ru: 'Добавленная нона и 6/9' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cadd9 adds the 9th, D, to the triad without a 7th. C6/9 adds both the 6th and the 9th.',
            ru: 'Cadd9 добавляет к трезвучию нону, ре, без септимы. C6/9 добавляет и сексту, и нону.',
          },
        },
        { kind: 'chords', symbols: ['Cadd9', 'C6/9'] },
      ],
    },
    {
      heading: { en: 'sus4 falls to the 3rd', ru: 'sus4 разрешается в терцию' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A suspended chord', ru: 'Аккорд с задержанием' },
          text: {
            en: 'replaces the 3rd. In sus4 the 4th, F, wants to fall back to E: Csus4 to C.',
            ru: 'заменяет терцию. В sus4 кварта, фа, стремится вернуться в ми: Csus4 в C.',
          },
        },
        { kind: 'chords', symbols: ['Csus4', 'C'] },
      ],
    },
    {
      heading: { en: 'sus2 stays open', ru: 'sus2 звучит открыто' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'sus2 puts the 2nd in place of the 3rd. Neither major nor minor, it can hold a whole bar.',
            ru: 'sus2 ставит секунду вместо терции. Ни мажор, ни минор: на нём можно стоять целый такт.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'C'] },
      ],
    },
    {
      heading: { en: '7sus4 before V7', ru: '7sus4 перед V7' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7sus4 delays the dominant. Its C falls to B, then the chord goes home to C.',
            ru: 'G7sus4 оттягивает доминанту. Его до опускается в си, затем аккорд приходит в до мажор.',
          },
        },
        { kind: 'chords', symbols: ['G7sus4', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C6.', ru: 'Сыграйте C6.' },
          answer: { chord: 'C6' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Dsus4.', ru: 'Сыграйте Dsus4.' },
          answer: { chord: 'Dsus4' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Fadd9.', ru: 'Сыграйте Fadd9.' },
          answer: { chord: 'Fadd9' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
      ],
    },
  ],
}

export default sixthAndSusChords
