import type { Lesson } from '../model/types'

/** Called to Play's lesson 5: the right hand's first two techniques, on its study and its song. */
const rightHandTechniques: Lesson = {
  id: 'right-hand-techniques',
  title: { en: 'Right-hand techniques: ♪♩ and ♪♪♪♪', ru: 'Техники правой руки: ♪♩ и ♪♪♪♪' },
  summary: {
    en: 'Called to Play, lesson 5: the right hand fills a chord while the left keeps the bass. A chord and octave jumps, and an arpeggio up two octaves.',
    ru: 'Called to Play, урок 5: правая рука заполняет аккорд, пока левая держит бас. Аккорд и скачки на октаву, арпеджио на две октавы вверх.',
  },
  level: 2,
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'The chord stays, the hand moves', ru: 'Аккорд тот же, рука движется' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A technique', ru: 'Техника' },
          text: {
            en: 'keeps the chord and gives the right hand something to play until the next change.',
            ru: 'не меняет аккорд, а даёт правой руке движение до следующей смены.',
          },
        },
        { kind: 'pattern', pattern: 't1', piece: 'ex5' },
        { kind: 'pattern', pattern: 't2', piece: 'ex5' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play Am – Dm – E – Am – F – C – Dm – E – Am with both techniques.',
              ru: 'Сыграйте Am – Dm – E – Am – F – C – Dm – E – Am обеими техниками.',
            },
            {
              en: 'Learn «All Glory to God in This World» with them.',
              ru: 'Выучите с ними «All Glory to God in This World».',
            },
          ],
        },
        { kind: 'chords', symbols: ['Am', 'Dm', 'E', 'Am', 'F', 'C', 'Dm', 'E', 'Am'] },
        {
          kind: 'link',
          title: { en: 'The lesson’s study', ru: 'Этюд урока' },
          target: { place: 'piece', piece: 'ex5' },
        },
        {
          kind: 'link',
          title: { en: 'All Glory to God in This World', ru: 'All Glory to God in This World' },
          target: { place: 'piece', piece: 'glory' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play E major, the chord that leads back to Am.',
            ru: 'Сыграйте ми мажор — аккорд, который ведёт обратно к Am.',
          },
          answer: { chord: 'E' },
        },
      ],
    },
  ],
}

export default rightHandTechniques
