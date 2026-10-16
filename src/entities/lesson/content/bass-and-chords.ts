import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const bassAndChords: Lesson = {
  id: 'bass-and-chords',
  title: { en: 'Bass and chords', ru: 'Бас и аккорды' },
  summary: {
    en: 'Split a chord chart between the hands: bass left, chord right.',
    ru: 'Делите аккорды между руками: бас в левой, аккорд в правой.',
  },
  sections: [
    {
      heading: { en: 'Two hands, two jobs', ru: 'Две руки — две задачи' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'From a chord chart,', ru: 'По аккордовой записи' },
          text: {
            en: 'split each chord: the left hand plays its root low, the right hand the chord near the middle.',
            ru: 'делите каждый аккорд: левая рука берёт его основной тон внизу, правая — сам аккорд в середине.',
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
            en: 'is the same chord with another note at the bottom. Take the nearest: keep shared notes, move the rest by the smallest step.',
            ru: '— тот же аккорд с другой нотой внизу. Берите ближайшее: общие ноты оставьте, остальные сдвиньте на ближайшую ступень.',
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
            en: 'Strike the bass and the chord together on beat 1, then the chord alone on each beat after.',
            ru: 'Бас и аккорд вместе на первую долю, затем аккорд один на каждую следующую.',
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
            en: 'Hold the chord in the right hand and move the bass: root, the 5th below, root, the 5th below.',
            ru: 'Правая рука держит аккорд, а бас движется: основной тон, квинта вниз, основной тон, квинта вниз.',
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
            en: 'the hands take turns. In a waltz the bass sounds on 1, the chord on 2 and 3.',
            ru: 'руки звучат по очереди. В вальсе бас — на раз, аккорд — на два и три.',
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
          title: { en: 'I–IV–V–I in the Player', ru: 'I–IV–V–I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'I–vi–IV–V in the Player', ru: 'I–vi–IV–V в плеере' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default bassAndChords
