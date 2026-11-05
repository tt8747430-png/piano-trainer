import { useState, type ReactNode, type SyntheticEvent } from 'react'
import type { KeyboardSettings } from '@/entities/settings'
import { cn, useHiddenWhileReading } from '@/shared/lib'
import { ChromeShownContext } from '../model/chrome-shown'
import { dockTap } from '../model/tap-on-screen'

/**
 * The score's screen, the Player's and the score editor's one frame (ADR 0115): the `player-screen`
 * grid with the same gaps and padding, so the bar, the tools row, the sheet, the transport and the
 * keys stand in the same places in both modes.
 */
export const SCORE_SCREEN =
  'player-screen min-h-0 flex-1 gap-3 py-2 max-sm:gap-x-2 landscape-phone:gap-2 landscape-phone:py-0 landscape-phone:data-[keys=top]:pb-2'

/** Whether an event happened on the music (`data-area="sheet"`). */
const onSheet = (event: SyntheticEvent) =>
  event.target instanceof Element && event.target.closest('[data-area="sheet"]') !== null

/**
 * The Player's screen: its areas (`PlayerArea`) placed by the `player-screen` utility,
 * the keys at the foot or under the tools row as the keyboard settings dock them. The floating
 * transport steps aside as the music is read (dragged, scrolled, pinched: `useHiddenWhileReading`);
 * a tap on the screen's free room shows or hides it, a tap on a note brings it back (`dockTap`).
 * While the bar and the tools row step aside (`aside`: Diagrams playing, ADR 0108, as Chordify's
 * do), a tap on the free room brings them back with the transport, and the next sends all of them
 * aside; once it is over (the music stopped), they are all back.
 */
export function PlayerScreen({
  keys,
  aside = false,
  panel = false,
  docked = false,
  children,
}: {
  keys: KeyboardSettings['dock']
  aside?: boolean
  /** A panel at the right is open (a laptop's Settings): the screen ends where it starts. */
  panel?: boolean
  /**
   * Nothing floats over the music (the Player's docked transport and foot, R31-P): no scroll room
   * kept for a transport floating at its foot.
   */
  docked?: boolean
  children: ReactNode
}) {
  const { shown, setShown, show, reading } = useHiddenWhileReading()
  // The bar brought back by a tap while it steps aside; forgotten as stepping aside begins or ends.
  const [back, setBack] = useState(false)
  const [wasAside, setWasAside] = useState(aside)
  if (aside !== wasAside) {
    setWasAside(aside)
    setBack(false)
    if (!aside) setShown(true)
  }
  const bar = !aside || back
  // Only the music read hides it: the keys, the toolbar and the transport are worked, not read.
  const onMusic =
    <E extends SyntheticEvent>(handle: (event: E) => void) =>
    (event: E) => {
      if (onSheet(event)) handle(event)
    }
  return (
    // A tap anywhere is the transport's business only by `dockTap`: every control keeps its own. On
    // a phone held upright the bar's two groups closer, so a phone from 320px has its buttons in a row.
    <div
      data-keys={keys}
      data-panel={panel || undefined}
      className={cn(
        SCORE_SCREEN,
        'data-panel:pe-[min(28rem,100vw)]',
        // Docked, its rows meet: the keys follow the music and the transport the keys, no band
        // between them (R32).
        docked && '[--float-room:0px] gap-y-0 landscape-phone:gap-y-0',
      )}
      onPointerDown={onMusic(reading.onPointerDown)}
      onPointerMove={onMusic(reading.onPointerMove)}
      onTouchStart={onMusic(reading.onTouchStart)}
      onTouchMove={onMusic(reading.onTouchMove)}
      onWheel={onMusic(reading.onWheel)}
      onClick={(event) => {
        const tap = dockTap(event.target as Element)
        if (tap === 'show') show()
        else if (tap === 'toggle' && aside) {
          setBack(!bar)
          setShown(!bar)
        } else if (tap === 'toggle') setShown((was) => !was)
      }}
    >
      <ChromeShownContext value={{ dock: shown, bar }}>{children}</ChromeShownContext>
    </div>
  )
}
