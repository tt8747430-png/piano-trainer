import type { NetResult } from '../network'

/** An online chord sheet as a link reads it (R39-10): its text, style and tempo, and who may change it. */
export interface OnlineSheet {
  readonly name: string
  /** The sheet as text (`sheetToText`). */
  readonly body: string
  readonly style: string
  readonly tempo: number
  /** Whether anyone holding the link may change it (the owner's Share: View only or Can edit). */
  readonly canEdit: boolean
  /** Raised by each write: what a copy last read. */
  readonly revision: number
  /** Whether the one asking owns it. */
  readonly mine: boolean
}

/** What a sheet's chords and sound are, as written online. */
export interface OnlineContent {
  readonly body: string
  readonly style: string
  readonly tempo: number
}

/** The chord sounding now in an open copy: a box (section, index) and its bar's beat; none when stopped. */
export interface LivePlace {
  readonly section: number
  readonly index: number
  readonly beat: number | null
}

/** One open copy's line to the sheet: what others change and play, and its own playing sent out. */
export interface SheetLine {
  /** Tells every other open copy what this one plays now (none: stopped). */
  sendPlaying(place: LivePlace | null): void
  /** Leaves the sheet's channel. */
  close(): void
}

export interface SheetLineEvents {
  /** The sheet was written: read it again. */
  onChanged(revision: number): void
  /** Another copy plays this chord now, or stopped. */
  onPlaying(place: LivePlace | null): void
}

/**
 * Chord sheets shared live (R39-10): the owner makes one of their sheets an online sheet (an account
 * needed: it reaches other people, ADR 0116); anyone holding its link reads it, writes it where the
 * owner allows, and sees each change and the chord playing as it happens.
 */
export interface ChordSharePort {
  /** Shares one of the owner's sheets, or updates the one shared: its link's id. */
  share(
    sheetKey: string,
    name: string,
    content: OnlineContent,
    canEdit: boolean,
  ): Promise<NetResult<string>>
  /** The owner's choice: View only or Can edit. */
  setAccess(id: string, canEdit: boolean): Promise<NetResult<void>>
  /** The sheet a link names; none where there is none. */
  read(id: string): Promise<NetResult<OnlineSheet | null>>
  /** Writes it through the link: its new revision; refused while it is view only. */
  write(id: string, content: OnlineContent): Promise<NetResult<number>>
  /** Opens the sheet's live line. */
  open(id: string, events: SheetLineEvents): SheetLine
}

/** A link's id: a uuid, as the server makes it. */
export const ONLINE_SHEET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
