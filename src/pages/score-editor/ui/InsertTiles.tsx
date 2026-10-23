import { useMemo, useRef, type ReactNode } from 'react'
import { cn, fitZoom, useElementSize } from '@/shared/lib'
import type { TimeSignature } from '@/shared/lib/music'
import { notate, type StaffId, type TimedMusic } from '@/shared/lib/notation'
import { LazyScoreView } from '@/shared/ui'

/**
 * One thing to insert: its picture over its name, as a notation app's palette tiles are, compact;
 * pressed where it is already so. Its name is `label`; `caption`, where given, is what the tile
 * says under the picture instead (a jump's words printed in the picture, what they ask under them),
 * in a softer ink as a gloss.
 */
export function Tile({
  label,
  caption,
  pressed,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  caption?: string
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={caption ? `${label}: ${caption}` : label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="flex min-w-0 flex-col items-center gap-1 overflow-hidden rounded-xl border border-border bg-card px-1.5 pt-1.5 pb-2 text-card-foreground transition-colors hover:bg-chosen aria-pressed:border-selected aria-pressed:bg-selected/10 disabled:opacity-35"
    >
      <span aria-hidden className="grid h-14 w-full place-items-center overflow-hidden">
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          'line-clamp-2 w-full text-center text-xs leading-tight text-balance',
          caption && 'text-muted-foreground',
        )}
      >
        {caption ?? label}
      </span>
    </button>
  )
}

/** A tile's picture drawn as a box of the same height as every other: an icon, a sign, a glyph. */
export function IconPicture({ children }: { children: ReactNode }) {
  return <span className="grid size-10 place-items-center">{children}</span>
}

/**
 * A tile's picture in words, as a score prints them: italic, a long one wrapping in its tile; a
 * sign drawn after them as `children` (To Coda's).
 */
export function TextPicture({
  text,
  music = false,
  children,
}: {
  text: string
  music?: boolean
  children?: ReactNode
}) {
  return (
    <span
      className={cn(
        'px-0.5 text-center leading-tight text-balance',
        music ? 'font-music text-5xl leading-none' : 'font-serif text-base font-semibold italic',
      )}
    >
      {text}
      {children}
    </span>
  )
}

/**
 * A tile's picture engraved on one staff (or the grand staff), shrunk to its tile at any width so
 * the mark is never cut off; `time` the bar's own signature where it is not the meter's (a bar of
 * another length).
 */
export function Engraved({
  music,
  noTime = false,
  time,
  grand = false,
  staff = 'treble',
}: {
  music: TimedMusic
  noTime?: boolean
  time?: TimeSignature
  grand?: boolean
  /** The one staff drawn, where not the grand staff. */
  staff?: StaffId
}) {
  const score = useMemo(() => {
    const notated = notate(music)
    const [first] = notated.measures
    return time && first ? { ...notated, measures: [{ ...first, time }] } : notated
  }, [music, time])
  const room = useRef<HTMLDivElement>(null)
  const drawn = useRef<HTMLDivElement>(null)
  const space = useElementSize(room)
  const size = useElementSize(drawn)
  const zoom = Math.min(fitZoom(space.width, size.width), fitZoom(space.height, size.height))
  return (
    <div
      ref={room}
      className="pointer-events-none grid size-full min-h-0 min-w-0 place-items-center overflow-hidden"
    >
      <div ref={drawn} className="w-max" style={zoom < 1 ? { zoom } : undefined}>
        <LazyScoreView
          score={score}
          staff={grand ? undefined : staff}
          scale={grand ? 0.42 : 0.5}
          timeBefore={noTime ? score.measures[0]?.time : undefined}
        />
      </div>
    </div>
  )
}

/** The grid of a group's tiles, as many to a row as the sheet holds, under an optional heading. */
export function Tiles({
  heading,
  note,
  children,
}: {
  heading?: string
  /** A line under the heading: what the group's tiles do, where it is not plain. */
  note?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2" aria-label={heading}>
      {heading ? <h3 className="text-sm font-semibold text-muted-foreground">{heading}</h3> : null}
      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-1.5">
        {children}
      </div>
    </section>
  )
}
