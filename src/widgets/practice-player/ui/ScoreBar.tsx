import { use, type ReactNode } from 'react'
import { ChromeShownContext } from '../model/chrome-shown'

/** Its groups' buttons side by side, level, a size closer on a phone held upright. */
const GROUP = 'flex min-w-0 items-center gap-1 sm:gap-2'

/**
 * The score's bar (ADR 0115), the Player's and the score editor's one surface: Close, the title and
 * Practise · Edit at its start (`lead`), the screen's own buttons at its end (`actions`: the
 * Player's Piano keys, MIDI and gear, the editor's Play, Undo, Redo and gear, R31-E). One band of
 * the card's paper with one hairline under the whole, every button a toolbar's round one
 * (`variant="tool"`), so the two modes' bars are the same height and switching moves nothing. While
 * the music is read in Diagrams it steps aside whole (ADR 0108), its room kept.
 */
export function ScoreBar({
  lead,
  middle,
  actions,
}: {
  lead: ReactNode
  /** The Player's views, a pill in the bar's middle (its canvas); the bar then bare over the paper. */
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
