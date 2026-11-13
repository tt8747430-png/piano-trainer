import { Link, useNavigate } from '@tanstack/react-router'
import { Link2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { groupTile, NewGroupSheet, useGroupsData } from '@/features/share-folder'
import {
  BackButton,
  NewDial,
  NewMenu,
  RoundButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { GroupsState, RowsLoading } from './GroupsState'
import { JoinLinkSheet } from './JoinLinkSheet'

/** What is open over Groups: New group, or Join with a link. */
type Open = 'new' | 'join' | null

/**
 * Groups (R30 S6, R32-C; canvas 133): Your groups, each a row with its picture on its paint, its
 * members and folders counted, Owner where it is theirs; then the folders shared with the learner by
 * others; Join with a link the bar's link; New group the one honey + (New on a laptop's bar). Signed
 * out it says groups need an account, with Sign in; loading, failed and offline each say so.
 */
export function GroupsPage() {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  const { data, reload } = useGroupsData()
  const [open, setOpen] = useState<Open>(null)
  const signedIn = data.kind !== 'guest'
  const making: readonly MenuAction[] = [
    { key: 'new', label: t('groups.new'), icon: Plus, onSelect: () => setOpen('new') },
  ]
  const ready = data.kind === 'ready' && data.groups.length > 0
  const sharedWithMe = data.kind === 'ready' ? data.shared.filter((each) => !each.mine) : []
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('groups.title')}
        back={<BackButton />}
        tools={
          signedIn ? (
            <>
              <RoundButton
                label={t('groups.joinLink')}
                icon={Link2}
                onClick={() => setOpen('join')}
              />
              {ready ? (
                <span className="max-lg:hidden">
                  <NewMenu label={t('groups.new')} actions={making} />
                </span>
              ) : null}
            </>
          ) : null
        }
      />
      {data.kind === 'loading' ? (
        <RowsLoading label={t('groups.loading')} />
      ) : data.kind !== 'ready' ? (
        <GroupsState data={data} onRetry={reload} />
      ) : data.groups.length === 0 ? (
        <GroupsState
          data={data}
          onRetry={reload}
          actions={
            <>
              <Button size="lg" onClick={() => setOpen('new')}>
                {t('groups.new')}
              </Button>
              <Button size="lg" variant="soft" onClick={() => setOpen('join')}>
                {t('groups.joinLink')}
              </Button>
            </>
          }
        />
      ) : (
        <>
          <SettingsGroup flush title={t('groups.yourGroups')} info={t('groups.about')}>
            {data.groups.map((group) => {
              const folders = data.shared.filter((each) => each.groupId === group.id).length
              return (
                <RowLink
                  key={group.id}
                  {...groupTile(group)}
                  title={group.name}
                  detail={[
                    t('groups.members', { count: group.members }),
                    ...(folders > 0 ? [t('groups.folders', { count: folders })] : []),
                  ].join(' · ')}
                  value={group.mine ? t('groups.owner') : undefined}
                  render={<Link to="/songs/groups/$groupId" params={{ groupId: group.id }} />}
                />
              )
            })}
          </SettingsGroup>
          {sharedWithMe.length > 0 ? (
            <SettingsGroup flush title={t('groups.sharedWithMe')}>
              {sharedWithMe.map((folder) => (
                <RowLink
                  key={folder.id}
                  {...groupTile(folder)}
                  title={folder.name}
                  detail={[
                    t('folder.songCount', { count: folder.songs.length }),
                    t('groups.sharedBy', {
                      name: folder.ownerName,
                      group: data.groups.find((each) => each.id === folder.groupId)?.name ?? '',
                    }),
                  ].join(' · ')}
                  render={
                    <Link to="/songs/shared-folders/$sharedId" params={{ sharedId: folder.id }} />
                  }
                />
              ))}
            </SettingsGroup>
          ) : null}
          <NewDial className="lg:hidden" label={t('groups.new')} actions={making} />
        </>
      )}
      <NewGroupSheet
        open={open === 'new'}
        onOpenChange={(next) => setOpen(next ? 'new' : null)}
        onMade={(group) => {
          setOpen(null)
          void navigate({ to: '/songs/groups/$groupId', params: { groupId: group.id } })
        }}
      />
      <JoinLinkSheet
        open={open === 'join'}
        onOpenChange={(next) => setOpen(next ? 'join' : null)}
      />
    </div>
  )
}
