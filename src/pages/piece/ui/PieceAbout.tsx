import { Link } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Credits, pieceKey, SourceLine, type Entry, shownCredits } from '@/entities/piece'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { keyScale, noteParam } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'

/** Who wrote a song or listing and where it is in its book: under its facts, as a songbook prints it. */
export function PieceCredits({ entry }: { entry: Entry }) {
  if (!entry.credits && !entry.source) return null
  return (
    <div className="-mt-3 flex flex-col gap-1 text-muted-foreground">
      {shownCredits(entry).length > 0 ? <Credits credits={shownCredits(entry)} /> : null}
      {entry.source ? <SourceLine source={entry.source} /> : null}
    </div>
  )
}

/**
 * What is said of a song or study (A28): its paragraph under the facts, two lines and a More that
 * opens it in place (ADR 0111, amended: a paragraph is allowed). Nothing where there is none.
 */
export function PieceAbout({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  if (!entry.note) return null
  const text = localText(entry.note, locale)
  return (
    <div className="-mt-2 flex max-w-prose flex-col items-start gap-1 print:hidden">
      <p className={cn('text-pretty text-muted-foreground', !open && 'line-clamp-2')}>{text}</p>
      {open ? null : (
        <Button variant="link" className="h-auto min-h-11 px-0" onClick={() => setOpen(true)}>
          {t('aboutMore')}
        </Button>
      )}
    </div>
  )
}

/** The key's link to its scale on Scales and keys (A28): the key chip on the song's page, a listing's key. */
export function ScaleLink({ entry, children }: { entry: Entry; children: ReactNode }) {
  const { t } = useTranslation('piece')
  const scaleName = useScaleName()
  const key = pieceKey(entry)
  return (
    <Link
      aria-label={t('scaleOf', { scale: scaleName(key.tonic, keyScale(key)) })}
      to="/practice/scales"
      search={{ root: noteParam(key.tonic), kind: keyScale(key), show: 'key' }}
      // Its chip is 32px; the reach is 44px on touch.
      className="after:absolute after:inset-x-0 after:inset-y-0 after:rounded-pill focus-visible:outline-none pointer-coarse:after:-inset-y-1.5"
    >
      {children}
    </Link>
  )
}
