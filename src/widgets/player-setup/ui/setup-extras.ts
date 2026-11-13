import { createContext, use, type ReactElement, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** A page's row on the Player's Settings (R32): its name, what it controls, what it is set to. */
export interface SettingsRow {
  readonly id: string
  readonly label: string
  readonly icon: LucideIcon
  /** What it is set to now, at the row's end. */
  readonly value?: string | undefined
}

/** A page of the Player's Settings opened from its row (Score view, Playback). */
export interface SettingsPageRow extends SettingsRow {
  readonly content: ReactNode
}

/**
 * A row leading to a page that is a setting's home elsewhere (R32: the On-screen piano's page, the
 * home of every on-screen piano's settings): `render` is its router `Link`.
 */
export interface SettingsLinkRow extends SettingsRow {
  readonly render: ReactElement
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
  /** Rows to a setting's home elsewhere, ranked among the pages. */
  readonly links?: readonly SettingsLinkRow[]
  readonly acts: readonly SettingsAct[]
  /** Told when the sheet opens or closes as a panel at the right (a laptop): the screen makes room. */
  readonly onPanel?: (open: boolean) => void
}

export const SettingsExtrasContext = createContext<SettingsExtras>({ pages: [], acts: [] })

export const useSettingsExtras = (): SettingsExtras => use(SettingsExtrasContext)
