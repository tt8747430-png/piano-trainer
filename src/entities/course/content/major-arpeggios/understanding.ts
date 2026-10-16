import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding arpeggios', ru: 'Как устроены арпеджио' },
  summary: {
    en: 'Play a major arpeggio over two octaves in either hand.',
    ru: 'Играть мажорное арпеджио на две октавы каждой рукой.',
  },
  sections: [
    {
      heading: { en: 'A chord, one note at a time', ru: 'Аккорд по одному звуку' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An arpeggio', ru: 'Арпеджио' },
          text: {
            en: 'plays a chord’s notes one after another. C major’s climbs C, E, G and C again.',
            ru: '— звуки аккорда, сыгранные один за другим. Арпеджио до мажора: до, ми, соль и снова до.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
      ],
    },
    {
      heading: { en: 'Over two octaves', ru: 'На две октавы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'An arpeggio runs two octaves or more, up and back. The fingers span a 3rd or a 4th each, so the hand stays open.',
            ru: 'Арпеджио играют на две октавы и больше, вверх и обратно. Между пальцами терция или кварта, рука остаётся раскрытой.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 E4/8 G4/8 C5/8 E5/8 G5/8 C6/8 G5/8 E5/8 C5/8 G4/8 E4/8 C4/2',
        },
      ],
    },
    {
      heading: { en: 'The fingers', ru: 'Аппликатура' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Right hand, up: 1-2-3-1-2-3-5. The thumb passes under to the middle C.',
              ru: 'Правая рука вверх: 1-2-3-1-2-3-5. Большой палец подкладывается на среднее до.',
            },
            {
              en: 'Left hand, up: 5-4-2-1-4-2-1. Finger 4 crosses over the thumb to E.',
              ru: 'Левая рука вверх: 5-4-2-1-4-2-1. Четвёртый палец перекладывается через большой на ми.',
            },
          ],
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C2/8 E2/8 G2/8 C3/8 E3/8 G3/8 C4/8 G3/8 E3/8 C3/8 G2/8 E2/8 C2/2',
        },
      ],
    },
    {
      heading: { en: 'The thumb passes under', ru: 'Подкладывание большого пальца' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the thumb under as soon as 3 plays G. Let the arm carry the hand sideways, with no bump between octaves.',
            ru: 'Подводите большой палец, как только третий взял соль. Рука ведёт кисть в сторону, и между октавами нет толчка.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/8 E4/8 G4/8 C5/8 E5/8 G5/8 C6/4' },
      ],
    },
    {
      heading: { en: 'A black-key root', ru: 'Тоника на чёрной клавише' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'When the root is black, the thumb takes the first white key. A♭ major puts it on C: the right hand plays 2-1-2-4.',
            ru: 'Если тоника на чёрной клавише, большой палец берёт первую белую. В ля-бемоль мажоре он на до: правая рука играет 2-1-2-4.',
          },
        },
        { kind: 'chords', symbols: ['A♭'] },
      ],
    },
    {
      heading: { en: 'Inversions', ru: 'Обращения' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'starts the chord on its 3rd or 5th. Its arpeggio moves the thumb to that note.',
            ru: 'начинает аккорд с терции или квинты. В его арпеджио большой палец переходит на эту ноту.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | C4 E4 G4' },
            { symbol: 'C/E', hands: 'E3 | E4 G4 C5' },
            { symbol: 'C/G', hands: 'G3 | G4 C5 E5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the C major arpeggio up one octave.',
            ru: 'Сыграйте арпеджио до мажора вверх на октаву.',
          },
          answer: { notes: ['C', 'E', 'G', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the G major arpeggio up one octave.',
            ru: 'Сыграйте арпеджио соль мажора вверх на октаву.',
          },
          answer: { notes: ['G', 'B', 'D', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play the A♭ major triad.', ru: 'Сыграйте трезвучие ля-бемоль мажора.' },
          answer: { chord: 'A♭' },
        },
        {
          kind: 'link',
          title: { en: 'C major arpeggio in the Player', ru: 'Арпеджио до мажора в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('C'), quality: 'maj' },
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

export default understanding
