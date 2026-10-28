import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MAJOR = { tonic: note('G'), minor: false }

/**
 * Slash chords: a chord over a bass, read as an inversion where the bass is a chord tone and as an
 * added bass where it is not; split between the hands; a stepwise bass and a pedal made of them.
 */
const slashChords: Lesson = {
  id: 'slash-chords',
  after: ['inversions'],
  title: { en: 'Slash chords', ru: 'Аккорды с указанным басом' },
  summary: {
    en: 'Read C/E and F/G: a chord over a bass note. Split them between the hands and use them to make a bass line walk.',
    ru: 'Читать C/E и F/G: аккорд над басовой нотой. Делить их между руками и вести ими басовую линию.',
  },
  sections: [
    {
      heading: { en: 'A chord over a bass', ru: 'Аккорд над басом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A slash chord', ru: 'Аккорд с указанным басом' },
          text: {
            en: 'names a chord, then the note under it. C/E is C major with E in the bass. The left hand plays the bass.',
            ru: 'называет аккорд, а за чертой — звук под ним. C/E — до мажор с ми в басу. Бас играет левая рука.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/E', degrees: '3 | 1 3 5', hands: 'E2 | C4 E4 G4' },
            { symbol: 'C/G', degrees: '5 | 1 3 5', hands: 'G2 | C4 E4 G4' },
          ],
        },
      ],
      takeaway: {
        en: 'Read the chord above the slash and the bass below it.',
        ru: 'Над чертой — аккорд, под ней — бас.',
      },
    },
    {
      heading: { en: 'Inversion or added bass', ru: 'Обращение или добавленный бас' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'When the bass is a chord tone, the slash chord is an inversion: G/B. When it is not, it adds a new note: F/G.',
            ru: 'Если бас — звук аккорда, это обращение: G/B. Если нет, он добавляет новый звук: F/G.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'Inversion', ru: 'Обращение' },
              caption: { en: 'G/B · the 3rd in the bass', ru: 'G/B · терция в басу' },
              example: {
                kind: 'voicings',
                voicings: [{ symbol: 'G/B', degrees: '3 | 1 3 5', hands: 'B2 | G3 B3 D4' }],
              },
            },
            {
              label: { en: 'Added bass', ru: 'Добавленный бас' },
              caption: {
                en: 'F/G · F major over G, a soft dominant',
                ru: 'F/G · фа мажор над соль, мягкая доминанта',
              },
              example: {
                kind: 'voicings',
                voicings: [{ symbol: 'F/G', degrees: '5 | ♭7 9 11', hands: 'G2 | F3 A3 C4' }],
              },
            },
          ],
        },
      ],
      takeaway: {
        en: 'A chord tone in the bass makes an inversion. Any other note adds colour.',
        ru: 'Звук аккорда в басу даёт обращение. Любой другой звук добавляет краску.',
      },
    },
    {
      heading: { en: 'A bass line that steps', ru: 'Бас, который идёт по ступеням' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Slash chords let the bass move by step while the chords change. Listen to G, D/F♯, Em: the bass falls G, F♯, E.',
            ru: 'Аккорды с указанным басом позволяют басу идти по ступеням. Послушайте G, D/F♯, Em: бас спускается соль, фа-диез, ми.',
          },
        },
        {
          kind: 'voicings',
          key: G_MAJOR,
          voicings: [
            { symbol: 'G', degrees: '1 | 3 5 1', hands: 'G2 | B3 D4 G4' },
            { symbol: 'D/F♯', degrees: '3 | 1 5 1', hands: 'F♯2 | A3 D4 F♯4' },
            { symbol: 'Em', degrees: '1 | 5 1 ♭3', hands: 'E2 | B3 E4 G4' },
            { symbol: 'C', degrees: '1 | 5 1 3', hands: 'C2 | G3 C4 E4' },
          ],
        },
      ],
      takeaway: {
        en: 'An inversion in the right place turns leaps in the bass into steps.',
        ru: 'Обращение в нужном месте превращает скачки баса в шаги.',
      },
    },
    {
      heading: { en: 'Over one bass note', ru: 'Над одним басом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A pedal', ru: 'Органный пункт' },
          text: {
            en: 'holds one bass note while the chords above it change. Slash chords write it: C, F/C, G/C, C.',
            ru: 'держит один басовый звук, пока аккорды над ним меняются. Его записывают так: C, F/C, G/C, C.',
          },
        },
        {
          kind: 'chords',
          symbols: ['C', 'F/C', 'G/C', 'C'],
        },
      ],
      takeaway: {
        en: 'The same bass under changing chords is a pedal.',
        ru: 'Один и тот же бас под сменой аккордов — органный пункт.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C/E: E in the bass.', ru: 'Сыграйте C/E: ми в басу.' },
          answer: { chord: 'C/E' },
        },
        {
          kind: 'question',
          ask: { en: 'Play D/F♯.', ru: 'Сыграйте D/F♯.' },
          answer: { chord: 'D/F♯' },
        },
        {
          kind: 'link',
          title: { en: 'G D/F♯ Em C on Progressions', ru: 'G D/F♯ Em C в «Последовательностях»' },
          target: { opens: 'song-chords', chords: 'G D/F# Em C' },
        },
      ],
    },
  ],
}

export default slashChords
