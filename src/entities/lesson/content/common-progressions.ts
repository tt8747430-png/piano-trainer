import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }

const commonProgressions: Lesson = {
  id: 'common-progressions',
  title: { en: 'Common progressions', ru: 'Распространённые последовательности' },
  summary: {
    en: 'The progressions under most hymns and songs, in major and minor keys. Each is written in Roman numerals, so it plays in any key.',
    ru: 'Последовательности, на которых держится большинство гимнов и песен, в мажоре и миноре. Каждая записана римскими цифрами, поэтому играется в любой тональности.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'I–IV–V–I', ru: 'I–IV–V–I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The three primary chords, then home again. Most hymns and folk songs are built on it. Learn it in every key you play in.',
            ru: 'Три главных аккорда и возвращение домой. На ней построено большинство гимнов и народных песен. Выучите её во всех тональностях, в которых играете.',
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
            en: 'The pop progression. Many worship songs are built on it. Here it is in G major.',
            ru: 'Поп-последовательность. На ней построено множество песен прославления. Здесь она в соль мажоре.',
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
            en: 'The 1950s progression. The minor vi softens the move from I to IV. Here it is in F major.',
            ru: 'Последовательность 1950-х. Минорный аккорд vi смягчает переход от I к IV. Здесь она в фа мажоре.',
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
          lead: { en: 'A cadence', ru: 'Каденция' },
          text: {
            en: 'is the chords that end a phrase. ii–V–I is the cadence of jazz, and of many a hymn’s last line.',
            ru: '— аккорды, которыми заканчивается фраза. ii–V–I — каденция джаза и последней строки многих гимнов.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'ii leads to V, and V leads home. It sounds best in 7th chords, as below.',
            ru: 'ii ведёт к V, а V — домой. Лучше всего она звучит септаккордами, как ниже.',
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
            en: 'A minor key counts its numerals from natural minor. There i, iv and v are all minor.',
            ru: 'Минорную тональность считают от натурального минора. В нём i, iv и v — минорные.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Most minor-key songs raise the 7th degree. This makes V major, so it leads home.',
            ru: 'В большинстве минорных песен седьмую ступень повышают. Тогда аккорд V становится мажорным и ведёт домой.',
          },
        },
        { kind: 'progression', numerals: 'i iv V i', key: A_MINOR },
        {
          kind: 'text',
          text: {
            en: 'The minor pop progression moves through the chords of the relative major.',
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
          kind: 'quiz',
          ask: { en: 'Play the IV chord of D major.', ru: 'Сыграйте аккорд IV ступени ре мажора.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'quiz',
          ask: {
            en: 'Play the V chord of E minor, made major.',
            ru: 'Сыграйте мажорный аккорд V ступени ми минора.',
          },
          answer: { chord: 'B' },
        },
        {
          kind: 'link',
          title: { en: 'Every style in Progressions', ru: 'Все стили в последовательностях' },
          target: { place: 'progressions', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default commonProgressions
