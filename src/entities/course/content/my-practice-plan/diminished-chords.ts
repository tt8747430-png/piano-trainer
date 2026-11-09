import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** My Practice Plan: the diminished triad and 7th, the three diminished 7ths, and their uses. */
const diminishedChords: Lesson = {
  id: 'diminished-chords',
  title: { en: 'Diminished chords', ru: 'Уменьшённые аккорды' },
  summary: {
    en: 'The diminished triad and 7th, why there are only three diminished 7ths, how each resolves, the four dominants inside one, and a daily drill.',
    ru: 'Уменьшённое трезвучие и септаккорд, почему уменьшённых септаккордов всего три, как они разрешаются, четыре доминанты в одном и ежедневное упражнение.',
  },
  after: ['voicings'],
  sections: [
    {
      heading: { en: 'The diminished triad', ru: 'Уменьшённое трезвучие' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A diminished triad', ru: 'Уменьшённое трезвучие' },
          text: {
            en: 'stacks two minor 3rds: B, D, F. It is chord vii of a major key and pulls hard toward I.',
            ru: 'складывается из двух малых терций: си, ре, фа. Это аккорд vii мажорной тональности, он сильно тянется к I.',
          },
        },
        { kind: 'chords', symbols: ['B°', 'C'] },
      ],
    },
    {
      heading: { en: 'The diminished 7th', ru: 'Уменьшённый септаккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A diminished 7th', ru: 'Уменьшённый септаккорд' },
          text: {
            en: 'adds one more minor 3rd on top: B, D, F, A♭. Every note is a minor 3rd from the next.',
            ru: 'добавляет сверху ещё одну малую терцию: си, ре, фа, ля-бемоль. Все звуки на малую терцию друг от друга.',
          },
        },
        { kind: 'grid', quality: 'o7' },
      ],
    },
    {
      heading: { en: 'Only three of them', ru: 'Их всего три' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move a diminished 7th up a minor 3rd and you get the same four notes. So all twelve are only three chords: C°7, C♯°7 and D°7.',
            ru: 'Сдвиньте уменьшённый септаккорд на малую терцию — получатся те же четыре звука. Поэтому все двенадцать — это три аккорда: C°7, C♯°7 и D°7.',
          },
        },
        { kind: 'chords', symbols: ['C°7', 'C#°7', 'D°7'], apart: true },
      ],
      takeaway: {
        en: 'Learn three shapes and you know every diminished 7th.',
        ru: 'Выучите три фигуры — и вы знаете все уменьшённые септаккорды.',
      },
    },
    {
      heading: { en: 'Every note moves by step', ru: 'Каждый звук идёт на ступень' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'B°7 resolves to C. B rises to C, D falls to C, F falls to E, and A♭ falls to G.',
            ru: 'B°7 разрешается в C. Си поднимается к до, ре спускается к до, фа к ми, ля-бемоль к соль.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'B°7', degrees: '| 1 ♭3 ♭5 𝄫7', hands: '| B3 D4 F4 A♭4' },
            { symbol: 'C', degrees: '| 1 3 5', hands: '| C4 E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Four dominants in one chord', ru: 'Четыре доминанты в одном аккорде' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Put a bass a half step under any note of B°7 and it becomes a 7♭9 chord. Under A♭ it is G7♭9, which resolves to C.',
            ru: 'Поставьте бас на полтона ниже любого звука B°7 — получится аккорд 7♭9. Под ля-бемолем это G7♭9, он разрешается в C.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'G7♭9', degrees: '1 | 3 5 ♭7 ♭9', hands: 'G2 | B3 D4 F4 A♭4' },
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Climbing a half step', ru: 'Подъём на полтона' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Put a diminished 7th on the half step between two chords. C – C♯°7 – Dm climbs C, C♯, D in the bass.',
            ru: 'Поставьте уменьшённый септаккорд на полутон между двумя аккордами. C – C♯°7 – Dm поднимает бас: до, до-диез, ре.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C#°7', 'Dm'] },
      ],
    },
    {
      heading: { en: 'The daily drill', ru: 'Ежедневное упражнение' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play C°7, C♯°7 and D°7 in all four positions.',
              ru: 'Сыграйте C°7, C♯°7 и D°7 во всех четырёх положениях.',
            },
            {
              en: 'Resolve each to the chord a half step above its bass.',
              ru: 'Разрешите каждый в аккорд на полтона выше его баса.',
            },
            {
              en: 'Break each into an arpeggio up two octaves.',
              ru: 'Разложите каждый в арпеджио на две октавы вверх.',
            },
          ],
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'B3/8 D4/8 F4/8 A♭4/8 B4/8 D5/8 F5/8 A♭5/8 B5/1',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C♯°7.', ru: 'Сыграйте C♯°7.' },
          answer: { chord: 'C#°7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the diminished 7th that resolves to C: B, D, F, A♭.',
            ru: 'Сыграйте уменьшённый септаккорд, разрешающийся в C: си, ре, фа, ля-бемоль.',
          },
          answer: { chord: 'B°7' },
        },
        {
          kind: 'link',
          title: {
            en: 'The sixth-diminished scale’s chords in the Player',
            ru: 'Аккорды секстово-уменьшённой гаммы в плеере',
          },
          target: { opens: 'exercise', exercise: 'sixth-diminished-chords', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Name the chord: Quiz', ru: 'Назовите аккорд: викторина' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
      ],
    },
  ],
}

export default diminishedChords
