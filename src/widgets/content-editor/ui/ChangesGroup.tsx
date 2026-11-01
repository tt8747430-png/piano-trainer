import { FilePen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DraftActions, DraftStatus, type ContentDraft } from '@/features/edit-original'
import { SettingsGroup, TileMark } from '@/shared/ui'

/**
 * An item's unpublished changes on its Settings page (round 28, a lesson's and a course's, as a
 * song's): where they stand, Publish, and their menu (Versions, Discard). Nothing shows while the
 * item is as published.
 */
export function ChangesGroup<T>({
  draft,
  title,
  unreadable,
}: {
  draft: ContentDraft<T>
  /** The item's name, in its dialogs. */
  title: string
  /** What Publish says where the changes do not read. */
  unreadable: string
}) {
  const { t } = useTranslation('learn')
  if (draft.load.state !== 'ready' || !draft.drafted) return null
  return (
    <SettingsGroup flush>
      <div className="flex min-h-16 min-w-0 items-center gap-3 py-2 pr-2 pl-2">
        <TileMark icon={FilePen} paint="sand" />
        <span className="min-w-0 flex-1 text-lg font-semibold">{t('settings.changes')}</span>
        <DraftStatus draft={draft} />
        <DraftActions draft={draft} title={title} unreadable={unreadable} onReset={draft.reopen} />
      </div>
    </SettingsGroup>
  )
}
