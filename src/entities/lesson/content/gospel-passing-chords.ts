import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const gospelPassingChords: Lesson = {
  id: 'gospel-passing-chords',
  title: { en: 'Gospel passing chords', ru: 'Проходящие аккорды в госпеле' },
  summary: {
    en: 'Fill the gap between two of a hymn’s chords with the passing chords gospel players use.',
    ru: 'Заполняйте промежуток между аккордами гимна проходящими аккордами, как играют в госпеле.',
  },
  sections: [
    {
      heading: { en: 'From I to IV', ru: 'С I на IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This is the most common gospel move. On the way from I to IV, add a minor 7th to I. C becomes C7, which pulls into F.',
            ru: 'Это самый частый ход в госпеле. По пути от I к IV добавьте к I малую септиму. C превращается в C7, и он тянет в F.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'link',
          title: { en: 'See the chords between C and F', ru: 'Аккорды между C и F' },
          target: { opens: 'between', key: C_MAJOR, from: 'C', to: 'F' },
        },
      ],
    },
    {
      heading: { en: 'From IV back to I', ru: 'С IV обратно на I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Going back, pass through the diminished 7th on F♯. Then play I with G in the bass. The bass climbs by half steps: F, F♯, G.',
            ru: 'На обратном пути пройдите через уменьшённый септаккорд от фа-диеза. Затем сыграйте I с соль в басу. Бас поднимается по полутонам: фа, фа-диез, соль.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'C/G'] },
        {
          kind: 'link',
          title: { en: 'See the chords between F and C/G', ru: 'Аккорды между F и C/G' },
          target: { opens: 'between', key: C_MAJOR, from: 'F', to: 'C/G' },
        },
      ],
    },
    {
      heading: { en: 'The walk-up', ru: 'Подход снизу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The walk-up', ru: 'Подход снизу' },
          text: {
            en: 'climbs to I from ♭VI and ♭VII, two chords borrowed from minor: A♭, B♭, C. Many gospel songs end this way.',
            ru: 'поднимается к I от ♭VI и ♭VII, двух аккордов из минора: A♭, B♭, C. Так заканчиваются многие госпел-песни.',
          },
        },
        { kind: 'chords', symbols: ['A♭', 'B♭', 'C'] },
        {
          kind: 'link',
          title: { en: 'See the chords between F and C', ru: 'Аккорды между F и C' },
          target: { opens: 'between', key: C_MAJOR, from: 'F', to: 'C' },
        },
      ],
    },
    {
      heading: { en: 'A ii–V into any chord', ru: 'ii–V в любой аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'You can reach any chord through its own ii and V. Dm7 is minor, so use D minor’s ii and V: Em7♭5 and A7.',
            ru: 'К любому аккорду можно подойти через его собственные ii и V. Dm7 минорный, поэтому берите ii и V ре минора: Em7♭5 и A7.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Em7♭5', 'A7', 'Dm7'] },
        {
          kind: 'note',
          text: {
            en: 'Play Em7 instead of Em7♭5 to stay inside C major’s notes.',
            ru: 'Сыграйте Em7 вместо Em7♭5, чтобы остаться в звуках до мажора.',
          },
        },
        {
          kind: 'link',
          title: { en: 'See the chords between C and Dm7', ru: 'Аккорды между C и Dm7' },
          target: { opens: 'between', key: C_MAJOR, from: 'C', to: 'Dm7' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the chord that turns C toward F.',
            ru: 'Сыграйте аккорд, который поворачивает C к F.',
          },
          answer: { chord: 'C7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the diminished 7th between F and G.',
            ru: 'Сыграйте уменьшённый септаккорд между F и G.',
          },
          answer: { chord: 'F#°7' },
        },
        {
          kind: 'link',
          title: { en: 'Practise I–IV–I–V in the Player', ru: 'I–IV–I–V в плеере' },
          target: { opens: 'player', numerals: 'I IV I V', key: C_MAJOR, size: 'sevenths' },
        },
        {
          kind: 'link',
          title: { en: 'Hear chords in the Quiz', ru: 'Аккорды на слух в тестах' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'ear' },
        },
      ],
    },
  ],
}

export default gospelPassingChords
