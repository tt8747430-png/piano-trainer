import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronRight, Ellipsis, Plus, Users } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeatureSwitch, Group } from '@/shared/api/admin'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { useAdmin } from '@/shared/lib/admin'
import {
  ActionMenu,
  ConfirmDialog,
  Fab,
  FloatingActions,
  NewSheet,
  RowButton,
  RowLink,
  SettingsGroup,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import { AddRow } from '@/widgets/content-editor'
import { SettingsScreen } from '@/widgets/settings-screen'
import { useChangeProblem } from '../model/use-change-problem'
import { Face, nameOf } from './Face'
import { useLoaded } from '../model/use-loaded'
import { FailureLine, LoadedState } from './LoadedState'

/** What Groups reads: the groups, the accounts their members are, the flags they turn on. */
function useGroupsData() {
  const admin = useAdmin()
  const load = useCallback(async () => {
    const [groups, accounts, switches] = await Promise.all([
      admin.groups(),
      admin.accounts(''),
      admin.switches(),
    ])
    if (!groups.ok) return groups
    if (!accounts.ok) return accounts
    if (!switches.ok) return switches
    return {
      ok: true as const,
      value: { groups: groups.value, accounts: accounts.value, switches: switches.value },
    }
  }, [admin])
  return useLoaded(load)
}

/** A group's page shows its first members, then Show all under the card (the Admin board). */
const FOLDED = 5

/**
 * Administration › Groups (the Admin board): the groups as rows, each its first members' faces, its
 * name and how many are in it, opening its page; New group floats at the foot on a phone, and stands in
 * the pane's row on a laptop, opening a New sheet: its name, then Create.
 */
export function GroupsTab() {
  const { t } = useTranslation('admin')
  const admin = useAdmin()
  const laptop = useMediaQuery(LAPTOP)
  const { loaded, reload } = useGroupsData()
  const { problem, after } = useChangeProblem(reload)
  const [naming, setNaming] = useState<string | null>(null)
  const create = () => {
    const name = (naming ?? '').trim()
    if (!name) return
    void admin.createGroup(name).then((result) => {
      if (result.ok) setNaming(null)
      after(result)
    })
  }
  return (
    <SettingsScreen
      title={t('sections.groups')}
      actions={laptop ? <Button onClick={() => setNaming('')}>{t('groups.new')}</Button> : null}
    >
      {laptop ? null : (
        <FloatingActions>
          <Fab label={t('groups.new')} icon={Plus} onClick={() => setNaming('')} />
        </FloatingActions>
      )}
      {problem ? <FailureLine reason={problem} /> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {({ groups, accounts }) =>
          groups.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users />
                </EmptyMedia>
                <EmptyTitle>{t('groups.none')}</EmptyTitle>
                <EmptyDescription>{t('groups.noneLine')}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setNaming('')}>{t('groups.new')}</Button>
              </EmptyContent>
            </Empty>
          ) : (
            <SettingsGroup flush className="[&_[data-slot=settings-card]>*]:min-h-16">
              {groups.map((group) => {
                const faces = group.members
                  .map((id) => accounts.find((account) => account.id === id))
                  .filter((account) => account !== undefined)
                  .slice(0, 3)
                return (
                  <RowLink
                    key={group.id}
                    title={group.name}
                    detail={t('groups.members', { count: group.members.length })}
                    mark={
                      <span aria-hidden className="flex w-21 shrink-0">
                        {faces.map((account) => (
                          <Face key={account.id} name={nameOf(account)} size="stack" />
                        ))}
                      </span>
                    }
                    render={<Link to="/admin/groups/$group" params={{ group: group.id }} />}
                  />
                )
              })}
            </SettingsGroup>
          )
        }
      </LoadedState>
      <NewSheet
        open={naming !== null}
        onOpenChange={(open) => setNaming(open ? '' : null)}
        title={t('groups.new')}
        nameLabel={t('groups.name')}
        name={naming ?? ''}
        maxLength={80}
        onName={setNaming}
        createLabel={t('groups.add')}
        onCreate={create}
      />
    </SettingsScreen>
  )
}

/** The flags a group turns on: those set to its groups with it among them. */
const flagsOf = (group: Group, switches: readonly FeatureSwitch[]) =>
  switches.filter((each) => each.state === 'groups' && each.groups.includes(group.id))

/**
 * A group's page (the Admin board's): its members, each with More › Remove, and Add member, the list's
 * last row, finding an account by its name or email; the flags it turns on; Delete group, asked
 * first, alone at the foot.
 */
