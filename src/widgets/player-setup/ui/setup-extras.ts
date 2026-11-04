import { createContext, use, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** A page of the Player's Settings opened from its row (Display, Playback, Volume). */
export interface SettingsPageRow {
  readonly id: string
  readonly label: string
  readonly icon: LucideIcon
  readonly content: ReactNode
}

/** An act on the music from the Player's Settings (Song information, Sections, Print, Export…). */
export interface SettingsAct {
  readonly key: string
  readonly label: string
  readonly icon: LucideIcon
  /** Its group: While you play (a way to more of the Player), This song, or Share (R29, 2.5). */
  readonly group: 'play' | 'song' | 'share'
  readonly disabled?: boolean | undefined
  /** Why it is greyed, said while it is. */
  readonly reason?: string | undefined
  onSelect(): void
}

/**
 * What the Player's screen adds to its Settings sheet (R29, Flat's one menu): the pages of how the
 * Player always works, and the acts on this music. The screen provides them; the sheet draws them.
 */
export interface SettingsExtras {
  readonly pages: readonly SettingsPageRow[]
  readonly acts: readonly SettingsAct[]
  /**
   * The sheet opened at one of its pages from elsewhere (the Tools sheet's Display, R29 B8): a new
   * object each time it is asked.
   */
  readonly request?: { readonly page: string } | null
}

export const SettingsExtrasContext = createContext<SettingsExtras>({ pages: [], acts: [] })

export const useSettingsExtras = (): SettingsExtras => use(SettingsExtrasContext)
