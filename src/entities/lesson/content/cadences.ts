import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const A_MINOR = { tonic: note('A'), minor: true }

const cadences: Lesson = {
  id: 'cadences',
  title: { en: 'Cadences', ru: 'Каденции' },
  summary: {
    en: 'A cadence is the pair of chords that ends a phrase. Learn the four kinds by ear and on the keys.',
    ru: 'Каденция — это пара аккордов в конце фразы. Узнайте четыре вида на слух и на клавишах.',
  },
  sections: [
    {
      heading: { en: 'Authentic: V to I', ru: 'Автентическая: V – I' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An authentic cadence', ru: 'Автентическая каденция' },
          text: {
            en: 'goes from V, the dominant, to I, the tonic. It sounds finished, like a full stop.',
            ru: 'идёт от V, доминанты, к I, тонике. Она звучит законченно, как точка в конце предложения.',
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
            en: 'Add a 7th to V and it pulls harder toward I. In C major, watch two notes move: B rises to C, and F falls to E.',
            ru: 'Добавьте к V септиму, и тяготение к I станет сильнее. В до мажоре следите за двумя звуками: си поднимается в до, фа опускается в ми.',
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
            en: 'goes from IV to I. It sounds softer than V to I. It is the Amen sung at the end of many hymns.',
            ru: 'идёт от IV к I. Она звучит мягче, чем V – I. Это «аминь», которым кончаются многие гимны.',
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
            en: 'stops on V instead of going home. The phrase sounds unfinished, like a question.',
            ru: 'останавливается на V и не возвращается домой. Фраза звучит незаконченно, как вопрос.',
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
            en: 'goes from V to vi. Your ear expects I, and the minor vi arrives instead. The song has to carry on.',
            ru: 'идёт от V к vi. Слух ждёт I, а вместо неё звучит минорная vi. Песне приходится продолжаться.',
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
            en: 'In a minor key, the 7th note is raised so that V becomes major. In A minor, G becomes G♯, and E major leads home to Am.',
            ru: 'В миноре седьмую ступень повышают, чтобы V стала мажорной. В ля миноре соль становится соль-диезом, и ми мажор ведёт домой, к ля минору.',
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
            en: 'Many tunes come in pairs of phrases. The first stops on V, a half cadence, like a question. The second answers with V to I.',
            ru: 'Многие мелодии состоят из пар фраз. Первая останавливается на V, как вопрос. Вторая отвечает каденцией V – I.',
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
          title: { en: 'Play both phrases in the Player', ru: 'Обе фразы в плеере' },
          target: { opens: 'player', numerals: 'I IV I V I IV V I', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: {
            en: 'Hear progressions in the Quiz',
            ru: 'Последовательности на слух в тестах',
          },
          target: { opens: 'quiz', trainer: 'progressions-by-ear' },
        },
      ],
    },
  ],
}

export default cadences
