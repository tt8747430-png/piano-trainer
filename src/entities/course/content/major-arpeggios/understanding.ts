import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding arpeggios', ru: 'Как устроены арпеджио' },
  summary: {
    en: 'What an arpeggio is, how it runs over two octaves, and how the thumb carries each hand from one octave to the next.',
    ru: 'Что такое арпеджио, как оно идёт на две октавы и как большой палец переносит руку из октавы в октаву.',
  },
  sections: [
    {
      heading: { en: 'A chord, one note at a time', ru: 'Аккорд по одному звуку' },
      blocks: [
        { kind: 'chords', symbols: ['C'] },
        {
          kind: 'text',
          lead: { en: 'An arpeggio', ru: 'Арпеджио' },
          text: {
            en: 'plays a chord’s notes one after another, like a harp. C major’s climbs C, E, G and C again.',
            ru: '— это звуки аккорда, сыгранные один за другим, как на арфе. Арпеджио до мажора: до, ми, соль и снова до.',
          },
        },
      ],
    },
    {
      heading: { en: 'Over two octaves', ru: 'На две октавы' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 E4/8 G4/8 C5/8 E5/8 G5/8 C6/8 G5/8 E5/8 C5/8 G4/8 E4/8 C4/2',
        },
        {
          kind: 'text',
          text: {
            en: 'An arpeggio runs two octaves or more, up and back. The fingers span a 3rd or a 4th each, so the hand stays open.',
            ru: 'Арпеджио играют на две октавы и больше, вверх и обратно. Между пальцами терция или кварта, поэтому рука остаётся раскрытой.',
          },
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
        { kind: 'notes', clef: 'treble', notes: 'C4/8 E4/8 G4/8 C5/8 E5/8 G5/8 C6/4' },
        {
          kind: 'text',
          text: {
            en: 'Move the thumb under as soon as 3 plays G. Let the wrist and arm carry the hand sideways, so there is no bump between octaves.',
            ru: 'Подводите большой палец, как только третий взял соль. Запястье и рука ведут кисть в сторону, и между октавами нет толчка.',
          },
        },
      ],
    },
    {
      heading: { en: 'A black-key root', ru: 'Тоника на чёрной клавише' },
      blocks: [
        { kind: 'chords', symbols: ['A♭'] },
        {
          kind: 'text',
          text: {
            en: 'When the root is black, the thumb takes the first white key. A♭ major puts it on C, so the right hand plays 2-1-2-4.',
            ru: 'Если тоника на чёрной клавише, большой палец берёт первую белую. В ля-бемоль мажоре он стоит на до, и правая рука играет 2-1-2-4.',
          },
        },
      ],
    },
    {
      heading: { en: 'Inversions', ru: 'Обращения' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | C4 E4 G4' },
            { symbol: 'C/E', hands: 'E3 | E4 G4 C5' },
            { symbol: 'C/G', hands: 'G3 | G4 C5 E5' },
          ],
        },
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'starts the chord on its 3rd or 5th. Its arpeggio moves the thumb to that note.',
            ru: 'начинает аккорд с терции или квинты. В его арпеджио большой палец переходит на эту ноту.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the C major triad.', ru: 'Сыграйте трезвучие до мажора.' },
          answer: { chord: 'C' },
        },
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
