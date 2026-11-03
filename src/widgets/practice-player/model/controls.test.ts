import { describe, expect, it } from 'vitest'
import { PLAYER_CONTROLS, PLAYER_KINDS, controlsFor, type PlayerControl } from './controls'

/** The audit's table (`.scratch/r29/audit.md`, A35): each control the Player offers each kind. */
const TABLE: Readonly<Record<PlayerControl, string>> = {
  //                  score chart example progression exercise
  staves: '           yes   yes   yes     no          no',
  accompaniment: '    no    yes   yes     yes         no',
  swing: '            yes   yes   yes     yes         yes',
  chordSize: '        no    yes   yes     yes         no',
  simplify: '         no    yes   yes     no          no',
  sections: '         yes   yes   yes     no          no',
  edit: '             yes   yes   yes     no          no',
  otherHand: '        yes   yes   yes     yes         yes',
  pedal: '            yes   yes   yes     yes         yes',
}

describe('controlsFor (A35, R30)', () => {
  it.each(PLAYER_KINDS.map((kind, column) => [kind, column] as const))(
    'offers a %s only what changes it',
    (kind, column) => {
      const offered = PLAYER_CONTROLS.filter(
        (control) => TABLE[control].trim().split(/\s+/)[column] === 'yes',
      )
      expect([...controlsFor(kind)]).toEqual(offered)
    },
  )
})
