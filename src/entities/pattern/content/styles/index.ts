import type { WrittenStyle } from '../../model/style-types'
import { BALLAD_STYLES } from './ballad'
import { GROOVE_STYLES } from './groove'
import { JAZZ_STYLES } from './jazz'
import { POP_STYLES } from './pop'

/** The Chord player's styles (R29 CP3), every one written by us for this app. */
export const WRITTEN_STYLES: readonly WrittenStyle[] = [
  ...POP_STYLES,
  ...BALLAD_STYLES,
  ...GROOVE_STYLES,
  ...JAZZ_STYLES,
]
