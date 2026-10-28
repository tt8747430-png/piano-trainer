import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const A_MINOR = { tonic: note('A'), minor: true }

const cadences: Lesson = {
  id: 'cadences',
  after: ['chord-functions', 'inversions'],
  title: { en: 'Cadences', ru: 'Каденции' },
  summary: {
    en: 'A cadence is the pair of chords that ends a phrase. Learn the four kinds and their variants by ear and on the keys.',
    ru: 'Каденция — это пара аккордов в конце фразы. Узнайте четыре вида и их разновидности на слух и на клавишах.',
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
      takeaway: {
        en: 'V to I closes a phrase, like a full stop.',
        ru: 'V – I закрывает фразу, как точка.',
      },
    },
    {
      heading: { en: 'Perfect or imperfect', ru: 'Совершенная или несовершенная' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A perfect authentic cadence', ru: 'Совершенная автентическая каденция' },
          text: {
            en: 'has V and I in root position and the tonic on top. Any other V to I is imperfect, and sounds less final.',
            ru: '— это V и I в основном виде с тоникой в верхнем голосе. Любая другая V – I несовершенная и звучит менее окончательно.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'Perfect', ru: 'Совершенная' },
              caption: {
                en: 'V – I · root position, the tonic on top',
                ru: 'V – I · основной вид, тоника наверху',
              },
              example: {
                kind: 'voicings',
                satb: true,
                voicings: [
                  { symbol: 'G', caption: 'V', degrees: '1 | 5 1 3', hands: 'G2 | D4 G4 B4' },
                  { symbol: 'C', caption: 'I', degrees: '1 | 3 5 1', hands: 'C3 | E4 G4 C5' },
                ],
              },
            },
            {
              label: { en: 'Imperfect', ru: 'Несовершенная' },
              caption: {
                en: 'V6 – I · the leading note in the bass, the 3rd on top',
                ru: 'V6 – I · вводный тон в басу, терция наверху',
              },
              example: {
                kind: 'voicings',
                satb: true,
                voicings: [
                  { symbol: 'G/B', caption: 'V6', degrees: '3 | 1 5 1', hands: 'B2 | G3 D4 G4' },
                  { symbol: 'C', caption: 'I', degrees: '1 | 5 1 3', hands: 'C3 | G3 C4 E4' },
                ],
              },
            },
          ],
        },
      ],
      takeaway: {
        en: 'Root position and the tonic on top make the cadence perfect.',
        ru: 'Основной вид и тоника наверху делают каденцию совершенной.',
      },
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
          satb: true,
          voicings: [
            { symbol: 'G7', caption: 'V7', degrees: '1 | 5 ♭7 3', hands: 'G2 | D4 F4 B4' },
            { symbol: 'C', caption: 'I', degrees: '1 | 1 3 1', hands: 'C3 | C4 E4 C5' },
          ],
        },
      ],
      takeaway: {
        en: 'In V7 to I, the leading note rises and the 7th falls.',
        ru: 'В V7 – I вводный тон идёт вверх, а септима — вниз.',
      },
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
      takeaway: {
        en: 'A deceptive cadence swaps the expected I for vi.',
        ru: 'Прерванная каденция подменяет ожидаемую I на vi.',
      },
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
      heading: { en: 'The Phrygian half cadence', ru: 'Фригийская половинная каденция' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A Phrygian half cadence', ru: 'Фригийская половинная каденция' },
          text: {
            en: 'goes from iv6 to V in a minor key. The bass falls a half step: F to E in A minor.',
            ru: 'идёт от iv6 к V в миноре. Бас опускается на полутон: фа – ми в ля миноре.',
          },
        },
        {
          kind: 'voicings',
          satb: true,
          key: A_MINOR,
          voicings: [
            { symbol: 'Dm/F', caption: 'iv6', degrees: '3 | 5 1 3', hands: 'F2 | A3 D4 F4' },
            { symbol: 'E', caption: 'V', degrees: '1 | 3 5 1', hands: 'E2 | G♯3 B3 E4' },
          ],
        },
      ],
      takeaway: {
        en: 'iv6 to V: the bass falls a half step onto the dominant.',
        ru: 'iv6 – V: бас спускается на полутон к доминанте.',
      },
    },
    {
      heading: { en: 'The cadential 6/4', ru: 'Кадансовый квартсекстаккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The cadential 6/4', ru: 'Кадансовый квартсекстаккорд' },
          text: {
            en: 'is I with its 5th in the bass, just before V. Over the held G, the 6th and 4th fall to the 5th and 3rd.',
            ru: '— это I с квинтой в басу прямо перед V. Над выдержанным соль секста и кварта спускаются в квинту и терцию.',
          },
        },
        {
          kind: 'voicings',
          satb: true,
          voicings: [
            { symbol: 'C/G', caption: 'I6/4', degrees: '5 | 3 5 1', hands: 'G2 | E4 G4 C5' },
            { symbol: 'G', caption: 'V', degrees: '1 | 5 1 3', hands: 'G2 | D4 G4 B4' },
            { symbol: 'C', caption: 'I', degrees: '1 | 3 5 1', hands: 'C3 | E4 G4 C5' },
          ],
        },
      ],
      takeaway: {
        en: 'The cadential 6/4 is V in disguise: it decorates the dominant.',
        ru: 'Кадансовый квартсекстаккорд — переодетая V: он украшает доминанту.',
      },
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
      heading: { en: 'One phrase, four endings', ru: 'Одна фраза, четыре окончания' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same phrase, ended four ways. Choose an ending and hear what changes.',
            ru: 'Одна и та же фраза с четырьмя окончаниями. Выберите окончание и послушайте, что меняется.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'Authentic', ru: 'Автентическая' },
              caption: { en: 'V – I · a full stop', ru: 'V – I · точка' },
              example: {
                kind: 'progression',
                numerals: 'I vi ii V I',
                key: { tonic: note('G'), minor: false },
              },
            },
            {
              label: { en: 'Plagal', ru: 'Плагальная' },
              caption: { en: 'IV – I · the Amen', ru: 'IV – I · «аминь»' },
              example: {
                kind: 'progression',
                numerals: 'I vi IV I',
                key: { tonic: note('G'), minor: false },
              },
            },
            {
              label: { en: 'Half', ru: 'Половинная' },
              caption: { en: 'ends on V · a question', ru: 'конец на V · вопрос' },
              example: {
                kind: 'progression',
                numerals: 'I vi ii V',
                key: { tonic: note('G'), minor: false },
              },
            },
            {
              label: { en: 'Deceptive', ru: 'Прерванная' },
              caption: { en: 'V – vi · the surprise', ru: 'V – vi · неожиданность' },
              example: {
                kind: 'progression',
                numerals: 'I vi ii V vi',
                key: { tonic: note('G'), minor: false },
              },
            },
          ],
        },
      ],
      takeaway: {
        en: 'The last two chords decide how a phrase ends.',
        ru: 'Как закончится фраза, решают два последних аккорда.',
      },
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
          kind: 'question',
          ask: {
            en: 'Play the chord before V in a Phrygian half cadence in A minor.',
            ru: 'Сыграйте аккорд перед V во фригийской половинной каденции ля минора.',
          },
          answer: { chord: 'Dm' },
        },
        {
          kind: 'link',
          title: { en: 'Name cadences by ear in the Quiz', ru: 'Каденции на слух в тестах' },
          target: { opens: 'quiz', trainer: 'cadences', drill: 'ear' },
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
