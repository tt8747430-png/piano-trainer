import type { Lesson } from '../model/types'

const sixthAndSusChords: Lesson = {
  id: 'sixth-and-sus-chords',
  title: {
    en: '6th, added and suspended chords',
    ru: 'Аккорды с секстой, добавленными тонами и задержанием',
  },
  summary: {
    en: 'Colour a triad by adding a 6th or a 9th, or by swapping its 3rd for a 2nd or a 4th.',
    ru: 'Окрашивать трезвучие, добавляя сексту или нону либо заменяя терцию секундой или квартой.',
  },
  sections: [
    {
      heading: { en: 'The 6th chord', ru: 'Аккорд с секстой' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 6th chord', ru: 'Аккорд с секстой' },
          text: {
            en: 'adds the major 6th to a triad: C E G A. It sounds warm and settled. It does not pull to another chord.',
            ru: 'добавляет к трезвучию большую сексту: до, ми, соль, ля. Он звучит тепло и устойчиво и не тянет к другому аккорду.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C6'] },
        { kind: 'chords', symbols: ['Cm', 'Cm6'] },
      ],
    },
    {
      heading: { en: 'Added 9th and 6/9', ru: 'Добавленная нона и 6/9' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cadd9 adds the 9th, D, with no 7th. C6/9 adds both the 6th and the 9th, A and D.',
            ru: 'Cadd9 добавляет нону, ре, без септимы. C6/9 добавляет и сексту, и нону: ля и ре.',
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
            en: 'swaps the 3rd for another note. In Csus4 the 4th, F, replaces E and wants to fall back to it.',
            ru: 'заменяет терцию другим звуком. В Csus4 кварта, фа, стоит вместо ми и стремится в него вернуться.',
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
            en: 'sus2 puts the 2nd in place of the 3rd. With no 3rd it is neither major nor minor. It can hold for a whole bar.',
            ru: 'sus2 ставит секунду вместо терции. Без терции он ни мажорный, ни минорный. На нём можно стоять целый такт.',
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
            en: 'G7sus4 delays the dominant 7th. Its C falls to B, making G7. Then G7 resolves home to C.',
            ru: 'G7sus4 оттягивает доминантсептаккорд. Его до опускается в си, и получается G7. Затем G7 разрешается в C.',
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
          ask: { en: 'Play Cm6.', ru: 'Сыграйте Cm6.' },
          answer: { chord: 'Cm6' },
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
