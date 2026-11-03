import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ContentKind } from '@/shared/api/content'
import type { NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'
import { ConfirmDialog, DangerGroup, DangerRow, say } from '@/shared/ui'

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
    const result = await act()
    setAsked(null)
    if (!result.ok)
      return say(
        t(result.reason === 'offline' ? 'original.actionOffline' : 'original.actionFailed'),
      )
    say(done)
    then()
  }
  return (
    <DangerGroup footnote={t('remove.footnote')}>
      {published ? (
        <DangerRow title={t('remove.unpublish')} onClick={() => setAsked('unpublish')} />
      ) : null}
      <DangerRow title={t('remove.delete')} onClick={() => setAsked('delete')} />
      <ConfirmDialog
        open={asked !== null}
        onOpenChange={(open) => (open ? null : setAsked(null))}
        title={t(asked === 'unpublish' ? 'remove.unpublishTitle' : 'remove.deleteTitle', { title })}
        body={t(asked === 'unpublish' ? 'remove.unpublishBody' : 'remove.deleteBody')}
        action={t(asked === 'unpublish' ? 'remove.unpublish' : 'remove.delete')}
        cancel={t('original.cancel')}
        // Deleting what learners have is typed first (R17).
        typed={asked === 'delete' && published ? title : undefined}
        onConfirm={() =>
          void (asked === 'unpublish'
            ? run(
                () => editing.unpublish(kind, id),
                t('remove.unpublished'),
                () => setPublished(false),
              )
            : run(() => editing.remove(kind, id), t('remove.deleted'), onDeleted))
        }
      />
    </DangerGroup>
  )
}
