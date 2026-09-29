import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const minorScales: Lesson = {
  id: 'minor-scales',
  title: { en: 'The minor scales', ru: 'Минорные гаммы' },
  summary: {
    en: 'Natural, harmonic and melodic minor, and the major key each minor key shares its notes with.',
    ru: 'Натуральный, гармонический и мелодический минор и мажор, с которым минор делит ноты.',
  },
  level: 2,
  category: 'scales',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Natural minor', ru: 'Натуральный минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Natural minor climbs whole, half, whole, whole, half, whole, whole. Its 3rd is a minor 3rd above the tonic, which gives it its darker colour. A minor uses only the white keys.',
            ru: 'Натуральный минор поднимается так: тон, полутон, тон, тон, полутон, тон, тон. Его третья ступень — малая терция от тоники: отсюда более тёмная окраска. Ля минор — только белые клавиши.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'natural' },
      ],
    },
    {
      heading: { en: 'Harmonic minor', ru: 'Гармонический минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Raise the 7th a half step (G♯ in A minor) and it leads up to the tonic, as in major, giving the key its major V chord. Between the 6th and the raised 7th a step and a half opens: the scale’s characteristic leap.',
            ru: 'Повысьте седьмую ступень на полутон (соль-диез в ля миноре) — она поведёт к тонике, как в мажоре, и даст тональности мажорную доминанту. Между шестой и повышенной седьмой ступенями образуется увеличенная секунда — характерный скачок этой гаммы.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'harmonic' },
      ],
    },
    {
      heading: { en: 'Melodic minor', ru: 'Мелодический минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Raise the 6th as well and the step and a half closes: F♯ and G♯ in A minor. Classical music raises them going up and comes back down in natural minor; jazz keeps them raised both ways.',
            ru: 'Повысьте ещё и шестую ступень — увеличенная секунда исчезнет: фа-диез и соль-диез в ля миноре. В классике их повышают при движении вверх, а вниз играют натуральный минор; в джазе повышенные ступени сохраняют в обе стороны.',
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
          text: {
            en: 'Every major key shares its notes and its signature with the minor key a minor 3rd below its tonic: C major and A minor, G major and E minor. They are relative keys.',
            ru: 'Каждый мажор делит ноты и ключевые знаки с минором, тоника которого на малую терцию ниже: до мажор и ля минор, соль мажор и ми минор. Это параллельные тональности.',
          },
        },
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
