import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const A_MINOR = { tonic: note('A'), minor: true }

const commonProgressions: Lesson = {
  id: 'common-progressions',
  after: ['chord-functions'],
  title: { en: 'Common progressions', ru: 'Распространённые последовательности' },
  summary: {
    en: 'Learn the few chord orders that most songs are built on, in major and in minor.',
    ru: 'Выучите несколько порядков аккордов, на которых построено большинство песен, в мажоре и в миноре.',
  },
  sections: [
    {
      heading: { en: 'I–IV–V–I', ru: 'I–IV–V–I' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A progression', ru: 'Последовательность' },
          text: {
            en: 'is an order of chords, written in numerals so it works in any key. This one plays the three primary chords, then goes home.',
            ru: '— это порядок аккордов, записанный цифрами, чтобы он подходил к любой тональности. Эта проходит три главных аккорда и возвращается домой.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'Most hymns and folk songs use it.',
            ru: 'На ней держится большинство гимнов и народных песен.',
          },
        },
      ],
    },
    {
      heading: { en: 'I–V–vi–IV', ru: 'I–V–vi–IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This is the pop progression. Countless pop and worship songs repeat it. Here it is in G major.',
            ru: 'Это поп-последовательность. Её повторяют бесчисленные поп-песни и песни прославления. Здесь она в соль мажоре.',
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
            en: 'Many songs of the 1950s use this order. The minor vi softens the step from I to IV. Here it is in F major.',
            ru: 'Этот порядок звучит во многих песнях 1950-х. Минорный vi смягчает переход от I к IV. Здесь он в фа мажоре.',
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
            en: 'Jazz and many hymns end their phrases this way. ii leads to V, and V leads home. It is played here with 7th chords.',
            ru: 'Так заканчивают фразы джаз и многие гимны. ii ведёт к V, а V — домой. Здесь она звучит септаккордами.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
      ],
      takeaway: {
        en: 'ii–V–I is the strongest way home: each root falls a 5th.',
        ru: 'ii–V–I — самый сильный путь домой: каждый основной тон падает на квинту.',
      },
    },
    {
      heading: { en: 'Why roots matter', ru: 'Почему важны основные тоны' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Root motion', ru: 'Ход основных тонов' },
          text: {
            en: 'is how far each chord’s root moves to the next. A root falling a 5th pulls hardest. This chain falls by 5ths all the way home.',
            ru: '— это расстояние, на которое основной тон аккорда переходит к следующему. Сильнее всего тянет ход на квинту вниз. Эта цепочка идёт квинтами вниз до самого дома.',
          },
        },
        { kind: 'progression', numerals: 'I IV vii° iii vi ii V I', key: C_MAJOR, show: 'motion' },
      ],
      takeaway: {
        en: 'Roots falling by 5ths are the engine of tonal harmony.',
        ru: 'Ход основных тонов на квинту вниз — двигатель тональной гармонии.',
      },
    },
    {
      heading: { en: 'In a minor key: i–iv–V–i', ru: 'В миноре: i–iv–V–i' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Minor numerals count from the natural minor scale. Then the 7th note is raised, so V turns major and leads home.',
            ru: 'В миноре ступени считают от натурального минора. Затем седьмую ступень повышают, и V становится мажорной и ведёт домой.',
          },
        },
        { kind: 'progression', numerals: 'i iv V i', key: A_MINOR },
      ],
    },
    {
      heading: { en: 'Minor pop: i–VI–III–VII', ru: 'Минорный поп: i–VI–III–VII' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The relative major', ru: 'Параллельный мажор' },
          text: {
            en: 'shares a minor key’s notes: C major for A minor. This progression plays only their shared chords.',
            ru: '— мажор с теми же нотами, что и минор: до мажор для ля минора. Эта последовательность берёт только их общие аккорды.',
          },
        },
        { kind: 'progression', numerals: 'i VI III VII', key: A_MINOR },
      ],
    },
    {
      heading: { en: 'The Andalusian cadence', ru: 'Андалузская каденция' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Four chords step down, from i to V. The bass walks down A, G, F, E.',
            ru: 'Четыре аккорда спускаются по ступеням от i к V. Бас идёт вниз: ля, соль, фа, ми.',
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
          title: { en: 'I–IV–V–I through all the keys', ru: 'I–IV–V–I по всем тональностям' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths' },
        },
        {
          kind: 'link',
          title: {
            en: 'More progressions, by style, in Progressions',
            ru: 'Другие последовательности по стилям',
          },
          target: { opens: 'progressions', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default commonProgressions
