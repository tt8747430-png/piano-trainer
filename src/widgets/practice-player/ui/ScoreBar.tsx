import { use, type ReactNode } from 'react'
import { ChromeShownContext } from '../model/chrome-shown'

/** Its groups' buttons side by side, level, a size closer on a phone held upright. */
const GROUP = 'flex min-w-0 items-center gap-1 sm:gap-2'

/**
 * The score's bar (ADR 0115), the Player's and the score editor's one surface: Close and Practise ·
 * Edit at its start (`lead`), the screen's own three buttons at its end (`actions`: the Player's MIDI
 * · Setup · More, the editor's MIDI · Undo · Redo), and its tools between (`tools`, a `PlayerTools`
 * row): under the buttons on a phone held upright and a tablet, in their row from a laptop's width
 * and on a phone on its side (the `score-bar` utility). One band of the card's paper with one
 * hairline under the whole, every button a toolbar's (`variant="tool"`), so the two modes' bars are
 * the same height and switching moves nothing. While the music is read in Diagrams it steps aside
 * whole (ADR 0102), its room kept.
 */
export function ScoreBar({
  lead,
  actions,
  tools,
}: {
  lead: ReactNode
  actions: ReactNode
  tools: ReactNode
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
      <div data-area="actions" className={`${GROUP} justify-end`}>
        {actions}
      </div>
      <div data-area="tools" className="min-w-0">
        {tools}
      </div>
    </header>
  )
}
