import type { Lesson } from '../model/types'

const bassAndChords: Lesson = {
  id: 'bass-and-chords',
  title: { en: 'Bass and chords', ru: 'Бас и аккорды' },
  summary: {
    en: 'The two hands’ jobs when you accompany from chords, the nearest chord for the right hand, and the first ways to play a chart.',
    ru: 'Что делает каждая рука, когда вы аккомпанируете по аккордам, ближайший аккорд для правой руки и первые способы сыграть последовательность.',
  },
  level: 1,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'Two hands, two jobs', ru: 'Две руки — две задачи' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'To accompany from a chord chart, split each chord between your hands. The left hand plays the bass: the chord’s root, low on the keyboard. The right hand plays the chord itself near the middle, where it sounds full but leaves room for the singers.',
            ru: 'Чтобы аккомпанировать по аккордам, разделите каждый аккорд между руками. Левая рука играет бас — основной тон аккорда внизу клавиатуры. Правая играет сам аккорд в середине: там он звучит полно, но оставляет место поющим.',
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
          text: {
            en: 'Don’t jump the right hand from one root position to the next. Take the nearest inversion instead: keep the notes two chords share and move the others by the smallest step. From C E G, the nearest F is C F A (F/C) and the nearest G is B D G (G/B): the hand hardly moves, and the chords join smoothly.',
            ru: 'Не перескакивайте правой рукой из одного основного вида в другой. Берите ближайшее обращение: общие звуки двух аккордов оставьте на месте, остальные сдвиньте на ближайшую ступень. От до–ми–соль ближайший F — до–фа–ля (F/C), а ближайший G — си–ре–соль (G/B): рука почти не двигается, и аккорды связываются плавно.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F/C', 'G/B'] },
        {
          kind: 'link',
          title: { en: 'Inversions', ru: 'Обращения' },
          target: { place: 'lesson', lesson: 'inversions' },
        },
      ],
    },
    {
      heading: { en: 'Bass and chords', ru: 'Бас и аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The first of Called to Play’s five ways, and the steadiest: start every new chart with it.',
            ru: 'Первый из пяти способов Called to Play и самый ровный — с него начинайте любую новую последовательность.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'A dotted bass', ru: 'Пунктирный бас' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Way 5 keeps the right hand as it was and sets the bass going: it carries a march or a lively hymn forward.',
            ru: 'Пятый способ оставляет правую руку как была и приводит бас в движение — он ведёт вперёд марш или бодрый гимн.',
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
            en: 'Н. В. Боброва’s second type lets the two hands take turns instead of sounding together.',
            ru: 'Второй вид у Н. В. Бобровой даёт рукам звучать по очереди, а не вместе.',
          },
        },
        { kind: 'pattern', pattern: 'r2', piece: 'otche' },
        {
          kind: 'text',
          text: {
            en: 'Her third type turns it round: the right hand keeps going, and the bass comes in less often.',
            ru: 'Её третий вид делает наоборот: правая рука не останавливается, а бас вступает реже.',
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
            en: 'Play F major as an accompanist does: F low for the bass, the chord above it.',
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
          target: { place: 'piece', piece: 'ex3' },
        },
      ],
    },
  ],
}

export default bassAndChords
