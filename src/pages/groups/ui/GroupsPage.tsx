import { Link, useNavigate } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NewGroupSheet, useGroupsData } from '@/features/share-folder'
import { BackButton, ButtonLink, RowLink, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

/**
 * Groups (R30 S6): the learner's groups and those they belong to, each a row to its page (its
 * members counted, Owner where theirs). Groups need an account: signed out, the page says so with
 * one Sign in. New group makes one here or from Songs' +.
 */
export function GroupsPage() {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  const { data, reload } = useGroupsData()
  const [making, setMaking] = useState(false)
  const newGroup = (
    <Button variant="soft" onClick={() => setMaking(true)}>
      {t('groups.new')}
    </Button>
  )
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-8">
      <ScreenHeader title={t('groups.title')} back={<BackButton />} />
      {data.kind === 'guest' ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('groups.guestTitle')}</EmptyTitle>
            <EmptyDescription>{t('groups.guestLine')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink render={<Link to="/account/sign-in" />}>{t('groups.signIn')}</ButtonLink>
          </EmptyContent>
        </Empty>
      ) : data.kind === 'loading' ? (
        <p className="text-muted-foreground">{t('groups.loading')}</p>
      ) : data.kind === 'failed' ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              {t(data.reason === 'offline' ? 'groups.offline' : 'groups.failed')}
            </EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="soft" onClick={reload}>
              {t('groups.retry')}
            </Button>
          </EmptyContent>
        </Empty>
      ) : data.groups.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('groups.empty')}</EmptyTitle>
            <EmptyDescription>{t('groups.emptyLine')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{newGroup}</EmptyContent>
        </Empty>
      ) : (
        <>
          <SettingsGroup flush title={t('groups.title')} info={t('groups.about')}>
            {data.groups.map((group) => (
              <RowLink
                key={group.id}
                icon={Users}
                paint="lilac"
                title={group.name}
                detail={t('groups.members', { count: group.members })}
                value={group.mine ? t('groups.owner') : undefined}
                render={<Link to="/songs/groups/$groupId" params={{ groupId: group.id }} />}
              />
            ))}
          </SettingsGroup>
          <div>{newGroup}</div>
        </>
      )}
      <NewGroupSheet
        open={making}
        onOpenChange={setMaking}
        onMade={(group) => {
          setMaking(false)
          void navigate({ to: '/songs/groups/$groupId', params: { groupId: group.id } })
        }}
      />
    </div>
  )
}
