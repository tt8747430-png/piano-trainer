import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelPassingChords: Lesson = {
  id: 'gospel-passing-chords',
  title: { en: 'Gospel passing chords', ru: 'Проходящие аккорды в госпел' },
  summary: {
    en: 'The moves between chords that make a hymn sound gospel: the 1 to the 4, the raised-4th diminished, the walk-up and a ii–V into any chord.',
    ru: 'Ходы между аккордами, от которых гимн звучит как госпел: с первой на четвёртую, уменьшённый на повышенной IV, подход снизу и ii–V в любой аккорд.',
  },
  level: 3,
  category: 'gospel',
  module: 'gospel',
  sections: [
    {
      heading: { en: 'The 1 to the 4', ru: 'С первой на четвёртую' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The most common gospel move: on the way from I to IV, turn I into a dominant 7th. C7 pulls into F.',
            ru: 'Самый частый ход в госпел: по пути от I к IV превратите I в доминантсептаккорд. C7 тянет в F.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'link',
          title: { en: 'C to F in Passing chords', ru: 'Из C в F в проходящих аккордах' },
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
            en: 'From IV back to I, pass through the diminished 7th on the raised 4th: F, F♯°7, then C over G. The bass climbs F, F♯, G.',
            ru: 'От IV обратно к I пройдите через уменьшённый септаккорд на повышенной IV ступени: F, F♯°7, затем C с басом соль. Бас поднимается фа, фа-диез, соль.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'C/G'] },
        {
          kind: 'link',
          title: { en: 'F to G in Passing chords', ru: 'Из F в G в проходящих аккордах' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'F', to: 'G' },
        },
      ],
    },
    {
      heading: { en: 'The walk-up', ru: 'Подход снизу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Approach I from ♭VI and ♭VII: A♭, B♭, C. In a hymn’s last bar it sounds like a choir’s final rise.',
            ru: 'Подойдите к I от ♭VI и ♭VII: A♭, B♭, C. В последнем такте гимна это звучит как финальный подъём хора.',
          },
        },
        { kind: 'chords', symbols: ['A♭', 'B♭', 'C'] },
      ],
    },
    {
      heading: { en: 'A ii–V into any chord', ru: 'ii–V в любой аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Any chord can be approached by its own ii and V. Before Dm7, play the ii and V of D minor, Em7♭5 and A7: C, Em7♭5, A7, Dm7. Em7 in place of Em7♭5 keeps to C major’s notes and leads in just as well.',
            ru: 'К любому аккорду можно подойти через его собственные ii и V. Перед Dm7 сыграйте ii и V ре минора, Em7♭5 и A7: C, Em7♭5, A7, Dm7. Em7 вместо Em7♭5 не выходит из звуков до мажора и ведёт так же хорошо.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Em7♭5', 'A7', 'Dm7'] },
        {
          kind: 'link',
          title: { en: 'C to Dm in Passing chords', ru: 'Из C в Dm в проходящих аккордах' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'Dm' },
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
