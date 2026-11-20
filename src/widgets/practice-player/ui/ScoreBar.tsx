import { use, type ReactNode } from 'react'
import { ChromeShownContext } from '../model/chrome-shown'

/** Its groups' buttons side by side, level, a size closer on a phone held upright. */
const GROUP = 'flex min-w-0 items-center gap-1 sm:gap-2'

/**
 * The score's bar (ADR 0115), the Player's and the score editor's one surface (loop round 61): Close
 * at its start (`lead`), Play · Edit in its middle (`middle`), the screen's own glass group at its
 * end (`actions`: the Player's View, MIDI and Settings; the editor's Undo, Redo and More). Glass
 * buttons over the music, no band and no hairline, so the two modes' bars are one and switching
 * moves nothing. While the music is read in Diagrams it steps aside whole (ADR 0108), its room kept.
 */
export function ScoreBar({
  lead,
  middle,
  actions,
}: {
  lead: ReactNode
  /** Play · Edit (`ModeSwitch`), or a lesson example's Done. */
  middle?: ReactNode
  actions: ReactNode
}) {
  const { bar } = use(ChromeShownContext)
  return (
    <header
      data-area="bar"
      data-hidden={bar ? undefined : true}
      inert={!bar}
      className="score-bar min-w-0 transition-[opacity,translate] duration-200 ease-out data-hidden:-translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none"
    >
      <div data-area="lead" className={GROUP}>
        {lead}
      </div>
      {middle ? <div data-area="middle">{middle}</div> : null}
      <div data-area="actions" className={`${GROUP} justify-end`}>
        {actions}
      </div>
    </header>
  )
}
