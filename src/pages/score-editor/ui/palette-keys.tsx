import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip, ToolKey } from '@/shared/ui'
import type { PaletteCategory } from '../model/palette-categories'
import { PaletteGroupName, useKeyTip, usePaletteForm } from './palette-form'

/** A key of the folded palette's row: a 44px picture (40px on a phone on its side), snapping in. */
const ROW_KEY = 'h-11 min-w-11 shrink-0 snap-start px-1.5 landscape-phone:h-10'

/**
 * A category's tools under its name, as the palette lays them out (ADR 0114). Opened, a titled
 * section the category bar scrolls to; `info`, what its tools do or why they are greyed where they
 * are, is the ⓘ beside its name, never a line in it (ADR 0096). In the folded row, a group of keys
 * parted from the one before by a hairline, named for a screen reader and in each key's tooltip.
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
  const form = usePaletteForm()
  if (form === 'row')
    return (
      <div
        role="group"
        aria-label={title}
        data-category={category}
        className="flex shrink-0 items-center gap-1 border-l border-hairline pl-2 first:border-l-0 first:pl-0"
      >
        <PaletteGroupName value={title}>{children}</PaletteGroupName>
      </div>
    )
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

/** A group's name inside a section (Pedal, Lyrics), with what it is for where it says more; none in the row. */
export function GroupName({ name, info }: { name: string; info?: ReactNode }) {
  if (usePaletteForm() === 'row') return null
  return (
    <div className="flex min-h-5 items-center gap-1.5 pt-1">
      <h4 className="text-sm text-muted-foreground">{name}</h4>
      {info ? <InfoTip name={name}>{info}</InfoTip> : null}
    </div>
  )
}

/** What a section says over its keys (whose staff, from which bar); none in the row, whose keys say it. */
export function SectionLine({ children }: { children: ReactNode }) {
  if (usePaletteForm() === 'row') return null
  return <p className="text-sm text-muted-foreground">{children}</p>
}

/** A grid of keys in a section; in the row, the keys in line. */
function KeyGrid({
  label,
  className,
  children,
}: {
  label?: string | undefined
  className: string
  children: ReactNode
}) {
  const row = usePaletteForm() === 'row'
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      className={row ? 'contents' : className}
    >
      {children}
    </div>
  )
}

/** A group of picture keys, six to a row: the values, the marks, the dynamics. */
export function GlyphGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <KeyGrid label={label} className="grid grid-cols-6 gap-1.5">
      {children}
    </KeyGrid>
  )
}

/** A group of keys that name what they do under their picture, as many to a row as fit. */
export function CaptionGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <KeyGrid label={label} className="grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-1.5">
      {children}
    </KeyGrid>
  )
}

/**
 * Signs as tiles (ADR 0110, 0114): clefs, key signatures, barlines, as many to a row as fit, three on
 * the narrowest phone; `narrow` for the key signatures, seven to a row where there is room.
 */
export function SignGrid({
  label,
  narrow = false,
  children,
}: {
  label?: string
  narrow?: boolean
  children: ReactNode
}) {
  return (
    <KeyGrid
      label={label}
      className={cn(
        'grid gap-1.5',
        narrow
          ? 'grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))]'
          : 'grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))]',
      )}
    >
      {children}
    </KeyGrid>
  )
}

/** Terms as a score prints them (dolce, rit., D.C. al Fine), as many to a row as fit. */
export function TermGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <KeyGrid
      label={label}
      className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5"
    >
      {children}
    </KeyGrid>
  )
}

/**
 * A palette's key (`ToolKey`), as the palette lays it out: in a section's grid as its grid sizes it;
 * in the row a 44px picture, its group's name in its tooltip (ADR 0114).
 */
export function PaletteKey({ label, className, ...props }: ComponentProps<typeof ToolKey>) {
  const row = usePaletteForm() === 'row'
  return (
    <ToolKey
      label={label}
      tip={useKeyTip(label)}
      className={cn(className, row && ROW_KEY)}
      {...props}
    />
  )
}

/**
 * A key that says what it does: in a section, its picture over its name (a standard musical term),
 * the name wrapping inside its box, never cut; in the row, its picture alone, named in its tooltip.
 * Pressed where it is so already; greyed, its tooltip says why (`reason`, ADR 0096).
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
  const row = usePaletteForm() === 'row'
  if (row)
    return (
      <PaletteKey
        label={label}
        reason={reason}
        pressed={pressed}
        disabled={disabled}
        onClick={onClick}
        className="[&_svg]:size-6"
      >
        <span aria-hidden className="grid place-items-center">
          {children}
        </span>
      </PaletteKey>
    )
  return (
    <button
      type="button"
      aria-label={label}
      title={disabled && reason ? reason : label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(KEY_FACE, 'min-h-16 justify-start gap-1 px-1 pt-2 pb-1.5')}
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

/** A tile's face: a card that gives a little as it is pressed, filled while it is so (ADR 0114). */
const KEY_FACE =
  'flex min-w-0 flex-col items-center rounded-xl border border-border bg-card text-card-foreground transition-[background-color,border-color,color,scale] duration-80 ease-out hover:bg-chosen active:scale-95 aria-pressed:border-selected aria-pressed:bg-selected aria-pressed:text-selected-foreground disabled:opacity-35 disabled:hover:bg-card motion-reduce:transition-none motion-reduce:active:scale-100'

/**
 * A sign's tile (ADR 0110, 0114, forScore's palette): the sign drawn on a short staff (`children`),
 * its name under it in small type, the same tile for a clef, a key and a barline; what it is besides
 * its name (`detail`: a key's relative minor) said in its tooltip and to a screen reader. Pressed where
 * it is so already; greyed, its tooltip says why (`reason`, ADR 0096). In the row, the sign alone.
 */
export function SignTile({
  label,
  name = label,
  reason,
  pressed,
  disabled = false,
  children,
  ...props
}: {
  /** Its name for a screen reader and its tooltip. */
  label: string
  /** What it prints under the sign, where that is not its label: a key's two names, short. */
  name?: string
  reason?: string | undefined
  pressed?: boolean
  disabled?: boolean
  children: ReactNode
} & Omit<
  ComponentProps<'button'>,
  'aria-label' | 'aria-pressed' | 'title' | 'disabled' | 'children'
>) {
  const row = usePaletteForm() === 'row'
  const tip = useKeyTip(label)
  return (
    <button
      type="button"
      aria-label={label}
      title={disabled && reason ? `${tip}\n${reason}` : tip}
      aria-pressed={pressed}
      disabled={disabled}
      {...props}
      className={cn(
        KEY_FACE,
        row
          ? 'h-11 w-16 shrink-0 snap-start justify-center p-1 landscape-phone:h-10'
          : 'min-h-18 justify-start gap-0.5 px-1 pt-1.5 pb-1.5',
      )}
    >
      <span aria-hidden className={cn('flex w-full shrink-0 justify-center', row ? 'h-8' : 'h-10')}>
        {children}
      </span>
      {row ? null : (
        <span
          aria-hidden
          className="w-full text-center text-xs leading-tight text-balance break-words"
        >
          {name}
        </span>
      )}
    </button>
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
  const row = usePaletteForm() === 'row'
  return (
    <PaletteKey
      label={label}
      description={meaning}
      reason={reason}
      disabled={disabled}
      onClick={onClick}
      className={row ? 'w-auto px-2.5 whitespace-nowrap' : 'whitespace-normal'}
    >
      <Printed text={term} />
    </PaletteKey>
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
