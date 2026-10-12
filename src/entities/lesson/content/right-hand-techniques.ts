import type { Lesson } from '../model/types'

const rightHandTechniques: Lesson = {
  id: 'right-hand-techniques',
  title: { en: 'Right-hand techniques', ru: 'Техники правой руки' },
  summary: {
    en: 'Called to Play’s ways to fill a chord while the left hand keeps the bass. Each comes with its lesson’s study.',
    ru: 'Приёмы Called to Play, которые заполняют аккорд, пока левая рука держит бас. Каждый — на этюде своего урока.',
  },
  level: 2,
  category: 'accompaniment',
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
            ru: 'не меняет аккорд. Она даёт правой руке движение до следующей смены.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The book teaches two or three techniques a lesson. Learn them this way:',
            ru: 'Учебник даёт две-три техники за урок. Осваивайте их так:',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play the lesson’s study with each technique in turn.',
              ru: 'Сыграйте этюд урока каждой техникой по очереди.',
            },
            {
              en: 'Then learn the lesson’s song with them.',
              ru: 'Затем выучите с ними песню урока.',
            },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'The book also gathers all twelve in one table. Lay it beside a song’s chords to see at a glance what to add or swap in.',
            ru: 'Все двенадцать учебник собирает в одну таблицу. Положите её рядом с аккордами песни. Сразу видно, что добавить или чем заменить.',
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
        {
          kind: 'text',
          lead: { en: 'A sixth', ru: 'Секста' },
          text: {
            en: 'spans six letter names, counting both ends: E up to C is a sixth. These techniques move sixths up or down the scale.',
            ru: 'охватывает шесть ступеней, считая обе крайние: от ми вверх до до. Эти техники ведут сексты вверх или вниз по гамме.',
          },
        },
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
            en: 'Play the sixth from E up to C: E, then the C above it.',
            ru: 'Сыграйте сексту ми–до: сначала ми, затем до над ней.',
          },
          answer: { notes: ['E', 'C'], rising: true },
        },
      ],
    },
  ],
}

export default rightHandTechniques
