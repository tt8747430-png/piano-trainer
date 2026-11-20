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

/**
 * A song card's face as R72's SONGROW lays it: 16 between its parts, its tile 56 with 12 corners, its
 * title on a 20 line and its two lines at their normal height, 2 apart.
 */
export const SONG_FACE =
  'gap-4 py-3 pl-3 [&_[data-slot=row-tile]]:size-14 [&_[data-slot=row-tile]]:rounded-xl **:data-[slot=row-title]:leading-5 **:data-[slot=row-detail]:mt-0.5 **:data-[slot=row-detail]:leading-[normal] **:data-[slot=row-status]:mt-0.5 **:data-[slot=row-status]:leading-[normal]'

/**
 * What a song's card shows, read or chosen in Select (R72's SONGROW): its first notes, its title over
 * its composer and key, and where it stands with when it was last played.
 */
export function SongCardFace({ entry }: { entry: Entry }) {
  const { show } = useCardLook()
  const { face } = useEntryFace(entry, { ...show, progress: false })
  const status = useSongStatus(entry)
  return (
    <>
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
    </>
  )
}

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
            cn(style.layout === 'list' ? ROW_FLAT : ROW_CARD, 'min-h-22'),
            'has-[>a:hover]:bg-muted',
          )}
        >
          <PieceLink entry={entry} className={cn(ROW_BODY, ROW_LIBRARY_FACE, SONG_FACE)} {...press}>
            <SongCardFace entry={entry} />
          </PieceLink>
          <RowMore label={t('library.moreOf', { name: face.title })} actions={menuOf(actions)} />
        </div>
      </SwipeRow>
    </li>
  )
}
