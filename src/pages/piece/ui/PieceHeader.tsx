import type { ReactNode } from 'react'
import { entryTitles, shelfOf, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { BackButton, ScreenHeader } from '@/shared/ui'

/** Where Back leads from an entry opened directly: its shelf (a study's, Accompaniment's first page). */
const SHELF_PAGE = { songs: '/songs', practice: '/practice/accompaniment' } as const

/**
 * A song's or listing's bar: its title, Back where the learner came from (Path, Songs, Practice),
 * or to the entry's shelf, and its own `actions` at its end. It spans the page, so it comes back over the chart too.
 */
export function PieceHeader({ entry, actions }: { entry: Entry; actions?: ReactNode }) {
  const locale = useLocale()
  return (
    <ScreenHeader
      title={entryTitles(entry, locale).primary}
      back={<BackButton fallback={{ to: SHELF_PAGE[shelfOf(entry.kind)] }} />}
      actions={actions}
    />
  )
}
