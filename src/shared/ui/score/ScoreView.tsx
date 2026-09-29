import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Score, StaffId } from '@/shared/lib/notation'
import { engrave, type ScoreLayout } from './engrave'
import { loadMusicFonts } from './music-font'
import { staffHeight } from './size'
import './score.css'

type Engraving =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly layout: ScoreLayout }
  | { readonly status: 'error' }

/**
 * A score engraved on one line of grand staff (spec §2.5), or on one of its staves, once the music
 * font is in. What lies over it (labels, a cursor, the loop) is its children, given the engraving's
 * layout. The staff of `muted` is soft ink.
 */
export function ScoreView({
  score,
  scale,
  fingers,
  names = false,
  muted,
  staff,
  children,
}: {
  score: Score
  scale: number
  fingers: boolean
  /** Each notehead carries its note's name (the Player's Named notes). */
  names?: boolean
  muted?: StaffId | undefined
  /** Only this staff of the grand staff: a line in one hand, an interval, a note to read. */
  staff?: StaffId | undefined
  children?: (layout: ScoreLayout) => ReactNode
}) {
  const { t } = useTranslation('music')
  const host = useRef<HTMLDivElement>(null)
  const [engraving, setEngraving] = useState<Engraving>({ status: 'loading' })

  // VexFlow draws into the DOM, outside React; the font must be in before it measures anything.
  useEffect(() => {
    let current = true
    const element = host.current
    if (!element) return
    loadMusicFonts()
      .then(() => {
        if (current)
          setEngraving({
            status: 'ready',
            layout: engrave(score, element, { scale, fingers, names, staff }),
          })
      })
      .catch(() => {
        if (current) setEngraving({ status: 'error' })
      })
    return () => {
      current = false
    }
  }, [score, scale, fingers, names, staff])

  const size =
    engraving.status === 'ready'
      ? { width: engraving.layout.width, height: engraving.layout.height }
      : { height: staffHeight(staff) * scale }
  return (
    <div className="relative" style={size}>
      <div
        ref={host}
        data-slot="score"
        data-muted={muted}
        aria-hidden
        className="pointer-events-none relative z-10"
      />
      {engraving.status === 'loading' ? <p className="sr-only">{t('sheet.loading')}</p> : null}
      {engraving.status === 'error' ? (
        <p className="absolute inset-0 flex items-center text-muted-foreground">
          {t('sheet.error')}
        </p>
      ) : null}
      {engraving.status === 'ready' && children ? children(engraving.layout) : null}
    </div>
  )
}
