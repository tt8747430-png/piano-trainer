import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }

/** Intermediate Piano Playing, lesson 5: three beats to a bar, the waltz and the minuet. */
const threeFour: Lesson = {
  id: 'three-four',
  title: { en: '3/4 time', ru: 'Размер 3/4' },
  summary: {
    en: 'Three beats to a bar, the first strong: the time of the waltz and the minuet, with an oom-pah-pah in the left hand.',
    ru: 'Три доли в такте, первая сильная: размер вальса и менуэта, с аккомпанементом «бас – аккорд – аккорд» в левой руке.',
  },
  sections: [
    {
      heading: { en: 'Three beats to a bar', ru: 'Три доли в такте' },
      blocks: [
        {
          kind: 'text',
          lead: { en: '3/4:', ru: '3/4:' },
          text: {
            en: 'three quarter-note beats in every bar. Count «1 2 3, 1 2 3» and play one note to each number.',
            ru: 'три четвертные доли в каждом такте. Считайте «раз-два-три, раз-два-три» и играйте по звуку на каждую цифру.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 E4 G4 C5/2. G4 E4 C4 C4/2.',
          meter: '3/4',
        },
      ],
    },
    {
      heading: { en: 'Strong, weak, weak', ru: 'Сильная, слабая, слабая' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Beat 1 is strong, beats 2 and 3 are light: ONE two three. That lean on the first beat is what makes a waltz.',
            ru: 'Первая доля сильная, вторая и третья лёгкие: РАЗ-два-три. Именно опора на первую долю и делает музыку вальсом.',
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
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 F4 G4 C5/2. D5 C5 B4 C5/2.',
          meter: '3/4',
        },
        {
          kind: 'text',
          text: {
            en: 'A whole note is four beats, too long for 3/4. A note that fills the bar is a dotted half: hold it «1 2 3».',
            ru: 'Целая нота длится четыре доли, для 3/4 это слишком долго. Звук на весь такт — половинная с точкой: держите её «раз-два-три».',
          },
        },
      ],
    },
    {
      heading: { en: 'Oom-pah-pah', ru: 'Бас – аккорд – аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The waltz’s left hand plays the root low on beat 1, then the chord’s other notes on beats 2 and 3.',
            ru: 'В вальсе левая рука берёт основной тон в басу на первую долю, затем остальные звуки аккорда на вторую и третью.',
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
        { kind: 'notes', clef: 'bass', notes: 'C3 r/4 r/4 G2 r/4 r/4 C3/2.', meter: '3/4' },
      ],
    },
    {
      heading: { en: 'The minuet', ru: 'Менуэт' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Minuet:', ru: 'Менуэт:' },
          text: {
            en: 'a graceful court dance in 3/4. The Minuet in G opens with these four bars. Feel one strong beat in each.',
            ru: 'изящный придворный танец в размере 3/4. Менуэт соль мажор начинается этими четырьмя тактами. Чувствуйте в каждом одну сильную долю.',
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
            en: 'Play the chord an oom-pah-pah on C spreads out.',
            ru: 'Сыграйте целиком аккорд, из которого строится вальсовый бас от до.',
          },
          answer: { chord: 'C' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G7’s «pah»: its 7th and 3rd, F and B.',
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
        {
          kind: 'link',
          title: { en: 'Minuet in G in the Player', ru: 'Менуэт соль мажор в плеере' },
          target: { opens: 'piece', piece: 'minuet-g' },
        },
        {
          kind: 'link',
          title: { en: 'Read notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default threeFour
