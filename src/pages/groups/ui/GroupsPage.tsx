import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { groupTile, NewGroupSheet, useGroupsData } from '@/features/share-folder'
import { BackButton, MoreMenu, RowLink, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { GroupsState, RowsLoading } from './GroupsState'
import { JoinLinkSheet } from './JoinLinkSheet'

/** What is open over Groups: New group, or Join with a link. */
type Open = 'new' | 'join' | null

/**
 * Groups (R30 S6, R32-C): the learner's groups and those they belong to, each a row with its picture
 * on its paint, its members and folders counted, Owner where it is theirs; New group under them; More
 * holds Join with a link. Signed out it says groups need an account, with Sign in; loading, failed
 * and offline each say so.
 */
export function GroupsPage() {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  const { data, reload } = useGroupsData()
  const [open, setOpen] = useState<Open>(null)
  const signedIn = data.kind !== 'guest'
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('groups.title')}
        back={<BackButton />}
        more={
          signedIn ? (
            <MoreMenu
              actions={[
                { key: 'join', label: t('groups.joinLink'), onSelect: () => setOpen('join') },
              ]}
            />
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
          <SettingsGroup flush title={t('groups.title')} info={t('groups.about')}>
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
          <Button variant="soft" size="lg" className="self-start" onClick={() => setOpen('new')}>
            {t('groups.new')}
          </Button>
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
