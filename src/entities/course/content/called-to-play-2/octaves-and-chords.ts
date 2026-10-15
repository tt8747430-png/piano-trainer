import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 2, «Октавы и аккорды»: octaves up the scale and by the chord, and chords that step. */
const octavesAndChords: Lesson = {
  id: 'octaves-and-chords',
  title: { en: 'Octaves and chords', ru: 'Октавы и аккорды' },
  summary: {
    en: 'Octaves in the right hand, up the scale and by the chord, and full chords that step.',
    ru: 'Октавы в правой руке — гаммой и по аккорду — и полные аккорды с движением.',
  },
  sections: [
    {
      heading: { en: 'An octave', ru: 'Октава' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'An octave',
            ru: 'Октава',
          },
          text: {
            en: 'is two notes of one name, eight steps apart, played together: C and C.',
            ru: '— это две одноимённые ноты через восемь ступеней, взятые одновременно: до и до.',
          },
        },
        { kind: 'pattern', pattern: 'octs', piece: 'zemlya' },
        {
          kind: 'note',
          text: {
            en: 'Keep the wrist loose and low. Black keys take the 4th finger most often.',
            ru: 'Кисть свободная, не поднимайте её высоко. Чёрные клавиши чаще всего берут 4-м пальцем.',
          },
        },
      ],
    },
    {
      heading: { en: 'Up the scale, or by the chord', ru: 'Гаммой или по аккорду' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Octaves go two ways: up the scale, step by step, or by the chord, on its 1st, 2nd, 3rd and 5th notes.',
            ru: 'Октавами играют двумя способами: гаммой, ступень за ступенью, или по аккорду — по его 1, 2, 3 и 5-й ступеням.',
          },
        },
        { kind: 'pattern', pattern: 'oct', piece: 'zemlya' },
      ],
    },
    {
      heading: { en: 'Chords', ru: 'Аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The chord takes its octave on top. Then its outer notes step up and come back.',
            ru: 'Аккорд берётся с октавой сверху. Затем его крайние звуки поднимаются на ступень и возвращаются.',
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
          ],
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'D', 'Dm', 'E', 'Em'], apart: true },
        {
          kind: 'link',
          title: {
            en: '«Пусть земля вся утверждает» in the Player',
            ru: '«Пусть земля вся утверждает» в плеере',
          },
          target: { opens: 'piece', piece: 'zemlya' },
        },
        {
          kind: 'link',
          title: {
            en: '«В небесах моя отчизна» in the Player',
            ru: '«В небесах моя отчизна» в плеере',
          },
          target: { opens: 'piece', piece: 'otchizna' },
        },
      ],
    },
  ],
}

export default octavesAndChords
