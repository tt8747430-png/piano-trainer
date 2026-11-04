import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Link2, ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  blankProgression,
  libraryLine,
  libraryParam,
  progressionById,
  progressionMode,
  shipsWithApp,
  type LibraryProgression,
} from '@/entities/progression-library'
import { RemoveGroup, useProgressionDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, RowButton, say, ScreenHeader, SettingsGroup, TileMark } from '@/shared/ui'
import { DraftPublishScreen, NotOpen, PublishRow } from '@/widgets/content-editor'

/** The route's progression: the library's, or one an editor made and has not published. */
function useRouteProgression(from: 'settings' | 'publish'): LibraryProgression {
  const { progressionId } = useParams({
    from:
      from === 'settings'
        ? '/shell/practice/progressions/$progressionId/settings'
        : '/shell/practice/progressions/$progressionId/publish',
  })
  return progressionById(progressionId) ?? blankProgression(progressionId, '')
}

/** Where a progression is shown on Progressions: its numerals, in the key of its mode. */
function progressionPath(progression: LibraryProgression): string {
  const minor = progressionMode(progression, false)
  const search = new URLSearchParams({ p: libraryParam(progression, minor) })
  if (minor) search.set('key', 'Am')
  return `/practice/progressions?${search.toString()}`
}

/**
 * A progression's Settings (`/practice/progressions/$progressionId/settings`, R29 B6), an editor's,
 * from its editor's bar: Publish… with where it stands, Share link, and Delete last for one made in
 * the app.
 */
export function ProgressionSettingsPage() {
  const progression = useRouteProgression('settings')
  return <ProgressionSettings key={progression.id} progression={progression} />
}

function ProgressionSettings({ progression }: { progression: LibraryProgression }) {
  const { t } = useTranslation(['practice', 'learn', 'editor'])
  const locale = useLocale()
  const { account } = useAccount()
  const navigate = useNavigate()
  const draft = useProgressionDraft(progression)
  const written = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(written.name, locale) || written.id
  const share = async () => {
    const shared = await shareLink({ title, path: progressionPath(written) })
    if (shared === 'copied') say(t('editor:publishPage.shared'))
    if (shared === 'failed') say(t('editor:publishPage.shareFailed'))
  }
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('learn:settings.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        {editsContent(account) ? (
          <>
            <p className="px-1 font-display text-2xl font-semibold text-balance">{title}</p>
            <SettingsGroup flush title={t('learn:settings.share')}>
              <PublishRow
                kind="progression"
                id={progression.id}
                draft={draft}
                link={
                  <Link
                    to="/practice/progressions/$progressionId/publish"
                    params={{ progressionId: progression.id }}
                  />
                }
              />
              <RowButton
                title={t('editor:publishPage.shareLink')}
                icon={Link2}
                paint="grass"
                onClick={() => void share()}
              />
            </SettingsGroup>
            {shipsWithApp(progression.id) ? null : (
              <RemoveGroup
                kind="progression"
                id={progression.id}
                title={title}
                onDeleted={() => void navigate({ to: '/practice/progressions', replace: true })}
              />
            )}
          </>
        ) : (
          <NotOpen line={t('practice:progressions.edit.editorsOnly')} />
        )}
      </div>
    </div>
  )
}

/** A progression's Publish page (`/practice/progressions/$progressionId/publish`, R29 B6). */
export function ProgressionPublishPage() {
  const progression = useRouteProgression('publish')
  return <ProgressionPublish key={progression.id} progression={progression} />
}

function ProgressionPublish({ progression }: { progression: LibraryProgression }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const draft = useProgressionDraft(progression)
  const written = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(written.name, locale) || written.id
  const path = progressionPath(written)
  const minor = progressionMode(written, false)
  return (
    <DraftPublishScreen
      kind="progression"
      id={progression.id}
      draft={draft}
      title={title}
      path={path}
      view={<Link to="/practice/progressions" search={{ p: libraryParam(written, minor) }} />}
      unreadable={t('progressions.edit.unreadable')}
      back={<BackButton />}
      removable={!shipsWithApp(progression.id)}
      preview={
        <div className="card flex min-h-16 items-center gap-3 p-2">
          <TileMark icon={ListMusic} paint="lilac" />
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold text-balance">{title}</span>
            <span className="text-sm text-muted-foreground">
              {(written.major ?? written.minor) ? libraryLine(written, minor) : ''}
            </span>
          </span>
        </div>
      }
    />
  )
}
