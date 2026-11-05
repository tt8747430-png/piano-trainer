import { use, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip, ToolKey } from '@/shared/ui'
import type { PaletteCategory } from '../model/palette-categories'
import type { Tool } from '../model/shortcuts'
import { PaletteTipSide, useKeyTip, usePaletteForm } from './palette-form'

/** What is chosen on the music, as the pickers' cells show it (ADR 0114): a sky glyph on a sky wash. */
const PRESSED = 'aria-pressed:bg-chosen aria-pressed:text-foreground'

/**
 * A key's face in each form (Flat's): in a section's grid an equal cell of its table, the table's
 * hairlines drawn inside the cells, at their right and their foot; in the row a 40px glyph with no box. Pressed, a sky
 * glyph on a sky wash; greyed, faded.
 */
const FACES = {
  grid: cn(
    'h-12 w-full min-w-0 rounded-none border-0 bg-card px-0 text-foreground/80 shadow-[inset_-1px_-1px_0_var(--color-hairline)] hover:bg-accent hover:text-foreground focus-visible:z-10 focus-visible:-outline-offset-3 active:scale-100',
    PRESSED,
  ),
  bar: cn(
    'size-10 shrink-0 rounded-control border-0 bg-transparent px-0 text-foreground/75 shadow-none hover:bg-accent hover:text-foreground focus-visible:-outline-offset-3 landscape-phone:size-9',
    PRESSED,
  ),
} as const

/** A cell two wide in a section's grid: a term's words, a barline's drawing. */
const WIDE = 'col-span-2'

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
      className={bar ? 'flex shrink-0 items-center gap-0.5' : 'flex flex-col gap-2 pb-1'}
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
      role="status"
      className={cn(
        'text-sm text-muted-foreground',
        bar
          ? 'flex min-h-10 items-center px-2'
          : 'rounded-control border border-dashed border-hairline p-3',
      )}
    >
      {children}
    </p>
  )
}

/** What a section says over its keys (whose staff, from which bar); nothing in the row. */
export function SectionLine({ children }: { children: ReactNode }) {
  if (usePaletteForm() === 'bar') return null
  return <p className="text-sm text-muted-foreground">{children}</p>
}

/**
 * A group of keys as the form lays them out (R31-E, Flat's palettes): in a section a table of equal
 * bordered cells, as many to a row as the room holds, its last row's cells keeping their lines; in
 * the row, in line.
 */
export function KeyGrid({ label, children }: { label?: string | undefined; children: ReactNode }) {
  const group = { role: label ? 'group' : undefined, 'aria-label': label }
  if (usePaletteForm() === 'bar')
    return (
      <div {...group} className="contents">
        {children}
      </div>
    )
  // Each cell draws its lines at its right and its foot; the last column's and the last row's
  // fall under the table's own border, clipped.
  return (
    <div
      {...group}
      data-slot="key-grid"
      className="overflow-hidden rounded-control border border-hairline bg-card"
    >
      <div className="-me-px -mb-px grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))]">
        {children}
      </div>
    </div>
  )
}

/**
 * A palette's key (`ToolKey`), as the form lays it out: a cell of the section's table, or the row's
 * glyph. Its tooltip names it, then its shortcut (`tool`, Flat's). A key that cannot act on what is
 * chosen is not drawn (R32-B): its caller leaves it out.
 */
export function PaletteKey({
  label,
  tool,
  className,
  span,
  children,
  ...props
}: ComponentProps<typeof ToolKey> & { tool?: Tool }) {
  const form = usePaletteForm()
  return (
    <ToolKey
      label={label}
      tip={useKeyTip(label, tool)}
      tipSide={use(PaletteTipSide)}
      className={cn(
        FACES[form],
        span === 'wide' && form === 'bar' && 'w-auto min-w-20 px-2',
        className,
      )}
      {...(span ? { span } : {})}
      {...props}
    >
      {children}
    </ToolKey>
  )
}

/**
 * A sign's key (ADR 0115, 0114): the sign drawn on a short staff (`children`), named in its tooltip
 * and to a screen reader. Two cells of the section's table, or the row's. Pressed where it is so
 * already.
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
  const form = usePaletteForm()
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
        form === 'grid'
          ? cn('h-12 bg-card shadow-[inset_-1px_-1px_0_var(--color-hairline)]', WIDE)
          : 'h-10 w-20 shrink-0 rounded-control',
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
