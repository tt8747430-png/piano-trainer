import type { Lesson } from '../model/types'

/** Called to Play's lesson 4, its practical lesson: three songs played by their plan. */
const songsByPlan: Lesson = {
  id: 'songs-by-plan',
  title: { en: 'Songs by their plan', ru: 'Песни по плану' },
  summary: {
    en: 'Three songs played by their plan, the number by each chord naming its way.',
    ru: 'Три песни по плану — цифра у аккорда называет способ.',
  },
  level: 1,
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'A number names the way', ru: 'Цифра называет способ' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In the book’s songs, the number by a chord is the way to play it: C1 is C played the first way.',
            ru: 'В песнях книги цифра у аккорда — это способ его сыграть: C1 — это C первым способом.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'hgta' },
        {
          kind: 'link',
          title: { en: 'The five ways', ru: 'Пять способов' },
          target: { opens: 'lesson', lesson: 'five-ways' },
        },
      ],
    },
    {
      heading: { en: 'Two chords in a bar', ru: 'Два аккорда в такте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Chords joined by a dash share a bar, two beats each: C – G.',
            ru: 'Аккорды через тире делят такт, по две доли: C – G.',
          },
        },
        { kind: 'chords', symbols: ['C', 'G'] },
      ],
    },
    {
      heading: { en: 'Slow, joined and soft', ru: 'Медленно, связно и мягко' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Practise at a slow tempo.', ru: 'Занимайтесь в медленном темпе.' },
            {
              en: 'Join every chord without a break: legato.',
              ru: 'Соединяйте аккорды без разрывов: легато.',
            },
            {
              en: 'Keep the volume even, mf, with no sudden changes.',
              ru: 'Держите ровную громкость, mf, без резких перепадов.',
            },
          ],
        },
        { kind: 'pattern', pattern: 'M5', piece: 'hgta' },
      ],
    },
    {
      heading: { en: 'The songs', ru: 'Песни' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Learn each song by its plan. The Player plays every chord the way its number says.',
            ru: 'Выучите каждую песню по плану. Плеер играет каждый аккорд тем способом, который называет цифра.',
          },
        },
        { kind: 'pattern', pattern: 'M2', piece: 'nojs' },
        {
          kind: 'link',
          title: { en: 'How Great Thou Art', ru: 'How Great Thou Art' },
          target: { opens: 'piece', piece: 'hgta' },
        },
        {
          kind: 'link',
          title: { en: 'The Name of Jesus Is So Sweet', ru: 'The Name of Jesus Is So Sweet' },
          target: { opens: 'piece', piece: 'nojs' },
        },
        {
          kind: 'link',
          title: { en: 'What a Friend We Have in Jesus', ru: 'What a Friend We Have in Jesus' },
          target: { opens: 'piece', piece: 'friend' },
        },
      ],
    },
  ],
}

export default songsByPlan
