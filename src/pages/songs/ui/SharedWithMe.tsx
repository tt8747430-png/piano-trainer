import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { groupTile, useGroupsData, useKeepSharesCurrent } from '@/features/share-folder'
import { RowLink, SettingsGroup } from '@/shared/ui'

/**
 * Shared with me (R30 S6): the folders others share with the learner's groups, each a row to its page
 * (who shared it, for which group), and the way to Groups. In the laptop's tree, its rows the tree's;
 * on a phone's Home, a section of rows. Signed out, Groups alone, which says groups need an account.
 */
export function SharedWithMe({ inTree }: { inTree: boolean }) {
  const { t } = useTranslation('songs')
  const { data, reload } = useGroupsData()
  // While Songs is open the learner's shared folders follow their folders (R30 S6).
  useKeepSharesCurrent(data, reload)
  const shared = data.kind === 'ready' ? data.shared.filter((each) => !each.mine) : []
  const groupName = (id: string) =>
    data.kind === 'ready' ? (data.groups.find((each) => each.id === id)?.name ?? '') : ''
  if (inTree)
    return (
      <>
        {shared.length > 0 ? (
          <>
            <h2 className="px-2 pt-4 pb-1 font-sans text-xs font-semibold text-muted-foreground">
              {t('groups.sharedWithMe')}
            </h2>
            <ul className="flex flex-col gap-0.5">
              {shared.map((folder) => {
                const { icon: Icon } = groupTile(folder)
                return (
                  <li key={folder.id} className="flex">
                    <Link
                      to="/songs/shared-folders/$sharedId"
                      params={{ sharedId: folder.id }}
                      className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-control px-2 text-[0.9375rem] font-medium hover:bg-muted focus-visible:-outline-offset-3"
                    >
                      <Icon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 truncate">{folder.name}</span>
                      <span className="ms-auto ps-2 text-sm font-normal text-muted-foreground tabular-nums">
                        {folder.songs.length}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </>
        ) : null}
        <ul className="mt-4 flex flex-col gap-0.5">
          <li className="flex">
            <Link
              to="/songs/groups"
              className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-control px-2 text-[0.9375rem] font-medium hover:bg-muted focus-visible:-outline-offset-3"
            >
              <Users aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
              {t('groups.title')}
            </Link>
          </li>
        </ul>
      </>
    )
  return (
    <SettingsGroup flush title={t('groups.sharedWithMe')}>
      {shared.map((folder) => {
        return (
          <RowLink
            key={folder.id}
            {...groupTile(folder)}
            title={folder.name}
            detail={t('groups.sharedBy', {
              name: folder.ownerName,
              group: groupName(folder.groupId),
            })}
            render={<Link to="/songs/shared-folders/$sharedId" params={{ sharedId: folder.id }} />}
          />
        )
      })}
      <RowLink
        icon={Users}
        paint="sky"
        title={t('groups.title')}
        render={<Link to="/songs/groups" />}
      />
    </SettingsGroup>
  )
}
