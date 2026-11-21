import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { cn, IN_PLACE } from '@/shared/lib'
import {
  keyParam,
  keyScale,
  keySignature,
  keySymbol,
  neighbourKeys,
  noteParam,
  printedSymbol,
  relativeKey,
  type Key,
  type ScaleKind,
} from '@/shared/lib/music'

/** A signature as the circle prints it at its key: 2♯, 3♭, nothing for none. */
const signatureMark = (key: Key) => {
  const count = keySignature(key)
  return count === 0 ? '' : `${Math.abs(count)}${count > 0 ? '♯' : '♭'}`
}

/**
 * The key's place on the circle of fifths (the Scales board's KEYG60), as the circle draws it: its
 * slice, IV · I · V, each major over its relative minor, the scale's own lit in honey's wash; a tap
 * shows that key's scale in place (a minor in the minor the page is on). Its heading opens the Circle
 * of fifths on the key.
 */
export function KeyFifths({ value, kind }: { value: Key; kind: ScaleKind }) {
  const { t } = useTranslation('practice')
  const keyName = useKeyName()
  const major = value.minor ? relativeKey(value) : value
  const [below, above] = neighbourKeys(major)
  const cell = (key: Key, size: 'major' | 'minor') => {
    const own = key.minor === value.minor && keySymbol(key) === keySymbol(value)
    return (
      <Link
        from="/practice/scales"
        to="/practice/scales"
        search={(prev) => ({
          ...prev,
          root: noteParam(key.tonic),
          kind: key.minor && value.minor ? kind : keyScale(key),
        })}
        {...IN_PLACE}
        aria-label={keyName(key)}
        aria-current={own ? 'true' : undefined}
        className={cn(
          'relative grid place-items-center font-display text-foreground transition-colors duration-150 ease-out hover:bg-muted/50',
          size === 'major'
            ? 'h-15 border-b border-border text-[1.375rem] font-bold'
            : 'h-12 text-lg font-semibold',
          own && 'bg-primary/35 hover:bg-primary/35',
        )}
      >
        {printedSymbol(keySymbol(key))}
        {size === 'major' && signatureMark(key) ? (
          <span className="absolute top-1.5 right-2 font-sans text-xs leading-[normal] font-medium text-muted-foreground">
            {signatureMark(key)}
          </span>
        ) : null}
      </Link>
    )
  }
  return (
    <section className="flex flex-col gap-2">
      <Link
        to="/practice/circle-of-fifths"
        search={{ key: keyParam(value) }}
        className="-my-3 flex min-h-11 items-center gap-0.5 self-start text-sm font-semibold text-foreground"
      >
        {t('scales.onCircleOfFifths')}
        <ChevronRight aria-hidden className="size-4" />
      </Link>
      <div className="card grid grid-cols-3 overflow-hidden">
        {[below, major, above].map((each) => (
          <div
            key={keySymbol(each)}
            className="flex flex-col border-s border-border first:border-s-0"
          >
            {cell(each, 'major')}
            {cell(relativeKey(each), 'minor')}
          </div>
        ))}
      </div>
    </section>
  )
}
