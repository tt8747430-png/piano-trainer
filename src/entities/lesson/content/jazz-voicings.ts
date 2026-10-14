import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const B_FLAT = { tonic: note('B', -1), minor: false }

/**
 * The jazz voicings sheet: major, minor and dominant chords beyond the basic 9ths, the dominant's
 * alterations, the slash chords that write them as two simple shapes, and drop 2.
 */
const jazzVoicings: Lesson = {
  id: 'jazz-voicings',
  title: { en: 'Jazz voicings', ru: 'Джазовые расположения' },
  summary: {
    en: 'Major, minor and dominant voicings, the altered dominant, slash chords over it, and drop 2.',
    ru: 'Расположения мажорных, минорных и доминантовых аккордов, альтерированная доминанта, слэш-аккорды и drop 2.',
  },
  level: 4,
  module: 'gorshkov',
  sections: [
    {
      heading: { en: 'Major: triads, 6ths and 9ths', ru: 'Мажор: трезвучия, сексты и ноны' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Spread triads sound light and classical. For a major 7th, swap the top C for B.',
            ru: 'Широкие трезвучия звучат светло и классично. Для большого септаккорда замените верхнее до на си.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 5 | 3 5 1', hands: 'C3 G3 | E4 G4 C5' },
            { symbol: 'CMaj7', degrees: '1 5 | 3 5 7', hands: 'C3 G3 | E4 G4 B4' },
            { symbol: 'C6', degrees: '1 5 | 3 6 1', hands: 'C3 G3 | E4 A4 C5' },
            { symbol: 'C6/9', degrees: '1 5 | 3 6 9', hands: 'C3 G3 | E4 A4 D5' },
            { symbol: 'CMaj9', degrees: '1 | 3 5 7 9', hands: 'C3 | E4 G4 B4 D5' },
            { symbol: 'CMaj9', degrees: '1 | 7 9 3 5', hands: 'C3 | B3 D4 E4 G4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'A minor chord takes the same shapes with E♭ for E.',
            ru: 'Минорный аккорд берёт те же расположения с ми-бемолем вместо ми.',
          },
        },
      ],
    },
    {
      heading: { en: 'Minor: the 11th', ru: 'Минор: ундецима' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cm11 is two triads, C minor and B♭ major. Spread wide, it is two 5ths in each hand, a semitone between the hands.',
            ru: 'Cm11 — это два трезвучия, до минор и си-бемоль мажор. В широком расположении это две квинты в каждой руке и полутон между руками.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cm11', degrees: '1 | 1 ♭3 5 ♭7 9 11', hands: 'C3 | C4 E♭4 G4 B♭4 D5 F5' },
            { symbol: 'Cm11', degrees: '1 5 9 | ♭3 ♭7 11', hands: 'C3 G3 D4 | E♭4 B♭4 F5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Minor: 6ths and the major 7th', ru: 'Минор: секста и большая септима' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The minor 6th sounds dramatic, more so with its 9th. CmMaj9 hides an augmented triad, E♭ G B: use it for tension.',
            ru: 'Минорный секстаккорд звучит драматично, а с ноной — ещё больше. В CmMaj9 спрятано увеличенное трезвучие ми-бемоль, соль, си: оно для напряжения.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cm6', degrees: '1 5 | ♭3 6 1', hands: 'C3 G3 | E♭4 A4 C5' },
            { symbol: 'Cm6/9', degrees: '1 5 | ♭3 6 9', hands: 'C3 G3 | E♭4 A4 D5' },
            { symbol: 'CmMaj9', degrees: '1 | ♭3 5 7 9', hands: 'C3 | E♭4 G4 B4 D5' },
          ],
        },
      ],
    },
    {
      heading: {
        en: 'Half-diminished: a bass and a minor triad',
        ru: 'Полууменьшённый: бас и минорное трезвучие',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Think of Cm7♭5 as C in the bass under an E♭ minor triad. It begins the minor ii–V–I.',
            ru: 'Думайте о Cm7♭5 как о до в басу под ми-бемоль минорным трезвучием. С него начинается минорный ii–V–I.',
          },
        },
        {
          kind: 'voicings',
          key: B_FLAT,
          voicings: [
            { symbol: 'Cm7♭5', caption: 'ii', degrees: '1 | ♭3 ♭5 ♭7', hands: 'C3 | E♭4 G♭4 B♭4' },
            { symbol: 'F7', caption: 'V', degrees: '1 | ♭7 3 5', hands: 'F2 | E♭4 A4 C5' },
            { symbol: 'B♭6', caption: 'I', degrees: '1 | 3 6 1', hands: 'B♭2 | D4 G4 B♭4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Dominants: the tritone', ru: 'Доминанты: тритон' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A 7 after the letter means a dominant. Its 3rd and 7th make a tritone, which never changes. The 5th can go.',
            ru: '7 сразу после буквы означает доминанту. Её терция и септима образуют тритон, который не меняется. Квинту можно пропустить.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'G7', degrees: '1 | ♭7 3', hands: 'G2 | F3 B3' },
            { symbol: 'G9', degrees: '1 | 3 ♭7 9', hands: 'G2 | B3 F4 A4' },
            { symbol: 'G7♭9', degrees: '1 | 3 ♭7 ♭9', hands: 'G2 | B3 F4 A♭4' },
            { symbol: 'G13', degrees: '1 ♭7 | 3 13 9', hands: 'G2 F3 | B3 E4 A4' },
            { symbol: 'G13', degrees: '1 | ♭7 9 3 13', hands: 'G2 | F3 A3 B3 E4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Altering a dominant', ru: 'Альтерация доминанты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Any note but the root and tritone can change: the 5th and 9th up or down, the 11th up, the 13th down.',
            ru: 'Меняться может любой звук, кроме основного тона и тритона: квинта и нона вверх или вниз, 11 вверх, 13 вниз.',
          },
        },
        {
          kind: 'chords',
          symbols: ['G7♭5', 'G7#5', 'G7♭9', 'G7#9', 'G7#11', 'G7♭13'],
          apart: true,
        },
        {
          kind: 'note',
          text: {
            en: 'G7alt alters all it can: A♭, A♯ and E♭.',
            ru: 'В G7alt изменено всё, что можно: ля-бемоль, ля-диез и ми-бемоль.',
          },
        },
      ],
    },
    {
      heading: { en: 'G7alt into minor and major', ru: 'G7alt в минор и мажор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Practise a dominant with its resolution, so the ear learns where it goes. Which do you like best?',
            ru: 'Отрабатывайте доминанту вместе с разрешением, чтобы слух привыкал, куда она ведёт. Какое разрешение нравится больше?',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'G7alt', degrees: '1 ♭7 | 3 ♭13 ♭9 ♯9', hands: 'G2 F3 | B3 E♭4 A♭4 A♯4' },
            { symbol: 'Cm9', degrees: '1 ♭7 | 9 ♭3 5', hands: 'C3 B♭3 | D4 E♭4 G4' },
            { symbol: 'G7alt', degrees: '1 ♭7 | 3 ♭13 ♭9 ♯9', hands: 'G2 F3 | B3 E♭4 A♭4 A♯4' },
            { symbol: 'CMaj9', degrees: '1 7 | 9 3 5', hands: 'C3 B3 | D4 E4 G4' },
            { symbol: 'G7alt', degrees: '1 ♭7 | 3 ♭13 ♭9 ♯9', hands: 'G2 F3 | B3 E♭4 A♭4 A♯4' },
            { symbol: 'Cm6', degrees: '1 6 | ♭3 5', hands: 'C3 A3 | E♭4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Slash chords over a dominant', ru: 'Слэш-аккорды над доминантой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A right-hand triad over the root and 7th: an altered dominant as two simple shapes.',
            ru: 'Трезвучие в правой руке над основным тоном и септимой: альтерированная доминанта как две простые фигуры.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            {
              symbol: 'A/G',
              caption: 'G13♯11',
              degrees: '1 ♭7 | 9 ♯11 13',
              hands: 'G2 F3 | A3 C♯4 E4',
            },
            {
              symbol: 'D♭/G',
              caption: 'G7♭9♭5',
              degrees: '1 ♭7 | ♭5 ♭7 ♭9',
              hands: 'G2 F3 | D♭4 F4 A♭4',
            },
            {
              symbol: 'E♭/G',
              caption: 'G7♯9♭13',
              degrees: '1 ♭7 | ♭13 1 ♯9',
              hands: 'G2 F3 | E♭4 G4 B♭4',
            },
            {
              symbol: 'E/G',
              caption: 'G13♭9',
              degrees: '1 ♭7 | 13 ♭9 3',
              hands: 'G2 F3 | E4 G♯4 B4',
            },
            {
              symbol: 'A♭m/G',
              caption: 'G7♭9♭13',
              degrees: '1 ♭7 | ♭9 3 ♭13',
              hands: 'G2 F3 | A♭3 C♭4 E♭4',
            },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Keep the melody off notes a semitone from the chord’s.',
            ru: 'Следите, чтобы в мелодии не было звуков на полтона от звуков аккорда.',
          },
        },
      ],
    },
    {
      heading: { en: 'Slash chords resolving', ru: 'Разрешение слэш-аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A/G, with its ♯11, and the other major triads over G lead to major. A♭m/G resolves to minor and major alike.',
            ru: 'A/G с повышенной 11 и другие мажорные трезвучия над соль ведут в мажор. A♭m/G разрешается и в минор, и в мажор.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'D♭/G', degrees: '1 ♭7 | ♭5 ♭7 ♭9', hands: 'G2 F3 | D♭4 F4 A♭4' },
            { symbol: 'CMaj7', degrees: '1 7 | 9 3 5', hands: 'C3 B3 | D4 E4 G4' },
            { symbol: 'A♭m/G', degrees: '1 ♭7 | ♭9 3 ♭13', hands: 'G2 F3 | A♭3 C♭4 E♭4' },
            { symbol: 'CmMaj9', degrees: '1 7 | 9 ♭3 5', hands: 'C3 B3 | D4 E♭4 G4' },
            { symbol: 'A♭m/G', degrees: '1 ♭7 | ♭9 3 ♭13', hands: 'G2 F3 | A♭3 C♭4 E♭4' },
            { symbol: 'C6/9', degrees: '1 6 | 9 3 5', hands: 'C3 A3 | D4 E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Inverted triads', ru: 'Обращённые трезвучия' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Slash chords sound best inverted: move the triad’s top note down an octave, or double it. Then the left hand needs only the 7th.',
            ru: 'Слэш-аккорды лучше всего звучат с обращением: перенесите верхний звук трезвучия на октаву вниз или удвойте его. Тогда левой руке достаточно септимы.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'D♭/G', degrees: '1 ♭7 | ♭9 ♭5 ♭7', hands: 'G2 F3 | A♭3 D♭4 F4' },
            { symbol: 'E♭/G', degrees: '1 ♭7 | ♯9 ♭13 1', hands: 'G2 F3 | B♭3 E♭4 G4' },
            { symbol: 'E/G', degrees: '1 ♭7 | 3 13 ♭9', hands: 'G2 F3 | B3 E4 G♯4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Wide major 9ths', ru: 'Широкие мажорные ноны' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Two 5ths in the left hand. In the right, a minor triad or 7th a major 3rd up: Am over F. Roll the left hand up.',
            ru: 'В левой руке две квинты подряд. В правой — минорное трезвучие или септаккорд на большую терцию выше: Am над фа. Левую руку играйте арпеджато.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'FMaj9', degrees: '1 5 9 | 3 5 7', hands: 'F2 C3 G3 | A3 C4 E4' },
            { symbol: 'FMaj9', degrees: '1 5 9 | 3 5 7 9', hands: 'F2 C3 G3 | A3 C4 E4 G4' },
            { symbol: 'F6/9', degrees: '1 5 9 | 3 6', hands: 'F2 C3 G3 | A3 D4' },
            { symbol: 'Fadd9', degrees: '1 5 | 1 9 3', hands: 'F2 C3 | F4 G4 A4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Close Fadd9 sounds minimal: good for quiet passages.',
            ru: 'Тесный Fadd9 звучит минималистично: хорошо для тихих мест.',
          },
        },
      ],
    },
    {
      heading: { en: 'Drop 2', ru: 'Drop 2' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The chord’s 3rd drops an octave into the left hand, and the 2nd takes its place in the right. Gospel players live on it.',
            ru: 'Терция аккорда переносится на октаву вниз, в левую руку, а её место в правой занимает вторая ступень. На этом стоит звучание госпела.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
            { symbol: 'Cadd9', degrees: '1 3 | 9 5 1', hands: 'C3 E3 | D4 G4 C5' },
            { symbol: 'Fadd9', degrees: '1 3 | 9 5 1', hands: 'F2 A2 | G3 C4 F4' },
            { symbol: 'Gadd9', degrees: '1 3 | 9 5 1', hands: 'G2 B2 | A3 D4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play Cm7♭5.', ru: 'Сыграйте Cm7♭5.' },
          answer: { chord: 'Cm7♭5' },
        },
        {
          kind: 'question',
          ask: { en: 'Play G7 with a raised 9th.', ru: 'Сыграйте G7 с повышенной ноной.' },
          answer: { chord: 'G7#9' },
        },
        {
          kind: 'link',
          title: { en: 'G7alt in Chords', ru: 'G7alt в аккордах' },
          target: { opens: 'chords', chord: 'G7alt' },
        },
        {
          kind: 'link',
          title: { en: 'The tensions of G7', ru: 'Надстройки G7' },
          target: { opens: 'tensions', chord: 'd7', root: note('G') },
        },
      ],
    },
  ],
}

export default jazzVoicings
