import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MINOR = { tonic: note('C'), minor: true }

/** The "Minor 2-5-1 progression: beginner to pro" sheet: one cadence voiced four ways, each richer. */
const minorTwoFiveLevels: Lesson = {
  id: 'minor-two-five-levels',
  title: { en: 'Minor ii–V–i: beginner to pro', ru: 'Минорный ii–V–i: от новичка до профи' },
  summary: {
    en: 'Play the minor ii–V–i in C minor at four levels, adding notes and colour at each one.',
    ru: 'Играть минорный ii–V–i в до миноре на четырёх уровнях, с каждым добавляя звуки и краски.',
  },
  sections: [
    {
      heading: { en: 'Level 1: Beginner', ru: 'Уровень 1: новичок' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The minor ii–V–i', ru: 'Минорный ii–V–i' },
          text: {
            en: 'in C minor is Dm7♭5, G7, Cm. At level 1 each hand plays two notes. The numbers give each note’s degree, left hand first.',
            ru: 'в до миноре — это Dm7♭5, G7, Cm. На первом уровне каждая рука играет по два звука. Цифры показывают ступени, начиная с левой руки.',
          },
        },
        {
          kind: 'voicings',
          key: C_MINOR,
          voicings: [
            { symbol: 'Dm7♭5', caption: 'iiø7', degrees: '1 ♭5 | ♭7 ♭3', hands: 'D3 A♭3 | C4 F4' },
            { symbol: 'G7♭13', caption: 'V7♭13', degrees: '♭7 3 | ♭13 1', hands: 'F3 B3 | E♭4 G4' },
            { symbol: 'Cm9', caption: 'i7', degrees: '♭3 ♭7 | 9 5', hands: 'E♭3 B♭3 | D4 G4' },
            { symbol: 'Cm6', caption: 'i6', degrees: '♭3 6 | 1 5', hands: 'E♭3 A3 | C4 G4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Only the ii has its root lowest.',
            ru: 'Только у ii внизу основной тон.',
          },
        },
      ],
    },
    {
      heading: { en: 'Level 2: Late beginner', ru: 'Уровень 2: продолжающий' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now the V and the i have their roots in the bass too. The V adds a ♯9.',
            ru: 'Теперь и у V, и у i в басу основной тон. Доминанта получает ♯9.',
          },
        },
        {
          kind: 'voicings',
          key: C_MINOR,
          voicings: [
            {
              symbol: 'Dm11♭5',
              caption: 'iiø11',
              degrees: '1 ♭5 | ♭7 11',
              hands: 'D3 A♭3 | C4 G4',
            },
            {
              symbol: 'G7♯9♭13',
              caption: 'V7',
              degrees: '1 ♭7 | 3 ♭13 ♯9',
              hands: 'G2 F3 | B3 E♭4 A♯4',
            },
            { symbol: 'Cm9', caption: 'i9', degrees: '1 | ♭7 9 ♭3 5', hands: 'C3 | B♭3 D4 E♭4 G4' },
            {
              symbol: 'Cm6/9',
              caption: 'i6/9',
              degrees: '1 | 6 9 ♭3 5',
              hands: 'C3 | A3 D4 E♭4 G4',
            },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Between chords, the right hand plays one melody note: F after the ii, A♭ after the V.',
            ru: 'Между аккордами правая рука играет один мелодический звук: фа после ii, ля-бемоль после V.',
          },
        },
      ],
    },
    {
      heading: { en: 'Level 3: Intermediate', ru: 'Уровень 3: средний' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand plays an octave with one note inside it. The tensions sit at the top.',
            ru: 'Правая рука играет октаву с одним звуком внутри. Альтерации и надстройки звучат сверху.',
          },
        },
        {
          kind: 'voicings',
          key: C_MINOR,
          voicings: [
            {
              symbol: 'Dm11♭5',
              caption: 'iiø11',
              degrees: '♭5 1 | 11 ♭7 11',
              hands: 'A♭3 D4 | G4 C5 G5',
            },
            {
              symbol: 'G7♭9♭13',
              caption: 'V7',
              degrees: '♭7 3 | ♭13 ♭9 ♭13',
              hands: 'F3 B3 | E♭4 A♭4 E♭5',
            },
            { symbol: 'Cm9', caption: 'i9', degrees: '11 ♭7 | 9 5 9', hands: 'F3 B♭3 | D4 G4 D5' },
            { symbol: 'Cm6/9', caption: 'i6/9', degrees: '♭3 6 | 9 5', hands: 'E♭3 A3 | D4 G4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Melody notes between chords: F after the ii, B after the V, C after the i.',
            ru: 'Мелодия между аккордами: фа после ii, си после V, до после i.',
          },
        },
      ],
    },
    {
      heading: { en: 'Level 4: Late intermediate', ru: 'Уровень 4: продвинутый' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A♭13 slides down a half step into G7. It stands in for G’s own dominant. Then G7 changes colour, and the i moves inside.',
            ru: 'A♭13 сползает на полутон вниз в G7. Он заменяет доминанту к соль. Затем G7 меняет краску, а внутри i движутся голоса.',
          },
        },
        {
          kind: 'voicings',
          key: C_MINOR,
          voicings: [
            {
              symbol: 'Dm11♭5',
              caption: 'iiø11',
              degrees: '♭5 1 | 11 ♭7 11',
              hands: 'A♭3 D4 | G4 C5 G5',
            },
            {
              symbol: 'A♭13',
              caption: 'subV/V',
              degrees: '♭7 3 | 13 9 13',
              hands: 'G♭3 C4 | F4 B♭4 F5',
            },
            {
              symbol: 'G7♯9♭13',
              caption: 'V7',
              degrees: '♭7 3 ♭13 | ♯9 ♭13 ♯9',
              hands: 'F3 B3 E♭4 | A♯4 E♭5 A♯5',
            },
            {
              symbol: 'G7♭9♯11',
              caption: 'V7',
              degrees: '♭7 3 ♭13 | ♭9 ♯11 ♭9',
              hands: 'F3 B3 E♭4 | A♭4 C♯5 A♭5',
            },
            {
              symbol: 'Cm9',
              caption: 'i9',
              degrees: '♭3 ♭7 9 | 5 1 5',
              hands: 'E♭3 B♭3 D4 | G4 C5 G5',
            },
            {
              symbol: 'Cm9',
              caption: 'i9',
              degrees: '♭7 9 ♭3 5 | 1 5 1',
              hands: 'B♭3 D4 E♭4 G4 | C5 G5 C6',
            },
            {
              symbol: 'Cm6/9',
              caption: 'i6/9',
              degrees: '6 9 ♭3 5 | 9 5 9',
              hands: 'A3 D4 E♭4 G4 | D5 G5 D6',
            },
            {
              symbol: 'Cm6/9',
              caption: 'i6/9',
              degrees: '6 9 ♭3 5 | ♭3 5 ♭3',
              hands: 'A3 D4 E♭4 G4 | E♭5 G5 E♭6',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the ii of C minor as a 7th chord.',
            ru: 'Сыграйте ii до минора септаккордом.',
          },
          answer: { chord: 'Dm7♭5' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the shell of G7: its 3rd and 7th.',
            ru: 'Сыграйте основу G7: терцию и септиму.',
          },
          answer: { notes: ['B', 'F'] },
        },
        {
          kind: 'link',
          title: {
            en: 'The minor ii–V–i round the circle of fifths',
            ru: 'Минорный ii–V–i по квинтовому кругу',
          },
          target: {
            opens: 'player',
            numerals: 'ii° V i',
            key: C_MINOR,
            size: 'ninths',
            walk: 'fifths',
          },
        },
        {
          kind: 'link',
          title: {
            en: 'A ii–V–i to every chord of the minor key',
            ru: 'ii–V–i к каждому аккорду минорной тональности',
          },
          target: {
            opens: 'player',
            numerals:
              'ii° V i ii°/ii V/ii ii° ii/III V/III III ii°/iv V/iv iv ii°/v V/v v ii/VI V/VI VI ii/VII V/VII VII',
            key: C_MINOR,
            size: 'sevenths',
          },
        },
      ],
    },
  ],
}

export default minorTwoFiveLevels
