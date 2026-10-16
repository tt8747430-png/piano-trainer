import type { Lesson } from '@/entities/lesson'

const fiveWays: Lesson = {
  id: 'five-ways',
  title: { en: 'The five ways', ru: 'Пять способов' },
  summary: {
    en: 'Play one progression five ways, one at a time, then change the way on every chord.',
    ru: 'Сыграйте одну последовательность пятью способами по очереди, затем меняйте способ на каждом аккорде.',
  },
  sections: [
    {
      heading: { en: 'Four chords of C major', ru: 'Четыре аккорда до мажора' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A progression', ru: 'Последовательность' },
          text: {
            en: 'is a row of chords played in order. This one uses four chords of C major.',
            ru: '— это ряд аккордов, сыгранных по порядку. Здесь их четыре, все из до мажора.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'G', 'C', 'F', 'C', 'G', 'C'] },
        {
          kind: 'note',
          text: {
            en: 'Play it as plain chords until the changes come easily. Every way below uses it.',
            ru: 'Играйте её простыми аккордами, пока смены не пойдут легко. Все способы ниже играют её.',
          },
        },
      ],
    },
    {
      heading: { en: 'Way 1: bass and chords', ru: 'Способ 1: бас и аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand holds the bass as an octave. The right hand plays the whole chord on every beat. Learn this one first.',
            ru: 'Левая рука держит бас октавой. Правая играет весь аккорд на каждую долю. Начните с этого способа.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Way 2: broken chords', ru: 'Способ 2: ломаные аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand still holds the octave. The right hand breaks the chord into eighths, rocking between its upper notes and its lowest.',
            ru: 'Левая рука по-прежнему держит октаву. Правая разбивает аккорд на восьмые и чередует его верхние звуки с нижним.',
          },
        },
        { kind: 'pattern', pattern: 'M2', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Way 3: an arpeggio', ru: 'Способ 3: арпеджио' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An arpeggio', ru: 'Арпеджио' },
          text: {
            en: 'plays a chord’s notes one after another. Here the left hand plays the root, 5th and octave (1–5–8). The right hand adds the 3rd, then holds the top notes.',
            ru: '— звуки аккорда по очереди. Здесь левая рука играет основной тон, квинту и октаву (1–5–8). Правая добавляет терцию и держит верхние звуки.',
          },
        },
        { kind: 'pattern', pattern: 'M3', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Way 4: up and down both hands', ru: 'Способ 4: вверх и вниз через обе руки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'One arpeggio in eighths climbs through the left hand, carries on in the right hand, and comes back down.',
            ru: 'Одно арпеджио восьмыми поднимается через левую руку, продолжается в правой и возвращается вниз.',
          },
        },
        { kind: 'pattern', pattern: 'M4', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Way 5, then all five mixed', ru: 'Способ 5 и все пять вместе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This is way 1 with a dotted bass. The left hand plays its octaves long, then short (♩. ♪).',
            ru: 'Это первый способ с пунктирным басом. Левая рука играет октавы долго, затем коротко (♩. ♪).',
          },
        },
        { kind: 'pattern', pattern: 'M5', piece: 'ex3' },
        {
          kind: 'note',
          text: {
            en: 'Once each way is easy, change the way from chord to chord, as these studies do.',
            ru: 'Когда каждый способ получается, меняйте способ от аккорда к аккорду, как в этих этюдах.',
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
      ],
    },
  ],
}

export default fiveWays
