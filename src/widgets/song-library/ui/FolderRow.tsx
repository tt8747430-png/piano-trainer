import { barOf, useSettings } from '@/entities/settings'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import { cn, useLongPress } from '@/shared/lib'
import {
  menuOf,
  POINTER_ONLY,
  ROW_BODY,
  ROW_CARD,
  ROW_FLAT,
  ROW_LIBRARY_FACE,
  RowMore,
  swipeOf,
  SwipeRow,
  type RowAction,
} from '@/shared/ui'
import { useCardLook } from './card-look'
import { FolderFace, type FolderHolds } from './FolderFace'

/** A folder's swipe (ADR 0106): to the right Edit; to the left Move, then Archive at the edge. */

/**
 * A folder of the library as a row (canvas 133, Mindscape's `FolderRow`): its tile, name and what it
 * holds, a link to its page on a tap anywhere, a chevron at its end under a finger, which has the
 * swipe (Edit, Move, Archive) and the long press (Select with it chosen); its More (Edit, Move to…,
 * Archive, Delete) in the chevron's place under a mouse.
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
  const { t } = useTranslation('common')
  // What each swipe offers: the learner's (R29 B10, Settings › Swipe actions).
  const leading = useSettings((state) => barOf(state.bars, 'swipe.folders.leading'))
  const trailing = useSettings((state) => barOf(state.bars, 'swipe.folders.trailing'))
  const { style } = useCardLook()
  const nameOf = useFolderName()
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
          <Link
            to="/songs/folders/$folderId"
            params={{ folderId: folder.id }}
            className={cn(ROW_BODY, ROW_LIBRARY_FACE)}
            {...press}
          >
            <FolderFace folder={folder} holds={holds} />
            <ChevronRight
              aria-hidden
              className="mr-3 size-5 shrink-0 text-muted-foreground pointer-fine:hidden"
            />
          </Link>
          <RowMore
            label={t('library.moreOf', { name: nameOf(folder) })}
            actions={menuOf(actions)}
            className={POINTER_ONLY}
          />
        </div>
      </SwipeRow>
    </li>
  )
}
