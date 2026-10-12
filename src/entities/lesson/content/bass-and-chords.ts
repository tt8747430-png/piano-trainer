import type { Lesson } from '../model/types'

const bassAndChords: Lesson = {
  id: 'bass-and-chords',
  title: { en: 'Bass and chords', ru: 'Бас и аккорды' },
  summary: {
    en: 'What each hand plays from chords, the nearest chord for the right hand, and the first ways to play.',
    ru: 'Что играет каждая рука в аккомпанементе по аккордам, ближайший аккорд для правой руки и первые способы сыграть последовательность.',
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
            en: 'A chord chart writes a song’s chord symbols over its words. To accompany from it, split each chord between your hands.',
            ru: 'В аккордовой записи буквенные обозначения аккордов стоят над словами песни. Чтобы аккомпанировать по ней, разделите каждый аккорд между руками.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'The left hand plays the bass: the chord’s root, low on the keyboard.',
              ru: 'Левая рука играет бас — основной тон аккорда внизу клавиатуры.',
            },
            {
              en: 'The right hand plays the chord itself near the middle. There it sounds full but leaves room for the singers.',
              ru: 'Правая играет сам аккорд в середине клавиатуры. Там он звучит полно и оставляет место поющим.',
            },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Tap C, F and G below to hear the right hand’s part.',
            ru: 'Нажмите C, F и G ниже — это партия правой руки.',
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
            en: 'Do not jump the right hand so that every chord starts on its root. Take the nearest inversion instead.',
            ru: 'Не перескакивайте правой рукой так, чтобы каждый аккорд начинался с основного тона. Берите ближайшее обращение.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'is the same chord with another of its notes at the bottom.',
            ru: '— тот же аккорд, но внизу у него звучит другая нота.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Keep the notes two chords share where they are.',
              ru: 'Общие ноты двух аккордов оставьте на месте.',
            },
            {
              en: 'Move the other notes by the smallest step.',
              ru: 'Остальные сдвиньте на ближайшую ступень.',
            },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'From C E G, the nearest F is C F A (F/C). The nearest G is B D G (G/B).',
            ru: 'От до–ми–соль ближайший F — до–фа–ля (F/C). Ближайший G — си–ре–соль (G/B).',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Play the row below: the hand hardly moves, and the chords join smoothly.',
            ru: 'Сыграйте ряд ниже: рука почти не двигается, и аккорды связываются плавно.',
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
          target: { place: 'piece', piece: 'ex3' },
        },
      ],
    },
  ],
}

export default bassAndChords
