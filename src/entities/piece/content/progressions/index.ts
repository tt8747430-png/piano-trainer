import type { Collection, Piece } from '../../model/types'
import flow from './flow'
import pop from './pop'
import twofive from './twofive'
import cadence from './cadence'
import minor251 from './minor251'
import mcadence from './mcadence'
import minorpop from './minorpop'
import res1 from './res1'
import res2 from './res2'
import res3 from './res3'
import blues from './blues'
import stacks from './stacks'
import romashki from './romashki'

const progressions: Collection = {
  id: 'progressions',
  name: { en: 'Progressions', ru: 'Последовательности аккордов' },
  entries: [
    flow,
    pop,
    twofive,
    cadence,
    minor251,
    mcadence,
    minorpop,
    res1,
    res2,
    res3,
    blues,
    stacks,
    romashki,
  ],
}

export default progressions

/** The key's common progressions (roadmap §3.8), a major key's and a minor key's, opened in the Player in any key. */
export const COMMON_PROGRESSIONS: Readonly<Record<'major' | 'minor', readonly Piece[]>> = {
  major: [cadence, flow, twofive, pop],
  minor: [mcadence, minorpop, minor251],
}
