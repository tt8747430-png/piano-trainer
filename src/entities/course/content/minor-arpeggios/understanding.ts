import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding minor arpeggios', ru: 'Как устроены минорные арпеджио' },
  summary: {
    en: 'Build a minor triad, hear how it differs from major, and play its arpeggio evenly.',
    ru: 'Строить минорное трезвучие, слышать его отличие от мажорного и ровно играть его арпеджио.',
  },
  sections: [
    {
      heading: { en: 'The minor triad', ru: 'Минорное трезвучие' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A minor triad', ru: 'Минорное трезвучие' },
          text: {
            en: 'is a minor 3rd with a major 3rd on top. A minor is A, C and E. Its arpeggio plays them one at a time.',
            ru: '— это малая терция, а над ней большая. Ля минор: ля, до и ми. Арпеджио играет эти звуки по одному.',
          },
        },
        { kind: 'chords', symbols: ['Am'] },
      ],
    },
    {
      heading: { en: 'One note away from major', ru: 'Одна нота от мажора' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C major and C minor share C and G. Only the 3rd differs: E in major, E♭ in minor. Lowering it a semitone darkens the sound.',
            ru: 'У до мажора и до минора общие до и соль. Различается только терция: ми в мажоре, ми-бемоль в миноре. На полутон ниже, и звук темнеет.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/8 E4/8 G4/8 C5/8 C4/8 E♭4/8 G4/8 C5/8 C4/1' },
      ],
    },
    {
      heading: { en: 'The fingers', ru: 'Аппликатура' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Minor arpeggios on white roots use C major’s fingers: right hand 1-2-3-1-2-3-5, left hand 5-4-2-1-4-2-1.',
              ru: 'Минорные арпеджио от белых клавиш играются пальцами до мажора: правая рука 1-2-3-1-2-3-5, левая 5-4-2-1-4-2-1.',
            },
            {
              en: 'On a black root, the thumb takes the first white key. In F♯ minor that is A.',
              ru: 'Если тоника на чёрной клавише, большой палец берёт первую белую. В фа-диез миноре это ля.',
            },
          ],
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'A3/8 C4/8 E4/8 A4/8 C5/8 E5/8 A5/8 E5/8 C5/8 A4/8 E4/8 C4/8 A3/2',
        },
      ],
    },
    {
      heading: { en: 'Keep it even', ru: 'Ровность' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play slowly, every note as loud as the one before. Listen where the thumb passes under, because that is where a bump hides.',
            ru: 'Играйте медленно, все звуки одинаково громко. Слушайте место, где подкладывается большой палец: там и прячется толчок.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'D4/8 F4/8 A4/8 D5/8 A4/8 F4/8 D4/4' },
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
