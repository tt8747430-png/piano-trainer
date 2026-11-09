import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** My Practice Plan: six drills that make inversions automatic. */
const inversionDrills: Lesson = {
  id: 'inversion-drills',
  title: { en: 'Inversion drills', ru: 'Упражнения на обращения' },
  summary: {
    en: 'Climb a chord through its positions, play a key’s chords in one position, start a progression from each, break them, and the 7th chord’s four positions.',
    ru: 'Поднимайтесь по положениям аккорда, играйте аккорды тональности в одном положении, начинайте оборот с каждого, разлагайте их, и четыре положения септаккорда.',
  },
  after: ['chord-fingering'],
  sections: [
    {
      heading: { en: 'Up the keyboard', ru: 'Вверх по клавиатуре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Climb one chord through its positions, two octaves up and back: root, first, second, root. Keep the hand’s shape and move the arm.',
            ru: 'Поднимите аккорд по его положениям на две октавы и обратно: основной, первое, второе, основной. Форма руки та же, движется предплечье.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '| 1 3 5', hands: '| C4 E4 G4' },
            { symbol: 'C/E', degrees: '| 3 5 1', hands: '| E4 G4 C5' },
            { symbol: 'C/G', degrees: '| 5 1 3', hands: '| G4 C5 E5' },
            { symbol: 'C', degrees: '| 1 3 5', hands: '| C5 E5 G5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'A key in one position', ru: 'Тональность в одном положении' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the key’s chords up the scale, all in first inversion. The fingers stay 1-2-5 and the hand glides.',
            ru: 'Сыграйте аккорды тональности вверх по гамме, все секстаккордами. Пальцы остаются 1-2-5, рука скользит.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/E', degrees: '| 3 5 1', hands: '| E4 G4 C5' },
            { symbol: 'Dm/F', degrees: '| 3 5 1', hands: '| F4 A4 D5' },
            { symbol: 'Em/G', degrees: '| 3 5 1', hands: '| G4 B4 E5' },
            { symbol: 'F/A', degrees: '| 3 5 1', hands: '| A4 C5 F5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'One progression, three tops', ru: 'Один оборот, три верхних голоса' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play I – IV – V – I three times, starting from each position of I. The top note changes, so the melody on top changes too.',
            ru: 'Сыграйте I – IV – V – I трижды, начиная с каждого положения I. Верхний звук меняется, а с ним и мелодия сверху.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/E', degrees: '| 3 5 1', hands: '| E4 G4 C5' },
            { symbol: 'F', degrees: '| 1 3 5', hands: '| F4 A4 C5' },
            { symbol: 'G/D', degrees: '| 5 1 3', hands: '| D4 G4 B4' },
            { symbol: 'C/E', degrees: '| 3 5 1', hands: '| E4 G4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Broken inversions', ru: 'Разложенные обращения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Break each position into single notes, up and back. It trains the fingering and the ear at the same time.',
            ru: 'Разложите каждое положение на отдельные звуки, вверх и обратно. Это тренирует и пальцы, и слух одновременно.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 E4/8 G4/8 E4/8 E4/8 G4/8 C5/8 G4/8 G4/8 C5/8 E5/8 C5/8 C5/2',
        },
      ],
    },
    {
      heading: { en: 'Four positions of a 7th', ru: 'Четыре положения септаккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A 7th chord has a third inversion, with the 7th in the bass. G7/F falls a step to C/E.',
            ru: 'У септаккорда есть третье обращение — септима в басу. G7/F спускается на ступень к C/E.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'G7/F', degrees: '7 | 1 3 5', hands: 'F2 | G3 B3 D4' },
            { symbol: 'C/E', degrees: '3 | 5 1 3', hands: 'E2 | G3 C4 E4' },
          ],
        },
      ],
      takeaway: {
        en: 'The bass names the inversion: whatever is lowest decides it.',
        ru: 'Обращение определяет бас: решает самый нижний звук.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C major in second inversion, up from G.',
            ru: 'Сыграйте до мажор квартсекстаккордом вверх от соль.',
          },
          answer: { notes: ['G', 'C', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play D minor in first inversion, up from F.',
            ru: 'Сыграйте ре минор секстаккордом вверх от фа.',
          },
          answer: { notes: ['F', 'A', 'D'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'I – IV – V – I from the first inversion, round the circle',
            ru: 'I – IV – V – I от секстаккорда по кругу',
          },
          target: {
            opens: 'player',
            numerals: 'I IV V I',
            key: C_MAJOR,
            walk: 'fifths',
            inversion: 1,
          },
        },
        {
          kind: 'link',
          title: {
            en: 'I – IV – V – I from the second inversion, round the circle',
            ru: 'I – IV – V – I от квартсекстаккорда по кругу',
          },
          target: {
            opens: 'player',
            numerals: 'I IV V I',
            key: C_MAJOR,
            walk: 'fifths',
            inversion: 2,
          },
        },
        {
          kind: 'link',
          title: { en: 'Inversions on F in the Player', ru: 'Обращения от фа в плеере' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('F') },
        },
      ],
    },
  ],
}

export default inversionDrills
