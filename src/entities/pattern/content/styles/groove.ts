/**
 * Hip hop, disco, funk, reggae and Latin styles (R29 CP3), written by us for this app.
 */
import type { WrittenStyle } from '../../model/style-types'
import { SNARE_RUN, TOM_FILL } from './fills'

const BACKBEAT = '....X.......X...'

export const GROOVE_STYLES: readonly WrittenStyle[] = [
  {
    id: 'hiphop-1',
    family: 'hiphop',
    name: { en: 'Hip hop 1', ru: 'Хип-хоп 1' },
    tempo: 88,
    variations: [
      // A laid-back beat: the kick off the beat, the snare on 2 and 4.
      {
        rh: 'hip',
        lh: 'o',
        bass: 'R......r..r.....',
        drums: { kick: 'X......x..x.....', snare: BACKBEAT, hatClosed: 'x.x.x.x.x.x.x.x.' },
        fill: {
          drums: {
            kick: 'X......x..x.....',
            snare: '....X.......X.xX',
            hatClosed: 'x.x.x.x.x.x.....',
          },
        },
      },
      {
        rh: 'r1',
        lh: 'o',
        bass: 'R......r..r...5.',
        drums: { kick: 'X......x..x..x..', snare: BACKBEAT, hatClosed: 'xxx.xxx.xxx.xxx.' },
        fill: { drums: SNARE_RUN },
      },
    ],
  },
  {
    id: 'hiphop-2',
    family: 'hiphop',
    name: { en: 'Hip hop 2', ru: 'Хип-хоп 2' },
    tempo: 92,
    swing: true,
    variations: [
      // A swung beat.
      {
        rh: 'hip',
        lh: 'o',
        bass: 'R.....r...r.....',
        drums: { kick: 'X.....x...x.....', snare: BACKBEAT, hatClosed: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'r3',
        lh: 'o',
        bass: 'R.....r...r...A.',
        drums: { kick: 'X.....x...x.x...', snare: BACKBEAT, ride: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: TOM_FILL },
      },
    ],
  },
  {
    id: 'disco-1',
    family: 'disco',
    name: { en: 'Disco 1', ru: 'Диско 1' },
    tempo: 120,
    variations: [
      // Four on the floor, the open hi-hat on the off-beats, the bass in octaves.
      {
        rh: 'r2',
        lh: 'o',
        bass: 'R.8.R.8.R.8.R.8.',
        drums: {
          kick: 'X...X...X...X...',
          snare: BACKBEAT,
          hatClosed: 'x...x...x...x...',
          hatOpen: '..x...x...x...x.',
        },
        fill: {
          drums: {
            kick: 'X...X...X...X...',
            snare: '....X.......X.xx',
            hatOpen: '..x...x...x.....',
          },
        },
      },
      {
        rh: 'sync',
        lh: 'o',
        bass: 'R.8.R.8.R.8.5.8.',
        drums: {
          kick: 'X...X...X...X...',
          snare: BACKBEAT,
          hatClosed: 'xx..xx..xx..xx..',
          hatOpen: '..x...x...x...x.',
        },
        fill: { drums: SNARE_RUN },
        crash: true,
      },
    ],
  },
  {
    id: 'disco-2',
    family: 'disco',
    name: { en: 'Disco 2', ru: 'Диско 2' },
    tempo: 124,
    variations: [
      {
        rh: 'sync',
        lh: 'o',
        bass: 'R..8..R.R..8..5.',
        drums: {
          kick: 'X...X...X...X...',
          snare: BACKBEAT,
          hatClosed: 'xoxoxoxoxoxoxoxo',
        },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'r2',
        lh: 'o',
        bass: 'R..8..R.R..8..A.',
        drums: {
          kick: 'X...X...X...X...',
          snare: BACKBEAT,
          hatOpen: '..x...x...x...x.',
          ride: 'x...x...x...x...',
        },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
  {
    id: 'funk-1',
    family: 'funk',
    name: { en: 'Funk 1', ru: 'Фанк 1' },
    tempo: 100,
    variations: [
      // Short stabs over 16ths, ghost notes on the snare.
      {
        rh: 'fun',
        lh: 'o',
        bass: 'R..r..8.._r.r.5.',
        drums: {
          kick: 'X..x..x...x.....',
          snare: '....X..o.o..X..o',
          hatClosed: 'xxxxxxxxxxxxxxxx',
        },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'fun',
        lh: 'o',
        bass: 'R..r..8.r.r.5.A.',
        drums: {
          kick: 'X..x..x...x..x..',
          snare: '....X..o.o..X..o',
          hatClosed: 'xxxxxxxxxxxxxx..',
          hatOpen: '..............x.',
        },
        fill: { drums: TOM_FILL },
      },
    ],
  },
  {
    id: 'funk-2',
    family: 'funk',
    name: { en: 'Funk 2', ru: 'Фанк 2' },
    tempo: 96,
    variations: [
      {
        rh: 'rnb',
        lh: 'o',
        bass: 'R.....r.r..r....',
        drums: {
          kick: 'X.....x.x..x....',
          snare: '....X.......X...',
          hatClosed: 'x.xox.xox.xox.xo',
        },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'fun',
        lh: 'o',
        bass: 'R.....r.r..r..A.',
        drums: {
          kick: 'X.....x.x..x..x.',
          snare: '....X..o....X...',
          hatClosed: 'xxxxxxxxxxxxxxxx',
        },
        fill: { drums: TOM_FILL },
      },
    ],
  },
  {
    id: 'reggae-1',
    family: 'reggae',
    name: { en: 'Reggae 1', ru: 'Регги 1' },
    tempo: 80,
    variations: [
      // The one drop: the piano on the off-beats, the kick and the rim on beat 3.
      {
        rh: 'r2',
        lh: 'o',
        bass: 'R.....5.R...._..',
        drums: { kick: '........X.......', rim: '........X.......', hatClosed: '..x...x...x...x.' },
        fill: {
          drums: {
            kick: '........X.......',
            snare: '............x.xx',
            hatClosed: '..x...x...x.....',
          },
        },
      },
      {
        rh: 'r2',
        lh: 'o',
        bass: 'R.....5.R.....8.',
        drums: {
          kick: 'X.......X.......',
          snare: '........X.......',
          hatClosed: 'x.x.x.x.x.x.x.x.',
        },
        fill: { drums: TOM_FILL },
      },
    ],
  },
  {
    id: 'reggae-2',
    family: 'reggae',
    name: { en: 'Reggae 2', ru: 'Регги 2' },
    tempo: 76,
    swing: true,
    variations: [
      // A swung one drop.
      {
        rh: 'r2',
        lh: 'o',
        bass: 'R.......5...r...',
        drums: { kick: '........X.......', rim: '........X.......', hatClosed: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: { kick: '........X.......', snare: '........x.x.x.x.' } },
      },
      {
        rh: 'cty',
        lh: 'o',
        bass: 'R.......5...A...',
        drums: { kick: 'X.......X.......', rim: '........X.......', hatClosed: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: TOM_FILL },
      },
    ],
  },
  {
    id: 'bossa-nova',
    family: 'latin',
    name: { en: 'Bossa nova', ru: 'Босса-нова' },
    tempo: 128,
    bass: 'bassUpright',
    variations: [
      // The bass on the root and the 5th, the rim's two-bar clave read in one bar.
      {
        rh: 'sync',
        lh: 'fifth',
        bass: 'R..5R..5R..5R..5',
        drums: { kick: 'X..xX..xX..xX..x', rim: 'x..x..x...x..x..', hatClosed: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: { kick: 'X..xX..xX..xX..x', rim: 'x..x..x...x.x.x.' } },
      },
      {
        rh: 'sync',
        lh: 'fifth',
        bass: 'R..5R..5R..5R.A.',
        drums: { kick: 'X..xX..xX..xX..x', rim: '..x..x...x..x...', ride: 'x.x.x.x.x.x.x.x.' },
        fill: { drums: TOM_FILL },
      },
    ],
  },
  {
    id: 'samba',
    family: 'latin',
    name: { en: 'Samba', ru: 'Самба' },
    tempo: 104,
    variations: [
      // The surdo's 2 on the kick, 16ths on the hi-hat.
      {
        rh: 'sal',
        lh: 'o',
        bass: 'R...5...R...5...',
        drums: {
          kick: 'X..xX..xX..xX..x',
          snare: '..o...o...o...o.',
          hatClosed: 'xoxxxoxxxoxxxoxx',
        },
        fill: { drums: SNARE_RUN },
      },
      {
        rh: 'sal',
        lh: 'o',
        bass: 'R..5R..5R..5R.A.',
        drums: { kick: 'X..xX..xX..xX..x', snare: '..x...x...x...x.', ride: 'xxxxxxxxxxxxxxxx' },
        fill: { drums: TOM_FILL },
        crash: true,
      },
    ],
  },
]
