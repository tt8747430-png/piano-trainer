import { ChevronDown } from 'lucide-react'
import { use, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip, ToolKey } from '@/shared/ui'
import type { PaletteCategory } from '../model/palette-categories'
import type { Tool } from '../model/shortcuts'
import { PanelSections, useKeyTip, usePaletteDock, usePaletteForm } from './palette-form'

/** What is chosen on the music, as the pickers' cells show it (ADR 0114): a sky glyph on a sky wash. */
const PRESSED =
  'aria-pressed:border-hairline aria-pressed:bg-[color-mix(in_oklab,var(--color-link)_14%,var(--color-card))] aria-pressed:text-link'

/**
 * A key's face in each form (Flat's): in a section's grid a square cell of the bordered table, its
 * hairlines right and under; in the toolbar a 40px glyph with no box; in the list its picture and its
 * name. Pressed, a sky glyph on a sky wash; greyed, faded.
 */
const FACES = {
  grid: cn(
    'h-11 w-auto min-w-0 rounded-none border-0 border-r border-b border-hairline bg-card px-0.5 text-foreground/80 shadow-none hover:bg-accent hover:text-foreground focus-visible:z-10 active:scale-100 landscape-phone:h-10',
    PRESSED,
  ),
  bar: cn(
    'size-10 shrink-0 rounded-lg border-0 bg-transparent px-0 text-foreground/75 shadow-none hover:bg-accent hover:text-foreground landscape-phone:size-9',
    PRESSED,
  ),
  list: cn(
    'h-11 justify-start gap-2.5 rounded-xl border-hairline bg-card px-2 text-left text-sm leading-tight font-normal whitespace-normal',
    PRESSED,
  ),
} as const

/**
 * A category's tools under its name (ADR 0114). In the panel an accordion row, as Flat's: its name
 * and a chevron, a tap folding it open or shut, several open at once; in the sheet a titled section
 * the category bar scrolls to. `info`, what its tools do or why they are greyed where they are, is the
 * ⓘ beside its name, never a line in it (ADR 0096).
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
  const dock = usePaletteDock()
  const { open, toggle } = use(PanelSections)
  if (dock === 'panel') {
    const shown = open.has(category)
    return (
      <section
        aria-label={title}
        data-category={category}
        className="border-b border-hairline last:border-b-0"
      >
        <div className="flex items-center gap-1.5">
          <h3 className="min-w-0 flex-1">
            <button
              type="button"
              aria-expanded={shown}
              onClick={() => toggle(category)}
              className="flex min-h-12 w-full items-center text-left text-base leading-tight font-semibold outline-none focus-visible:underline"
            >
              {title}
            </button>
          </h3>
          {info ? <InfoTip name={title}>{info}</InfoTip> : null}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => toggle(category)}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                'size-5 transition-transform duration-200 ease-out motion-reduce:transition-none',
                shown && 'rotate-180',
              )}
            />
          </button>
        </div>
        {shown ? <div className="flex flex-col gap-2 pb-4">{children}</div> : null}
      </section>
    )
  }
  return (
    <section
      aria-label={title}
      data-category={category}
      className="flex scroll-mt-1 flex-col gap-2 py-2"
    >
      <div className="flex min-h-5 items-center gap-1.5">
        <h3 className="text-[0.9375rem] leading-tight font-semibold">{title}</h3>
        {info ? <InfoTip name={title}>{info}</InfoTip> : null}
      </div>
      {children}
    </section>
  )
}

/** A group's name inside a section (Pedal, Signs and jumps), with what it is for where it says more. */
export function GroupName({ name, info }: { name: string; info?: ReactNode }) {
  return (
    <div className="flex min-h-5 items-center gap-1.5 pt-1">
      <h4 className="text-sm text-muted-foreground">{name}</h4>
      {info ? <InfoTip name={name}>{info}</InfoTip> : null}
    </div>
  )
}

