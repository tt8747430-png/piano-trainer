import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 9, «Виды игры для левой руки»: ten ways under a tune the right hand plays. */
const leftHandWays: Lesson = {
  id: 'left-hand-ways',
  title: { en: 'Left-hand ways', ru: 'Виды игры для левой руки' },
  summary: {
    en: 'Play the tune in the right hand and accompany it with the left hand alone.',
    ru: 'Играйте мелодию правой рукой и аккомпанируйте ей одной левой.',
  },
  sections: [
    {
      heading: { en: 'Tune on the right, chords on the left', ru: 'Мелодия справа, аккорды слева' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now the right hand plays the tune and the left hand plays the chords. The bass can be an octave, or one note in its place.',
            ru: 'Теперь правая рука играет мелодию, а левая — аккорды. Бас может быть октавой или одной нотой вместо неё.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'skala' },
      ],
    },
    {
      heading: { en: 'Bass and chord', ru: 'Бас и аккорд' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Way 1: bass, chord, bass, chord, in quarters.',
              ru: 'Вид 1: бас, аккорд, бас, аккорд — четвертями.',
            },
            {
              en: 'Way 3: the bass long, then short, under chords in quarters.',
              ru: 'Вид 3: бас долго, затем коротко, под аккордами четвертями.',
            },
            {
              en: 'Way 4: the bass held three beats, then struck again.',
              ru: 'Вид 4: бас выдержан три доли, затем берётся снова.',
            },
          ],
        },
        { kind: 'pattern', pattern: 'M5', piece: 'kryl' },
      ],
    },
    {
      heading: { en: 'Arpeggios that climb', ru: 'Восходящие арпеджио' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Ways 5 to 7 climb the chord in eighths: 1–5–8–10, then on to the 12th and the 15th. Here they are on C.',
            ru: 'Виды 5–7 поднимаются по аккорду восьмыми: 1–5–8–10, затем к 12-й и 15-й ступеням. Здесь они от до.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C2/8 G2/8 C3/8 E3/8 G3/2' },
        { kind: 'notes', clef: 'bass', notes: 'C2/8 G2/8 C3/8 E3/8 G3/4 E3/4' },
        { kind: 'notes', clef: 'bass', notes: 'C2/8 G2/8 C3/8 E3/8 G3/8 C4/8 G3/8 E3/8' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play each way with the left hand alone over this row of chords.',
              ru: 'Играйте каждый вид одной левой рукой по этой цепочке аккордов.',
            },
            {
              en: 'Then play three songs with the tune in the right hand and the chords in the left.',
              ru: 'Затем сыграйте три песни: мелодия в правой руке, аккорды в левой.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm', 'C', 'B♭', 'F', 'Gm', 'A', 'Dm'] },
        {
          kind: 'link',
          title: {
            en: '“Бог посылает всё для нас” in the Player',
            ru: '«Бог посылает всё для нас» в плеере',
          },
          target: { opens: 'piece', piece: 'posylaet' },
        },
        {
          kind: 'link',
          title: {
            en: '“Дерзновение, упование” in the Player',
            ru: '«Дерзновение, упование» в плеере',
          },
          target: { opens: 'piece', piece: 'derznovenie' },
        },
        {
          kind: 'link',
          title: {
            en: '“Один построил свой дом на скале” in the Player',
            ru: '«Один построил свой дом на скале» в плеере',
          },
          target: { opens: 'piece', piece: 'skala' },
        },
      ],
    },
  ],
}

export default leftHandWays
