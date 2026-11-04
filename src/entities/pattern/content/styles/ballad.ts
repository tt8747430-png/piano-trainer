/**
 * Ballads, worship, gospel and hymns (R29 CP3), written by us for this app. A hymn's first style is
 * the piano alone in four parts; its second adds the bass; neither has drums.
 */
import type { WrittenStyle } from '../../model/style-types'
import { SOFT_FILL, TOM_FILL } from './fills'

const BACKBEAT = '....X.......X...'
const EIGHTHS = 'x.x.x.x.x.x.x.x.'

export const BALLAD_STYLES: readonly WrittenStyle[] = [
  {
    id: 'ballad-1',
    family: 'ballad',
    name: { en: 'Ballad 1', ru: 'Баллада 1' },
    tempo: 72,
    variations: [
      // An arpeggio over a cross-stick on 2 and 4.
      {
        rh: 'bal',
        lh: 'o',
        bass: 'R.......5.......',
        drums: { kick: 'X.......X.......', rim: BACKBEAT, hatClosed: EIGHTHS },
        fill: { drums: SOFT_FILL },
      },
      {
        rh: 'bal',
        lh: 'o',
        bass: 'R.....r.5.......',
        drums: { kick: 'X.....x.X.......', snare: BACKBEAT, ride: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'ballad-2',
    family: 'ballad',
    name: { en: 'Ballad 2', ru: 'Баллада 2' },
    tempo: 66,
    variations: [
      // Held chords, the hi-hat in quarters.
      {
        rh: 'r1',
        lh: 'h',
        bass: 'R.......R.......',
        drums: { kick: 'X.......X.......', rim: BACKBEAT, hatClosed: 'x...x...x...x...' },
        fill: { drums: SOFT_FILL },
      },
      {
        rh: 'r3',
        lh: 'h',
        bass: 'R.......R...5...',
        drums: { kick: 'X.......X.......', snare: BACKBEAT, hatClosed: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'ballad-3',
    family: 'ballad',
    name: { en: 'Ballad 3', ru: 'Баллада 3' },
    tempo: 76,
    variations: [
      // An arpeggio 1–5–8–5 in the left hand, chords held over it.
      {
        rh: 'x1',
        lh: 'q',
        bass: 'R...............',
        drums: { ride: 'x...x...x...x...', rim: '............x...' },
        fill: { drums: SOFT_FILL },
      },
      {
        rh: 'r1',
        lh: 'q',
        bass: 'R.......5.......',
        drums: { kick: 'X.......X.......', rim: BACKBEAT, ride: EIGHTHS },
        fill: { drums: TOM_FILL },
      },
    ],
  },
  {
    id: 'ballad-4',
    family: 'ballad',
    name: { en: 'Ballad 4', ru: 'Баллада 4' },
    tempo: 60,
    variations: [
      // A wide arpeggio under a whole-note chord: a slow 6/8 feel in four.
      {
        rh: 'x1',
        lh: 'wide',
        bass: 'R...............',
        drums: { kick: 'X...............', hatClosed: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: SOFT_FILL },
      },
      {
        rh: 'r1',
        lh: 'wide',
        bass: 'R.......5.......',
        drums: { kick: 'X.......X.......', snare: '........X.......', hatClosed: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'worship-1',
    family: 'worship',
    name: { en: 'Worship ballad 1', ru: 'Баллада прославления 1' },
    tempo: 70,
    variations: [
      // Held chords over an open 5th, the band coming in softly.
      {
        rh: 'r1',
        lh: 'o',
        bass: 'R...............',
        drums: { ride: 'x...x...x...x...', kick: 'X...............' },
        fill: { drums: SOFT_FILL },
      },
      {
        rh: 'r3',
        lh: 'o',
        bass: 'R.......r.....5.',
        drums: { kick: 'X.......X.x.....', snare: BACKBEAT, hatClosed: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
      // 3: a quiet bridge: the chords held, a swell on the cymbal.
      {
        rh: 'x1',
        lh: 'fifth',
        bass: 'R...............',
        drums: { ride: 'o...o...o...o...' },
        fill: { drums: SOFT_FILL },
      },
    ],
  },
  {
    id: 'worship-2',
    family: 'worship',
    name: { en: 'Worship ballad 2', ru: 'Баллада прославления 2' },
    tempo: 76,
    variations: [
      // Syncopated chords and a kick that pushes into beat 3.
      {
        rh: 'sync',
        lh: 'fifth',
        bass: 'R.....r.r.......',
        drums: { kick: 'X.....x.X.......', rim: BACKBEAT, hatClosed: EIGHTHS },
        fill: { drums: SOFT_FILL },
      },
      {
        rh: 'sync',
        lh: 'o',
        bass: 'R.....r.r...5...',
        drums: { kick: 'X.....x.X.......', snare: BACKBEAT, ride: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'gospel-1',
    family: 'worship',
    name: { en: 'Gospel 1', ru: 'Госпел 1' },
    tempo: 84,
    variations: [
      // Chords on every beat over gospel octaves, the bass walking to the next chord.
      {
        rh: 'b1',
        lh: 'gos',
        bass: 'R.......5.....A.',
        drums: { kick: 'X.......X.x.....', snare: BACKBEAT, hatClosed: 'x.xox.xox.xox.xo' },
        fill: { drums: TOM_FILL },
      },
      {
        rh: 'sync',
        lh: 'gos',
        bass: 'R.....r.5...3.A.',
        drums: { kick: 'X.....x.X.x.....', snare: BACKBEAT, ride: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'gospel-2',
    family: 'worship',
    name: { en: 'Gospel 2', ru: 'Госпел 2' },
    tempo: 96,
    swing: true,
    variations: [
      // A swung gospel shuffle.
      {
        rh: 'b1',
        lh: 'gos',
        bass: 'R...r.5...r.A...',
        drums: { kick: 'X.......X.......', snare: BACKBEAT, hatClosed: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: { snare: '....X...x.x.x.x.', kick: 'X.......X.......' } },
      },
      {
        rh: 'sync',
        lh: 'gos',
        bass: 'R...r.5...8.A...',
        drums: { kick: 'X.......X...x...', snare: BACKBEAT, ride: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'hymn-1',
    family: 'hymn',
    name: { en: 'Hymn 1', ru: 'Гимн 1' },
    tempo: 80,
    variations: [
      // Four parts in block chords, the piano alone.
      { rh: 'r1', lh: 'h' },
      { rh: 'b1', lh: 'o' },
    ],
  },
  {
    id: 'hymn-2',
    family: 'hymn',
    name: { en: 'Hymn 2', ru: 'Гимн 2' },
    tempo: 84,
    bass: 'bassUpright',
    variations: [
      // Block chords with the bass on 1 and 3.
      { rh: 'r1', lh: 'o', bass: 'R.......5.......' },
      { rh: 'b1', lh: 'o', bass: 'R...r...5...A...' },
    ],
  },
]
