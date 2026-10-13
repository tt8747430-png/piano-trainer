import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const minorScales: Lesson = {
  id: 'minor-scales',
  title: { en: 'The minor scales', ru: 'Минорные гаммы' },
  summary: {
    en: 'Natural, harmonic and melodic minor, and the major key that has the same notes as each minor key.',
    ru: 'Три вида минора — натуральный, гармонический и мелодический — и мажор с теми же нотами.',
  },
  level: 2,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Natural minor', ru: 'Натуральный минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Natural minor climbs whole, half, whole, whole, half, whole, whole. From A: white keys only.',
            ru: 'Натуральный минор идёт так: тон, полутон, тон, тон, полутон, тон, тон. От ля — только белые клавиши.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'natural' },
        {
          kind: 'text',
          lead: { en: 'A degree', ru: 'Ступень' },
          text: {
            en: 'is a note’s place from the tonic. The 3rd degree, a minor 3rd up, makes minor sound dark.',
            ru: '— место ноты от тоники. Третья ступень, на малую терцию выше, делает минор тёмным.',
          },
        },
      ],
    },
    {
      heading: { en: 'Harmonic minor', ru: 'Гармонический минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Raise the 7th degree, G♯ in A minor: it leads up to the tonic, and the chord on the 5th turns major. F to G♯ is a step and a half.',
            ru: 'Повысьте седьмую ступень, соль-диез в ля миноре: она ведёт к тонике, а аккорд пятой ступени становится мажорным. Фа — соль-диез — увеличенная секунда.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'harmonic' },
        { kind: 'chords', symbols: ['E', 'Am'] },
      ],
    },
    {
      heading: { en: 'Melodic minor', ru: 'Мелодический минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Raise the 6th too, F♯ and G♯ in A minor, and the leap is gone. Classical music raises them only going up, jazz both ways.',
            ru: 'Повысьте и шестую, фа-диез и соль-диез в ля миноре, — скачок исчезнет. В классике их повышают только вверх, в джазе — в обе стороны.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'melodic' },
      ],
    },
    {
      heading: { en: 'Relative keys', ru: 'Параллельные тональности' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Relative keys', ru: 'Параллельные тональности' },
          text: {
            en: 'share their notes and key signature, like C major and A minor. The minor tonic is a minor 3rd below the major one.',
            ru: 'имеют одни ноты и ключевые знаки, как до мажор и ля минор. Тоника минора на малую терцию ниже тоники мажора.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
        { kind: 'interval', root: note('A'), interval: 'm3' },
        {
          kind: 'link',
          title: { en: 'A minor in Keys', ru: 'Ля минор в тональностях' },
          target: { place: 'keys', key: { tonic: note('A'), minor: true } },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the notes of E natural minor.',
            ru: 'Сыграйте ноты натурального ми минора.',
          },
          answer: { notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] },
        },
      ],
    },
  ],
}

export default minorScales
