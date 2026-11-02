import type { ReactNode } from 'react'
import { entryTitles, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { BackButton, ScreenHeader } from '@/shared/ui'

/**
 * A song's or listing's bar: its title, Back up to the entry's shelf (rule 26), and its `actions` (a song's Edit, Favourite and More).
 */
export function PieceHeader({ entry, actions }: { entry: Entry; actions?: ReactNode }) {
  const locale = useLocale()
  return (
    <ScreenHeader
      title={entryTitles(entry, locale).primary}
      // A song's name in full over its page, as a deck's in Noji's: the bar echoes it once scrolled.
      large
      back={<BackButton />}
      actions={actions}
    />
  )
}
