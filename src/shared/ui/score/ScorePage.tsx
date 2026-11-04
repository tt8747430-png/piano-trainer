import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Score, StaffId, StaffLabels } from '@/shared/lib/notation'
import { drawPage } from './verovio/draw'
import type { PageSetup } from './verovio/toolkit'
import './score.css'

/**
 * A score's first page as its Layout prints it (A40, Flat's live preview): the page's own shape, its
 * music drawn by Verovio to the page's size, margins, staff, spacing and font, scaled to the room it
 * has. Faint while a new drawing is on its way; the last one stays until it is whole.
 */
export function ScorePage({
  score,
  staves,
  labels,
  title,
  page,
}: {
  score: Score
  staves: readonly StaffId[]
  labels?: StaffLabels | undefined
  title: string
  page: PageSetup
}) {
  const { t } = useTranslation('music')
  const host = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  // As one string, so a new object of the same page draws nothing again.
  const pageKey = JSON.stringify(page)
  const stavesKey = staves.join(' ')
  const labelsKey = labels ? JSON.stringify(labels) : ''
  useEffect(() => {
    const element = host.current
    if (!element) return
    const stopped = new AbortController()
    setState('loading')
    drawPage(
      score,
      element,
      {
        page: JSON.parse(pageKey) as PageSetup,
        staves: stavesKey.split(' ') as StaffId[],
        title,
        labels: labelsKey ? (JSON.parse(labelsKey) as StaffLabels) : undefined,
      },
      stopped.signal,
    )
      .then((drawn) => {
        if (drawn && !stopped.signal.aborted) setState('ready')
      })
      .catch(() => {
        if (!stopped.signal.aborted) setState('error')
      })
    return () => stopped.abort()
  }, [score, pageKey, stavesKey, labelsKey, title])
  return (
    <figure
      aria-label={t('sheet.firstPage')}
      aria-busy={state === 'loading'}
      data-slot="score-page"
      data-state={state}
      className="relative w-full overflow-hidden rounded-control bg-white shadow-sm ring-1 ring-border"
      style={{ aspectRatio: `${page.width} / ${page.height}` }}
    >
      <div
        ref={host}
        aria-hidden
        className="absolute inset-0 text-black transition-opacity duration-200 [&_svg]:size-full"
        style={{ opacity: state === 'loading' ? 0.5 : 1 }}
      />
      {state === 'error' ? (
        <p className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-muted-foreground">
          {t('sheet.error')}
        </p>
      ) : null}
    </figure>
  )
}
