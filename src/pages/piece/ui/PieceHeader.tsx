import type { ReactNode } from 'react'
import { entryTitles, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { BackButton, ScreenHeader, type EditAction } from '@/shared/ui'

/**
 * A song's or listing's bar: its title with its Edit beside it, Back up to the entry's shelf (rule 26),
 * and its Settings at the bar's end.
 */
export function PieceHeader({
  entry,
  tools,
  settings,
  edit,
  titleOnPage = false,
}: {
  entry: Entry
  tools?: ReactNode
  settings?: ReactNode
  edit?: EditAction
  /** The page prints the title itself (a song's, under its first page). */
  titleOnPage?: boolean
}) {
  const locale = useLocale()
  return (
    <ScreenHeader
      title={entryTitles(entry, locale).primary}
      // A song's name in full over its page, as a deck's in Noji's: the bar echoes it once scrolled.
      large
      back={<BackButton />}
      tools={tools}
      settings={settings}
      edit={edit}
      titleOnPage={titleOnPage}
    />
  )
}
