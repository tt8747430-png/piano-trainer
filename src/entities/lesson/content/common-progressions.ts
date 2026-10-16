import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }

const commonProgressions: Lesson = {
  id: 'common-progressions',
  title: { en: 'Common progressions', ru: 'Распространённые последовательности' },
  summary: {
    en: 'Play the progressions most songs use, in any key.',
    ru: 'Играйте последовательности, на которых держится большинство песен.',
  },
  sections: [
    {
      heading: { en: 'I–IV–V–I', ru: 'I–IV–V–I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The three primary chords, then home. Most hymns and folk songs are built on it.',
            ru: 'Три главных аккорда и возвращение домой. На ней построено большинство гимнов и народных песен.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'I–V–vi–IV', ru: 'I–V–vi–IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The pop progression, under countless pop and worship songs.',
            ru: 'Поп-последовательность, на ней стоят бесчисленные поп-песни и песни прославления.',
          },
        },
        { kind: 'progression', numerals: 'I V vi IV', key: { tonic: note('G'), minor: false } },
      ],
    },
    {
      heading: { en: 'I–vi–IV–V', ru: 'I–vi–IV–V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The 1950s progression. The minor vi softens the move from I to IV.',
            ru: 'Последовательность 1950-х. Минорный аккорд vi смягчает переход от I к IV.',
          },
        },
        { kind: 'progression', numerals: 'I vi IV V', key: { tonic: note('F'), minor: false } },
      ],
    },
    {
      heading: { en: 'ii–V–I', ru: 'ii–V–I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The cadence of jazz and of many hymns. ii leads to V, and V leads home.',
            ru: 'Каденция джаза и многих гимнов. ii ведёт к V, а V — домой.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'In a minor key', ru: 'В миноре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Minor-key numerals count from natural minor. Raising the 7th makes V major, so it leads home.',
            ru: 'В миноре ступени считают от натурального минора. Повышенная седьмая ступень делает V мажорным, и он ведёт домой.',
          },
        },
        { kind: 'progression', numerals: 'i iv V i', key: A_MINOR },
        {
          kind: 'text',
          text: {
            en: 'The minor pop progression uses the relative major’s chords.',
            ru: 'Минорная поп-последовательность идёт по аккордам параллельного мажора.',
          },
        },
        { kind: 'progression', numerals: 'i VI III VII', key: A_MINOR },
        {
          kind: 'text',
          text: {
            en: 'The Andalusian cadence steps down from i to V.',
            ru: 'Андалузская каденция спускается по ступеням от i к V.',
          },
        },
        { kind: 'progression', numerals: 'i VII VI V', key: A_MINOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the IV chord of D major.', ru: 'Сыграйте аккорд IV ступени ре мажора.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the V chord of E minor, made major.',
            ru: 'Сыграйте мажорный аккорд V ступени ми минора.',
          },
          answer: { chord: 'B' },
        },
        {
          kind: 'link',
          title: { en: 'I–IV–V–I through the keys', ru: 'I–IV–V–I по всем тональностям' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths' },
        },
        {
          kind: 'link',
          title: { en: 'Every style in Progressions', ru: 'Все стили в последовательностях' },
          target: { opens: 'progressions', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default commonProgressions
