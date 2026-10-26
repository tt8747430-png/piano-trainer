import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip, ToolKey } from '@/shared/ui'
import type { PaletteCategory } from '../model/palette-categories'

/**
 * One category's tools in the opened palette, under its name: a titled section the category bar
 * scrolls to; `info`, what its tools do or why they are greyed where they are (no note chosen, not a
 * hand's staff), is the ⓘ beside its name, never a line in it (ADR 0096).
 */
export function PaletteSection({
  category,
  title,
  info,
  children,
}: {
  category: PaletteCategory
  title: string
  info?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      data-category={category}
      className="flex scroll-mt-1 flex-col gap-2 py-1.5"
    >
      <div className="flex min-h-5 items-center gap-1.5">
        <h3 className="text-sm leading-tight font-semibold">{title}</h3>
        {info ? <InfoTip name={title}>{info}</InfoTip> : null}
      </div>
      {children}
    </section>
  )
}

/** A group's name inside a section (Pedal, Lyrics), with what it is for where it says more. */
export function GroupName({ name, info }: { name: string; info?: ReactNode }) {
  return (
    <div className="flex min-h-5 items-center gap-1.5 pt-1">
      <h4 className="text-sm text-muted-foreground">{name}</h4>
      {info ? <InfoTip name={name}>{info}</InfoTip> : null}
    </div>
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
 * wrapping inside its box, never cut; pressed where it is so already; greyed, its tooltip says why
 * (`reason`, ADR 0096).
 */
export function CaptionKey({
  label,
  reason,
  pressed,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  /** Why it is greyed, said in its tooltip while it is. */
  reason?: string | undefined
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={disabled && reason ? reason : label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="flex min-h-16 min-w-0 flex-col items-center justify-start gap-1 rounded-xl border border-border bg-card px-1 pt-2 pb-1.5 text-card-foreground transition-colors hover:bg-chosen aria-pressed:border-selected aria-pressed:bg-selected aria-pressed:text-selected-foreground disabled:opacity-35 disabled:hover:bg-card"
    >
      <span aria-hidden className="grid min-h-7 w-full shrink-0 place-items-center [&_svg]:size-7">
        {children}
      </span>
      <span
        aria-hidden
        className="w-full text-center text-xs leading-tight text-balance break-words hyphens-auto"
      >
        {label}
      </span>
    </button>
  )
}

/**
 * Signs as tiles (ADR 0110, forScore's palette): clefs, key and time signatures, barlines, as many to
 * a row as fit, three on the narrowest phone.
 */
export function SignGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      className="grid grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))] gap-1.5"
    >
      {children}
    </div>
  )
}

/**
 * A sign's tile (ADR 0110, forScore's palette): the sign drawn on a short staff (`children`), its name
 * under it, and what it holds in small type (`detail`: a key's relative minor, a time's beats); pressed
 * where it is so already; greyed, its tooltip says why (`reason`, ADR 0096).
 */
export function SignTile({
  label,
  name = label,
  detail,
  reason,
  pressed,
  disabled = false,
  onClick,
  children,
}: {
  /** Its name for a screen reader and its tooltip. */
  label: string
  /** What it prints under the sign, where that is not its label: a time's beats alone. */
  name?: string | null
  detail?: string
  reason?: string | undefined
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={disabled && reason ? `${label}\n${reason}` : detail ? `${label} · ${detail}` : label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="group flex min-h-24 min-w-0 flex-col items-center justify-start gap-0.5 rounded-xl border border-border bg-card px-1 pt-1.5 pb-1.5 text-card-foreground transition-colors hover:bg-chosen aria-pressed:border-selected aria-pressed:bg-selected aria-pressed:text-selected-foreground disabled:opacity-35 disabled:hover:bg-card"
    >
      <span aria-hidden className="flex h-11 w-full shrink-0 justify-center">
        {children}
      </span>
      {name === null ? null : (
        <span
          aria-hidden
          className="w-full text-center text-sm leading-tight text-balance break-words"
        >
          {name}
        </span>
      )}
      {detail ? (
        <span
          aria-hidden
          className="w-full text-center text-xs leading-tight text-muted-foreground tabular-nums group-aria-pressed:text-selected-foreground/80"
        >
          {detail}
        </span>
      ) : null}
    </button>
  )
}

/** Terms as a score prints them (dolce, rit., D.C. al Fine), as many to a row as fit. */
export function TermGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5"
    >
      {children}
    </div>
  )
}

/**
 * A term's key (ADR 0096): the term alone as a score prints it, its name for a screen reader, what it
 * means (`meaning`: dolce, sweetly) its tooltip and a screen reader's description; greyed, why.
 */
export function TermKey({
  label,
  term,
  meaning,
  reason,
  disabled = false,
  onClick,
}: {
  label: string
  term: string
  meaning: string
  reason?: string | undefined
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <ToolKey
      label={label}
      description={meaning}
      reason={reason}
      disabled={disabled}
      onClick={onClick}
      className="whitespace-normal"
    >
      <Printed text={term} />
    </ToolKey>
  )
}

/** Words as a score prints them, as a key's picture: italic, wrapping in its box. */
export function Printed({ text, music = false }: { text: string; music?: boolean }) {
  return (
    <span
      className={cn(
        'text-center',
        music
          ? 'font-music text-3xl leading-none'
          : 'font-serif text-sm leading-tight font-semibold italic',
      )}
    >
      {text}
    </span>
  )
}
