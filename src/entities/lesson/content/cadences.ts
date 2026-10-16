import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }

const cadences: Lesson = {
  id: 'cadences',
  title: { en: 'Cadences', ru: 'Каденции' },
  summary: {
    en: 'Hear and play the four cadences that end a line.',
    ru: 'Слушайте и играйте четыре каденции, которыми кончаются фразы.',
  },
  sections: [
    {
      heading: { en: 'Authentic: V to I', ru: 'Полная: V – I' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An authentic cadence', ru: 'Полная (совершенная) каденция' },
          text: {
            en: 'ends on the tonic from the dominant, V to I. It sounds finished.',
            ru: 'приходит на тонику от доминанты, V – I. Она звучит завершённо.',
          },
        },
        { kind: 'progression', numerals: 'V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'With the 7th: V7 to I', ru: 'С септимой: V7 – I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Add the 7th to V and the pull grows. In C, B rises to C and F falls to E.',
            ru: 'Добавьте к V септиму, и тяготение усилится. В до мажоре си поднимается в до, а фа опускается в ми.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'G7', caption: 'V7', degrees: '1 | 5 ♭7 3', hands: 'G2 | D4 F4 B4' },
            { symbol: 'C', caption: 'I', degrees: '1 | 1 3 1', hands: 'C3 | C4 E4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Plagal: IV to I, the Amen', ru: 'Плагальная: IV – I, «аминь»' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A plagal cadence', ru: 'Плагальная каденция' },
          text: {
            en: 'comes to I from IV. It is softer than V–I: the Amen at a hymn’s end.',
            ru: 'приходит к I от IV. Она мягче, чем V – I: это «аминь» в конце гимна.',
          },
        },
        { kind: 'progression', numerals: 'IV I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Half: stopping on V', ru: 'Половинная: остановка на V' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half cadence', ru: 'Половинная каденция' },
          text: {
            en: 'stops on V. The line sounds like a question, and the next line answers it.',
            ru: 'останавливается на V. Фраза звучит как вопрос, а следующая на него отвечает.',
          },
        },
        { kind: 'progression', numerals: 'I vi IV V', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Deceptive: V to vi', ru: 'Прерванная: V – vi' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A deceptive cadence', ru: 'Прерванная каденция' },
          text: {
            en: 'leads you to expect I, then vi arrives. The song goes on for one more line.',
            ru: 'заставляет ждать I, а приходит vi. Песня продолжается ещё на одну фразу.',
          },
        },
        { kind: 'progression', numerals: 'IV V vi', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'In a minor key', ru: 'В миноре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A minor key raises its 7th so that V is major. In A minor, E leads home to Am.',
            ru: 'В миноре седьмую ступень повышают, чтобы V была мажорной. В ля миноре ми мажор ведёт к ля минору.',
          },
        },
        { kind: 'progression', numerals: 'iv V i', key: A_MINOR },
      ],
    },
    {
      heading: { en: 'Question and answer', ru: 'Вопрос и ответ' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Many tunes ask, then answer. The first line stops on V, a half cadence. The second ends V–I.',
            ru: 'Многие мелодии спрашивают и отвечают. Первая фраза останавливается на V, вторая кончается V – I.',
          },
        },
        { kind: 'progression', numerals: 'I IV I V I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the chord a deceptive cadence lands on in C major.',
            ru: 'Сыграйте аккорд, на который приходит прерванная каденция в до мажоре.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the chord a half cadence stops on in G major.',
            ru: 'Сыграйте аккорд, на котором останавливается половинная каденция в соль мажоре.',
          },
          answer: { chord: 'D' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the chord before I in a plagal cadence in F major.',
            ru: 'Сыграйте аккорд перед I в плагальной каденции фа мажора.',
          },
          answer: { chord: 'B♭' },
        },
        {
          kind: 'link',
          title: { en: 'Both lines in the Player', ru: 'Обе фразы в плеере' },
          target: { opens: 'player', numerals: 'I IV I V I IV V I', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: {
            en: 'Progressions by ear in the Quiz',
            ru: 'Последовательности на слух в тестах',
          },
          target: { opens: 'quiz', trainer: 'progressions-by-ear' },
        },
      ],
    },
  ],
}

export default cadences
