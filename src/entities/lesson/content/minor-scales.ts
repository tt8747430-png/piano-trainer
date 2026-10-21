import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const minorScales: Lesson = {
  id: 'minor-scales',
  title: { en: 'The minor scales', ru: 'Минорные гаммы' },
  summary: {
    en: 'Build the three minor scales from A, and find the major key that shares a minor key’s notes.',
    ru: 'Строить три вида минора от ля и находить мажор с теми же нотами, что у минора.',
  },
  sections: [
    {
      heading: { en: 'Natural minor', ru: 'Натуральный минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Natural minor', ru: 'Натуральный минор' },
          text: {
            en: 'climbs whole, half, whole, whole, half, whole, whole. From A it uses only white keys.',
            ru: 'поднимается так: тон, полутон, тон, тон, полутон, тон, тон. От ля в ней только белые клавиши.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'natural' },
        {
          kind: 'text',
          text: {
            en: 'Play it and listen to the 3rd, C. It makes the scale minor.',
            ru: 'Сыграйте её и послушайте третью ступень, до. Она делает гамму минорной.',
          },
        },
      ],
    },
    {
      heading: { en: 'Relative keys', ru: 'Параллельные тональности' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Relative keys', ru: 'Параллельные тональности' },
          text: {
            en: 'share the same notes and key signature, like A minor and C major. The minor key’s tonic is a minor 3rd below the major’s.',
            ru: 'имеют одни ноты и ключевые знаки, как ля минор и до мажор. Тоника минора на малую терцию ниже тоники мажора.',
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
            en: 'raises the 7th note: G becomes G♯ in A minor. G♯ pulls up to A, and the chord on the 5th becomes major.',
            ru: 'повышает седьмую ступень: в ля миноре соль становится соль-диезом. Он тянется к ля, а аккорд пятой ступени становится мажорным.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'harmonic' },
        { kind: 'chords', symbols: ['E', 'Am'] },
        {
          kind: 'text',
          text: {
            en: 'Play E, then Am, and hear G♯ rise to A.',
            ru: 'Сыграйте E, затем Am и услышьте, как соль-диез идёт в ля.',
          },
        },
      ],
    },
    {
      heading: { en: 'Melodic minor', ru: 'Мелодический минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Melodic minor', ru: 'Мелодический минор' },
          text: {
            en: 'raises the 6th as well, F to F♯. That closes the wide gap from F to G♯.',
            ru: 'повышает ещё и шестую ступень: фа становится фа-диезом. Так исчезает широкий шаг от фа к соль-диезу.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'melodic' },
        {
          kind: 'note',
          text: {
            en: 'Classical music raises them going up only. Jazz raises them both ways.',
            ru: 'В классике их повышают только при движении вверх. В джазе — в обе стороны.',
          },
        },
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
