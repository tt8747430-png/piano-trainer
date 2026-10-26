import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Paint } from './paint'
import { TileMark } from './TileMark'

/** A row's tile on its paint's wash: an icon, or the row's number where the rows are a sequence; or none. */
export type RowTile =
  | { icon: LucideIcon; numeral?: undefined; paint: Paint }
  | { icon?: undefined; numeral: number; paint: Paint }
  | { icon?: undefined; numeral?: undefined; paint?: undefined }

/** What a row shows, a link's or a button's alike. */
export type RowFaceProps = {
  title: string
  detail?: string | undefined
  /** What it carries at its end: a level, a mark. */
  trailing?: ReactNode
  /** What it shows under its title and detail. */
  children?: ReactNode
} & RowTile

/**
 * What a list row shows (`RowLink`, `RowButton`): a tile in its paint with an icon, or its number in
 * a sequence (a list of one kind goes without, every row's tile alike), a title of up to two lines,
 * an optional detail of up to two, what it holds under them (a song's chords), what it carries at its
 * end, then the row's own `end` (a link's chevron).
 */
export function RowFace({
  title,
  detail,
  icon: Icon,
  numeral,
  paint,
  trailing,
  children,
  end,
}: RowFaceProps & { end?: ReactNode }) {
  return (
    <>
      {paint ? (
        Icon ? (
          <TileMark icon={Icon} paint={paint} />
        ) : numeral === undefined ? null : (
          <TileMark numeral={numeral} paint={paint} />
        )
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-lg leading-snug font-semibold text-pretty">{title}</span>
        {detail ? (
          <>
            {' '}
            <span className="line-clamp-2 text-sm text-pretty text-muted-foreground">{detail}</span>
          </>
        ) : null}
        {children ? <> {children}</> : null}
      </span>
      {trailing ? <> {trailing}</> : null}
      {end}
    </>
  )
}
