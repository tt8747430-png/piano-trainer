import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const sameTime: Lesson = {
  id: 'same-time',
  title: { en: 'Both hands at the same time', ru: 'Две руки одновременно' },
  summary: {
    en: 'Play a tune over a bass, then both hands moving together.',
    ru: 'Играть мелодию над басом и вести обе руки вместе.',
  },
  sections: [
    {
      heading: { en: 'A tune over a held bass', ru: 'Мелодия над выдержанным басом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A held bass', ru: 'Выдержанный бас' },
          text: {
            en: 'sounds through the bar while the tune moves. In Jingle Bells it is C for four bars, then F, C and G.',
            ru: 'звучит весь такт, пока движется мелодия. В «Бубенцах» это до четыре такта, затем фа, до и соль.',
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
      ],
    },
    {
      heading: { en: 'One holds, one moves', ru: 'Одна держит, другая движется' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The Saints holds long notes in the tune. Under them the left hand keeps the beat moving.',
            ru: 'В «Святых» мелодия тянет долгие ноты. Под ними левая рука продолжает идти по долям.',
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
      heading: { en: 'Moving together', ru: 'Движение вместе' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Parallel motion', ru: 'Параллельное движение' },
          text: {
            en: 'moves both hands the same way, an octave apart. The keys match, the fingers mirror.',
            ru: '— обе руки идут в одну сторону на октаву друг от друга. Клавиши те же, пальцы зеркальные.',
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
            en: 'moves the hands apart and back on the same fingers. Start on the thumbs: left on G, right on middle C.',
            ru: '— руки расходятся и сходятся одними пальцами. Начните с больших: левый на соль, правый на до.',
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
            { en: 'Learn each hand alone first.', ru: 'Сначала выучите каждую руку отдельно.' },
            {
              en: 'Join them at half speed, counting aloud.',
              ru: 'Соедините в половинном темпе, считая вслух.',
            },
            { en: 'Watch the music, not the hands.', ru: 'Смотрите в ноты, а не на руки.' },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass note of Jingle Bells’ fifth bar.',
            ru: 'Сыграйте бас пятого такта «Бубенцов».',
          },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play both starting thumbs of contrary motion together.',
            ru: 'Сыграйте вместе оба больших пальца, с которых начинается противоположное движение.',
          },
          answer: { notes: ['G', 'C'] },
        },
      ],
    },
  ],
}

export default sameTime
