import type { ReactNode } from 'react'
import type { Locale, LocalText } from '@/shared/i18n'
import { cn } from '@/shared/lib'

/**
 * A text of a document written in place in one language, no box round it (round 21): the page's
 * title as its large heading, or a paragraph under it; as tall as its words. Empty, its placeholder
 * says what goes there, in the language written, and it is marked as missing.
 */
export function DocText({
  label,
  value,
  locale,
  placeholder,
  onChange,
  size = 'text',
  className,
}: {
  label: string
  value: LocalText
  locale: Locale
  placeholder: string
  onChange: (text: LocalText) => void
  /** The page's title, or a paragraph of it; a section's heading. */
  size?: 'title' | 'heading' | 'text'
  className?: string
}) {
  return (
    <textarea
      aria-label={label}
      lang={locale}
      rows={1}
      value={value[locale]}
      placeholder={placeholder}
      aria-invalid={value[locale].trim() === '' || undefined}
      onChange={(event) => onChange({ ...value, [locale]: event.target.value.replace(/\n/g, ' ') })}
      className={cn(
        // Written in place, as in a document: the caret marks where, never a box round it.
        'w-full resize-none bg-transparent caret-primary outline-none field-sizing-content placeholder:text-muted-foreground',
        size === 'title' && 'font-display text-3xl font-semibold text-balance sm:text-4xl',
        size === 'heading' && 'font-display text-2xl text-balance',
        size === 'text' && 'text-lg leading-relaxed text-muted-foreground',
        className,
      )}
    />
  )
}

/**
 * A new item's name, written as its page's large heading (a new course, a new progression): one line,
 * no box round it, the caret marking where; focused as the page opens.
 */
export function DocTitleField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <input
      aria-label={label}
      value={value}
      required
      autoFocus
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full bg-transparent font-display text-3xl font-semibold caret-primary outline-none placeholder:text-muted-foreground sm:text-4xl"
    />
  )
}

/** A document's properties (Obsidian's): rows of a name and its value, each a choice in place. */
export function Properties({ label, children }: { label: string; children: ReactNode }) {
  return (
    <dl aria-label={label} className="flex flex-col border-y border-border py-2">
      {children}
    </dl>
  )
}

export function PropertyRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="grid min-h-12 grid-cols-[minmax(6rem,10rem)_minmax(0,1fr)] items-center gap-3">
      <dt className="text-sm text-muted-foreground">{name}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}
