import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FolderShare } from '@/shared/api/groups'
import { useGroups } from '@/shared/lib/groups'
import { ButtonLink, Dropdown, Sheet, SheetContent } from '@/shared/ui'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import { Button } from '@/shared/ui/primitives/button'
import { Checkbox } from '@/shared/ui/primitives/checkbox'
import { useGroupsData } from '../model/use-groups-data'

/** A group's place in the sheet: shared or not, and whether it may edit. */
type Choice = Readonly<Record<string, 'view' | 'edit' | null>>

/**
 * Share with a group (R30 S6, the folder's Settings): the learner's groups, each ticked to share the
 * folder with it and set Can view or Can edit; Done writes what changed. Signed out, it says groups
 * need an account.
 */
export function ShareFolderSheet({
  open,
  onOpenChange,
  folder,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: FolderShare
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {open ? <ShareForm folder={folder} onDone={() => onOpenChange(false)} /> : null}
    </Sheet>
  )
}

function ShareForm({ folder, onDone }: { folder: FolderShare; onDone: () => void }) {
  const { t } = useTranslation('songs')
  const port = useGroups()
  const { data } = useGroupsData()
  const [changed, setChanged] = useState<Choice>({})
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const shared: Choice =
    data.kind === 'ready'
      ? Object.fromEntries(
          data.shared
            .filter((each) => each.mine && each.folderKey === folder.folderKey)
            .map((each) => [each.groupId, each.canEdit ? 'edit' : 'view'] as const),
        )
      : {}
  const chosen = (id: string) => (id in changed ? changed[id] : (shared[id] ?? null))
  const done = async () => {
    setBusy(true)
    const writes = Object.entries(changed).flatMap(([groupId, choice]) =>
      choice === (shared[groupId] ?? null)
        ? []
        : [
            choice
              ? port.share(groupId, folder, choice === 'edit')
              : port.unshare(groupId, folder.folderKey),
          ],
    )
    const results = await Promise.all(writes)
    setBusy(false)
    const failed = results.find((result) => !result.ok)
    if (failed && !failed.ok)
      setProblem(t(failed.reason === 'offline' ? 'groups.offline' : 'groups.failed'))
    else onDone()
  }
  return (
    <SheetContent
      title={t('groups.share')}
      footer={
        data.kind === 'ready' && data.groups.length > 0 ? (
          <Button size="lg" className="w-full" disabled={busy} onClick={() => void done()}>
            {t('groups.done')}
          </Button>
        ) : null
      }
    >
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
        <p role="alert" className="text-destructive">
          {t(data.reason === 'offline' ? 'groups.offline' : 'groups.failed')}
        </p>
      ) : data.groups.length === 0 ? (
        <p className="text-pretty text-muted-foreground">{t('groups.noneToShare')}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-hairline card">
          {data.groups.map((group) => {
            const choice = chosen(group.id)
            return (
              <li key={group.id} className="flex min-h-14 items-center gap-3 px-4">
                <label className="flex min-h-11 flex-1 items-center gap-3 font-medium">
                  <Checkbox
                    checked={choice !== null}
                    onCheckedChange={(on) =>
                      setChanged((was) => ({ ...was, [group.id]: on ? (choice ?? 'view') : null }))
                    }
                  />
                  {group.name}
                </label>
                {choice ? (
                  <Dropdown<'view' | 'edit'>
                    label={t('groups.access')}
                    bare
                    value={choice}
                    onChange={(next) => setChanged((was) => ({ ...was, [group.id]: next }))}
                    options={[
                      { value: 'view', label: t('groups.canView') },
                      { value: 'edit', label: t('groups.canEdit') },
                    ]}
                  />
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
      {problem ? (
        <p role="alert" className="text-sm text-destructive">
          {problem}
        </p>
      ) : null}
    </SheetContent>
  )
}
