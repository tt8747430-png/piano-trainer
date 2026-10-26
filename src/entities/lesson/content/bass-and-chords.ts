import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const bassAndChords: Lesson = {
  id: 'bass-and-chords',
  title: { en: 'Bass and chords', ru: 'Бас и аккорды' },
  summary: {
    en: 'Turn chord names into music: the bass in the left hand, the chord in the right.',
    ru: 'Превращайте названия аккордов в музыку: бас в левой руке, аккорд в правой.',
  },
  sections: [
    {
      heading: { en: 'Two hands, two jobs', ru: 'Две руки — две задачи' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord chart', ru: 'Аккордовая запись' },
          text: {
            en: 'gives only chord names. Play each one with two hands: the left hand plays the root low, the right hand plays the chord near middle C.',
            ru: 'даёт только названия аккордов. Каждый играйте двумя руками: левая берёт основной тон внизу, правая — весь аккорд около до первой октавы.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
            { symbol: 'F', degrees: '1 | 1 3 5', hands: 'F2 | F4 A4 C5' },
            { symbol: 'G', degrees: '1 | 1 3 5', hands: 'G2 | G4 B4 D5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'The nearest chord', ru: 'Ближайший аккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'is the same chord with another of its notes at the bottom. Choose the one nearest your hand: keep shared notes still and move the others as little as you can.',
            ru: '— тот же аккорд с другой своей нотой внизу. Выбирайте ближайшее к руке: общие ноты оставьте, остальные сдвиньте как можно меньше.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
            { symbol: 'F', degrees: '1 | 5 1 3', hands: 'F2 | C4 F4 A4' },
            { symbol: 'G', degrees: '1 | 3 5 1', hands: 'G2 | B3 D4 G4' },
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Bass and chord together', ru: 'Бас и аккорд вместе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now add rhythm. On beat 1 play the bass and the chord together. On each beat after, repeat the chord alone.',
            ru: 'Теперь добавьте ритм. На первую долю играйте бас и аккорд вместе. На каждую следующую повторяйте один аккорд.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'A moving bass', ru: 'Подвижный бас' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand holds the chord. The left hand walks between two notes: the root, then the chord’s 5th below it, and again.',
            ru: 'Правая рука держит аккорд. Левая ходит между двумя нотами: основной тон, затем квинта аккорда под ним, и снова.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3 G2 C3 G2 F2 C2 F2 C2 G2 D2 G2 D2 C3/1',
        },
      ],
    },
    {
      heading: { en: 'Bass and chord in turn', ru: 'Бас и аккорд по очереди' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Oom-pah:', ru: 'Бас — аккорд:' },
          text: {
            en: 'the hands take turns instead of playing together. In a waltz, count 1 2 3: the bass on 1, the chord on 2 and 3.',
            ru: 'руки играют по очереди, а не вместе. В вальсе считайте «раз, два, три»: бас на раз, аккорд на два и три.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', caption: '1', hands: 'C3 |' },
            { symbol: 'C', caption: '2', hands: '| E4 G4 C5' },
            { symbol: 'C', caption: '3', hands: '| E4 G4 C5' },
            { symbol: 'G7', caption: '1', hands: 'G2 |' },
            { symbol: 'G7', caption: '2', hands: '| D4 F4 B4' },
            { symbol: 'G7', caption: '3', hands: '| D4 F4 B4' },
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
            en: 'Play F major with a low F in the bass and the chord above it.',
            ru: 'Сыграйте фа мажор: внизу бас фа, над ним аккорд.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G major with its 3rd, B, in the bass.',
            ru: 'Сыграйте соль мажор с терцией си в басу.',
          },
          answer: { chord: 'G/B' },
        },
        {
          kind: 'link',
          title: { en: 'Practise I–IV–V–I in the Player', ru: 'I–IV–V–I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'Practise I–vi–IV–V in the Player', ru: 'I–vi–IV–V в плеере' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default bassAndChords
