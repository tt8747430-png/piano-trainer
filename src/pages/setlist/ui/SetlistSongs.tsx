import { DndContext, DragOverlay, type Announcements, type UniqueIdentifier } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { entryTitles, type Piece, type PieceId } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { useSortableList } from '@/shared/lib'
import { SetlistSongInHand } from './SetlistSongInHand'
import { SetlistSongRow } from './SetlistSongRow'

/** A drag moves along the list alone, never off its column. */
const MODIFIERS = [restrictToVerticalAxis]

/**
 * A setlist's songs (those its search keeps), each a row moved by its handle (Mindscape's engine,
 * `useSortableList`): dragged by a finger or a mouse, or picked up by Space or Enter and moved by the
 * arrows, along the list alone, the order dropped written over the whole setlist (`onMove`); a
 * screen reader hears where it is, by the song's title and its place.
 */
export function SetlistSongs({
  pieces,
  onMove,
  onRemove,
}: {
  pieces: readonly Piece[]
  onMove: (order: PieceId[]) => void
  onRemove: (piece: PieceId) => void
}) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const byId = new Map(pieces.map((piece) => [piece.id, piece]))
  const list = useSortableList({ ids: pieces.map((piece) => piece.id), onDrop: onMove })
  const titleOf = (id: UniqueIdentifier) => {
    const piece = byId.get(String(id))
    return piece ? entryTitles(piece, locale).primary : ''
  }
  const at = (id: UniqueIdentifier) => ({
    place: list.items.indexOf(String(id)) + 1,
    count: list.items.length,
  })
  const announcements: Announcements = {
    onDragStart: ({ active }) => t('setlist.drag.picked', { title: titleOf(active.id) }),
    onDragOver: ({ active, over }) =>
      over ? t('setlist.drag.over', { title: titleOf(active.id), ...at(over.id) }) : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? t('setlist.drag.dropped', { title: titleOf(active.id), ...at(over.id) })
        : t('setlist.drag.cancelled', { title: titleOf(active.id) }),
    onDragCancel: ({ active }) => t('setlist.drag.cancelled', { title: titleOf(active.id) }),
  }
  const inHand = list.activeId === null ? undefined : byId.get(list.activeId)
  return (
    <DndContext
      {...list.dnd}
      modifiers={MODIFIERS}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: t('setlist.drag.instructions') },
      }}
    >
      <SortableContext items={[...list.items]} strategy={verticalListSortingStrategy}>
        <ul aria-label={t('title')} className="flex flex-col gap-2 lg:max-w-3xl">
          {list.items.map((id) => {
            const piece = byId.get(id)
            return piece ? (
              <SetlistSongRow key={id} piece={piece} onRemove={() => onRemove(id)} />
            ) : null
          })}
        </ul>
      </SortableContext>
      <DragOverlay {...list.overlay}>
        {inHand ? <SetlistSongInHand piece={inHand} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
