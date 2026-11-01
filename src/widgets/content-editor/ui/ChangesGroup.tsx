import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DraftActions, DraftStatus, type ContentDraft } from '@/features/edit-original'
import { SettingsGroup, TileMark } from '@/shared/ui'

/**
 * An item's changes on its Settings page (round 28, a lesson's and a course's, as a song's original):
 * where its draft stands, with Publish, Versions and Discard in its menu; while it opens, or where it
 * cannot, said in the row's place.
 */
export function ChangesGroup<T>({
  draft,
  title,
  unreadable,
}: {
  draft: ContentDraft<T>
  /** The item's name, in its dialogs. */
  title: string
  /** What Publish says where the draft does not read. */
  unreadable: string
}) {
  const { t } = useTranslation('learn')
  return (
    <SettingsGroup flush title={t('settings.publishing')}>
      <div className="flex min-h-16 min-w-0 items-center gap-3 py-2 pr-2 pl-2">
        <TileMark icon={Upload} paint="sand" />
        <span className="min-w-0 flex-1 text-lg font-semibold">{t('settings.changes')}</span>
        {draft.load.state === 'ready' ? (
          <>
            <DraftStatus draft={draft} />
            <DraftActions
              draft={draft}
              title={title}
              unreadable={unreadable}
              onReset={draft.reopen}
              publishInMenu
            />
          </>
        ) : (
          <span className="pr-2 text-muted-foreground">
            {draft.load.state === 'loading' ? t('settings.opening') : t('settings.offline')}
          </span>
        )}
      </div>
    </SettingsGroup>
  )
}
