import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
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
    en: 'piano.org’s learning order: ten steps from I–IV–V to the tritone substitution, each heard in C and walked through the keys.',
    ru: 'Порядок изучения piano.org: десять шагов от I–IV–V до тритоновой замены, каждый — в до мажоре и по тональностям.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'Step 1: I–IV–V, three chords', ru: 'Шаг 1: I–IV–V, три аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Three chords carry thousands of folk, country, blues and early rock songs. Start in C, then G and D: the shape stays, the names change.',
            ru: 'Три аккорда держат тысячи народных, кантри-, блюзовых и ранних рок-песен. Начните в до, затем соль и ре: форма та же, меняются названия.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I–IV–V–I in C, G, D…', ru: 'I–IV–V–I в до, соль, ре…' },
          target: { place: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths-up' },
        },
      ],
    },
    {
      heading: { en: 'Step 2: V–I, arriving home', ru: 'Шаг 2: V–I, возвращение домой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'V to I is the perfect authentic cadence, the strongest sound of arriving. Learn to hear it in C, G and F.',
            ru: 'V–I — совершенная автентическая каденция, самое сильное ощущение прихода. Научитесь слышать её в до, соль и фа.',
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
            en: 'Add vi, the relative minor, and you have pop’s most played four-chord loop. Songwriting can start here.',
            ru: 'Добавьте vi, параллельный минор, и получите самый частый круг из четырёх аккордов в поп-музыке. Отсюда можно начинать сочинять.',
          },
        },
        { kind: 'progression', numerals: 'I V vi IV', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I–V–vi–IV in C, G, D…', ru: 'I–V–vi–IV в до, соль, ре…' },
          target: { place: 'player', numerals: 'I V vi IV', key: C_MAJOR, walk: 'fifths-up' },
        },
      ],
    },
    {
      heading: { en: 'Step 4: I–vi–IV–V, the 50s', ru: 'Шаг 4: I–vi–IV–V, 50-е' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same four chords reordered: the doo-wop and slow-dance loop. With step 3 it covers most pop and ballads.',
            ru: 'Те же четыре аккорда в другом порядке: круг ду-вопа и медленных танцев. Вместе с шагом 3 он покрывает большую часть попа и баллад.',
          },
        },
        { kind: 'progression', numerals: 'I vi IV V', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I–vi–IV–V in C, G, D…', ru: 'I–vi–IV–V в до, соль, ре…' },
          target: { place: 'player', numerals: 'I vi IV V', key: C_MAJOR, walk: 'fifths-up' },
        },
      ],
    },
    {
      heading: { en: 'Step 5: four cadences', ru: 'Шаг 5: четыре каденции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cadences are music’s punctuation: authentic V–I, plagal IV–I, a half cadence on V, and deceptive V–vi, where V expects I but gets vi.',
            ru: 'Каденции — знаки препинания музыки: автентическая V–I, плагальная IV–I, половинная на V и прерванная V–vi, где V ждёт I, а приходит vi.',
          },
        },
        { kind: 'progression', numerals: 'I IV I', key: C_MAJOR },
        { kind: 'progression', numerals: 'I IV V', key: C_MAJOR },
        { kind: 'progression', numerals: 'I IV V vi', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'With steps 1 to 5, most folk and pop plays by ear.',
            ru: 'С шагами 1–5 большая часть народной музыки и попа играется на слух.',
          },
        },
      ],
    },
    {
      heading: { en: 'Step 6: ii–V–I, jazz’s workhorse', ru: 'Шаг 6: ii–V–I, основа джаза' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The most common jazz progression, the building block of standards. Play it in all twelve keys round the cycle of fourths.',
            ru: 'Самая частая последовательность джаза, кирпичик стандартов. Играйте её во всех двенадцати тональностях по кварто-квинтовому кругу.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
        {
          kind: 'link',
          title: { en: 'ii–V–I round the cycle of fourths', ru: 'ii–V–I по кругу кварт' },
          target: {
            place: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'fifths',
          },
        },
        {
          kind: 'link',
          title: { en: 'The ii–V–I', ru: 'Оборот ii–V–I' },
          target: { place: 'lesson', lesson: 'two-five-one' },
        },
      ],
    },
    {
      heading: { en: 'Step 7: the 12-bar blues', ru: 'Шаг 7: 12-тактовый блюз' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Dominant 7ths on I, IV and V bend the key’s usual pull. Start in C, then F, B♭ and E♭.',
            ru: 'Доминантсептаккорды на I, IV и V нарушают привычное тяготение тональности. Начните в до, затем фа, си-бемоль и ми-бемоль.',
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
            place: 'player',
            numerals: 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7',
            key: C_MAJOR,
            walk: 'fifths',
          },
        },
        {
          kind: 'note',
          text: {
            en: 'Now you can join a blues jam.',
            ru: 'Теперь можно играть на блюзовом джеме.',
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
            en: 'Borrow ♭VII from the parallel minor for rock’s bluesy colour: C–B♭–F–C.',
            ru: 'Возьмите ♭VII из одноимённого минора для блюзовой краски рока: C–B♭–F–C.',
          },
        },
        { kind: 'progression', numerals: 'I ♭VII IV I', key: C_MAJOR },
        {
          kind: 'link',
          title: {
            en: 'Borrowed ♭VII in Progressions',
            ru: 'Заимствованная ♭VII в последовательностях',
          },
          target: { place: 'progressions', numerals: 'I ♭VII IV I', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Step 9: secondary dominants', ru: 'Шаг 9: вторичные доминанты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'V/V is the V of V: D7, borrowed from G major, leads into G. It visits another key without leaving home.',
            ru: 'V/V — это V от V: D7, взятый из соль мажора, ведёт в G. Он ненадолго заходит в другую тональность, не уходя из своей.',
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
            en: '♭II7 stands in for V7, a tritone away, and the bass falls by semitones into I. Now any jazz standard’s harmony reads.',
            ru: '♭II7 заменяет V7, отстоящий на тритон, и бас спускается к I по полутонам. Теперь читается гармония любого джазового стандарта.',
          },
        },
        { kind: 'progression', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR },
        {
          kind: 'link',
          title: {
            en: 'The tritone substitution in Progressions',
            ru: 'Тритоновая замена в последовательностях',
          },
          target: { place: 'progressions', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'How to practise', ru: 'Как заниматься' },
      blocks: [
        { kind: 'progression', numerals: 'I IV V I', key: G_MAJOR },
        {
          kind: 'steps',
          steps: [
            { en: 'A week on each step, at the least.', ru: 'Не меньше недели на каждый шаг.' },
            { en: 'Steps 1 to 5 in C, G, D and F.', ru: 'Шаги 1–5 — в до, соль, ре и фа.' },
            {
              en: 'From step 6 on, all twelve keys.',
              ru: 'Начиная с шага 6 — во всех двенадцати тональностях.',
            },
            {
              en: 'Skip one only if it is clean in three keys.',
              ru: 'Пропускайте шаг, только если чисто играете его в трёх тональностях.',
            },
          ],
        },
      ],
    },
  ],
}

export default progressionsInOrder
