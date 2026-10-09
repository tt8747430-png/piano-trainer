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
            en: 'A chord need not be struck all at once. Played a note at a time, it keeps moving between the words and fills a slow song without getting louder. Called to Play’s second way is the first step.',
            ru: 'Аккорд не обязательно брать разом. Сыгранный по звукам, он движется между словами и заполняет медленную песню, не становясь громче. Второй способ Called to Play — первый шаг.',
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
            en: 'An arpeggio climbs the chord across both hands, one line passed from the left into the right: Called to Play’s third and fourth ways.',
            ru: 'Арпеджио поднимается по аккорду через обе руки, одной линией из левой в правую: третий и четвёртый способы Called to Play.',
          },
        },
        { kind: 'pattern', pattern: 'M3', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M4', piece: 'ex3' },
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
      heading: { en: 'Harmonic figuration', ru: 'Гармоническая фигурация' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Боброва’s fourth type passes the arpeggio from hand to hand too, and turns it back on itself in the right hand.',
            ru: 'Четвёртый вид у Бобровой тоже передаёт арпеджио из руки в руку, а в правой поворачивает его назад.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
        {
          kind: 'text',
          text: {
            en: 'Its broken arpeggio turns the other way: the right hand steps 1–3–2–3 through the chord, so the figure rocks instead of climbing.',
            ru: 'Её ломаное арпеджио поворачивает иначе: правая рука идёт по аккорду 1–3–2–3, и фигура покачивается, а не поднимается.',
          },
        },
        { kind: 'pattern', pattern: 'r4b', piece: 'otche' },
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
          title: { en: 'Right-hand techniques', ru: 'Техники правой руки' },
          target: { place: 'lesson', lesson: 'right-hand-techniques' },
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
