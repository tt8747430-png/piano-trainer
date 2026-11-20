import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  blankProgression,
  libraryNumerals,
  libraryLine,
  progressionById,
  progressionMode,
  shipsWithApp,
  type LibraryProgression,
} from '@/entities/progression-library'
import { RemoveGroup, useProgressionDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink, useForgetScreens } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  BackButton,
  ProgressionTiles,
  ActionRow,
  say,
  ScreenHeader,
  SettingsGroup,
  ThingHead,
} from '@/shared/ui'
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

/** Where a progression is shown: its own page (R30-4). */
const progressionPath = (progression: LibraryProgression): string =>
  `/practice/progressions/${progression.id}`

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
  const forget = useForgetScreens()
  const draft = useProgressionDraft(progression)
  const written = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(written.name, locale) || written.id
  const share = async () => {
    const shared = await shareLink({ title, path: progressionPath(written) })
    if (shared === 'copied') say(t('editor:publishPage.shared'))
    if (shared === 'failed') say(t('editor:publishPage.shareFailed'))
  }
  return (
    <div className="flex flex-col gap-2 pb-8 lg:gap-6">
      <ScreenHeader column="until-laptop" title={t('learn:settings.title')} back={<BackButton />} />
      <div className="page-column flex flex-col gap-6 lg:max-w-295">
        <ThingHead
          mark={
            <span className="grid size-16 shrink-0 place-items-center rounded-pill bg-card ring-1 ring-border ring-inset">
              <ListMusic aria-hidden className="size-6" />
            </span>
          }
          name={title}
          line={libraryLine(written, progressionMode(written, false))}
        />
        {editsContent(account) ? (
          <>
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
      back={<BackButton />}
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
