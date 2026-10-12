import type { Lesson } from '../model/types'

const brokenChords: Lesson = {
  id: 'broken-chords',
  title: { en: 'Broken chords and arpeggios', ru: 'Ломаные аккорды и арпеджио' },
  summary: {
    en: 'A chord one note at a time: broken in one hand, climbing through both, and the figure churches use most.',
    ru: 'Аккорд по одному звуку: ломаный в одной руке, восходящий через обе и самая частая в церкви фигурация.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'One note at a time', ru: 'По одному звуку' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A broken chord', ru: 'Ломаный аккорд' },
          text: {
            en: 'plays its notes one at a time instead of all at once.',
            ru: '— аккорд, звуки которого берут по одному, а не разом.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'It keeps moving between the words. It fills a slow song without getting louder.',
            ru: 'Он движется между словами и заполняет медленную песню, не становясь громче.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Called to Play’s second way is the first step. Play it below.',
            ru: 'Второй способ Called to Play — первый шаг. Сыграйте его ниже.',
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
          lead: { en: 'An arpeggio', ru: 'Арпеджио' },
          text: {
            en: 'climbs the chord across both hands. One line passes from the left hand into the right.',
            ru: 'поднимается по аккорду через обе руки. Одна линия переходит из левой руки в правую.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Called to Play’s third and fourth ways do this.',
            ru: 'Так устроены третий и четвёртый способы Called to Play.',
          },
        },
        { kind: 'pattern', pattern: 'M3', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M4', piece: 'ex3' },
        {
          kind: 'note',
          text: {
            en: 'Hold the bass through the bar, with the pedal if you use it. Change the pedal with each chord. The broken notes then sound as one chord.',
            ru: 'Держите бас весь такт — педалью, если играете с ней. Меняйте педаль с каждым аккордом. Тогда ломаные звуки сольются в один аккорд.',
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
            en: 'Боброва’s fourth type, harmonic figuration, also passes the arpeggio from hand to hand. In the right hand it turns back down.',
            ru: 'Четвёртый вид у Бобровой, гармоническая фигурация, тоже передаёт арпеджио из руки в руку. В правой руке оно поворачивает назад.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
        {
          kind: 'text',
          text: {
            en: 'Its variant, the broken arpeggio, turns another way. The right hand plays the chord’s lowest, top, middle and top notes. The figure rocks instead of climbing.',
            ru: 'Его вариант, ломаное арпеджио, поворачивает иначе. Правая рука играет нижний, верхний, средний и снова верхний звук аккорда. Фигура покачивается, а не поднимается.',
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
            en: 'Play the notes A minor’s arpeggio climbs through.',
            ru: 'Сыграйте звуки, по которым поднимается арпеджио ля минора.',
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
