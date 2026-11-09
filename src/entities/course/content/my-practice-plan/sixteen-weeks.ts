import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const F_MAJOR = { tonic: note('F'), minor: false }
const G_MAJOR = { tonic: note('G'), minor: false }

/** My Practice Plan: the sixteen weeks in four blocks, the daily technique block, and the checkpoints. */
const sixteenWeeks: Lesson = {
  id: 'sixteen-weeks',
  title: { en: 'Sixteen weeks, week by week', ru: 'Шестнадцать недель по неделям' },
  summary: {
    en: 'What to practise in each block of four weeks, the ten-minute technique block for every day, and the checkpoints before moving on.',
    ru: 'Что играть в каждом блоке из четырёх недель, десятиминутный технический блок на каждый день и проверки перед тем, как идти дальше.',
  },
  after: ['the-plan'],
  sections: [
    {
      heading: {
        en: 'Every day: ten minutes of technique',
        ru: 'Каждый день: десять минут техники',
      },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'The week’s scale, two octaves, hands apart then together.',
              ru: 'Гамма недели, две октавы, отдельно, потом вместе.',
            },
            { en: 'Its arpeggio, the same way.', ru: 'Её арпеджио так же.' },
            {
              en: 'Its I, IV and V through their inversions.',
              ru: 'Её I, IV и V по всем обращениям.',
            },
            {
              en: 'One diminished 7th, resolved.',
              ru: 'Один уменьшённый септаккорд с разрешением.',
            },
          ],
        },
        { kind: 'scale', root: note('G'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Weeks 1–4: shapes and fingers', ru: 'Недели 1–4: фигуры и пальцы' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Triads and 7ths on all twelve roots, fingered.',
              ru: 'Трезвучия и септаккорды от всех двенадцати звуков, с аппликатурой.',
            },
            { en: 'The six inversion drills.', ru: 'Шесть упражнений на обращения.' },
            {
              en: 'Arpeggios in C, G, F, then the black keys.',
              ru: 'Арпеджио в до, соль, фа, потом от чёрных клавиш.',
            },
            {
              en: 'The key’s chords by number, in its key.',
              ru: 'Аккорды тональности по ступеням.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Weeks 5–8: rhythm and the left hand', ru: 'Недели 5–8: ритм и левая рука' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'One accompaniment rhythm a week, under a song.',
              ru: 'Один ритм аккомпанемента в неделю, под песню.',
            },
            {
              en: 'One rung of the left hand’s ladder a week.',
              ru: 'Одна ступень лестницы левой руки в неделю.',
            },
            {
              en: 'Shells, then rootless voicings, on ii – V – I.',
              ru: 'Шеллы, затем аккорды без баса на ii – V – I.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I V vi IV', key: G_MAJOR },
      ],
    },
    {
      heading: {
        en: 'Weeks 9–12: diminished and passing chords',
        ru: 'Недели 9–12: уменьшённые и проходящие',
      },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'The diminished drill every day.', ru: 'Упражнение на уменьшённые каждый день.' },
            {
              en: 'One passing chord a week, in every key you know.',
              ru: 'Один проходящий аккорд в неделю, во всех знакомых тональностях.',
            },
            {
              en: 'The 3–6–2–5 turnaround round the circle.',
              ru: 'Оборот 3–6–2–5 по квинтовому кругу.',
            },
          ],
        },
        { kind: 'progression', numerals: 'iii vi ii V I', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: {
        en: 'Weeks 13–16: hymns, improvising, by ear',
        ru: 'Недели 13–16: гимны, импровизация, слух',
      },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Arrange one hymn in the five steps.',
              ru: 'Обработайте один гимн в пять шагов.',
            },
            {
              en: 'Five minutes of improvising over its chords.',
              ru: 'Пять минут импровизации на его аккорды.',
            },
            {
              en: 'Find one new song by ear each week.',
              ru: 'Каждую неделю подбирайте на слух одну новую песню.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I IV I V', key: F_MAJOR },
      ],
    },
    {
      heading: { en: 'Checkpoints', ru: 'Проверки' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'End of each week: the drills at 90, clean, three times.',
              ru: 'В конце недели: упражнения на 90, чисто, три раза.',
            },
            {
              en: 'End of each block: record one song and listen.',
              ru: 'В конце блока: запишите одну песню и послушайте.',
            },
            {
              en: 'Not clean yet? Repeat the week. That is the plan working.',
              ru: 'Пока не чисто? Повторите неделю. Так план и работает.',
            },
          ],
        },
        { kind: 'chords', symbols: ['C', 'G/B', 'Am', 'F'] },
      ],
      takeaway: {
        en: 'Move on when it is clean, not when the week ends.',
        ru: 'Идите дальше, когда чисто, а не когда кончилась неделя.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Today’s technique block in G: play the G major chord, then its first inversion.',
            ru: 'Технический блок в соль: сыграйте соль мажор, потом его секстаккорд.',
          },
          answer: { notes: ['B', 'D', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'The scale routine in G', ru: 'Работа над гаммой соль мажор' },
          target: { opens: 'exercise', exercise: 'scale-routine', root: note('G') },
        },
        {
          kind: 'link',
          title: { en: 'Arpeggio on G in the Player', ru: 'Арпеджио от соль в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('G') },
        },
      ],
    },
  ],
}

export default sixteenWeeks
