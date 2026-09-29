import type { Lesson } from '../model/types'

const brokenChords: Lesson = {
  id: 'broken-chords',
  title: { en: 'Broken chords and arpeggios', ru: 'Ломаные аккорды и арпеджио' },
  summary: {
    en: 'A chord played a note at a time: broken in one hand, climbing through both, and the figuration churches use most.',
    ru: 'Аккорд по одному звуку: ломаный в одной руке, поднимающийся через обе и фигурация, которую в церкви играют чаще всего.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'Broken, not struck', ru: 'Не ударом, а по звукам' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A chord need not be struck all at once. Played a note at a time, it keeps moving between the words and fills a slow song without getting louder. In way 2 the left hand holds the octave while the right hand rocks between the chord’s upper two notes and its root in 8ths.',
            ru: 'Аккорд не обязательно брать разом. Сыгранный по звукам, он движется между словами и заполняет медленную песню, не становясь громче. Во втором способе левая рука держит октаву, а правая восьмыми чередует два верхних звука аккорда и основной тон.',
          },
        },
        { kind: 'pattern', pattern: 'M2', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Arpeggios through both hands', ru: 'Арпеджио через обе руки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'An arpeggio climbs the chord across both hands. In way 3 the left hand plays root, 5th and octave (1–5–8), and the right hand goes on with the 3rd and holds the 5th and octave. In way 4 the arpeggio runs up through both hands and comes back down, all in 8ths.',
            ru: 'Арпеджио поднимается по аккорду через обе руки. В третьем способе левая рука играет основной тон, квинту и октаву (1–5–8), а правая продолжает терцией и держит квинту с октавой. В четвёртом арпеджио поднимается через обе руки и возвращается вниз, всё восьмыми.',
          },
        },
        { kind: 'pattern', pattern: 'M3', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M4', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Harmonic figuration', ru: 'Гармоническая фигурация' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Боброва’s fourth type is the one used most in church: the left hand’s 1–5–8 passes into the right hand, which plays the chord’s notes in a turning order. It moves and sings at once.',
            ru: 'Четвёртый вид у Бобровой — самый употребительный в церкви: 1–5–8 левой руки переходит в правую, которая играет звуки аккорда в переменном порядке. Он одновременно движется и поёт.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Two octaves up', ru: 'Вверх на две октавы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Called to Play’s second right-hand technique runs the arpeggio 1–3–5–8 up two octaves, fingers 1–2–3–5, over the left hand’s octave.',
            ru: 'Вторая техника правой руки из Called to Play ведёт арпеджио 1–3–5–8 вверх на две октавы, пальцами 1–2–3–5, над октавой левой руки.',
          },
        },
        { kind: 'pattern', pattern: 't2', piece: 'ex5' },
        {
          kind: 'note',
          text: {
            en: 'Hold the bass through the bar, with the pedal if you use it, changing it with each chord: the broken notes then sound as one chord.',
            ru: 'Держите бас весь такт — педалью, если играете с ней, меняя её с каждым аккордом: тогда ломаные звуки сольются в один аккорд.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Choose the notes A minor’s arpeggio climbs.',
            ru: 'Выберите звуки, по которым поднимается арпеджио ля минора.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'link',
          title: { en: 'The seven types of accompaniment', ru: 'Семь видов аккомпанемента' },
          target: { place: 'lesson', lesson: 'seven-types' },
        },
      ],
    },
  ],
}

export default brokenChords
