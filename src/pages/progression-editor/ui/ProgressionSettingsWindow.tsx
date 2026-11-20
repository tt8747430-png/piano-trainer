import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  libraryNumerals,
  libraryLine,
  progressionMode,
  shipsWithApp,
  type LibraryProgression,
} from '@/entities/progression-library'
import { RemoveGroup, type ContentDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink, useForgetScreens, type SettingsWindowState } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  ActionRow,
  ProgressionTiles,
  say,
  SettingsGroup,
  SettingsWindow,
  ThingHead,
} from '@/shared/ui'
import { DraftPublishScreen, NotOpen, PublishRow } from '@/widgets/content-editor'
import { LibraryTile } from '@/widgets/practice-library'

/** Where a progression is shown: its own page (R30-4). */
const progressionPath = (progression: LibraryProgression): string =>
  `/practice/progressions/${progression.id}`

/**
 * A progression's Settings, an editor's, a window over its editor (the ProgressionEdit boards): Publish…
 * with where it stands, a page inside the window with Back to them; Share link; and Delete last for
 * one made in the app.
 */
export function ProgressionSettingsWindow({
  progression,
  draft,
  open,
  onOpenChange,
  page,
  onPage,
}: {
  progression: LibraryProgression
  /** The editor's own draft: the window reads it as it stands, never afresh. */
  draft: ContentDraft<LibraryProgression>
} & SettingsWindowState) {
  const { t } = useTranslation(['learn', 'editor'])
  return (
    <SettingsWindow
      open={open}
      onOpenChange={onOpenChange}
      title={t(page === 'publish' ? 'editor:publishPage.title' : 'settings.title')}
      onBack={page === 'publish' ? () => onPage('settings') : undefined}
    >
      {page === 'publish' ? (
        <ProgressionPublish progression={progression} draft={draft} />
      ) : (
        <ProgressionSettings
          progression={progression}
          draft={draft}
          onPublish={() => onPage('publish')}
        />
      )}
    </SettingsWindow>
  )
}

function ProgressionSettings({
  progression,
  draft,
  onPublish,
}: {
  progression: LibraryProgression
  draft: ContentDraft<LibraryProgression>
  onPublish: () => void
}) {
  const { t } = useTranslation(['practice', 'learn', 'editor'])
  const locale = useLocale()
  const { account } = useAccount()
  const navigate = useNavigate()
  const forget = useForgetScreens()
  const written = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(written.name, locale) || written.id
  const share = async () => {
    const shared = await shareLink({ title, path: progressionPath(written) })
    if (shared === 'copied') say(t('editor:publishPage.shared'))
    if (shared === 'failed') say(t('editor:publishPage.shareFailed'))
  }
  return (
    <div className="flex flex-col gap-6">
      <ThingHead
        // Its list picture, the library row's chord columns, at the head's 64 as a song's tile.
        mark={
          <span className="block shrink-0 [&_[data-slot=row-tile]]:size-16 [&_[data-slot=row-tile]]:rounded-[10px]">
            <LibraryTile
              picture={{
                chords: libraryNumerals(written, progressionMode(written, false)),
                minor: progressionMode(written, false),
              }}
            />
          </span>
        }
        name={title}
        line={libraryLine(written, progressionMode(written, false))}
      />
      {editsContent(account) ? (
        <>
          <SettingsGroup flush title={t('learn:settings.share')}>
            <PublishRow kind="progression" id={progression.id} draft={draft} onOpen={onPublish} />
            <ActionRow title={t('editor:publishPage.shareLink')} onClick={() => void share()} />
          </SettingsGroup>
          {shipsWithApp(progression.id) ? null : (
            <RemoveGroup
              kind="progression"
              id={progression.id}
              title={title}
              onDeleted={() => {
                forget(`/practice/progressions/${progression.id}`, `/play/progression`)
                void navigate({ to: '/practice/progressions', replace: true })
              }}
            />
          )}
        </>
      ) : (
        <NotOpen
          line={t('practice:progressions.edit.editorsOnly')}
          why={t('practice:progressions.edit.editorsWhy')}
        />
      )}
    </div>
  )
}

/** A progression's Publish, a page in its Settings' window, the window's bar its bar. */
function ProgressionPublish({
  progression,
  draft,
}: {
  progression: LibraryProgression
  draft: ContentDraft<LibraryProgression>
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const written = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(written.name, locale) || written.id
  const path = progressionPath(written)
  return (
    <DraftPublishScreen
      kind="progression"
      id={progression.id}
      draft={draft}
      title={title}
      path={path}
      view={
        <Link to="/practice/progressions/$progressionId" params={{ progressionId: written.id }} />
      }
      unreadable={t('progressions.edit.unreadable')}
      removable={!shipsWithApp(progression.id)}
      preview={
        <div className="card flex min-h-16 items-center gap-3 p-2">
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-lg font-semibold text-balance">{title}</span>
            <ProgressionTiles
              numerals={libraryNumerals(written, progressionMode(written, false))}
              minor={progressionMode(written, false)}
            />
          </span>
        </div>
      }
    />
  )
}
