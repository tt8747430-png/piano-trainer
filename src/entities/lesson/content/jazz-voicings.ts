import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const B_FLAT = { tonic: note('B', -1), minor: false }

/**
 * The jazz voicings sheet: major, minor and dominant chords beyond the basic 9ths, the dominant's
 * alterations, the slash chords that write them as two simple shapes, and spread add9 chords.
 */
const jazzVoicings: Lesson = {
  id: 'jazz-voicings',
  title: { en: 'Jazz voicings', ru: 'Джазовые расположения' },
  summary: {
    en: 'Spread major, minor and dominant chords over two hands, then alter a dominant with a simple triad on top.',
    ru: 'Раскладывать мажорные, минорные и доминантовые аккорды на две руки и альтерировать доминанту простым трезвучием сверху.',
  },
  sections: [
    {
      heading: { en: 'Major: 6ths and 9ths', ru: 'Мажор: сексты и ноны' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A voicing', ru: 'Расположение' },
          text: {
            en: 'is which notes each hand plays. Here the left hand keeps the root low. The right hand changes the colour on top.',
            ru: '— это какие звуки играет каждая рука, снизу вверх. Здесь левая держит основной тон внизу. Правая меняет окраску сверху.',
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
            en: 'For minor, play the same shapes with E♭ for E.',
            ru: 'Для минорного аккорда играйте те же фигуры с ми-бемолем вместо ми.',
          },
        },
      ],
    },
    {
      heading: { en: 'Wide major 9ths', ru: 'Широкие мажорные ноны' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand plays two 5ths stacked: F, C, G. The right hand plays A minor, a major 3rd above F.',
            ru: 'Левая рука играет две квинты друг над другом: фа, до, соль. Правая играет ля минор, на большую терцию выше фа.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'FMaj9', degrees: '1 5 9 | 3 5 7', hands: 'F2 C3 G3 | A3 C4 E4' },
            { symbol: 'FMaj9', degrees: '1 5 9 | 3 5 7 9', hands: 'F2 C3 G3 | A3 C4 E4 G4' },
            { symbol: 'F6/9', degrees: '1 5 9 | 3 6', hands: 'F2 C3 G3 | A3 D4' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Play all three. The left hand never moves.',
            ru: 'Сыграйте все три. Левая рука не двигается.',
          },
        },
      ],
    },
    {
      heading: { en: 'Spread add9 chords', ru: 'Аккорды add9 в широком расположении' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A spread add9 puts the root and 3rd in the left hand. The right hand plays the 9th, 5th and root.',
            ru: 'В широком add9 левая рука берёт основной тон и терцию. Правая играет нону, квинту и основной тон.',
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
        {
          kind: 'text',
          text: {
            en: 'Play C, then Cadd9, and follow the E down.',
            ru: 'Сыграйте C, затем Cadd9 и проследите, как ми уходит вниз.',
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
            en: 'Cm11 is two triads stacked: C minor, then B♭ major. Spread wide, each hand plays two 5ths.',
            ru: 'Cm11 — это два трезвучия друг над другом: до минор и си-бемоль мажор. В широком расположении каждая рука играет две квинты.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cm11', degrees: '1 | 1 ♭3 5 ♭7 9 11', hands: 'C3 | C4 E♭4 G4 B♭4 D5 F5' },
            { symbol: 'Cm11', degrees: '1 5 9 | ♭3 ♭7 11', hands: 'C3 G3 D4 | E♭4 B♭4 F5' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Play the close shape, then the wide one.',
            ru: 'Сыграйте тесное расположение, затем широкое.',
          },
        },
      ],
    },
    {
      heading: { en: 'Minor: 6ths and the major 7th', ru: 'Минор: секста и большая септима' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A minor chord with a 6th sounds dramatic, more so with its 9th. CmMaj9 hides a tense augmented triad: E♭ G B.',
            ru: 'Минор с секстой звучит драматично, а с ноной ещё сильнее. В CmMaj9 спрятано напряжённое увеличенное трезвучие: ми-бемоль, соль, си.',
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
        {
          kind: 'text',
          text: {
            en: 'Play the three and compare their colours.',
            ru: 'Сыграйте все три и сравните их окраску.',
          },
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
            en: 'Think of Cm7♭5 as C in the bass under an E♭ minor triad. It is the ii of the minor ii–V–I.',
            ru: 'Думайте о Cm7♭5 как о до в басу под ми-бемоль минорным трезвучием. Это ii в минорном ii–V–I.',
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
        {
          kind: 'text',
          text: {
            en: 'Play the three chords in order.',
            ru: 'Сыграйте три аккорда по порядку.',
          },
        },
      ],
    },
    {
      heading: { en: 'Dominants: keep the tritone', ru: 'Доминанты: тритон на месте' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tritone', ru: 'Тритон' },
          text: {
            en: 'is six half steps. A dominant’s 3rd and 7th are a tritone apart. Keep them in every voicing. The 5th can go.',
            ru: '— это шесть полутонов. Терция и септима доминанты отстоят на тритон. Держите их в любом расположении. Квинту можно опустить.',
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
        {
          kind: 'text',
          text: {
            en: 'Find B and F in each one.',
            ru: 'Найдите си и фа в каждом.',
          },
        },
      ],
    },
    {
      heading: { en: 'Altering a dominant', ru: 'Альтерация доминанты' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Altering', ru: 'Альтерация' },
          text: {
            en: 'moves a note a half step. A dominant’s 5th and 9th go up or down, its 11th up, its 13th down.',
            ru: '— это сдвиг звука на полутон. У доминанты квинта и нона идут вверх или вниз, 11 вверх, 13 вниз.',
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
            en: 'G7alt keeps the root and tritone, altering the rest: D♭, E♭, A♭, A♯.',
            ru: 'G7alt сохраняет основной тон и тритон и альтерирует остальное: ре-бемоль, ми-бемоль, ля-бемоль, ля-диез.',
          },
        },
      ],
    },
    {
      heading: { en: 'Slash chords over a dominant', ru: 'Слэш-аккорды над доминантой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand holds G and F, the root and 7th. A triad in the right hand adds the altered notes.',
            ru: 'Левая рука держит соль и фа, основной тон и септиму. Трезвучие в правой добавляет альтерированные звуки.',
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
            en: 'Keep the melody off notes a half step from the chord’s notes.',
            ru: 'Мелодия не должна звучать на полутон от звуков аккорда.',
          },
        },
      ],
    },
    {
      heading: { en: 'Where slash chords resolve', ru: 'Куда разрешаются слэш-аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A major triad over G leads to a major chord. A♭m/G can resolve to minor or to major.',
            ru: 'Мажорное трезвучие над соль ведёт в мажорный аккорд. A♭m/G разрешается и в минор, и в мажор.',
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
        {
          kind: 'text',
          text: {
            en: 'Play each pair: the slash chord, then where it lands.',
            ru: 'Сыграйте каждую пару: слэш-аккорд, затем аккорд разрешения.',
          },
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
