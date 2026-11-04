import type { LocalText } from '@/shared/i18n'
import type { DrumVoice, SheetMeter } from '@/shared/lib/arrangement'
import type { LeftFigureId, RightFigureId } from './types'

/**
 * The Chord player's style families (R29 CP3), in the order its Style sheet lists them; `patterns`
 * holds Accompaniment's own patterns played on the piano alone.
 */
export const STYLE_FAMILIES = [
  'pop',
  'rock',
  'ballad',
  'worship',
  'hymn',
  'hiphop',
  'disco',
  'funk',
  'reggae',
  'latin',
  'jazz',
  'blues',
  'classical',
  'patterns',
] as const
export type StyleFamily = (typeof STYLE_FAMILIES)[number]

/** A groove written a character a step, voice by voice (`drumSteps`): `X` accent, `x` stroke, `o` ghost, `.` silent. */
export type WrittenGrid = Partial<Readonly<Record<DrumVoice, string>>>

/** A variation as written: the piano's two hands, the bass's line (`bassLine`), the drums' groove, its fill. */
export interface WrittenVariation {
  readonly rh: RightFigureId
  readonly lh: LeftFigureId
  readonly bass?: string
  readonly drums?: WrittenGrid
  readonly fill?: { readonly bass?: string; readonly drums?: WrittenGrid }
  readonly crash?: boolean
}

/** A style as written (`content/styles`): its name, its family, its tempo, the time it is written in, its variations. */
export interface WrittenStyle {
  readonly id: string
  readonly family: Exclude<StyleFamily, 'patterns'>
  readonly name: LocalText
  /** Beats a minute it is played at when chosen. */
  readonly tempo: number
  /** The time it is written in: choosing it lays a sheet in another time into this one. 4/4 where none. */
  readonly meter?: SheetMeter
  /** Its 16ths played on triplets. */
  readonly swing?: boolean
  /** Which bass plays it: the electric's where none. */
  readonly bass?: 'bassElectric' | 'bassUpright'
  /** 1 to 4. */
  readonly variations: readonly WrittenVariation[]
}
