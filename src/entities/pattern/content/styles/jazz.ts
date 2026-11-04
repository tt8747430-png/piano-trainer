/**
 * Jazz, blues and classical styles (R29 CP3), written by us for this app. Swung styles play their
 * 16ths on triplets; a waltz is written in 3/4, twelve steps a bar.
 */
import type { WrittenStyle } from '../../model/style-types'
import { JAZZ_FILL, SOFT_FILL, WALTZ_FILL } from './fills'

/** The ride's "ding, ding-a ding" and the hi-hat's foot on 2 and 4. */
const RIDE = 'x...x.x.x...x.x.'
const FOOT = '....x.......x...'

export const JAZZ_STYLES: readonly WrittenStyle[] = [
  {
    id: 'swing-1',
    family: 'jazz',
    name: { en: 'Swing 1', ru: 'Свинг 1' },
    tempo: 132,
    swing: true,
    bass: 'bassUpright',
    variations: [
      // A walking bass, shells in the left hand, the Charleston on top.
      {
        rh: 'jaz',
        lh: 'shell',
        bass: 'R...3...5...A...',
        drums: { ride: RIDE, hatPedal: FOOT },
        fill: { drums: JAZZ_FILL },
      },
      // Two-beat feel: the bass on 1 and 3, for a head's first chorus.
      {
        rh: 'r1',
        lh: 'shell',
        bass: 'R.......5.......',
        drums: { ride: RIDE, hatPedal: FOOT },
        fill: { drums: JAZZ_FILL },
      },
      // Comping on every beat, the snare dropping bombs.
      {
        rh: 'b1',
        lh: 'shell',
        bass: 'R...5...8...A...',
        drums: { ride: RIDE, hatPedal: FOOT, snare: '......o.......o.', kick: 'o.......o.......' },
        fill: { drums: JAZZ_FILL },
      },
    ],
  },
  {
    id: 'swing-2',
    family: 'jazz',
    name: { en: 'Swing 2', ru: 'Свинг 2' },
    tempo: 168,
    swing: true,
    bass: 'bassUpright',
    variations: [
      {
        rh: 'b1',
        lh: 'chs',
        bass: 'R...5...3...A...',
        drums: { ride: RIDE, hatPedal: FOOT, snare: '..........o.....' },
        fill: { drums: JAZZ_FILL },
      },
      {
        rh: 'jaz',
        lh: 'chs',
        bass: 'R...3...5...A...',
        drums: { ride: 'x.x.x.x.x.x.x.x.', hatPedal: FOOT, snare: '....x.......x...' },
        fill: { drums: JAZZ_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'jazz-ballad',
    family: 'jazz',
    name: { en: 'Jazz ballad', ru: 'Джазовая баллада' },
    tempo: 60,
    swing: true,
    bass: 'bassUpright',
    variations: [
      // Brushes' time on the ride, held chords, the bass in half notes.
      {
        rh: 'r1',
        lh: 'shell',
        bass: 'R.......5.......',
        drums: { ride: 'o...o.o.o...o.o.', hatPedal: FOOT },
        fill: { drums: SOFT_FILL },
      },
      {
        rh: 'x1',
        lh: 'shell',
        bass: 'R...3...5...A...',
        drums: { ride: RIDE, hatPedal: FOOT },
        fill: { drums: JAZZ_FILL },
      },
    ],
  },
  {
    id: 'jazz-waltz',
    family: 'jazz',
    name: { en: 'Jazz waltz', ru: 'Джазовый вальс' },
    tempo: 144,
    meter: '3/4',
    swing: true,
    bass: 'bassUpright',
    variations: [
      // The bass on 1, the chord on 2 and 3; the ride's waltz.
      {
        rh: 'b1',
        lh: 'shell',
        bass: 'R...5...A...',
        drums: { ride: 'x...x.x.x...', hatPedal: '....x...x...', kick: 'o...........' },
        fill: { drums: WALTZ_FILL },
      },
      {
        rh: 'r1',
        lh: 'shell',
        bass: 'R...........',
        drums: { ride: 'x...x...x...', hatPedal: '....x...x...' },
        fill: { drums: WALTZ_FILL },
      },
    ],
  },
  {
    id: 'shuffle',
    family: 'blues',
    name: { en: 'Shuffle', ru: 'Шаффл' },
    tempo: 112,
    swing: true,
    variations: [
      // A shuffle: the bass's 1–3–5–6 line, the ride in 8ths, the snare on 2 and 4.
      {
        rh: 'blu',
        lh: 'o',
        bass: 'R.3.5.5.R.3.5.A.',
        drums: { ride: 'x.x.x.x.x.x.x.x.', snare: '....X.......X...', kick: 'X.......X.......' },
        fill: {
          drums: { ride: 'x.x.x.x.x.x.....', snare: '....X...x.x.x.x.', kick: 'X.......X.......' },
        },
      },
      {
        rh: 'r3',
        lh: 'o',
        bass: 'R.3.5.8.R.8.5.3.',
        drums: {
          hatClosed: 'x.x.x.x.x.x.x.x.',
          snare: '....X.......X...',
          kick: 'X.......X.x.....',
        },
        fill: { drums: JAZZ_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'slow-blues',
    family: 'blues',
    name: { en: 'Slow blues', ru: 'Медленный блюз' },
    tempo: 66,
    swing: true,
    variations: [
      // A slow 12/8 feel in four: every triplet on the hi-hat.
      {
        rh: 'r3',
        lh: 'o',
        bass: 'R...5...R...A...',
        drums: {
          hatClosed: 'xxx.xxx.xxx.xxx.',
          snare: '....X.......X...',
          kick: 'X.......X.......',
        },
        fill: {
          drums: {
            hatClosed: 'xxx.xxx.........',
            snare: '....X...xxx.xxx.',
            kick: 'X.......X.......',
          },
        },
      },
      {
        rh: 'blu',
        lh: 'o',
        bass: 'R.3.5.8.R.8.5.A.',
        drums: { ride: 'xxx.xxx.xxx.xxx.', snare: '....X.......X...', kick: 'X.......X.......' },
        fill: { drums: JAZZ_FILL },
      },
    ],
  },
  {
    id: 'alberti',
    family: 'classical',
    name: { en: 'Alberti', ru: 'Альбертиевы басы' },
    tempo: 96,
    variations: [
      // The broken chord low, high, middle, high in the right hand, the root held under it.
      { rh: 'r4b', lh: 'r' },
    ],
  },
  {
    id: 'arpeggio',
    family: 'classical',
    name: { en: 'Arpeggio', ru: 'Арпеджио' },
    tempo: 84,
    variations: [
      { rh: 'b4', lh: 'r' },
      { rh: 't2', lh: 'o' },
    ],
  },
  {
    id: 'waltz',
    family: 'classical',
    name: { en: 'Waltz', ru: 'Вальс' },
    tempo: 132,
    meter: '3/4',
    variations: [
      // The bass on 1, the chord on 2 and 3.
      { rh: 'r1', lh: 'str' },
      { rh: 'b1', lh: 'alt' },
    ],
  },
]
