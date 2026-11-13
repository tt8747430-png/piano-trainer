import { barOf, useSettings } from '@/entities/settings'
import { useTranslation } from 'react-i18next'
import { PieceLink, type Entry } from '@/entities/piece'
import { FavouriteToggle } from '@/features/manage-library'
import { cn, useLongPress } from '@/shared/lib'
import {
  menuOf,
  POINTER_ONLY,
  ROW_BODY,
  ROW_CARD,
  ROW_FLAT,
  ROW_LIBRARY_FACE,
  RowFace,
  RowMore,
  swipeOf,
  SwipeRow,
  type RowAction,
} from '@/shared/ui'
import { PieceMark } from '@/widgets/piece-cover'
import { useEntryFace } from '@/widgets/piece-list'
import { useCardLook } from './card-look'

/** A song's swipe (ADR 0106): to the right Favourite; to the left Move, then Archive at the edge. */

/**
 * A song of the library as a row (canvas 133, Mindscape's deck row): its small cover (its first
 * notes), its title over its composer and key, a link to its page; the ♡ at its end, one tap; its
 * More under a mouse, a swipe and a long press (Select with it chosen) under a finger.
 */
export function SongRow({
  entry,
  actions,
  onSelect,
}: {
  entry: Entry
  actions: readonly RowAction[]
  /** Starts Select with this song chosen: a long press on it. */
  onSelect: () => void
}) {
  const { t } = useTranslation('common')
  // What each swipe offers: the learner's (R29 B10, Settings › Swipe actions).
  const leading = useSettings((state) => barOf(state.bars, 'swipe.songs.leading'))
  const trailing = useSettings((state) => barOf(state.bars, 'swipe.songs.trailing'))
  // What the place's look shows (R29 B9, Card style), and whether its rows share one card.
  const { show, style } = useCardLook()
  const { face } = useEntryFace(entry, show)
  const press = useLongPress({ onLongPress: onSelect })
  return (
    <li className="min-w-0">
      <SwipeRow
        leading={swipeOf(actions, leading)}
        trailing={swipeOf(actions, trailing)}
        className="h-full"
      >
        <div
          className={cn(style.layout === 'list' ? ROW_FLAT : ROW_CARD, 'has-[>a:hover]:bg-muted')}
        >
          <PieceLink entry={entry} className={cn(ROW_BODY, ROW_LIBRARY_FACE)} {...press}>
            <PieceMark entry={entry} />
            <RowFace {...face} />
          </PieceLink>
          <FavouriteToggle piece={entry.id} />
          <RowMore
            label={t('library.moreOf', { name: face.title })}
            actions={menuOf(actions)}
            className={POINTER_ONLY}
          />
        </div>
      </SwipeRow>
    </li>
  )
}
