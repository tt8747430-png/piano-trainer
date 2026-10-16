import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const minorScales: Lesson = {
  id: 'minor-scales',
  title: { en: 'The minor scales', ru: 'Минорные гаммы' },
  summary: {
    en: 'Play natural, harmonic and melodic minor and find the relative major.',
    ru: 'Играть натуральный, гармонический и мелодический минор и находить параллельный мажор.',
  },
  sections: [
    {
      heading: { en: 'Natural minor', ru: 'Натуральный минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Natural minor', ru: 'Натуральный минор' },
          text: {
            en: 'climbs whole, half, whole, whole, half, whole, whole. From A it is the white keys.',
            ru: 'идёт так: тон, полутон, тон, тон, полутон, тон, тон. От ля это белые клавиши.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'natural' },
      ],
    },
    {
      heading: { en: 'Relative keys', ru: 'Параллельные тональности' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Relative keys', ru: 'Параллельные тональности' },
          text: {
            en: 'share their notes and signature, like A minor and C major. The minor tonic is a minor 3rd below.',
            ru: 'имеют одни ноты и ключевые знаки, как ля минор и до мажор. Тоника минора на малую терцию ниже.',
          },
        },
        { kind: 'interval', root: note('A'), interval: 'm3' },
        {
          kind: 'link',
          title: { en: 'A minor in Keys', ru: 'Ля минор в тональностях' },
          target: { opens: 'key', key: { tonic: note('A'), minor: true } },
        },
      ],
    },
    {
      heading: { en: 'Harmonic minor', ru: 'Гармонический минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Harmonic minor', ru: 'Гармонический минор' },
          text: {
            en: 'raises the 7th, G♯ in A minor. It leads up to the tonic, and the chord on the 5th turns major.',
            ru: 'повышает седьмую ступень, соль-диез в ля миноре. Она ведёт к тонике, а аккорд пятой ступени становится мажорным.',
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
          lead: { en: 'Melodic minor', ru: 'Мелодический минор' },
          text: {
            en: 'raises the 6th too, smoothing the leap from F to G♯. Classical music raises them going up only, jazz both ways.',
            ru: 'повышает и шестую, сглаживая скачок от фа к соль-диезу. В классике их повышают только вверх, в джазе — в обе стороны.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'melodic' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the notes of E natural minor.',
            ru: 'Сыграйте ноты натурального ми минора.',
          },
          answer: { notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the tonic of A minor’s relative major.',
            ru: 'Сыграйте тонику мажора, параллельного ля минору.',
          },
          answer: { notes: ['C'] },
        },
        {
          kind: 'link',
          title: { en: 'Scales by ear in the Quiz', ru: 'Гаммы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'scales-by-ear' },
        },
      ],
    },
  ],
}

export default minorScales
