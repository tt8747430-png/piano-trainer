import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import { cn, useLongPress } from '@/shared/lib'
import { SwipeRow } from '@/shared/ui'
import { menuOf, swipeOf, type RowAction } from '../model/row-actions'
import { FolderFace, type FolderHolds } from './FolderFace'
import { ROW_BODY, ROW_CARD } from './row-class'
import { RowMore } from './RowMore'

/** A folder's swipe (ADR 0106): to the right Edit; to the left Move, then Archive at the edge. */
const LEADING = ['edit']
const TRAILING = ['move', 'archive']

/**
 * A folder of the library as a row (Mindscape's `FolderRow`): its tile, name and what it holds, a
 * link to its page with its chevron; its More (Edit, Move to…, Archive, Delete); a swipe for Edit,
 * Move and Archive;
 * a long press starts Select with it chosen.
 */
export function FolderRow({
  folder,
  holds,
  actions,
  onSelect,
}: {
  folder: ShelvedFolder
  holds: FolderHolds
  actions: readonly RowAction[]
  onSelect: () => void
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const press = useLongPress({ onLongPress: onSelect })
  return (
    <li className="min-w-0">
      <SwipeRow
        leading={swipeOf(actions, LEADING)}
        trailing={swipeOf(actions, TRAILING)}
        className="h-full"
      >
        <div className={cn(ROW_CARD, 'has-[>a:hover]:bg-muted')}>
          <Link
            to="/songs/folders/$folderId"
            params={{ folderId: folder.id }}
            className={ROW_BODY}
            {...press}
          >
            <FolderFace folder={folder} holds={holds} />
            <ChevronRight
              aria-hidden
              className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover/row:translate-x-0.5"
            />
          </Link>
          <RowMore
            label={t('library.moreOf', { name: nameOf(folder) })}
            actions={menuOf(actions)}
          />
        </div>
      </SwipeRow>
    </li>
  )
}
