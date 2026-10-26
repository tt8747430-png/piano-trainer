import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PieceLink, type Piece } from '@/entities/piece'
import { cn } from '@/shared/lib'
import { RowFace } from '@/shared/ui'
import { useEntryFace } from '@/widgets/piece-list'
import { SONG_BODY, SONG_CARD, SONG_CONTROL } from './song-row-class'

/**
 * A setlist's song as a row (ADR 0103): its handle, which a finger, a mouse or the keyboard moves it
 * by along the list; the song, its row's face as Songs shows it (one kind: no tile), a link to its
 * page; and Remove, which takes it out of the setlist. In the hand, its place is an empty slot,
 * where it would land.
 */
export function SetlistSongRow({ piece, onRemove }: { piece: Piece; onRemove: () => void }) {
  const { t } = useTranslation('songs')
  const { kind: _kind, ...face } = useEntryFace(piece)
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: piece.id, attributes: { roleDescription: t('setlist.drag.role') } })
  const move = t('setlist.move', { title: face.title })
  const remove = t('setlist.remove', { title: face.title })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-dragging={isDragging ? '' : undefined}
      className={cn(
        SONG_CARD,
        'data-dragging:border-dashed data-dragging:bg-muted data-dragging:*:invisible',
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={move}
        title={move}
        className={cn(SONG_CONTROL, 'cursor-grab touch-none active:cursor-grabbing')}
      >
        <GripVertical aria-hidden />
      </button>
      <PieceLink entry={piece} className={cn(SONG_BODY, 'focus-visible:-outline-offset-3')}>
        <RowFace {...face} />
      </PieceLink>
      <button
        type="button"
        onClick={onRemove}
        aria-label={remove}
        title={remove}
        className={SONG_CONTROL}
      >
        <X aria-hidden />
      </button>
    </li>
  )
}
