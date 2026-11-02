import { EyeOff, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ContentKind } from '@/shared/api/content'
import type { NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'
import { RowButton, say, SettingsGroup } from '@/shared/ui'
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

type Asked = 'unpublish' | 'delete' | null

/**
 * An item made in the app, given up (round 28): Unpublish while learners have it (it stays the
 * editor's, unpublished) and Delete for good, each asked first, on the item's Settings page. One of
 * the app's own lessons or courses has neither: it ships with the app, and leaves its level or shelf
 * from Manage lessons or Manage courses.
 */
export function RemoveGroup({
  kind,
  id,
  title,
  onDeleted,
}: {
  kind: ContentKind
  id: string
  /** The item's name, in its dialogs. */
  title: string
  /** Where the editor goes once it is deleted. */
  onDeleted: () => void
}) {
  const { t } = useTranslation('editor')
  const editing = useContentEditing()
  const [published, setPublished] = useState(false)
  const [asked, setAsked] = useState<Asked>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let current = true
    void editing.published(kind, id).then((result) => {
      if (current) setPublished(result.ok)
    })
    return () => {
      current = false
    }
  }, [editing, kind, id])
  const run = async (act: () => Promise<NetResult<void>>, done: string, then: () => void) => {
    setBusy(true)
    const result = await act()
    setBusy(false)
    setAsked(null)
    if (!result.ok)
      return say(
        t(result.reason === 'offline' ? 'original.actionOffline' : 'original.actionFailed'),
      )
    say(done)
    then()
  }
  return (
    <SettingsGroup flush title={t('remove.title')}>
      {published ? (
        <RowButton
          title={t('remove.unpublish')}
          icon={EyeOff}
          paint="sand"
          onClick={() => setAsked('unpublish')}
        />
      ) : null}
      <RowButton
        title={t('remove.delete')}
        icon={Trash2}
        paint="sand"
        destructive
        onClick={() => setAsked('delete')}
      />
      <AlertDialog open={asked !== null} onOpenChange={(open) => (open ? null : setAsked(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(asked === 'unpublish' ? 'remove.unpublishTitle' : 'remove.deleteTitle', { title })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(asked === 'unpublish' ? 'remove.unpublishBody' : 'remove.deleteBody')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('original.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={busy}
              onClick={() =>
                void (asked === 'unpublish'
                  ? run(
                      () => editing.unpublish(kind, id),
                      t('remove.unpublished'),
                      () => setPublished(false),
                    )
                  : run(() => editing.remove(kind, id), t('remove.deleted'), onDeleted))
              }
            >
              {t(asked === 'unpublish' ? 'remove.unpublish' : 'remove.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsGroup>
  )
}
