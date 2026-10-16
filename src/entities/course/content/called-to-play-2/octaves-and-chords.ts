import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 2, «Октавы и аккорды»: octaves up the scale and by the chord, and chords that step. */
const octavesAndChords: Lesson = {
  id: 'octaves-and-chords',
  title: { en: 'Octaves and chords', ru: 'Октавы и аккорды' },
  summary: {
    en: 'Play right-hand octaves up the scale and through the chord, then chords whose outer notes step.',
    ru: 'Играйте октавы правой рукой по гамме и по аккорду, затем аккорды, у которых шагают крайние звуки.',
  },
  sections: [
    {
      heading: { en: 'Octaves up the scale', ru: 'Октавы по гамме' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An octave', ru: 'Октава' },
          text: {
            en: 'is two notes of the same name, eight steps apart, played together. Here they climb the scale.',
            ru: '— это две одноимённые ноты через восемь ступеней, взятые вместе. Здесь октавы идут вверх по гамме.',
          },
        },
        { kind: 'pattern', pattern: 'octs', piece: 'zemlya' },
        {
          kind: 'note',
          text: {
            en: 'Keep the wrist loose and low. Black keys usually take the 4th finger.',
            ru: 'Кисть свободная, не поднимайте её высоко. Чёрные клавиши чаще всего берут 4-м пальцем.',
          },
        },
      ],
    },
    {
      heading: { en: 'Octaves through the chord', ru: 'Октавы по аккорду' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The octaves can also follow the chord’s figure 1–2–3–5 instead of the whole scale.',
            ru: 'Октавы могут идти и по фигуре аккорда 1–2–3–5 вместо всей гаммы.',
          },
        },
        { kind: 'pattern', pattern: 'oct', piece: 'zemlya' },
      ],
    },
    {
      heading: { en: 'Chords that step', ru: 'Шагающие аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the chord with its octave on top. Then move its outer notes up a step and bring them back.',
            ru: 'Возьмите аккорд с октавой сверху. Затем поднимите его крайние звуки на ступень и верните обратно.',
          },
        },
        { kind: 'pattern', pattern: 'chd', piece: 'zemlya' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play octaves and chords on every white key, major and minor.',
              ru: 'Играйте октавы и аккорды от всех белых клавиш, мажорные и минорные.',
            },
            {
              en: 'Then play both songs with them.',
              ru: 'Затем сыграйте с ними обе песни.',
            },
          ],
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'D', 'Dm', 'E', 'Em'], apart: true },
        {
          kind: 'link',
          title: {
            en: '“Пусть земля вся утверждает” in the Player',
            ru: '«Пусть земля вся утверждает» в плеере',
          },
          target: { opens: 'piece', piece: 'zemlya' },
        },
        {
          kind: 'link',
          title: {
            en: '“В небесах моя отчизна” in the Player',
            ru: '«В небесах моя отчизна» в плеере',
          },
          target: { opens: 'piece', piece: 'otchizna' },
        },
      ],
    },
  ],
}

export default octavesAndChords
