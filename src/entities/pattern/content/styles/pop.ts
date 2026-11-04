/**
 * Pop and rock styles (R29 CP3), written by us for this app. Each variation: the piano's two hands
 * (`entities/pattern` figures), the bass's line (`R` root, `5`, `8` octave, `3`, `A` approach; `.`
 * rings on, `_` stops) and the drums' groove, a 4/4 bar of 16 steps; then its fill.
 */
import type { WrittenStyle } from '../../model/style-types'
import { ROCK_FILL, SNARE_RUN, TOM_FILL } from './fills'

const BACKBEAT = '....X.......X...'
const EIGHTHS = 'x.x.x.x.x.x.x.x.'

export const POP_STYLES: readonly WrittenStyle[] = [
  {
    id: 'pop-1',
    family: 'pop',
    name: { en: 'Pop 1', ru: 'Поп 1' },
    tempo: 100,
    variations: [
      // 1: closed hi-hat in 8ths, the backbeat, the kick on 1, the "and" of 2 and 3.
      {
        rh: 'b1',
        lh: 'o',
        bass: 'R.....r.r.......',
        drums: { kick: 'X.....x.X.......', snare: BACKBEAT, hatClosed: EIGHTHS },
        fill: { drums: SNARE_RUN },
      },
      // 2: a chorus: the ride for the hi-hat, a crash at the top, the bass walking up to the 5th.
      {
        rh: 'r3',
        lh: 'o',
        bass: 'R.....r.r...5...',
        drums: { kick: 'X.....x.X.x.....', snare: BACKBEAT, ride: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
      // 3: busier: the hi-hat in 16ths, more kicks.
      {
        rh: 'sync',
        lh: 'o',
        bass: 'R..r..r.R..r..5.',
        drums: {
          kick: 'X..x..x.X..x....',
          snare: '....X.......X..o',
          hatClosed: 'xoxoxoxoxoxoxoxo',
        },
        fill: { drums: SNARE_RUN },
      },
      // 4: half time, for an intro or a breakdown: the hi-hat on 2 and 4, a chord a bar.
      {
        rh: 'x1',
        lh: 'o',
        bass: 'R...............',
        drums: { kick: 'X...............', hatClosed: '....x.......x...', rim: '........x.......' },
        fill: {
          drums: {
            kick: 'X...............',
            hatClosed: 'x...x...x.......',
            tomHigh: '............X.x.',
          },
        },
      },
    ],
  },
  {
    id: 'pop-2',
    family: 'pop',
    name: { en: 'Pop 2', ru: 'Поп 2' },
    tempo: 104,
    variations: [
      // Syncopated piano over a kick on 1 and the "and" of 3.
      {
        rh: 'sync',
        lh: 'o',
        bass: 'R.......r.r.....',
        drums: { kick: 'X.......x.x.....', snare: BACKBEAT, hatClosed: 'xoxoxoxoxoxoxoxo' },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'sync',
        lh: 'o',
        bass: 'R.....r.r.r...A.',
        drums: {
          kick: 'X.....x.x.x.....',
          snare: BACKBEAT,
          hatClosed: 'x.x.x.x.x.x.x...',
          hatOpen: '..............x.',
        },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'pop-3',
    family: 'pop',
    name: { en: 'Pop 3', ru: 'Поп 3' },
    tempo: 92,
    variations: [
      // Pulsing 8ths on the piano, the bass in 8ths on the root.
      {
        rh: 'r3',
        lh: 'h',
        bass: 'R.r.r.r.R.r.r.r.',
        drums: { kick: 'X.......X.......', snare: BACKBEAT, hatClosed: EIGHTHS },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'r3',
        lh: 'h',
        bass: 'R.r.r.r.R.r.5.8.',
        drums: { kick: 'X.......X.x.....', snare: BACKBEAT, ride: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'pop-4',
    family: 'pop',
    name: { en: 'Pop 4', ru: 'Поп 4' },
    tempo: 84,
    variations: [
      // An arpeggio over a light groove.
      {
        rh: 'bal',
        lh: 'o',
        bass: 'R.......5.......',
        drums: { kick: 'X.......X.......', rim: BACKBEAT, hatClosed: EIGHTHS },
        fill: {
          drums: { kick: 'X.......X.......', rim: '....x...........', snare: '..........o.x.x.' },
        },
      },
      {
        rh: 'bal',
        lh: 'o',
        bass: 'R.....r.5.......',
        drums: { kick: 'X.....x.X.......', snare: BACKBEAT, hatClosed: EIGHTHS },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'pop-5',
    family: 'pop',
    name: { en: 'Pop 5', ru: 'Поп 5' },
    tempo: 112,
    variations: [
      // Chords on the off-beats, a dance pop groove.
      {
        rh: 'r2',
        lh: 'o',
        bass: 'R.r.R.r.R.r.R.r.',
        drums: {
          kick: 'X...X...X...X...',
          snare: BACKBEAT,
          hatClosed: 'x...x...x...x...',
          hatOpen: '..x...x...x...x.',
        },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'r3',
        lh: 'o',
        bass: 'R.8.R.8.R.8.R.8.',
        drums: { kick: 'X...X...X...X...', snare: BACKBEAT, hatOpen: '..x...x...x...x.' },
        fill: { drums: TOM_FILL },
        crash: true,
      },
      {
        rh: 'x1',
        lh: 'o',
        bass: 'R...............',
        drums: { kick: 'X...X...X...X...' },
        fill: { drums: { kick: 'X...X...X...X...', snare: '........x.x.XxXx' } },
      },
    ],
  },
  {
    id: 'rock-1',
    family: 'rock',
    name: { en: 'Rock 1', ru: 'Рок 1' },
    tempo: 120,
    variations: [
      // Piano and bass in driving 8ths, the open hi-hat.
      {
        rh: 'rock',
        lh: 'o',
        bass: 'R.r.r.r.r.r.r.r.',
        drums: { kick: 'X.x.....X.x.....', snare: BACKBEAT, hatOpen: EIGHTHS },
        fill: { drums: ROCK_FILL },
      },
      {
        rh: 'rock',
        lh: 'rock',
        bass: 'R.r.r.r.r.r.5.8.',
        drums: { kick: 'X.x.....X.x.....', snare: BACKBEAT, ride: EIGHTHS },
        fill: { drums: ROCK_FILL },
        crash: true,
      },
      {
        rh: 'x1',
        lh: 'o',
        bass: 'R.......R.......',
        drums: { kick: 'X...............', hatClosed: '....x.......x...' },
        fill: { drums: { kick: 'X.......X.x.x.x.', snare: '..........x.x.x.' } },
      },
    ],
  },
  {
    id: 'rock-2',
    family: 'rock',
    name: { en: 'Rock 2', ru: 'Рок 2' },
    tempo: 132,
    variations: [
      // Four on the floor under a 16th-note snare push.
      {
        rh: 'r3',
        lh: 'o',
        bass: 'R.r.r.r.R.r.r.r.',
        drums: {
          kick: 'X...X...X...X...',
          snare: '....X.......X..x',
          hatClosed: 'x.x.x.x.x.x.x.x.',
        },
        fill: { drums: ROCK_FILL },
      },
      {
        rh: 'rock',
        lh: 'rock',
        bass: 'R.R.r.r.R.R.5.5.',
        drums: {
          kick: 'X.x.X...X.x.X...',
          snare: BACKBEAT,
          crash: 'x...............',
          ride: EIGHTHS,
        },
        fill: { drums: ROCK_FILL },
        crash: true,
      },
    ],
  },
]
