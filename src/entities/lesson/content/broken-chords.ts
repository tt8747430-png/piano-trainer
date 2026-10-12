import type { Lesson } from '../model/types'

const brokenChords: Lesson = {
  id: 'broken-chords',
  title: { en: 'Broken chords and arpeggios', ru: 'Ломаные аккорды и арпеджио' },
  summary: {
    en: 'A chord one note at a time: broken in one hand, climbing through both, and figuration.',
    ru: 'Аккорд по одному звуку: ломаный в одной руке, восходящий через обе и фигурация.',
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
            en: 'plays its notes one at a time, not all at once. It keeps a slow song moving without getting louder.',
            ru: '— аккорд, звуки которого берут по одному, а не разом. Он движет медленную песню, не делая её громче.',
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
            en: 'climbs the chord in one line, from the left hand into the right.',
            ru: 'поднимается по аккорду одной линией, из левой руки в правую.',
          },
        },
        { kind: 'pattern', pattern: 'M3', piece: 'ex3' },
        { kind: 'pattern', pattern: 'M4', piece: 'ex3' },
        {
          kind: 'note',
          text: {
            en: 'Hold the bass through the bar, or catch it with the pedal and change it with each chord.',
            ru: 'Держите бас весь такт или берите его на педаль и меняйте её с каждым аккордом.',
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
            en: 'Боброва’s harmonic figuration also passes the arpeggio between the hands, then turns back down in the right.',
            ru: 'Гармоническая фигурация у Бобровой тоже передаёт арпеджио из руки в руку, а в правой поворачивает вниз.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
        {
          kind: 'text',
          text: {
            en: 'Its variant, the broken arpeggio, rocks instead of climbing: lowest, top, middle, top.',
            ru: 'Её вариант, ломаное арпеджио, покачивается, а не поднимается: нижний, верхний, средний, верхний.',
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
