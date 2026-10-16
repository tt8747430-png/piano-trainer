import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 1: why play by chords, a chord chart beside sheet music, and the C major triad. */
const playingByChords: Lesson = {
  id: 'playing-by-chords',
  title: { en: 'Introduction to chord playing', ru: 'Введение в игру аккордами' },
  summary: {
    en: 'Read a chord chart and play the C major triad.',
    ru: 'Читайте аккорды над словами и играйте трезвучие до мажор.',
  },
  sections: [
    {
      heading: { en: 'Chords over the words', ru: 'Аккорды над словами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A chord chart writes only the chords over the words. With it you can accompany any song, in any key.',
            ru: 'Аккордовая запись пишет над словами только аккорды. По ней можно аккомпанировать любой песне в любой тональности.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'C', 'G', 'C'] },
        {
          kind: 'link',
          title: { en: 'How Great Thou Art in the Player', ru: 'How Great Thou Art в плеере' },
          target: { opens: 'piece', piece: 'hgta' },
        },
      ],
    },
    {
      heading: { en: 'What is a chord?', ru: 'Что такое аккорд?' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord', ru: 'Аккорд' },
          text: {
            en: 'is three or more different notes sounding together. C, E and G make C major, a major triad.',
            ru: '— это одновременное звучание трёх или более разных звуков. До, ми и соль образуют до мажор — мажорное трезвучие.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play chords on C, D, E, F, G and A, white keys only.',
              ru: 'Сыграйте аккорды от C, D, E, F, G и A только на белых клавишах.',
            },
            {
              en: 'First each hand alone, then both together.',
              ru: 'Сначала каждой рукой отдельно, затем вместе.',
            },
            { en: 'Then play them in other octaves.', ru: 'Затем сыграйте их в других октавах.' },
          ],
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G', 'Am'], apart: true },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C major: C, E and G.', ru: 'Сыграйте до мажор: до, ми и соль.' },
          answer: { chord: 'C' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the chord on F, white keys only.',
            ru: 'Сыграйте аккорд от фа только на белых клавишах.',
          },
          answer: { chord: 'F' },
        },
      ],
    },
  ],
}

export default playingByChords
