import { barOf, useSettings } from '@/entities/settings'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import { cn, useLongPress } from '@/shared/lib'
import { menuOf, ROW_BODY, ROW_CARD, RowMore, swipeOf, SwipeRow, type RowAction } from '@/shared/ui'
import { FolderFace, type FolderHolds } from './FolderFace'

/** A folder's swipe (ADR 0106): to the right Edit; to the left Move, then Archive at the edge. */

/**
 * A folder of the library as a row (Mindscape's `FolderRow`): its tile, name and what it holds, a
 * link to its page on a tap anywhere, with no chevron beside its More (R34: one affordance a row); its More (Edit, Move to…, Archive, Delete); a swipe for Edit,
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
  const { t } = useTranslation('common')
  // What each swipe offers: the learner's (R29 B10, Settings › Swipe actions).
  const leading = useSettings((state) => barOf(state.bars, 'swipe.folders.leading'))
  const trailing = useSettings((state) => barOf(state.bars, 'swipe.folders.trailing'))
  const nameOf = useFolderName()
  const press = useLongPress({ onLongPress: onSelect })
  return (
    <li className="min-w-0">
      <SwipeRow
        leading={swipeOf(actions, leading)}
        trailing={swipeOf(actions, trailing)}
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
