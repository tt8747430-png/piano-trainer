import type { ReactNode } from 'react'

/** The Player's screen: its areas (`PlayerArea`) placed by the `player-screen` utility (spec §2.8). */
export function PlayerScreen({ children }: { children: ReactNode }) {
  return (
    <div className="player-screen min-h-0 flex-1 gap-3 py-2 landscape-phone:gap-2 landscape-phone:py-0">
      {children}
    </div>
  )
}
