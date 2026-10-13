import type { Lesson } from '../model/types'

const bassAndChords: Lesson = {
  id: 'bass-and-chords',
  title: { en: 'Bass and chords', ru: 'Бас и аккорды' },
  summary: {
    en: 'What each hand plays from chords, the nearest chord, and the first ways to play.',
    ru: 'Что играет каждая рука по аккордам, ближайший аккорд и первые способы игры.',
  },
  level: 1,
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'Two hands, two jobs', ru: 'Две руки — две задачи' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'From a chord chart,', ru: 'По аккордовой записи' },
          text: {
            en: 'split each chord: the left hand plays its root low, the right hand the chord near the middle.',
            ru: 'разделите каждый аккорд: левая рука берёт его основной тон внизу, правая — сам аккорд в середине.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
      ],
    },
    {
      heading: { en: 'The nearest chord', ru: 'Ближайший аккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'is the same chord with another note at the bottom. Take the nearest one: keep shared notes, move the rest by the smallest step.',
            ru: '— тот же аккорд с другой нотой внизу. Берите ближайшее: общие ноты оставьте, остальные сдвиньте на ближайшую ступень.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F/C', 'G/B'] },
        {
          kind: 'link',
          title: { en: 'Inversions', ru: 'Обращения' },
          target: { opens: 'lesson', lesson: 'inversions' },
        },
      ],
    },
    {
      heading: { en: 'Way 1: bass and chords', ru: 'Способ 1: бас и аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Called to Play’s first way is the steadiest of its five. Start every new chart with it.',
            ru: 'Первый из пяти способов Called to Play — самый ровный. С него начинайте любую новую последовательность.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Way 5: a dotted bass', ru: 'Способ 5: пунктирный бас' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Way 5 keeps the right hand as it was and sets the bass moving. It carries a march or a lively hymn forward.',
            ru: 'Пятый способ оставляет правую руку как была, а бас приводит в движение. Он ведёт вперёд марш или бодрый гимн.',
          },
        },
        { kind: 'pattern', pattern: 'M5', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Bass and chord in turn', ru: 'Бас и аккорд по очереди' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In Н. В. Боброва’s second type, the hands take turns instead of sounding together.',
            ru: 'Во втором виде у Н. В. Бобровой руки звучат по очереди, а не вместе.',
          },
        },
        { kind: 'pattern', pattern: 'r2', piece: 'otche' },
        {
          kind: 'text',
          text: {
            en: 'Her third type turns it round. The right hand keeps going, and the bass comes in less often.',
            ru: 'Её третий вид — наоборот. Правая рука не останавливается, а бас вступает реже.',
          },
        },
        { kind: 'pattern', pattern: 'r3', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play F major as an accompanist does: a low F in the bass, the chord above it.',
            ru: 'Сыграйте фа мажор, как аккомпаниатор: внизу бас фа, над ним аккорд.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: {
            en: 'Lesson 3’s progression in the Player',
            ru: 'Последовательность урока 3 в плеере',
          },
          target: { opens: 'piece', piece: 'ex3' },
        },
      ],
    },
  ],
}

export default bassAndChords
