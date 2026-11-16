import { barOf, useSettings } from '@/entities/settings'
import { useTranslation } from 'react-i18next'
import { PieceLink, type Entry } from '@/entities/piece'
import { cn, useLongPress } from '@/shared/lib'
import {
  menuOf,
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
import { useSongStatus } from './use-song-status'

/** A song's swipe (ADR 0106): to the right Favourite; to the left Move, then Archive at the edge. */

/**
 * A song of the library as a row (the R72 board's SONGROW, Flat's library): its own card 88 tall, its
 * small cover 56 (its first notes), its title over its composer and key and where it stands with when
 * it was last played ("Bar 9 of 16 · Today"), a link to its page; ··· at its end holds its acts,
 * Favourite among them; a swipe and a long press (Select with it chosen) under a finger too.
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
  const { face } = useEntryFace(entry, { ...show, progress: false })
  const status = useSongStatus(entry)
  const press = useLongPress({ onLongPress: onSelect })
  return (
    <li className="min-w-0">
      <SwipeRow
        leading={swipeOf(actions, leading)}
        trailing={swipeOf(actions, trailing)}
        className="h-full"
      >
        <div
          className={cn(
            style.layout === 'list' ? ROW_FLAT : cn(ROW_CARD, 'min-h-22'),
            'has-[>a:hover]:bg-muted',
          )}
        >
          <PieceLink
            entry={entry}
            className={cn(
              ROW_BODY,
              ROW_LIBRARY_FACE,
              'gap-4 py-3 pl-3 [&_[data-slot=row-tile]]:size-14 [&_[data-slot=row-tile]]:rounded-xl',
            )}
            {...press}
          >
            <PieceMark entry={entry} />
            <RowFace {...face}>
              {face.children}
              {show.progress ? (
                <span
                  data-slot="row-status"
                  className="block truncate text-sm text-muted-foreground tabular-nums"
                >
                  {status}
                </span>
              ) : null}
            </RowFace>
          </PieceLink>
          <RowMore label={t('library.moreOf', { name: face.title })} actions={menuOf(actions)} />
        </div>
      </SwipeRow>
    </li>
  )
}
