import type { Lesson } from '../model/types'

const fiveWays: Lesson = {
  id: 'five-ways',
  title: { en: 'The five ways', ru: 'Пять способов' },
  summary: {
    en: 'Lesson 3 of Called to Play: one progression played five ways, then a different way on each chord.',
    ru: 'Третий урок Called to Play: одна последовательность пятью способами, затем свой способ на каждом аккорде.',
  },
  level: 1,
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'Four chords of C major', ru: 'Четыре аккорда до мажора' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A progression', ru: 'Последовательность' },
          text: {
            en: 'is a series of chords played in order. This one uses four chords of C major.',
            ru: '— аккорды, которые играют друг за другом. Здесь их четыре, все из до мажора.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'G', 'C', 'F', 'C', 'G', 'C'] },
        {
          kind: 'note',
          text: {
            en: 'Play it in blocks, all notes together, until the changes come without thinking.',
            ru: 'Играйте её целыми аккордами, пока смены не пойдут сами.',
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
            en: 'Each way plays the same chords and changes what one hand does. Take them in order.',
            ru: 'Каждый способ играет те же аккорды и меняет партию одной руки. Берите их по порядку.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M2', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M3', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M4', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M5', piece: 'ex3' },
        {
          kind: 'text',
          text: {
            en: 'Once each way is easy, switch ways from chord to chord, as these studies do.',
            ru: 'Когда все способы получаются, меняйте их от аккорда к аккорду, как в этих этюдах.',
          },
        },
        {
          kind: 'link',
          title: {
            en: 'A new way on every chord, in C',
            ru: 'Новый способ на каждом аккорде, до мажор',
          },
          target: { opens: 'piece', piece: 'exm1' },
        },
        {
          kind: 'link',
          title: {
            en: 'A new way on every chord, in A minor',
            ru: 'Новый способ на каждом аккорде, ля минор',
          },
          target: { opens: 'piece', piece: 'exm2' },
        },
        {
          kind: 'link',
          title: {
            en: 'A new way on every chord, in D minor',
            ru: 'Новый способ на каждом аккорде, ре минор',
          },
          target: { opens: 'piece', piece: 'exm3' },
        },
        {
          kind: 'link',
          title: { en: 'Bass and chords', ru: 'Бас и аккорды' },
          target: { opens: 'lesson', lesson: 'bass-and-chords' },
        },
        {
          kind: 'link',
          title: { en: 'Broken chords and arpeggios', ru: 'Ломаные аккорды и арпеджио' },
          target: { opens: 'lesson', lesson: 'broken-chords' },
        },
      ],
    },
  ],
}

export default fiveWays
