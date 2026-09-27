import type { ReactNode } from 'react'

/** The Player's screen: its areas (`PlayerArea`) placed by the `player-screen` utility (spec §2.8). */
export function PlayerScreen({ children }: { children: ReactNode }) {
  return (
    <div className="player-screen flex-1 gap-3 pt-2 landscape-phone:min-h-0 landscape-phone:gap-2 landscape-phone:pt-1">
      {children}
    </div>
  )
}
