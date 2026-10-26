import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import { cn, useLongPress } from '@/shared/lib'
import { SwipeRow } from '@/shared/ui'
import { menuOf, swipeOf, type RowAction } from '../model/row-actions'
import { FolderFace } from './FolderFace'
import { ROW_BODY, ROW_CARD } from './row-class'
import { RowMore } from './RowMore'

/** A folder's swipe (ADR 0106): to the right Edit; to the left Archive. */
const LEADING = ['edit']
const TRAILING = ['archive']

/**
 * A folder of the library as a row (Mindscape's `FolderRow`): its tile, name and songs counted, a
 * link to its page with its chevron; its More (Edit, Archive, Delete); a swipe for Edit and Archive;
 * a long press starts Select with it chosen.
 */
export function FolderRow({
  folder,
  actions,
  onSelect,
}: {
  folder: ShelvedFolder
  actions: readonly RowAction[]
  onSelect: () => void
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const press = useLongPress({ onLongPress: onSelect })
  return (
    <li>
      <SwipeRow leading={swipeOf(actions, LEADING)} trailing={swipeOf(actions, TRAILING)}>
        <div className={cn(ROW_CARD, 'hover:bg-muted')}>
          <Link
            to="/songs/folders/$folderId"
            params={{ folderId: folder.id }}
            className={ROW_BODY}
            {...press}
          >
            <FolderFace folder={folder} />
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
