import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ContentKind } from '@/shared/api/content'
import type { NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'
import { ConfirmDialog, DangerGroup, DangerRow, say } from '@/shared/ui'

/**
 * An item made in the app, deleted for good (round 28, R29 B6): its Settings page's last group, asked
 * first (typed where learners have it). Unpublish is its Publish page's. One of the app's own lessons
 * or courses has none: it ships with the app, and leaves its level or shelf in Learn's Edit mode.
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
  const [asked, setAsked] = useState(false)
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
    setAsked(false)
    if (!result.ok)
      return say(
        t(result.reason === 'offline' ? 'original.actionOffline' : 'original.actionFailed'),
      )
    say(done)
    then()
  }
  return (
    <DangerGroup footnote={t('remove.footnote')}>
      <DangerRow title={t('remove.delete')} onClick={() => setAsked(true)} />
      <ConfirmDialog
        open={asked}
        onOpenChange={setAsked}
        title={t('remove.deleteTitle', { title })}
        body={t('remove.deleteBody')}
        action={t('remove.delete')}
        cancel={t('original.cancel')}
        // Deleting what learners have is typed first (R17).
        typed={published ? title : undefined}
        onConfirm={() => void run(() => editing.remove(kind, id), t('remove.deleted'), onDeleted)}
      />
    </DangerGroup>
  )
}
