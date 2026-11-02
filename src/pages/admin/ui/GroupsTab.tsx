import { Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdminAccount, Group } from '@/shared/api/admin'
import { useAdmin } from '@/shared/lib/admin'
import { FormField, RoundButton } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'
import { useLoaded } from '../model/use-loaded'
import { useChangeProblem } from '../model/use-change-problem'
import { FailureLine, LoadedState } from './LoadedState'

/** Groups: made by name, each with its members chosen from the accounts, and deleted, asked first. */
export function GroupsTab() {
  const { t } = useTranslation('admin')
  const admin = useAdmin()
  const [name, setName] = useState('')
  const [deleting, setDeleting] = useState<Group | null>(null)
  const load = useCallback(async () => {
    const [groups, accounts] = await Promise.all([admin.groups(), admin.accounts('')])
    if (!groups.ok) return groups
    if (!accounts.ok) return accounts
    return { ok: true as const, value: { groups: groups.value, accounts: accounts.value } }
  }, [admin])
  const { loaded, reload } = useLoaded(load)
  const { problem, after } = useChangeProblem(reload)
  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          if (!name.trim()) return
          void admin.createGroup(name.trim()).then((result) => {
            if (result.ok) setName('')
            after(result)
          })
        }}
      >
        <FormField
          className="min-w-0 flex-1"
          label={t('groups.name')}
          value={name}
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="submit" size="lg" disabled={!name.trim()}>
          {t('groups.add')}
        </Button>
      </form>
      {problem ? <FailureLine reason={problem} /> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {({ groups, accounts }) =>
          groups.length === 0 ? (
            <p className="text-muted-foreground">{t('groups.none')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {groups.map((group) => (
                <li key={group.id} className="flex flex-col gap-2 card p-4">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('groups.members', { count: group.members.length })}
                      </p>
                    </div>
                    <RoundButton
                      label={t('groups.delete')}
                      icon={Trash2}
                      onClick={() => setDeleting(group)}
                    />
                  </div>
                  <Members
                    group={group}
                    accounts={accounts}
                    onChange={(userId, member) =>
                      void admin.setMember(group.id, userId, member).then(after)
                    }
                  />
                </li>
              ))}
            </ul>
          )
        }
      </LoadedState>
      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('groups.deleteTitle', { name: deleting?.name ?? '' })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t('groups.deleteBody')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('groups.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) void admin.deleteGroup(deleting.id).then(after)
                setDeleting(null)
              }}
            >
              {t('groups.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/** A group's members: every account with a switch saying whether it is in the group. */
function Members({
  group,
  accounts,
  onChange,
}: {
  group: Group
  accounts: readonly AdminAccount[]
  onChange: (userId: string, member: boolean) => void
}) {
  const { t } = useTranslation('admin')
  return (
    <ul className="flex flex-col divide-y divide-border">
      {accounts.map((account) => (
        <li key={account.id} className="flex min-h-11 items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm">{account.name || account.email}</span>
          <Switch
            aria-label={`${account.name || account.email}: ${t('groups.member', { group: group.name })}`}
            checked={group.members.includes(account.id)}
            onCheckedChange={(member) => onChange(account.id, member)}
          />
        </li>
      ))}
    </ul>
  )
}
