import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 4, its practical lesson: three songs played by their plan. */
const songsByPlan: Lesson = {
  id: 'songs-by-plan',
  title: { en: 'Songs by their plan', ru: 'Песни по плану' },
  summary: {
    en: 'Read a song’s plan, where each chord’s number names its way, and play three songs by it.',
    ru: 'Читайте план песни, где цифра у аккорда называет способ, и сыграйте по нему три песни.',
  },
  sections: [
    {
      heading: { en: 'A number names the way', ru: 'Цифра называет способ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A plan', ru: 'План' },
          text: {
            en: 'is a song’s chords with a number by each one. The number is the way to play that chord: C1 means C in way 1.',
            ru: '— это аккорды песни с цифрой у каждого. Цифра означает способ, которым играть аккорд: C1 — это C первым способом.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'hgta' },
      ],
    },
    {
      heading: { en: 'Two chords in one bar', ru: 'Два аккорда в одном такте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Two chords joined by a dash share one bar, two beats each. C – G means two beats of C, then two of G.',
            ru: 'Два аккорда через тире делят один такт, по две доли каждый. C – G: две доли C, затем две доли G.',
          },
        },
        { kind: 'chords', symbols: ['C', 'G'] },
      ],
    },
    {
      heading: { en: 'How to practise', ru: 'Как заниматься' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Choose a slow tempo.', ru: 'Выберите медленный темп.' },
            {
              en: 'Join the chords with no gap between them. This is called legato.',
              ru: 'Соединяйте аккорды без разрывов. Это называется легато.',
            },
            {
              en: 'Keep one even volume, mf (moderately loud), with no sudden changes.',
              ru: 'Держите ровную громкость, mf (умеренно громко), без резких перепадов.',
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
            en: 'Learn each song by its plan. The Player plays every chord the way its number says, so you can hear it first.',
            ru: 'Выучите каждую песню по плану. Плеер играет каждый аккорд тем способом, который называет цифра, и его можно сначала послушать.',
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