/** What a section says over its keys (whose staff, from which bar). */
export function SectionLine({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

/**
 * A group of keys as the form lays them out (Flat's): a bordered table of square cells, 44px at the
 * least, as many to a row as the panel or the sheet holds, empty cells left blank so the table stays
 * whole; two columns of named keys in the list; in line in the toolbar.
 */
export function KeyGrid({ label, children }: { label?: string | undefined; children: ReactNode }) {
  const form = usePaletteForm()
  const group = { role: label ? 'group' : undefined, 'aria-label': label }
  if (form === 'bar')
    return (
      <div {...group} className="contents">
        {children}
      </div>
    )
  if (form === 'list')
    return (
      <div {...group} className="grid grid-cols-2 gap-1.5">
        {children}
      </div>
    )
  return (
    <div {...group} className="overflow-hidden rounded-xl border border-hairline bg-card">
      <div className="-mr-px -mb-px grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))]">
        {children}
      </div>
    </div>
  )
}

/** A key's picture and, in the list, its name beside it. */
function Face({ label, children }: { label: string; children: ReactNode }) {
  if (usePaletteForm() !== 'list') return children
  return (
    <>
      <span aria-hidden className="grid size-8 shrink-0 place-items-center [&_svg]:size-6">
        {children}
      </span>
      <span aria-hidden className="min-w-0 flex-1 break-words">
        {label}
      </span>
    </>
  )
}

/**
 * A palette's key (`ToolKey`), as the form lays it out: a cell of the section's table, the
 * toolbar's glyph, or the list's picture and name. Its tooltip names it, then its shortcut (`tool`,
 * Flat's); greyed, why (`reason`, ADR 0096).
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
      span={form === 'grid' ? span : 'one'}
      className={cn(FACES[form], className)}
      {...props}
    >
      <Face label={label}>{children}</Face>
    </ToolKey>
  )
}

/**
 * A sign's key (ADR 0115, 0114): the sign drawn on a short staff (`children`), named in its tooltip
 * and to a screen reader, what it is besides (`name`: a key's relative minor) in the list. A cell of
 * the section's table, a trigger for the sign's picker where it opens one. Pressed where it is so
 * already; greyed, its tooltip says why (`reason`, ADR 0096).
 */
export function SignTile({
  label,
  name = label,
  tool,
  reason,
  pressed,
  disabled = false,
  children,
  ...props
}: {
  /** Its name for a screen reader and its tooltip. */
  label: string
  /** What the list prints beside the sign, where that is not its label. */
  name?: string
  /** Its shortcut, named in its tooltip. */
  tool?: Tool | undefined
  reason?: string | undefined
  pressed?: boolean
  disabled?: boolean
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
      title={disabled && reason ? `${tip}\n${reason}` : tip}
      aria-pressed={pressed}
      disabled={disabled}
      {...props}
      className={cn(
        'flex min-w-0 items-center transition-colors duration-150 ease-out outline-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ring disabled:opacity-35 motion-reduce:transition-none',
        form === 'list'
          ? 'h-11 gap-2.5 rounded-xl border border-hairline bg-card px-2 text-left text-sm leading-tight hover:bg-accent'
          : 'col-span-2 h-11 justify-center border-r border-b border-hairline bg-card px-1 text-foreground/80 hover:bg-accent hover:text-foreground focus-visible:z-10 landscape-phone:h-10',
        PRESSED,
      )}
    >
      <span
        aria-hidden
        className={cn('flex h-9 shrink-0 justify-center', form === 'list' && 'w-12')}
      >
        {children}
      </span>
      {form === 'list' ? (
        <span aria-hidden className="min-w-0 flex-1 break-words">
          {name}
        </span>
      ) : null}
    </button>
  )
}

/**
 * A term's key (ADR 0096): the term alone as a score prints it, two cells wide, its name for a screen
 * reader, what it means (`meaning`: dolce, sweetly) its tooltip and a screen reader's description;
 * greyed, why.
 */
export function TermKey({
  label,
  term,
  meaning,
  tool,
  reason,
  disabled = false,
  onClick,
}: {
  label: string
  term: string
  meaning: string
  tool?: Tool
  reason?: string | undefined
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <PaletteKey
      label={label}
      tool={tool}
      description={meaning}
      reason={reason}
      disabled={disabled}
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
