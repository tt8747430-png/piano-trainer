import type { ReactNode } from 'react'
import { entryTitles, shelfOf, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { BackButton, ScreenHeader } from '@/shared/ui'

/** Where Back leads from an entry opened directly: its shelf (a study's, Accompaniment's first page). */
const SHELF_PAGE = { songs: '/songs', practice: '/practice/accompaniment' } as const

/**
 * A song's or listing's bar: its title, Back where the learner came from (Learn, Songs, Practice) or to
 * the entry's shelf, and its `actions` (a song's Edit, Favourite and More).
 */
export function PieceHeader({ entry, actions }: { entry: Entry; actions?: ReactNode }) {
  const locale = useLocale()
  return (
    <ScreenHeader
      title={entryTitles(entry, locale).primary}
      // A song's name in full over its page, as a deck's in Noji's: the bar echoes it once scrolled.
      large
      back={<BackButton fallback={{ to: SHELF_PAGE[shelfOf(entry.kind)] }} />}
      actions={actions}
    />
  )
}
