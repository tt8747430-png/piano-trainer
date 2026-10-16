import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const sameTime: Lesson = {
  id: 'same-time',
  title: { en: 'Both hands at once', ru: 'Две руки одновременно' },
  summary: {
    en: 'Play a tune over a bass, then move both hands together, first the same way, then in mirror.',
    ru: 'Играть мелодию над басом, затем вести обе руки вместе: сначала в одну сторону, потом зеркально.',
  },
  sections: [
    {
      heading: { en: 'A tune over a long bass note', ru: 'Мелодия над долгим басом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A held bass', ru: 'Выдержанный бас' },
          text: {
            en: 'is one low note that lasts the whole bar while the tune moves above it. In Jingle Bells the left hand holds C for four bars, then F, C and G.',
            ru: '— низкая нота, которая звучит весь такт, пока сверху движется мелодия. В «Бубенцах» левая рука четыре такта держит до, затем фа, до и соль.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes:
            'E4 E4 E4/2 E4 E4 E4/2 E4 G4 C4/4. D4/8 E4/1 F4 F4 F4/4. F4/8 F4 E4 E4 E4/8 E4/8 E4 D4 D4 E4 D4/2 G4/2',
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 C3/1 C3/1 C3/1 F3/1 C3/1 G3/1 G3/1' },
        {
          kind: 'link',
          title: { en: 'Jingle Bells in the Player', ru: '«Бубенцы» в плеере' },
          target: { opens: 'piece', piece: 'jingle-bells' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass note of the fifth bar of Jingle Bells.',
            ru: 'Сыграйте басовую ноту пятого такта «Бубенцов».',
          },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'One hand holds, one moves', ru: 'Одна рука держит, другая движется' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In The Saints the tune holds long notes. Under them the left hand keeps walking, one note on each beat.',
            ru: 'В «Святых» мелодия тянет долгие ноты. Под ними левая рука продолжает шагать, по ноте на каждую долю.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'r/4 C4 E4 F4 G4/1 r/4 C4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 C3 E3 G3 E3 C3/1 C3 E3 G3 E3' },
        {
          kind: 'link',
          title: { en: 'The Saints in the Player', ru: '«Святые» в плеере' },
          target: { opens: 'piece', piece: 'saints' },
        },
      ],
    },
    {
      heading: { en: 'Moving the same way', ru: 'Движение в одну сторону' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Parallel motion', ru: 'Параллельное движение' },
          text: {
            en: 'means both hands move the same way, an octave apart. They play the same notes, but the fingers mirror: the right thumb goes with the left little finger.',
            ru: '— обе руки идут в одну сторону на октаву друг от друга. Ноты одни и те же, а пальцы зеркальные: правый большой идёт вместе с левым мизинцем.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3 F3 E3 D3 C3/1' },
      ],
    },
    {
      heading: { en: 'Moving in mirror', ru: 'Зеркальное движение' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Contrary motion', ru: 'Противоположное движение' },
          text: {
            en: 'means the hands move in opposite directions. Start on both thumbs, the left on G and the right on middle C. The same fingers then play together.',
            ru: '— руки идут в разные стороны. Начните с больших пальцев: левый на соль, правый на до первой октавы. Дальше обе руки играют одинаковыми пальцами.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'bass', notes: 'G3 F3 E3 D3 C3 D3 E3 F3 G3/1' },
        {
          kind: 'link',
          title: { en: 'Contrary motion in the Player', ru: 'Противоположное движение в плеере' },
          target: { opens: 'exercise', exercise: 'contrary', root: note('C') },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Learn each hand on its own first.',
              ru: 'Сначала выучите каждую руку отдельно.',
            },
            {
              en: 'Put them together at half speed, counting aloud.',
              ru: 'Соедините руки в половинном темпе, считая вслух.',
            },
            {
              en: 'Keep your eyes on the music, not on your hands.',
              ru: 'Смотрите в ноты, а не на руки.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the two thumb notes that start contrary motion, together.',
            ru: 'Сыграйте вместе две ноты больших пальцев, с которых начинается противоположное движение.',
          },
          answer: { notes: ['G', 'C'] },
        },
      ],
    },
  ],
}

export default sameTime
