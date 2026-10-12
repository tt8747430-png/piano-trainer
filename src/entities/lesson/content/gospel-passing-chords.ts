import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelPassingChords: Lesson = {
  id: 'gospel-passing-chords',
  title: { en: 'Gospel passing chords', ru: 'Проходящие аккорды в госпеле' },
  summary: {
    en: 'The moves between chords that make a hymn sound gospel: I to IV, the raised-4th diminished, the walk-up, and a ii–V into any chord.',
    ru: 'Ходы между аккордами, от которых гимн звучит как госпел: с I на IV, уменьшённый на повышенной IV, подход снизу и ii–V в любой аккорд.',
  },
  level: 3,
  category: 'gospel',
  module: 'gospel',
  sections: [
    {
      heading: { en: 'From I to IV', ru: 'С I на IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'On the way from I to IV, turn I into a dominant 7th. In C, C becomes C7, and C7 pulls into F.',
            ru: 'По пути от I к IV превратите I в доминантсептаккорд. В до мажоре C становится C7, и C7 тянет в F.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'It is the most common gospel move. Tap the row below.',
            ru: 'Это самый частый ход в госпеле. Нажмите аккорды ниже.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'link',
          title: { en: 'C to F in Passing chords', ru: 'Из C в F в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'F' },
        },
      ],
    },
    {
      heading: { en: 'The raised-4th diminished', ru: 'Уменьшённый на повышенной IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From IV back to I, pass through the diminished 7th on the raised 4th. In C: F, F♯°7, then C over G.',
            ru: 'От IV обратно к I пройдите через уменьшённый септаккорд на повышенной IV ступени. В до мажоре: F, F♯°7, затем C с басом соль.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'C over G, written C/G, is a C chord with G in the bass. So the bass climbs F, F♯, G.',
            ru: 'C с басом соль пишут C/G. Поэтому бас поднимается: фа, фа-диез, соль.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'C/G'] },
        {
          kind: 'link',
          title: { en: 'F to C/G in Passing chords', ru: 'Из F в C/G в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'F', to: 'C/G' },
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
            en: 'approaches I from ♭VI and ♭VII: A♭, B♭, C. In a hymn’s last bar it sounds like a choir’s final rise.',
            ru: 'ведёт к I от ♭VI и ♭VII: A♭, B♭, C. В последнем такте гимна он звучит как финальный подъём хора.',
          },
        },
        { kind: 'chords', symbols: ['A♭', 'B♭', 'C'] },
        {
          kind: 'link',
          title: { en: 'F to C in Passing chords', ru: 'Из F в C в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'F', to: 'C' },
        },
      ],
    },
    {
      heading: { en: 'A ii–V into any chord', ru: 'ii–V в любой аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Any chord can be approached by its own ii and V. Before Dm7, play the ii and V of D minor: Em7♭5 and A7.',
            ru: 'К любому аккорду можно подойти через его собственные ii и V. Перед Dm7 сыграйте ii и V ре минора: Em7♭5 и A7.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The row below is C, Em7♭5, A7, Dm7. Em7 in place of Em7♭5 keeps to C major’s notes and leads in just as well.',
            ru: 'Ниже — C, Em7♭5, A7, Dm7. Em7 вместо Em7♭5 не выходит из звуков до мажора и ведёт так же хорошо.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Em7♭5', 'A7', 'Dm7'] },
        {
          kind: 'link',
          title: { en: 'C to Dm7 in Passing chords', ru: 'Из C в Dm7 в «Проходящих аккордах»' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'Dm7' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the diminished 7th between F and G.',
            ru: 'Сыграйте уменьшённый септаккорд между F и G.',
          },
          answer: { chord: 'F#°7' },
        },
      ],
    },
  ],
}

export default gospelPassingChords
