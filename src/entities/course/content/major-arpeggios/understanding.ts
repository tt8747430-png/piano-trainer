import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding arpeggios', ru: 'Как устроены арпеджио' },
  summary: {
    en: 'Play a major arpeggio over two octaves with each hand, then from a black key and from an inversion.',
    ru: 'Играть мажорное арпеджио на две октавы каждой рукой, затем от чёрной клавиши и от обращения.',
  },
  sections: [
    {
      heading: { en: 'A chord, one note at a time', ru: 'Аккорд по одному звуку' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An arpeggio', ru: 'Арпеджио' },
          text: {
            en: 'is a chord played one note at a time. The C major arpeggio climbs C, E, G and C again.',
            ru: '— это аккорд, сыгранный по одному звуку. Арпеджио до мажора поднимается по звукам до, ми, соль и снова до.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
      ],
    },
    {
      heading: { en: 'The right hand', ru: 'Правая рука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each finger spans a 3rd or a 4th, so keep the hand open. Going up, play 1-2-3, pass the thumb under to C, then 2-3-5.',
            ru: 'Между соседними пальцами терция или кварта, поэтому рука раскрыта. Вверх: 1-2-3, большой палец подкладывается на до, затем 2-3-5.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/8 E4/8 G4/8 C5/8 E5/8 G5/8 C6/4' },
      ],
    },
    {
      heading: { en: 'Two octaves, up and back', ru: 'Две октавы вверх и обратно' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the thumb under while finger 3 still plays G. Let the arm carry the hand sideways, so the new octave starts without a bump.',
            ru: 'Подводите большой палец, пока третий ещё держит соль. Рука ведёт кисть в сторону, и новая октава начинается без толчка.',
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
      heading: { en: 'The left hand', ru: 'Левая рука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Going up, the left hand plays 5-4-2-1, then 4-2-1. After the thumb plays C, finger 4 crosses over it to E.',
            ru: 'Вверх левая рука играет 5-4-2-1, затем 4-2-1. После до большим пальцем четвёртый перекладывается через него на ми.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C2/8 E2/8 G2/8 C3/8 E3/8 G3/8 C4/8 G3/8 E3/8 C3/8 G2/8 E2/8 C2/2',
        },
      ],
    },
    {
      heading: { en: 'A root on a black key', ru: 'Тоника на чёрной клавише' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'When the root is a black key, the thumb takes the first white key. In A♭ major that is C, so the right hand plays 2-1-2-4. F♯ major has no white key: 1-2-3-1-2-3-5 from F♯.',
            ru: 'Если тоника на чёрной клавише, большой палец берёт первую белую. В ля-бемоль мажоре это до, и правая рука играет 2-1-2-4. В фа-диез мажоре белых нет: 1-2-3-1-2-3-5 от фа-диеза.',
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
            en: 'starts the chord on its 3rd or 5th instead of its root. C/E starts on E, C/G on G. The thumb starts the arpeggio on that note.',
            ru: '— аккорд, который начинается с терции или квинты, а не с основного тона. C/E начинается с ми, C/G с соль. С этого звука арпеджио начинает большой палец.',
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
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
      ],
    },
  ],
}

export default understanding
