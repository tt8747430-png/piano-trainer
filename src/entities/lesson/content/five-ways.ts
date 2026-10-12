import type { Lesson } from '../model/types'

const fiveWays: Lesson = {
  id: 'five-ways',
  title: { en: 'The five ways', ru: 'Пять способов' },
  summary: {
    en: 'Lesson 3 of Called to Play: one progression played five ways, then a different way on each chord.',
    ru: 'Третий урок Called to Play: одна последовательность пятью способами, затем свой способ на каждом аккорде.',
  },
  level: 1,
  category: 'accompaniment',
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'Four chords of C major', ru: 'Четыре аккорда до мажора' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A progression', ru: 'Последовательность' },
          text: {
            en: 'is a series of chords played in order. This lesson’s is C, Dm, G, C, F, C, G, C.',
            ru: '— это аккорды, которые играют друг за другом. В этом уроке она такая: C, Dm, G, C, F, C, G, C.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'It uses four chords of C major. Tap them below: each moves to the next by the nearest keys.',
            ru: 'В ней четыре аккорда до мажора. Нажмите их ниже: каждый переходит в следующий по ближайшим клавишам.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'G', 'F'] },
        {
          kind: 'text',
          text: {
            en: 'Play the progression in blocks first, every note of a chord together. Repeat it until the changes come without thinking.',
            ru: 'Сначала играйте последовательность целыми аккордами, все звуки вместе. Повторяйте, пока смены не пойдут сами.',
          },
        },
      ],
    },
    {
      heading: { en: 'Same chords, five ways', ru: 'Те же аккорды, пять способов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each way plays the same chords. Only what the hands do changes.',
            ru: 'Каждый способ играет те же аккорды. Меняется только то, что делают руки.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Take them in order: each one changes what one hand does. Listen to each way below, then play it.',
            ru: 'Берите их по порядку: каждый меняет партию одной руки. Послушайте каждый способ ниже, затем сыграйте его.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M2', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M3', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M4', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M5', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'A new way on every chord', ru: 'Новый способ на каждом аккорде' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Once each way is easy, switch ways from chord to chord. The lesson’s studies write a different way over every chord.',
            ru: 'Когда все способы получаются, меняйте их от аккорда к аккорду. В этюдах урока над каждым аккордом стоит свой способ.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Play the studies below. The hands learn to change ways without stopping.',
            ru: 'Сыграйте этюды ниже. Так руки учатся менять способ без остановки.',
          },
        },
        {
          kind: 'link',
          title: {
            en: 'A new way on every chord, in C',
            ru: 'Новый способ на каждом аккорде, до мажор',
          },
          target: { place: 'piece', piece: 'exm1' },
        },
        {
          kind: 'link',
          title: {
            en: 'A new way on every chord, in A minor',
            ru: 'Новый способ на каждом аккорде, ля минор',
          },
          target: { place: 'piece', piece: 'exm2' },
        },
        {
          kind: 'link',
          title: {
            en: 'A new way on every chord, in D minor',
            ru: 'Новый способ на каждом аккорде, ре минор',
          },
          target: { place: 'piece', piece: 'exm3' },
        },
      ],
    },
    {
      heading: { en: 'More on each way', ru: 'Подробнее о каждом способе' },
      blocks: [
        {
          kind: 'link',
          title: { en: 'Bass and chords', ru: 'Бас и аккорды' },
          target: { place: 'lesson', lesson: 'bass-and-chords' },
        },
        {
          kind: 'link',
          title: { en: 'Broken chords and arpeggios', ru: 'Ломаные аккорды и арпеджио' },
          target: { place: 'lesson', lesson: 'broken-chords' },
        },
      ],
    },
  ],
}

export default fiveWays
