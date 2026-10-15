import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MINOR = { tonic: note('C'), minor: true }

/** The "Minor 2-5-1 progression: beginner to pro" sheet: one cadence voiced four ways, each richer. */
const minorTwoFiveLevels: Lesson = {
  id: 'minor-two-five-levels',
  title: { en: 'Minor ii–V–i: beginner to pro', ru: 'Минорный ii–V–i: от новичка до профи' },
  summary: {
    en: 'One cadence in C minor, voiced at four levels: shells, 9ths and 11ths, altered dominants, a tritone substitute.',
    ru: 'Один оборот в до миноре в четырёх уровнях: двузвучия, ноны и ундецимы, альтерированные доминанты, тритоновая замена.',
  },
  sections: [
    {
      heading: { en: 'Level 1: Beginner', ru: 'Уровень 1: новичок' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Two notes in each hand. The numbers say what each key is, left hand first.',
            ru: 'По два звука в каждой руке. Цифры говорят, чем является каждый звук, начиная с левой руки.',
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
            en: 'Only the ii has its root in the bass.',
            ru: 'Только у ii в басу основной тон.',
          },
        },
      ],
    },
    {
      heading: { en: 'Level 2: Late beginner', ru: 'Уровень 2: продолжающий' },
      blocks: [
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
            en: 'Between the chords the right hand sings a note: F, the ♭3, after the ii, and A♭, the ♭9, after the V.',
            ru: 'Между аккордами правая рука поёт звук: фа, ♭3, после ii, и ля-бемоль, ♭9, после V.',
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
            en: 'The right hand plays an octave with a note inside. The tensions sit on top.',
            ru: 'Правая рука играет октаву со звуком внутри. Наверху — альтерации и надстройки.',
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
            en: 'Melody notes between: F after the ii, B, the 3rd, after the V, and C after the i.',
            ru: 'Звуки мелодии между аккордами: фа после ii, си, терция, после V и до после i.',
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
            en: 'A♭13 slides into G7: the tritone substitute of G’s own dominant. Then the dominant changes colour, and the i moves inside.',
            ru: 'A♭13 соскальзывает в G7: тритоновая замена доминанты к G. Затем доминанта меняет краску, а i движется внутри.',
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
      heading: { en: 'In every key', ru: 'Во всех тональностях' },
      blocks: [
        { kind: 'progression', numerals: 'ii° V i', key: C_MINOR, size: 'ninths' },
        {
          kind: 'text',
          text: {
            en: 'Take one level at a time round the circle of fifths. Say each chord’s numbers as you play.',
            ru: 'Проходите по одному уровню по квинтовому кругу. Называйте цифры каждого аккорда, пока играете.',
          },
        },
        {
          kind: 'link',
          title: { en: 'Round the circle of fifths', ru: 'По квинтовому кругу' },
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
            en: 'To every chord of the minor key',
            ru: 'К каждому аккорду минорной тональности',
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
            en: 'The minor ii–V–i through the keys',
            ru: 'Минорный ii–V–i по всем тональностям',
          },
          target: {
            opens: 'player',
            numerals: 'ii° V i',
            key: { tonic: note('C'), minor: true },
            size: 'sevenths',
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default minorTwoFiveLevels
