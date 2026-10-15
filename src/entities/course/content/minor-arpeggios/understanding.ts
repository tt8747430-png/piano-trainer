import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding minor arpeggios', ru: 'Как устроены минорные арпеджио' },
  summary: {
    en: 'The minor triad and its arpeggio, how it differs from the major one by a single note, and how each hand fingers it.',
    ru: 'Минорное трезвучие и его арпеджио, чем оно отличается от мажорного и как его играет каждая рука.',
  },
  sections: [
    {
      heading: { en: 'The minor triad', ru: 'Минорное трезвучие' },
      blocks: [
        { kind: 'chords', symbols: ['Am'] },
        {
          kind: 'text',
          lead: { en: 'A minor triad', ru: 'Минорное трезвучие' },
          text: {
            en: 'stacks a minor 3rd, then a major 3rd: A, C and E. Its arpeggio plays them one at a time.',
            ru: '— это малая терция, а над ней большая: ля, до и ми. Арпеджио играет их по одному.',
          },
        },
      ],
    },
    {
      heading: { en: 'One note from major', ru: 'Одна нота от мажора' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4/8 E4/8 G4/8 C5/8 C4/8 E♭4/8 G4/8 C5/8 C4/1' },
        {
          kind: 'text',
          text: {
            en: 'C major and C minor differ only in the 3rd, E or E♭. Lower it a half step and the colour turns dark.',
            ru: 'До мажор и до минор отличаются только терцией: ми или ми-бемоль. Понизьте её на полутон, и окраска становится тёмной.',
          },
        },
      ],
    },
    {
      heading: { en: 'The fingers', ru: 'Аппликатура' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'A3/8 C4/8 E4/8 A4/8 C5/8 E5/8 A5/8 E5/8 C5/8 A4/8 E4/8 C4/8 A3/2',
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'White-key minors finger like C major: right hand 1-2-3-1-2-3-5, left hand 5-4-2-1-4-2-1.',
              ru: 'Миноры от белых клавиш играются как до мажор: правая рука 1-2-3-1-2-3-5, левая 5-4-2-1-4-2-1.',
            },
            {
              en: 'With a black root, the thumb takes the first white key: A in F♯ minor.',
              ru: 'Если тоника на чёрной клавише, большой палец берёт первую белую: ля в фа-диез миноре.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Keeping it even', ru: 'Ровность' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'D4/8 F4/8 A4/8 D5/8 A4/8 F4/8 D4/4' },
        {
          kind: 'text',
          text: {
            en: 'Play slowly, every note as loud as the next. The bump hides where the thumb passes under, so listen there.',
            ru: 'Играйте медленно, каждый звук так же громко, как соседний. Толчок прячется там, где подкладывается большой палец, слушайте это место.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the A minor triad.', ru: 'Сыграйте трезвучие ля минора.' },
          answer: { chord: 'Am' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the C minor arpeggio up one octave.',
            ru: 'Сыграйте арпеджио до минора вверх на октаву.',
          },
          answer: { notes: ['C', 'E♭', 'G', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'A minor arpeggio in the Player', ru: 'Арпеджио ля минора в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('A'), quality: 'min' },
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
