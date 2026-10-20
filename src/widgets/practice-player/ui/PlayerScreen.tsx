import type { ReactNode } from 'react'
import type { KeyboardSettings } from '@/entities/settings'

/**
 * The Player's screen: its areas (`PlayerArea`) placed by the `player-screen` utility (spec §2.8),
 * the keys at the foot or under the toolbar as the keyboard settings dock them.
 */
export function PlayerScreen({
  keys,
  children,
}: {
  keys: KeyboardSettings['dock']
  children: ReactNode
}) {
  return (
    <div
      data-keys={keys}
      className="player-screen min-h-0 flex-1 gap-3 py-2 landscape-phone:gap-2 landscape-phone:py-0 landscape-phone:data-[keys=top]:pb-2"
    >
      {children}
    </div>
  )
}
