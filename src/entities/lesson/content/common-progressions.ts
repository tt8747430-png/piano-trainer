import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }

const commonProgressions: Lesson = {
  id: 'common-progressions',
  title: { en: 'Common progressions', ru: 'Распространённые последовательности' },
  summary: {
    en: 'The progressions under most hymns and songs, in major and in minor keys, each in Roman numerals so it plays in any key.',
    ru: 'Последовательности, на которых держится большинство гимнов и песен, в мажоре и в миноре, записанные римскими цифрами, чтобы играть их в любой тональности.',
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
            en: 'The three primary chords and home again: the backbone of hymns and folk songs. Learn it in every key you play in.',
            ru: 'Три главных аккорда и возвращение домой — основа гимнов и народных песен. Выучите её во всех тональностях, в которых играете.',
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
            en: 'The pop progression, under countless worship songs. Here it is in G major.',
            ru: 'Поп-последовательность, на которой построены бесчисленные песни прославления. Здесь — в соль мажоре.',
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
            en: 'The 1950s progression: the minor vi softens the way from I to IV. Here it is in F major.',
            ru: 'Последовательность 1950-х: минорная vi смягчает путь от I к IV. Здесь — в фа мажоре.',
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
            en: 'The cadence of jazz, and of many a hymn’s last line: ii leads to V, and V home. It sounds best in 7th chords.',
            ru: 'Каденция джаза и последней строки многих гимнов: ii ведёт к V, а V — домой. Лучше всего она звучит септаккордами.',
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
            en: 'A minor key counts from its natural minor, where i, iv and v are all minor. Most minor-key songs raise the 7th to make V major, so it leads home.',
            ru: 'Минорная тональность считается от натурального минора, где i, iv и v минорные. В большинстве минорных песен седьмую ступень повышают, и V становится мажорной — она ведёт домой.',
          },
        },
        { kind: 'progression', numerals: 'i iv V i', key: A_MINOR },
        {
          kind: 'text',
          text: {
            en: 'The minor pop progression climbs through the relative major’s chords; the Andalusian cadence steps down from i to V.',
            ru: 'Минорная поп-последовательность проходит через аккорды параллельного мажора; андалузская каденция спускается от i к V.',
          },
        },
        { kind: 'progression', numerals: 'i VI III VII', key: A_MINOR },
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
