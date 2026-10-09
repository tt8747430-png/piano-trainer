import type { Lesson } from '../model/types'

const rightHandTechniques: Lesson = {
  id: 'right-hand-techniques',
  title: { en: 'Right-hand techniques', ru: 'Техники правой руки' },
  summary: {
    en: 'Called to Play’s ways to decorate a chord while the left hand keeps the bass, each on its own lesson’s study.',
    ru: 'Приёмы Called to Play, которые украшают аккорд, пока левая рука держит бас, — каждый на этюде своего урока.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'Decorating a chord', ru: 'Украшение аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each technique keeps the chord and gives the right hand something to do between its changes. The book teaches them two or three a lesson: play the lesson’s study with each in turn, then learn its song with them. It gathers all twelve in one table to lay beside a song’s chords, to see at a glance what to add or swap in.',
            ru: 'Каждая техника сохраняет аккорд и даёт правой руке занятие между сменами. Учебник даёт их по две-три за урок: сыграйте этюд урока каждой по очереди, затем выучите с ними песню урока. Все двенадцать он собирает в одну таблицу, которую кладут рядом с аккордами песни, чтобы сразу видеть, что добавить или чем заменить.',
          },
        },
      ],
    },
    {
      heading: { en: 'Lesson 5: ♪♩ and ♪♪♪♪', ru: 'Урок 5: ♪♩ и ♪♪♪♪' },
      blocks: [
        { kind: 'pattern', pattern: 't1', piece: 'ex5' },
        { kind: 'pattern', pattern: 't2', piece: 'ex5' },
        {
          kind: 'link',
          title: { en: 'All Glory to God in This World', ru: 'All Glory to God in This World' },
          target: { place: 'piece', piece: 'glory' },
        },
      ],
    },
    {
      heading: { en: 'Lesson 6: runs down and up', ru: 'Урок 6: пассажи вниз и вверх' },
      blocks: [
        { kind: 'pattern', pattern: 't3', piece: 'ex6' },
        { kind: 'pattern', pattern: 't4', piece: 'ex6' },
        {
          kind: 'link',
          title: { en: 'What a Fellowship', ru: 'What a Fellowship' },
          target: { place: 'piece', piece: 'fellow' },
        },
      ],
    },
    {
      heading: {
        en: 'Lesson 7: chords up the keyboard',
        ru: 'Урок 7: аккорды вверх по клавиатуре',
      },
      blocks: [
        { kind: 'pattern', pattern: 't5', piece: 'ex7' },
        { kind: 'pattern', pattern: 'c3', piece: 'ex7' },
        { kind: 'pattern', pattern: 'inv', piece: 'ex7' },
        {
          kind: 'link',
          title: {
            en: 'For Love, For Mercy, For Salvation',
            ru: 'For Love, For Mercy, For Salvation',
          },
          target: { place: 'piece', piece: 'mercy' },
        },
      ],
    },
    {
      heading: { en: 'Lesson 8: 5.1, 5.2 and 5.3', ru: 'Урок 8: 5.1, 5.2 и 5.3' },
      blocks: [
        { kind: 'pattern', pattern: 'p51', piece: 'ex8' },
        { kind: 'pattern', pattern: 'p52', piece: 'ex8' },
        { kind: 'pattern', pattern: 'p53', piece: 'ex8' },
        {
          kind: 'link',
          title: { en: 'Heaven Awaits Me', ru: 'Heaven Awaits Me' },
          target: { place: 'piece', piece: 'heaven' },
        },
      ],
    },
    {
      heading: { en: 'Lesson 9: sixths', ru: 'Урок 9: сексты' },
      blocks: [
        { kind: 'pattern', pattern: 's6u', piece: 'ex9' },
        { kind: 'pattern', pattern: 's6d', piece: 'ex9' },
        {
          kind: 'link',
          title: { en: 'Face to Face with Christ', ru: 'Face to Face with Christ' },
          target: { place: 'piece', piece: 'face' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the sixth from E up to C.',
            ru: 'Сыграйте сексту от ми вверх до до.',
          },
          answer: { notes: ['E', 'C'] },
        },
      ],
    },
  ],
}

export default rightHandTechniques
