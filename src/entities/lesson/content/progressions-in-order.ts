import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MAJOR = { tonic: note('G'), minor: false }

/**
 * piano.org's chord progression learning order: ten steps, each building on the last, every one heard
 * in C and practised through the keys; three or four keys for the first five, all twelve from step 6.
 */
const progressionsInOrder: Lesson = {
  id: 'progressions-in-order',
  title: {
    en: 'Progressions in the order to learn them',
    ru: 'Последовательности в порядке изучения',
  },
  summary: {
    en: 'Ten progressions in the order to learn them, each building on the one before, from three chords to the tritone substitution.',
    ru: 'Десять последовательностей в порядке изучения, каждая опирается на предыдущую: от трёх аккордов до тритоновой замены.',
  },
  sections: [
    {
      heading: { en: 'How to practise', ru: 'Как заниматься' },
      blocks: [
        { kind: 'progression', numerals: 'I IV V I', key: G_MAJOR },
        {
          kind: 'steps',
          steps: [
            { en: 'At least a week on each step.', ru: 'Не меньше недели на каждый шаг.' },
            { en: 'Steps 1 to 5 in C, G, D and F.', ru: 'Шаги 1–5 — в до, соль, ре и фа.' },
            {
              en: 'From step 6, all twelve keys.',
              ru: 'Начиная с шага 6 — во всех двенадцати тональностях.',
            },
            {
              en: 'Skip a step only if it is clean in three keys.',
              ru: 'Пропускайте шаг, только если чисто играете его в трёх тональностях.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Step 1: I–IV–V, three chords', ru: 'Шаг 1: I–IV–V, три аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Three chords, on degrees 1, 4 and 5, carry thousands of folk, blues and rock songs. Start in C, then G and D.',
            ru: 'Три аккорда на ступенях 1, 4 и 5 держат тысячи народных, блюзовых и рок-песен. Начните в до, затем соль и ре.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I–IV–V–I in C, G, D…', ru: 'I–IV–V–I в до, соль, ре…' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths-up' },
        },
      ],
    },
    {
      heading: { en: 'Step 2: V–I, arriving home', ru: 'Шаг 2: V–I, возвращение домой' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The authentic cadence', ru: 'Автентическая каденция' },
          text: {
            en: 'is V moving to I. It is the strongest way to sound like you have arrived home.',
            ru: '— это переход V в I. Он сильнее всего даёт ощущение возвращения домой.',
          },
        },
        { kind: 'progression', numerals: 'V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Step 3: I–V–vi–IV, the Axis', ru: 'Шаг 3: I–V–vi–IV, «ось»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Add vi, the chord of the relative minor. Now you have the four-chord loop pop plays most.',
            ru: 'Добавьте vi, аккорд параллельного минора. Получится круг из четырёх аккордов, самый частый в поп-музыке.',
          },
        },
        { kind: 'progression', numerals: 'I V vi IV', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I–V–vi–IV in C, G, D…', ru: 'I–V–vi–IV в до, соль, ре…' },
          target: { opens: 'player', numerals: 'I V vi IV', key: C_MAJOR, walk: 'fifths-up' },
        },
      ],
    },
    {
      heading: { en: 'Step 4: I–vi–IV–V, the 50s', ru: 'Шаг 4: I–vi–IV–V, 50-е' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same four chords in a new order. This is the loop of doo-wop and ballads.',
            ru: 'Те же четыре аккорда в другом порядке. Это круг ду-вопа и баллад.',
          },
        },
        { kind: 'progression', numerals: 'I vi IV V', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I–vi–IV–V in C, G, D…', ru: 'I–vi–IV–V в до, соль, ре…' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR, walk: 'fifths-up' },
        },
      ],
    },
    {
      heading: { en: 'Step 5: four cadences', ru: 'Шаг 5: четыре каденции' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A cadence', ru: 'Каденция' },
          text: {
            en: 'is the chords that end a phrase. Besides V to I: the plagal IV to I, the half cadence on V, the deceptive V to vi.',
            ru: '— это аккорды, которыми кончается фраза. Кроме V–I: плагальная IV–I, половинная на V и прерванная V–vi.',
          },
        },
        { kind: 'progression', numerals: 'I IV I', key: C_MAJOR },
        { kind: 'progression', numerals: 'I IV V', key: C_MAJOR },
        { kind: 'progression', numerals: 'I IV V vi', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Step 6: ii–V–I, jazz’s workhorse', ru: 'Шаг 6: ii–V–I, основа джаза' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Jazz standards are built from this progression. Play it in all twelve keys, round the cycle of fourths.',
            ru: 'Из этого оборота построены джазовые стандарты. Играйте его во всех двенадцати тональностях по кругу кварт.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
        {
          kind: 'link',
          title: { en: 'ii–V–I round the cycle of fourths', ru: 'ii–V–I по кругу кварт' },
          target: {
            opens: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'fifths',
          },
        },
        {
          kind: 'link',
          title: { en: 'The ii–V–I', ru: 'Оборот ii–V–I' },
          target: { opens: 'lesson', lesson: 'two-five-one' },
        },
      ],
    },
    {
      heading: { en: 'Step 7: the 12-bar blues', ru: 'Шаг 7: 12-тактовый блюз' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Twelve bars with a dominant 7th on I, IV and V. Start in C, then F, B♭ and E♭.',
            ru: 'Двенадцать тактов с доминантсептаккордами на I, IV и V. Начните в до, затем фа, си-бемоль и ми-бемоль.',
          },
        },
        {
          kind: 'progression',
          numerals: 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7',
          key: C_MAJOR,
        },
        {
          kind: 'link',
          title: {
            en: 'The 12-bar blues in C, F, B♭…',
            ru: '12-тактовый блюз в до, фа, си-бемоль…',
          },
          target: {
            opens: 'player',
            numerals: 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7',
            key: C_MAJOR,
            walk: 'fifths',
          },
        },
      ],
    },
    {
      heading: { en: 'Step 8: borrowing ♭VII', ru: 'Шаг 8: заимствованная ♭VII' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Take ♭VII from C minor, the minor key on the same tonic. In C that gives C, B♭, F, C, a rock sound.',
            ru: 'Возьмите ♭VII из до минора, одноимённой тональности. В до получится C, B♭, F, C: звук рока.',
          },
        },
        { kind: 'progression', numerals: 'I ♭VII IV I', key: C_MAJOR },
        {
          kind: 'link',
          title: {
            en: 'Borrowed ♭VII in Progressions',
            ru: 'Заимствованная ♭VII в последовательностях',
          },
          target: { opens: 'progressions', numerals: 'I ♭VII IV I', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Step 9: secondary dominants', ru: 'Шаг 9: побочные доминанты' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
          text: {
            en: 'is the V of a chord other than I. V/V is the V of V. In C, D7 leads into G.',
            ru: '— это V к аккорду тональности, кроме I. V/V — доминанта к V. В до D7 ведёт в G.',
          },
        },
        { kind: 'progression', numerals: 'I V7/V V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Step 10: the tritone substitution', ru: 'Шаг 10: тритоновая замена' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '♭II7 replaces V7, a tritone away. They share the tritone F and B. The bass now falls by half steps: D, D♭, C.',
            ru: '♭II7 заменяет V7, отстоящий на тритон. У них общий тритон фа–си. Бас теперь спускается по полутонам: ре, ре-бемоль, до.',
          },
        },
        { kind: 'progression', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR },
        {
          kind: 'link',
          title: {
            en: 'The tritone substitution in Progressions',
            ru: 'Тритоновая замена в последовательностях',
          },
          target: { opens: 'progressions', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play V7/V in C major.', ru: 'Сыграйте V7/V в до мажоре.' },
          answer: { chord: 'D7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the tritone substitute for G7.',
            ru: 'Сыграйте тритоновую замену G7.',
          },
          answer: { chord: 'D♭7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play vi in G major.', ru: 'Сыграйте vi в соль мажоре.' },
          answer: { chord: 'Em' },
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

export default progressionsInOrder
