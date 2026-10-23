import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import type { PaletteCategory } from '../model/palette-categories'

/**
 * One category's tools in the opened palette, under its name: a titled section the category bar
 * scrolls to; `reason`, one line saying why its tools are greyed where they are (no note chosen, not
 * a hand's staff).
 */
export function PaletteSection({
  category,
  title,
  reason,
  children,
}: {
  category: PaletteCategory
  title: string
  reason?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      data-category={category}
      className="flex scroll-mt-1 flex-col gap-2 py-1.5"
    >
      <h3 className="text-sm leading-tight font-semibold">{title}</h3>
      {reason ? <p className="text-sm text-pretty text-muted-foreground">{reason}</p> : null}
      {children}
    </section>
  )
}

/** A group of picture keys, six to a row: the values, the marks, the dynamics. */
export function GlyphGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div role={label ? 'group' : undefined} aria-label={label} className="grid grid-cols-6 gap-1.5">
      {children}
    </div>
  )
}

/** A group of keys that name what they do under their picture, as many to a row as fit. */
export function CaptionGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      className="grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-1.5"
    >
      {children}
    </div>
  )
}

/**
 * A key that says what it does: its picture over its name (a standard musical term), the name
 * wrapping inside its box, never cut; `caption` a gloss in a softer ink where the picture already
 * prints the name (a jump's words); pressed where it is so already.
 */
export function CaptionKey({
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
      className="flex min-h-16 min-w-0 flex-col items-center justify-start gap-1 rounded-xl border border-border bg-card px-1 pt-2 pb-1.5 text-card-foreground transition-colors hover:bg-chosen aria-pressed:border-selected aria-pressed:bg-selected aria-pressed:text-selected-foreground disabled:opacity-35"
    >
      <span aria-hidden className="grid min-h-7 w-full shrink-0 place-items-center [&_svg]:size-7">
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          'w-full text-center text-xs leading-tight text-balance break-words hyphens-auto',
          caption && 'text-muted-foreground aria-pressed:text-inherit',
        )}
      >
        {caption ?? label}
      </span>
    </button>
  )
}

/** Words as a score prints them, as a key's picture: italic, wrapping in its box. */
export function Printed({ text, music = false }: { text: string; music?: boolean }) {
  return (
    <span
      className={cn(
        'text-center leading-none',
        music ? 'font-music text-3xl' : 'font-serif text-sm font-semibold italic',
      )}
    >
      {text}
    </span>
  )
}
