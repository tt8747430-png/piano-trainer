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
  category: 'scales',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Natural minor', ru: 'Натуральный минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Natural minor climbs whole, half, whole, whole, half, whole, whole. From A it uses only the white keys. Play it below.',
            ru: 'Натуральный минор строится так: тон, полутон, тон, тон, полутон, тон, тон. От ля он идёт только по белым клавишам. Сыграйте его ниже.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'natural' },
        {
          kind: 'text',
          lead: { en: 'A degree', ru: 'Ступень' },
          text: {
            en: 'is a note’s place in the scale, counted from the tonic. In A minor, A is the 1st degree and G the 7th.',
            ru: '— место ноты в гамме, считая от тоники. В ля миноре ля — первая ступень, соль — седьмая.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The 3rd degree, C, is a minor 3rd above the tonic. This minor 3rd makes minor sound darker than major.',
            ru: 'Третья ступень, до, на малую терцию выше тоники. Эта малая терция и делает минор темнее мажора.',
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
            en: 'Raise the 7th degree a half step: G♯ in A minor. Now it leads up to the tonic, as in major.',
            ru: 'Повысьте седьмую ступень на полутон: соль-диез в ля миноре. Теперь она ведёт вверх к тонике, как в мажоре.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The raised 7th also makes the chord on the 5th degree major, as in a major key.',
            ru: 'Аккорд на пятой ступени от этого становится мажорным, как в мажорной тональности.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Between the 6th and the raised 7th lies a step and a half, F to G♯. Listen for this leap in the scale below.',
            ru: 'Между шестой и повышенной седьмой ступенью получается увеличенная секунда, фа — соль-диез. Услышьте этот скачок в гамме ниже.',
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
            en: 'Raise the 6th degree as well, and the step and a half is gone. In A minor that gives F♯ and G♯.',
            ru: 'Повысьте ещё и шестую ступень — увеличенная секунда исчезнет. В ля миноре это фа-диез и соль-диез.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Classical music raises them only going up. Coming down, it plays natural minor. Jazz keeps them raised both ways.',
            ru: 'В классике их повышают только вверх, а вниз играют натуральный минор. В джазе они остаются повышенными и вверх, и вниз.',
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
            en: 'C major and A minor have the same notes and the same key signature. Keys like these are relative keys.',
            ru: 'У до мажора и ля минора одни и те же ноты и одинаковые ключевые знаки. Такие тональности называют параллельными.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The relative minor’s tonic is a minor 3rd below the major tonic: G major and E minor.',
            ru: 'Тоника параллельного минора на малую терцию ниже тоники мажора: соль мажор и ми минор.',
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
