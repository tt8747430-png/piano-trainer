import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Sixteen-Week Practice Plan, lesson 7: the passing-chord toolkit church and gospel players use. */
const passingChords: Lesson = {
  id: 'passing-chords',
  title: { en: 'Passing chords', ru: 'Проходящие аккорды' },
  summary: {
    en: 'The ii – V – I, each chord’s own V, diminished passing chords, the 3–6–2–5 turnaround, sus and slash chords, and the tritone substitution.',
    ru: 'ii – V – I, своя доминанта к каждому аккорду, уменьшённые проходящие, оборот 3–6–2–5, sus и аккорды над басом, тритоновая замена.',
  },
  after: ['diminished-chords'],
  sections: [
    {
      heading: { en: 'The ii – V – I', ru: 'ii – V – I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The ii – V – I is the strongest pull in harmony. Any chord can be reached by its own ii and V.',
            ru: 'ii – V – I — самое сильное тяготение в гармонии. К любому аккорду можно прийти через его ii и V.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'Each chord’s own V', ru: 'Своя доминанта к каждому аккорду' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
          text: {
            en: 'is the V7 of a chord other than I. Before Dm play A7. Before F play C7.',
            ru: '— V7 к аккорду, который не I. Перед Dm играйте A7. Перед F — C7.',
          },
        },
        { kind: 'chords', symbols: ['C', 'A7', 'Dm'] },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
      ],
      takeaway: {
        en: 'Make any chord feel like home for a moment by playing its V7 first.',
        ru: 'Любой аккорд на миг станет тоникой, если сыграть перед ним его V7.',
      },
    },
    {
      heading: { en: 'Diminished passing chords', ru: 'Уменьшённые проходящие' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A diminished passing chord', ru: 'Уменьшённый проходящий аккорд' },
          text: {
            en: 'fills a half step in the bass. From F to C/G, play F♯°7 and the bass climbs F, F♯, G.',
            ru: 'заполняет полутон в басу. От F к C/G сыграйте F♯°7, и бас поднимется: фа, фа-диез, соль.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'C/G'] },
      ],
    },
    {
      heading: { en: 'The 3–6–2–5 turnaround', ru: 'Оборот 3–6–2–5' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'To get back to I, step down through iii, vi, ii and V. Then make vi and ii dominant for the gospel sound.',
            ru: 'Чтобы вернуться к I, пройдите iii, vi, ii и V. Затем сделайте vi и ii доминантами — получится звучание госпела.',
          },
        },
        { kind: 'progression', numerals: 'iii vi ii V I', key: C_MAJOR, size: 'sevenths' },
        { kind: 'chords', symbols: ['Em7', 'A7', 'D7', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'Sus and slash chords', ru: 'Sus и аккорды над басом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sus chord', ru: 'Sus-аккорд' },
          text: {
            en: 'holds the 4th in place of the 3rd, then resolves to it. F/G is the gospel V: an F triad over a G bass.',
            ru: 'держит кварту вместо терции и разрешается в неё. F/G — госпел-доминанта: трезвучие фа над басом соль.',
          },
        },
        { kind: 'chords', symbols: ['Gsus4', 'G', 'C'] },
        { kind: 'chords', symbols: ['F/G', 'C'] },
      ],
    },
    {
      heading: { en: 'The tritone substitution', ru: 'Тритоновая замена' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tritone substitution', ru: 'Тритоновая замена' },
          text: {
            en: 'swaps V7 for the 7th chord a tritone away. D♭7 slides into C by a half step.',
            ru: 'меняет V7 на септаккорд в тритоне от него. D♭7 соскальзывает в C на полтона.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'D♭7', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the secondary dominant that leads to Dm.',
            ru: 'Сыграйте побочную доминанту, которая ведёт к Dm.',
          },
          answer: { chord: 'A7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the diminished chord that climbs from F to G.',
            ru: 'Сыграйте уменьшённый аккорд, который поднимается от фа к соль.',
          },
          answer: { chord: 'F#°7' },
        },
        {
          kind: 'link',
          title: { en: 'The turnaround round the circle', ru: 'Оборот по квинтовому кругу' },
          target: {
            opens: 'player',
            numerals: 'iii vi ii V I',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'fifths',
          },
        },
        {
          kind: 'link',
          title: { en: 'A ii – V to every chord of C', ru: 'ii – V к каждому аккорду до мажора' },
          target: {
            opens: 'player',
            numerals: 'ii/ii V/ii ii ii/IV V/IV IV ii V I',
            key: C_MAJOR,
            size: 'sevenths',
          },
        },
      ],
    },
  ],
}

export default passingChords
