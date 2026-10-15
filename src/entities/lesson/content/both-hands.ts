import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const bothHands: Lesson = {
  id: 'both-hands',
  title: { en: 'Both hands together', ru: 'Две руки вместе' },
  summary: {
    en: 'The left hand’s place, hands moving together and in mirror, a held bass under a melody, and how to join the hands.',
    ru: 'Место левой руки, движение рук вместе и зеркально, выдержанный бас под мелодией и как соединять руки.',
  },
  sections: [
    {
      heading: { en: 'The left hand plays the bass', ru: 'Левая рука играет бас' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In songs the left hand plays the bass. Its C position puts the little finger on C3, the C below middle C.',
            ru: 'В песнях левая рука играет бас. В позиции до её мизинец стоит на до малой октавы, ниже первой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/2 G3 F3 E3 D3 C3/2' },
        {
          kind: 'note',
          text: {
            en: 'Going up, the left hand plays 5 4 3 2 1.',
            ru: 'Вверх левая рука играет пальцами 5 4 3 2 1.',
          },
        },
      ],
    },
    {
      heading: { en: 'Parallel: the same way', ru: 'Параллельно: в одну сторону' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Both hands climb together, an octave apart. The keys match, the fingers mirror.',
            ru: 'Обе руки поднимаются вместе, на октаву друг от друга. Клавиши одинаковые, пальцы зеркальные.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
      ],
    },
    {
      heading: { en: 'Contrary: in mirror', ru: 'Противоположно: зеркально' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Both thumbs share middle C. The right hand goes up, the left goes down, with the same fingers.',
            ru: 'Оба больших пальца на до первой октавы. Правая рука идёт вверх, левая вниз, одними и теми же пальцами.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C4 B3 A3 G3 F3/1' },
        {
          kind: 'link',
          title: { en: 'Contrary motion in the Player', ru: 'Противоположное движение в плеере' },
          target: { opens: 'exercise', exercise: 'contrary', root: note('C') },
        },
      ],
    },
    {
      heading: { en: 'A held bass under the melody', ru: 'Выдержанный бас под мелодией' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hold one bass note while the right hand plays. Change it when the harmony changes.',
            ru: 'Держите одну басовую ноту, пока играет правая рука. Меняйте её вместе с гармонией.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | E4 G4' },
            { symbol: 'G', hands: 'G2 | D4 G4' },
            { symbol: 'C', hands: 'C3 | C4 E4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Joining the hands', ru: 'Как соединять руки' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Learn each hand alone first.', ru: 'Сначала выучите каждую руку отдельно.' },
            {
              en: 'Join them at half speed, counting aloud.',
              ru: 'Соедините их в половинном темпе, считая вслух.',
            },
            {
              en: 'Play a bar you stumble on three times, then go on.',
              ru: 'Такт, где сбиваетесь, сыграйте трижды и идите дальше.',
            },
            { en: 'Raise the speed a little at a time.', ru: 'Повышайте темп понемногу.' },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C in the left hand and E in the right, together.',
            ru: 'Сыграйте вместе до в левой руке и ми в правой.',
          },
          answer: { notes: ['C', 'E'] },
        },
        {
          kind: 'link',
          title: { en: 'Amazing Grace in the Player', ru: '«О, благодать» в плеере' },
          target: { opens: 'piece', piece: 'amazing' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'With the left hand in the C position, play from the little finger to the thumb.',
            ru: 'Левой рукой в позиции до сыграйте от мизинца до большого пальца.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G in the left hand under D and G in the right.',
            ru: 'Сыграйте соль в левой руке под ре и соль в правой.',
          },
          answer: { notes: ['G', 'D', 'G'] },
        },
      ],
    },
  ],
}

export default bothHands