export function AdminGroupPage({ id }: { id: string }) {
  const { t } = useTranslation('admin')
  const admin = useAdmin()
  const { loaded, reload } = useGroupsData()
  const { problem, after } = useChangeProblem(reload)
  const [deleting, setDeleting] = useState(false)
  const [all, setAll] = useState(false)
  const navigate = useNavigate()
  const group =
    loaded.kind === 'ready' ? loaded.value.groups.find((each) => each.id === id) : undefined
  return (
    <SettingsScreen title={group?.name ?? t('sections.groups')}>
      {problem ? <FailureLine reason={problem} /> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {({ accounts, switches }) => {
          if (!group) return <p className="px-4 text-muted-foreground">{t('groups.gone')}</p>
          const members = accounts.filter((account) => group.members.includes(account.id))
          const others = accounts.filter((account) => !group.members.includes(account.id))
          const flags = flagsOf(group, switches)
          return (
            <>
              <SettingsGroup title={t('groups.membersTitle', { count: members.length })} flush>
                {(all ? members : members.slice(0, FOLDED)).map((account) => (
                  <div
                    key={account.id}
                    className="flex min-h-15 items-center gap-4 py-1.5 ps-4 pe-1"
                  >
                    <Face name={nameOf(account)} size="row" />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                      <span className="truncate">{nameOf(account)}</span>
                      <span className="truncate text-sm leading-[normal] text-muted-foreground">
                        {account.email}
                      </span>
                    </span>
                    <ActionMenu
                      label={t('groups.moreFor', { name: nameOf(account) })}
                      align="end"
                      trigger={<Ellipsis aria-hidden />}
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          aria-label={t('groups.moreFor', { name: nameOf(account) })}
                        />
                      }
                      actions={[
                        {
                          key: 'remove',
                          label: t('groups.remove'),
                          destructive: true,
                          onSelect: () =>
                            void admin.setMember(group.id, account.id, false).then(after),
                        },
                      ]}
                    />
                  </div>
                ))}
                <AddRow
                  label={t('groups.addMember')}
                  title={t('groups.addMember')}
                  nameLabel={t('groups.nameOrEmail')}
                  createLabel={t('groups.addMember')}
                  failed={t('groups.noAccount')}
                  found={[
                    {
                      title: t('sections.accounts'),
                      icon: Users,
                      typed: true,
                      items: others.map((account) => ({
                        key: account.id,
                        title: nameOf(account),
                        detail: account.email,
                      })),
                    },
                  ]}
                  onPick={(userId) => void admin.setMember(group.id, userId, true).then(after)}
                  onCreate={async (typed) => {
                    const wanted = typed.toLowerCase()
                    const found = others.find(
                      (account) =>
                        account.email.toLowerCase() === wanted ||
                        nameOf(account).toLowerCase() === wanted,
                    )
                    if (!found) return false
                    const result = await admin.setMember(group.id, found.id, true)
                    after(result)
                    return result.ok
                  }}
                />
              </SettingsGroup>
              {!all && members.length > FOLDED ? (
                <button
                  type="button"
                  className="-mt-2 ms-1 flex min-h-11 items-center gap-1 self-start rounded-control px-1 text-[0.9375rem] font-semibold text-link tabular-nums focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  onClick={() => setAll(true)}
                >
                  {t('groups.showAll', { count: members.length })}
                  <ChevronRight aria-hidden className="size-4" />
                </button>
              ) : null}
              <SettingsGroup title={t('sections.flags')} flush>
                <p
                  className={
                    flags.length > 0
                      ? 'flex min-h-13 items-center px-4'
                      : 'flex min-h-13 items-center px-4 text-muted-foreground'
                  }
                >
                  {flags.length > 0
                    ? flags.map((each) => each.label).join(', ')
                    : t('groups.noFlags')}
                </p>
              </SettingsGroup>
              <SettingsGroup flush>
                <RowButton
                  title={t('groups.delete')}
                  destructive
                  onClick={() => setDeleting(true)}
                />
              </SettingsGroup>
            </>
          )
        }}
      </LoadedState>
      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        title={t('groups.deleteTitle', { name: group?.name ?? '' })}
        body={t('groups.deleteBody')}
        action={t('groups.confirm')}
        onConfirm={() => {
          if (group)
            void admin.deleteGroup(group.id).then((result) => {
              after(result)
              if (result.ok)
                void navigate({
                  to: '/admin/$section',
                  params: { section: 'groups' },
                  replace: true,
                })
            })
          setDeleting(false)
        }}
      />
    </SettingsScreen>
  )
}
