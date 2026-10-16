import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelPassingChords: Lesson = {
  id: 'gospel-passing-chords',
  title: { en: 'Gospel passing chords', ru: 'Проходящие аккорды в госпеле' },
  summary: {
    en: 'Join a hymn’s chords with gospel passing chords.',
    ru: 'Связывайте аккорды гимна проходящими аккордами госпела.',
  },
  sections: [
    {
      heading: { en: 'From I to IV', ru: 'С I на IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The most common gospel move: on the way to IV, turn I into a dominant 7th. C7 pulls into F.',
            ru: 'Самый частый ход в госпеле: по пути к IV превратите I в доминантсептаккорд. C7 тянет в F.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
        {
          kind: 'link',
          title: { en: 'C to F in Passing chords', ru: 'Из C в F в «Проходящих аккордах»' },
          target: { opens: 'between', key: C_MAJOR, from: 'C', to: 'F' },
        },
      ],
    },
    {
      heading: { en: 'The raised-4th diminished', ru: 'Уменьшённый на повышенной IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From IV back to I, pass through the diminished 7th on the raised 4th. With I over its 5th, the bass climbs F, F♯, G.',
            ru: 'От IV обратно к I пройдите через уменьшённый септаккорд на повышенной IV. С I над квинтой бас поднимается: фа, фа-диез, соль.',
          },
        },
        { kind: 'chords', symbols: ['F', 'F#°7', 'C/G'] },
        {
          kind: 'link',
          title: { en: 'F to C/G in Passing chords', ru: 'Из F в C/G в «Проходящих аккордах»' },
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
            en: 'approaches I from ♭VI and ♭VII: A♭, B♭, C. It is the gospel ending.',
            ru: 'ведёт к I от ♭VI и ♭VII: A♭, B♭, C. Это госпел-окончание.',
          },
        },
        { kind: 'chords', symbols: ['A♭', 'B♭', 'C'] },
        {
          kind: 'link',
          title: { en: 'F to C in Passing chords', ru: 'Из F в C в «Проходящих аккордах»' },
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
            en: 'Any chord can be approached by its own ii and V. Before Dm7, play D minor’s: Em7♭5 and A7.',
            ru: 'К любому аккорду можно подойти через его собственные ii и V. Перед Dm7 сыграйте ii и V ре минора: Em7♭5 и A7.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Em7♭5', 'A7', 'Dm7'] },
        {
          kind: 'note',
          text: {
            en: 'Em7 in place of Em7♭5 keeps to C major’s notes.',
            ru: 'Em7 вместо Em7♭5 не выходит из звуков до мажора.',
          },
        },
        {
          kind: 'link',
          title: { en: 'C to Dm7 in Passing chords', ru: 'Из C в Dm7 в «Проходящих аккордах»' },
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
          title: { en: 'I–IV–I–V in the Player', ru: 'I–IV–I–V в плеере' },
          target: { opens: 'player', numerals: 'I IV I V', key: C_MAJOR, size: 'sevenths' },
        },
        {
          kind: 'link',
          title: { en: 'Chords by ear in the Quiz', ru: 'Аккорды на слух в тестах' },
          target: { opens: 'quiz', trainer: 'chords-by-ear' },
        },
      ],
    },
  ],
}

export default gospelPassingChords
