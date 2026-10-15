import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const sameTime: Lesson = {
  id: 'same-time',
  title: { en: 'Both hands at the same time', ru: 'Две руки одновременно' },
  summary: {
    en: 'A tune over a held bass, one hand holding while the other moves, then both moving together and in mirror.',
    ru: 'Мелодия над выдержанным басом, одна рука держит, другая движется, затем обе вместе и зеркально.',
  },
  sections: [
    {
      heading: { en: 'A tune over a held bass', ru: 'Мелодия над выдержанным басом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A held note', ru: 'Выдержанная нота' },
          text: {
            en: 'keeps sounding while the other hand moves. Play both on beat 1, then keep the bass down for the whole bar.',
            ru: 'звучит, пока другая рука движется. Возьмите обе ноты на первую долю и держите бас весь такт.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 E4 E4/2 E4 E4 E4/2' },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 C3/1' },
      ],
    },
    {
      heading: { en: 'The bass changes with the harmony', ru: 'Бас меняется с гармонией' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In Jingle Bells the left hand plays C for four bars, then F, C and G. Each bass note fits the tune above it.',
            ru: 'В «Бубенцах» левая рука четыре такта держит до, затем фа, до и соль. Каждый бас подходит к мелодии над ним.',
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
            en: 'The Saints holds long notes in the tune. Under them the left hand can keep the beat moving.',
            ru: 'В «Святых» мелодия тянет долгие ноты. Под ними левая рука продолжает движение по долям.',
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
            en: 'moves both hands the same way, an octave apart. The keys match, but the fingers mirror.',
            ru: '— обе руки идут в одну сторону на октаву друг от друга. Клавиши те же, а пальцы зеркальные.',
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
            en: 'moves the hands apart and back. Start on the thumbs, the left on G, the right on middle C. Both hands use the same fingers.',
            ru: '— руки расходятся и сходятся. Начните с больших пальцев: левый на соль малой октавы, правый на до первой. Пальцы в обеих руках одинаковые.',
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
      heading: { en: 'Joining the hands', ru: 'Соединение рук' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Learn each hand alone first.', ru: 'Сначала выучите каждую руку отдельно.' },
            {
              en: 'Join them at half speed, counting aloud.',
              ru: 'Соедините в половинном темпе, считая вслух.',
            },
            {
              en: 'Watch the music, not the hands.',
              ru: 'Смотрите в ноты, а не на руки.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C in the left hand and E in the right, together.',
            ru: 'Сыграйте вместе до левой рукой и ми правой.',
          },
          answer: { notes: ['C', 'E'] },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the bass note under the fifth bar of Jingle Bells.',
            ru: 'Сыграйте бас пятого такта «Бубенцов».',
          },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Put both thumbs down for contrary motion and play them together.',
            ru: 'Поставьте оба больших пальца для противоположного движения и сыграйте их вместе.',
          },
          answer: { notes: ['G', 'C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G in the left hand under E in the right.',
            ru: 'Сыграйте соль левой рукой под ми в правой.',
          },
          answer: { notes: ['G', 'E'] },
        },
        {
          kind: 'link',
          title: { en: 'Jingle Bells in the Player', ru: '«Бубенцы» в плеере' },
          target: { opens: 'piece', piece: 'jingle-bells' },
        },
        {
          kind: 'link',
          title: { en: 'The Saints in the Player', ru: '«Святые» в плеере' },
          target: { opens: 'piece', piece: 'saints' },
        },
        {
          kind: 'link',
          title: { en: 'Contrary motion in the Player', ru: 'Противоположное движение в плеере' },
          target: { opens: 'exercise', exercise: 'contrary', root: note('C') },
        },
      ],
    },
  ],
}

export default sameTime
