import { barOf, useSettings } from '@/entities/settings'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FOLDER_PICTURE_ICONS, useLibrary } from '@/entities/library'
import { PieceLink, type Entry } from '@/entities/piece'
import { cn, useLongPress } from '@/shared/lib'
import { RowFace, SwipeRow } from '@/shared/ui'
import { useEntryFace } from '@/widgets/piece-list'
import { menuOf, swipeOf, type RowAction } from '../model/row-actions'
import { ROW_BODY, ROW_CARD } from './row-class'
import { RowMore } from './RowMore'
import { useCardLook } from './card-look'

/** A favourite's small filled ♡, at its row's end, read and chosen alike. */
export function FavouriteMark() {
  const { t } = useTranslation('songs')
  return (
    <Heart
      role="img"
      aria-label={t('favourites')}
      className="size-4 shrink-0 fill-current text-muted-foreground"
    />
  )
}

/** A song's swipe (ADR 0106): to the right Favourite; to the left Move, then Archive at the edge. */

/**
 * A song of the library as a row (Mindscape's deck row): its face as Songs shows it, a link to its
 * page; its More, every action at every size; a swipe for the same on a touch screen; a long press
 * starts Select with it chosen.
 */
export function SongRow({
  entry,
  favourite,
  actions,
  onSelect,
}: {
  entry: Entry
  /** A favourite wears a small filled ♡ before its More. */
  favourite: boolean
  actions: readonly RowAction[]
  /** Starts Select with this song chosen: a long press on it. */
  onSelect: () => void
}) {
  const { t } = useTranslation('songs')
  // What each swipe offers: the learner's (R29 B10, Settings › Swipe actions).
  const leading = useSettings((state) => barOf(state.bars, 'swipe.songs.leading'))
  const trailing = useSettings((state) => barOf(state.bars, 'swipe.songs.trailing'))
  // What the place's look shows (R29 B9, Card style): the key and progress at its end, its chords.
  const { show } = useCardLook()
  const { face } = useEntryFace(entry, show)
  // Its own colour and picture where the learner gave it one (B9, Appearance).
  const look = useLibrary((state) => state.songLooks[entry.id])
  const plain = show.chords ? face : { ...face, children: null }
  const press = useLongPress({ onLongPress: onSelect })
  return (
    <li>
      <SwipeRow
        leading={swipeOf(actions, leading)}
        trailing={swipeOf(actions, trailing)}
        className="h-full"
      >
        <div className={cn(ROW_CARD, 'has-[>a:hover]:bg-muted')}>
          <PieceLink entry={entry} className={ROW_BODY} {...press}>
            {look ? (
              <RowFace {...plain} icon={FOLDER_PICTURE_ICONS[look.picture]} paint={look.paint} />
            ) : (
              <RowFace {...plain} />
            )}
          </PieceLink>
          {favourite ? <FavouriteMark /> : null}
          <RowMore label={t('library.moreOf', { name: face.title })} actions={menuOf(actions)} />
        </div>
      </SwipeRow>
    </li>
  )
}
