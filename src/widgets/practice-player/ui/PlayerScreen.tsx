import { useState, type ReactNode } from 'react'
import type { KeyboardSettings } from '@/entities/settings'
import { DockShownContext } from '../model/dock-shown'
import { dockTap } from '../model/tap-on-screen'

/**
 * The Player's screen: its areas (`PlayerArea`) placed by the `player-screen` utility (spec §2.8),
 * the keys at the foot or under the toolbar as the keyboard settings dock them. A tap on its free
 * room shows or hides the floating transport, a tap on a note brings it back (`dockTap`).
 */
export function PlayerScreen({
  keys,
  children,
}: {
  keys: KeyboardSettings['dock']
  children: ReactNode
}) {
  const [dock, setDock] = useState(true)
  return (
    // A tap anywhere is the transport's business only by `dockTap`: every control keeps its own.
    <div
      data-keys={keys}
      className="player-screen min-h-0 flex-1 gap-3 py-2 landscape-phone:gap-2 landscape-phone:py-0 landscape-phone:data-[keys=top]:pb-2"
      onClick={(event) => {
        const tap = dockTap(event.target as Element)
        if (tap === 'show') setDock(true)
        else if (tap === 'toggle') setDock((shown) => !shown)
      }}
    >
      <DockShownContext value={dock}>{children}</DockShownContext>
    </div>
  )
}
