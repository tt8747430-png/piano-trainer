import type { Lesson } from '../model/types'

const fiveWays: Lesson = {
  id: 'five-ways',
  title: { en: 'The five ways', ru: 'Пять способов' },
  summary: {
    en: 'Called to Play’s third lesson: one progression, five ways to play it, and then a new way on every chord.',
    ru: 'Третий урок Called to Play: одна последовательность, пять способов её сыграть, а затем новый способ на каждом аккорде.',
  },
  level: 1,
  category: 'accompaniment',
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'One progression', ru: 'Одна последовательность' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The lesson’s progression is C, Dm, G, C, F, C, G, C: four chords of C major. Play them in blocks first, until the changes come without thinking.',
            ru: 'Последовательность урока — C, Dm, G, C, F, C, G, C: четыре аккорда до мажора. Сначала играйте их целиком, пока смены не пойдут сами.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'G', 'F'] },
      ],
    },
    {
      heading: { en: 'The five ways', ru: 'Пять способов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each way keeps the same chords and changes what the hands do. Play them in order: each one moves a little more than the one before.',
            ru: 'Каждый способ сохраняет те же аккорды и меняет то, что делают руки. Играйте их по порядку: каждый движется чуть больше предыдущего.',
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
            en: 'Once each way is easy, the lesson’s studies write a different way over every chord, so the hands learn to change between them without stopping.',
            ru: 'Когда каждый способ получается, этюды урока ставят над каждым аккордом другой способ — руки учатся переходить между ними без остановки.',
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
