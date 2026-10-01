import { entryTitles, shelfOf, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { BackButton, ScreenHeader } from '@/shared/ui'

/** Where Back leads from an entry opened directly: its shelf. */
const SHELF_PAGE = { songs: '/songs', practice: '/practice' } as const

/**
 * A song's or listing's bar: its title, and Back where the learner came from (Path, Songs, Practice),
 * or to the entry's shelf. It spans the page, so it comes back over the chart too.
 */
export function PieceHeader({ entry }: { entry: Entry }) {
  const locale = useLocale()
  return (
    <ScreenHeader
      title={entryTitles(entry, locale).primary}
      back={<BackButton fallback={{ to: SHELF_PAGE[shelfOf(entry.kind)] }} />}
    />
  )
}
