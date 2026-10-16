import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 1: why play by chords, a chord chart beside sheet music, and the C major triad. */
const playingByChords: Lesson = {
  id: 'playing-by-chords',
  title: { en: 'Introduction to chord playing', ru: 'Введение в игру аккордами' },
  summary: {
    en: 'Read a chord chart, build a triad and play C major.',
    ru: 'Читайте аккорды над словами, стройте трезвучие и играйте до мажор.',
  },
  sections: [
    {
      heading: { en: 'Chords over the words', ru: 'Аккорды над словами' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord chart', ru: 'Аккордовая запись' },
          text: {
            en: 'prints only the chord names above a song’s words. You make up the accompaniment from them, so one chart lets you play any song in any key.',
            ru: 'показывает над словами песни только названия аккордов. Аккомпанемент вы строите по ним сами, поэтому так можно играть любую песню в любой тональности.',
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
      heading: { en: 'What a chord is', ru: 'Что такое аккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord', ru: 'Аккорд' },
          text: {
            en: 'is three or more different notes played together. Three notes make a triad: C, E and G make C major.',
            ru: '— это три или больше разных звука, взятых вместе. Аккорд из трёх звуков называется трезвучием. До, ми и соль дают до мажор.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
        {
          kind: 'note',
          text: {
            en: 'Play every other white key: C, skip D, E, skip F, G.',
            ru: 'На клавиатуре до мажор берётся через клавишу: до, ре пропустить, ми, фа пропустить, соль.',
          },
        },
      ],
    },
    {
      heading: {
        en: 'The same shape on every white key',
        ru: 'Та же форма от каждой белой клавиши',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the shape of every other white key and start it on C, D, E, F, G and A.',
            ru: 'Сохраняйте форму «через клавишу» и стройте её от до, ре, ми, фа, соль и ля.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G', 'Am'], apart: true },
        {
          kind: 'steps',
          steps: [
            { en: 'Right hand alone, then left hand alone.', ru: 'Правой рукой, затем левой.' },
            {
              en: 'Then both hands, in other octaves too.',
              ru: 'Затем двумя руками, в том числе в других октавах.',
            },
          ],
        },
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
