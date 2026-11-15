import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { groupTile, useGroupsData, useKeepSharesCurrent } from '@/features/share-folder'
import { cn } from '@/shared/lib'
import { PAINT, PlaceRow, TREE_ITEM, TreeCount, TreeList } from '@/shared/ui'

/**
 * Shared with me (R30 S6): the folders others share with the learner's groups, each a row to its page
 * (who shared it, for which group), and the way to Groups. In the laptop's tree, its rows the tree's;
 * on a phone's Home, rows at the foot of Folders. Signed out, Groups alone, which says groups need an account.
 */
export function SharedWithMe({ inTree }: { inTree: boolean }) {
  const { t } = useTranslation('songs')
  const { data, reload } = useGroupsData()
  // While Songs is open the learner's shared folders follow their folders (R30 S6).
  useKeepSharesCurrent(data, reload)
  const shared = data.kind === 'ready' ? data.shared.filter((each) => !each.mine) : []
  const groupName = (id: string) =>
    data.kind === 'ready' ? (data.groups.find((each) => each.id === id)?.name ?? '') : ''
  // In the laptop's pane: the shared folders after the learner's, each a row of the pane's kind (a
  // grass dot, its count), then Shared with me, the way to Groups, as the board lists it with the folders.
  if (inTree)
    return (
      <TreeList>
        {shared.map((folder) => (
          <li key={folder.id} className="flex">
            <Link
              to="/songs/shared-folders/$sharedId"
              params={{ sharedId: folder.id }}
              className={TREE_ITEM}
            >
              <span
                aria-hidden
                className={cn('size-2.5 shrink-0 rounded-[3px]', PAINT.grass.fill)}
              />
              <span className="min-w-0 truncate">{folder.name}</span>
              <TreeCount n={folder.songs.length} />
            </Link>
          </li>
        ))}
        <li className="flex">
          <Link to="/songs/groups" className={TREE_ITEM}>
            <span aria-hidden className={cn('size-2.5 shrink-0 rounded-[3px]', PAINT.grass.fill)} />
            <span className="min-w-0 truncate">{t('groups.sharedWithMe')}</span>
          </Link>
        </li>
      </TreeList>
    )
  // A phone's Home: rows at the foot of Folders' card, as folders are (canvas 133).
  return (
    <>
      {shared.map((folder) => (
        <PlaceRow
          key={folder.id}
          folder
          {...groupTile(folder)}
          title={folder.name}
          detail={t('groups.sharedBy', {
            name: folder.ownerName,
            group: groupName(folder.groupId),
          })}
          render={<Link to="/songs/shared-folders/$sharedId" params={{ sharedId: folder.id }} />}
        />
      ))}
      <PlaceRow
        folder
        icon={Users}
        paint="sky"
        title={t('groups.sharedWithMe')}
        detail={t('groups.title')}
        render={<Link to="/songs/groups" />}
      />
    </>
  )
}
