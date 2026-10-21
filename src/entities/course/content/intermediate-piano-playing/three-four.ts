import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }

/** Intermediate Piano Playing, lesson 5: three beats to a bar, the waltz and the minuet. */
const threeFour: Lesson = {
  id: 'three-four',
  title: { en: '3/4 time', ru: 'Размер 3/4' },
  summary: {
    en: 'Count three beats to a bar, hold a dotted half, and play a waltz bass in the left hand.',
    ru: 'Считать три доли в такте, выдерживать половинную с точкой и играть вальсовый бас левой рукой.',
  },
  sections: [
    {
      heading: { en: 'Strong, weak, weak', ru: 'Сильная, слабая, слабая' },
      blocks: [
        {
          kind: 'text',
          lead: { en: '3/4 time:', ru: 'Размер 3/4:' },
          text: {
            en: 'three beats in every bar, each a quarter note. Count “1 2 3” and lean on 1: ONE two three.',
            ru: 'три доли в каждом такте, каждая — четверть. Считайте «раз, два, три» с опорой на первую: РАЗ-два-три.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4 E4 E4 F4 D4 D4 C4 E4 G4 C5/2.',
          meter: '3/4',
        },
      ],
    },
    {
      heading: { en: 'A whole bar: the dotted half', ru: 'Целый такт: половинная с точкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A whole note lasts four beats, so it does not fit in 3/4. A note that fills the bar is a dotted half. Hold it for “1 2 3”.',
            ru: 'Целая нота длится четыре доли, поэтому в 3/4 не помещается. Звук на весь такт — половинная с точкой. Держите её на «раз, два, три».',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 F4 G4 C5/2. D5 C5 B4 C5/2.',
          meter: '3/4',
        },
      ],
    },
    {
      heading: { en: 'Oom-pah-pah', ru: 'Бас, аккорд, аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In a waltz, the left hand plays the root low on beat 1. On beats 2 and 3 it plays two of the chord’s other notes, higher up.',
            ru: 'В вальсе левая рука берёт основной тон в басу на первую долю. На вторую и третью она играет выше два других звука аккорда.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 |', hands: 'C3 |' },
            { symbol: 'C', degrees: '3 5 |', hands: 'E3 G3 |' },
            { symbol: 'G7', degrees: '1 |', hands: 'G2 |' },
            { symbol: 'G7', degrees: '♭7 3 |', hands: 'F3 B3 |' },
          ],
        },
      ],
    },
    {
      heading: { en: 'The minuet', ru: 'Менуэт' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A minuet', ru: 'Менуэт' },
          text: {
            en: 'is a dance in 3/4. The Minuet in G opens with these four bars. Feel one strong beat at the start of each.',
            ru: '— танец в размере 3/4. Менуэт соль мажор начинается этими четырьмя тактами. Почувствуйте сильную долю в начале каждого.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'D5 G4/8 A4/8 B4/8 C5/8 D5 G4 G4 E5 C5/8 D5/8 E5/8 F#5/8 G5 G4 G4',
          meter: '3/4',
          key: G_MAJOR,
        },
        {
          kind: 'link',
          title: { en: 'Minuet in G in the Player', ru: 'Менуэт соль мажор в плеере' },
          target: { opens: 'piece', piece: 'minuet-g' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play, all at once, the chord that an oom-pah-pah on C breaks up.',
            ru: 'Сыграйте целиком аккорд, из которого строится вальсовый бас от до.',
          },
          answer: { chord: 'C' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the “pah” of G7: its 7th and 3rd, F and B.',
            ru: 'Сыграйте аккордовую часть G7: септиму и терцию, фа и си.',
          },
          answer: { notes: ['F', 'B'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the Minuet’s first run: G, A, B, C, D.',
            ru: 'Сыграйте первый пассаж менуэта: соль, ля, си, до, ре.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D'], rising: true },
        },
      ],
    },
  ],
}

export default threeFour
