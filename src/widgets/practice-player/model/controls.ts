/**
 * What the Player plays (A35): a score (the piano's staves written out), a chord chart (its piano
 * played from the chords by a pattern), a lesson's example (a chart a lesson opens on its pattern), a
 * progression, an exercise.
 */
export const PLAYER_KINDS = ['score', 'chart', 'example', 'progression', 'exercise'] as const
export type PlayerKind = (typeof PLAYER_KINDS)[number]

/**
 * The Player's controls that some kinds have and others not (R30: none that does nothing): the
 * Setup's Staves, accompaniment (pattern, inversion, voice leading), Swing and chord size; the tools
 * row's Simplify; More's Sections and the bar's Edit; the settings page's other hand and pedal.
 */
export const PLAYER_CONTROLS = [
  'staves',
  'accompaniment',
  'swing',
  'chordSize',
  'simplify',
  'sections',
  'edit',
  'otherHand',
  'pedal',
] as const
export type PlayerControl = (typeof PLAYER_CONTROLS)[number]

/**
 * Each kind's controls, as the audit found what changes it: a score plays its staves as written, so
 * no pattern, inversion, voice leading, chord size or Simplify changes what it plays (its 8ths still
 * swing, as Flat's playback swings a score's); a
 * progression and an exercise are music of the app's, with no staves of their own to name, no
 * sections and nothing to edit; an exercise plays its own figure, so no pattern or chord size.
 */
const TABLE: Readonly<Record<PlayerKind, readonly PlayerControl[]>> = {
  score: ['staves', 'swing', 'sections', 'edit', 'otherHand', 'pedal'],
  chart: PLAYER_CONTROLS,
  example: PLAYER_CONTROLS,
  progression: ['accompaniment', 'swing', 'chordSize', 'otherHand', 'pedal'],
  exercise: ['swing', 'otherHand', 'pedal'],
}

const inOrder = (kind: PlayerKind): ReadonlySet<PlayerControl> =>
  new Set(PLAYER_CONTROLS.filter((control) => TABLE[kind].includes(control)))
const SETS: Readonly<Record<PlayerKind, ReadonlySet<PlayerControl>>> = {
  score: inOrder('score'),
  chart: inOrder('chart'),
  example: inOrder('example'),
  progression: inOrder('progression'),
  exercise: inOrder('exercise'),
}

/** The controls the Player offers a kind of music, in the table's order. */
export const controlsFor = (kind: PlayerKind): ReadonlySet<PlayerControl> => SETS[kind]
