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
  /**
   * What the detail line counts (a song's chords): kept whole at its end, a long detail cut short on
   * one line before it, so the count never stands alone on a line of its own.
   */
  count?: string | undefined
  /** What it carries at its end: a level, a mark. */
  trailing?: ReactNode
  /** Its setting's value now, at its end before the chevron (Settings' "MIDI keyboard  Off ›"). */
  value?: string | undefined
  /** What it shows under its title and detail. */
  children?: ReactNode
} & RowTile

/**
 * What a list row shows (`RowLink`, `RowButton`): a tile in its paint with an icon, or its number in
 * a sequence (a list of one kind goes without, every row's tile alike), a title of up to two lines,
 * an optional detail of up to two, what it holds under them (a song's chords), what it carries at its
 * end, its setting's value, then the row's own `end` (a link's chevron).
 */
export function RowFace({
  title,
  detail,
  count,
  icon: Icon,
  numeral,
  paint,
  trailing,
  value,
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
      {/* Beside a value, the title takes the room it needs (two thirds at most); the value wraps under itself, never cut short. */}
      <span className={value ? 'max-w-[65%] min-w-0 flex-[1_0_auto]' : 'min-w-0 flex-1'}>
        <span className="line-clamp-2 text-lg leading-snug font-semibold text-pretty">{title}</span>
        {count ? (
          <>
            {' '}
            <span className="flex min-w-0 text-sm text-muted-foreground">
              {detail ? (
                <>
                  <span className="truncate">{detail}</span>
                  <span className="shrink-0 whitespace-pre">{' · '}</span>
                </>
              ) : null}
              <span className="shrink-0">{count}</span>
            </span>
          </>
        ) : detail ? (
          <>
            {' '}
            <span className="line-clamp-2 text-sm text-pretty text-muted-foreground">{detail}</span>
          </>
        ) : null}
        {children ? <> {children}</> : null}
      </span>
      {trailing ? <> {trailing}</> : null}
      {value ? (
        <>
          {' '}
          <span
            data-slot="row-value"
            className="min-w-0 shrink-[9] text-end break-words text-muted-foreground"
          >
            {value}
          </span>
        </>
      ) : null}
      {end}
    </>
  )
}
