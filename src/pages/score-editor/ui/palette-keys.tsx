import { use, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip, ToolKey } from '@/shared/ui'
import type { PaletteCategory } from '../model/palette-categories'
import type { Tool } from '../model/shortcuts'
import { PaletteTipSide, useKeyTip, usePaletteForm } from './palette-form'

/** What is chosen on the music, as the pickers' cells show it (ADR 0114): a sky glyph on a sky wash. */
const PRESSED =
  'aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90'

/** A tool's tile (its canvas, Flat's): 48px of sand, the chosen in ink; the same in a section and in the row. */
const TILE =
  'h-12 min-w-12 shrink-0 rounded-control border-0 bg-muted px-2 text-foreground shadow-none hover:bg-accent focus-visible:-outline-offset-3 active:scale-100 landscape-phone:h-10 landscape-phone:min-w-10'

/** A tile two wide: a term's words, a barline's drawing. */
const WIDE = 'min-w-24 px-3'

/**
 * A category's tools (ADR 0114, R31-E), the one chosen in the palette: a region named for it, its
 * sections each a titled grid (`GroupName` over a `KeyGrid`); in the row, its keys alone.
 */
export function PaletteSection({
  category,
  title,
  children,
}: {
  category: PaletteCategory
  title: string
  children: ReactNode
}) {
  const bar = usePaletteForm() === 'bar'
  return (
    <section
      aria-label={title}
      data-category={category}
      className={
        bar ? 'flex shrink-0 items-center gap-0.5' : 'flex scroll-mt-2 flex-col gap-2 pb-1'
      }
    >
      {children}
    </section>
  )
}

/**
 * A section's title over its grid (Flat's Notation, Pitch and representation), with what its tools
 * do in the ⓘ beside it (ADR 0096); nothing in the row.
 */
export function GroupName({ name, info }: { name: string; info?: ReactNode }) {
  if (usePaletteForm() === 'bar') return null
  return (
    <div className="flex min-h-6 items-center gap-1.5 pt-1">
      <h3 className="text-[0.9375rem] leading-tight font-semibold">{name}</h3>
      {info ? <InfoTip name={name}>{info}</InfoTip> : null}
    </div>
  )
}

/**
 * What a category says in place of its tools while it has none to show (R32-B): to choose a note.
 * In the row too, where it stands in the tools' place.
 */
export function PaletteHint({ children }: { children: ReactNode }) {
  const bar = usePaletteForm() === 'bar'
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        bar
          ? 'flex min-h-11 items-center px-2'
          : 'rounded-control border border-dashed border-hairline p-3',
      )}
    >
      {children}
    </p>
  )
}

/**
 * A group of keys as the form lays them out (its canvas, Flat's palettes): in a section tiles
 * wrapping 8px apart; in the row, in line.
 */
export function KeyGrid({ label, children }: { label?: string | undefined; children: ReactNode }) {
  const group = { role: label ? 'group' : undefined, 'aria-label': label }
  const form = usePaletteForm()
  return (
    <div
      {...group}
      data-slot="key-grid"
      className={form === 'bar' ? 'contents' : 'flex flex-wrap gap-2'}
    >
      {children}
    </div>
  )
}

/**
 * A palette's key (`ToolKey`): a tile, in a section and in the row alike. Its tooltip names it, then its shortcut (`tool`, Flat's). A key that cannot act on what is
 * chosen is not drawn (R32-B): its caller leaves it out.
 */
export function PaletteKey({
  label,
  tool,
  className,
  span,
  children,
  ...props
}: ComponentProps<typeof ToolKey> & { tool?: Tool; span?: 'wide' }) {
  return (
    <ToolKey
      label={label}
      tip={useKeyTip(label, tool)}
      tipSide={use(PaletteTipSide)}
      className={cn(TILE, PRESSED, span === 'wide' && WIDE, className)}
      {...props}
    >
      {children}
    </ToolKey>
  )
}

/**
 * A sign's key (ADR 0115, 0114): the sign drawn on a short staff (`children`), named in its tooltip
 * and to a screen reader. A wide tile. Pressed where it is so already.
 */
export function SignTile({
  label,
  tool,
  pressed,
  children,
  ...props
}: {
  /** Its name for a screen reader and its tooltip. */
  label: string
  /** Its shortcut, named in its tooltip. */
  tool?: Tool | undefined
  pressed?: boolean
  children: ReactNode
} & Omit<
  ComponentProps<'button'>,
  'aria-label' | 'aria-pressed' | 'title' | 'disabled' | 'children'
>) {
  const tip = useKeyTip(label, tool)
  return (
    <button
      type="button"
      aria-label={label}
      title={tip}
      aria-pressed={pressed}
      {...props}
      className={cn(
        'flex min-w-0 items-center justify-center px-1 text-foreground/80 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground focus-visible:z-10 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ring disabled:opacity-35 motion-reduce:transition-none',
        TILE,
        WIDE,
        PRESSED,
      )}
    >
      <span aria-hidden className="flex h-9 shrink-0 justify-center">
        {children}
      </span>
    </button>
  )
}

/**
 * A term's key (ADR 0096): the term alone as a score prints it, two cells wide, its name for a screen
 * reader, what it means (`meaning`: dolce, sweetly) its tooltip and a screen reader's description.
 */
export function TermKey({
  label,
  term,
  meaning,
  tool,
  onClick,
}: {
  label: string
  term: string
  meaning: string
  tool?: Tool
  onClick: () => void
}) {
  return (
    <PaletteKey
      label={label}
      tool={tool}
      description={meaning}
      span="wide"
      onClick={onClick}
      className="whitespace-nowrap"
    >
      <Printed text={term} />
    </PaletteKey>
  )
}

/** Words as a score prints them, as a key's picture: a serif's bold italic, or a music glyph. */
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
