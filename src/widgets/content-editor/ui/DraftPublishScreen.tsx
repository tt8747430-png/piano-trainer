import { History } from 'lucide-react'
import { useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { VersionsDialog, type ContentDraft, type Unreadable } from '@/features/edit-original'
import { CopyLinkField, RightsCheck, StandingLine } from '@/features/publish'
import type { ContentKind } from '@/shared/api/content'
import type { NetResult } from '@/shared/api/network'
import { useAccount, editsContent } from '@/shared/lib/account'
import { useContentEditing } from '@/shared/lib/content-editing'
import { ButtonLink, ConfirmDialog, InfoTip, OpensMark, say, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useStanding } from '../model/use-standing'
import { NotOpen } from './DraftScreen'

/**
 * One Publish page for the app's items (R29 B6, ADR 0116's amendment), an editor's: Back, Publish
 * and ⓘ in the bar; where the item stands (not published, published, changed since); what changed;
 * the item as learners will see it; the rights, ticked each time, then Publish (or Publish new
 * version), live once ticked; once published its link with Copy, View, Versions › (a version restored
 * once asked), and Unpublish last and alone in red, asked first, for an item made in the app.
 */
export function DraftPublishScreen<T>({
  kind,
  id,
  draft,
  title,
  path,
  view,
  preview,
  unreadable,
  back,
  removable = false,
}: {
  kind: ContentKind
  id: string
  draft: ContentDraft<T>
  /** The item's name, in its dialogs. */
  title: string
  /** Its page's path, its link. */
  path: string
  /** A router `Link` to the item as learners see it. */
  view: ReactElement
  /** The item's row or card as learners will see it. */
  preview: ReactNode
  /** What is said where Publish is refused for a draft that does not read. */
  unreadable: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** Made in the app, not shipped with it: it may be unpublished. */
  removable?: boolean
}) {
  const { t } = useTranslation('editor')
  const { account } = useAccount()
  const editing = useContentEditing()
  const { published, setPublished, standing } = useStanding(kind, id, draft)
  const [rights, setRights] = useState(false)
  const [busy, setBusy] = useState(false)
  const [asked, setAsked] = useState<'versions' | 'unpublish' | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const { load } = draft
  const run = async (
    act: () => Promise<NetResult<unknown> | Unreadable>,
    done: string,
    then?: () => void,
  ) => {
    setBusy(true)
    const result = await act()
    setBusy(false)
    if (result.ok) {
      say(done)
      then?.()
      return
    }
    say(
      result.reason === 'unreadable'
        ? unreadable
        : result.reason === 'offline'
          ? t('original.actionOffline')
          : t('original.actionFailed'),
    )
  }
  const publish = () =>
    void run(draft.publish, t('original.published'), () => {
      setRights(false)
      setPublished(true)
    })
  return (
    <div className="flex min-h-screen-free flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('publishPage.title')}
        back={back}
        tools={
          <InfoTip name={t('publishPage.title')} bar>
            {t('publishPage.whyBody')}
          </InfoTip>
        }
      />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
        {!editsContent(account) ? (
          <NotOpen line={t('original.editorsOnly')} />
        ) : load.state === 'loading' || published === null ? (
          <NotOpen line={t('original.opening')} />
        ) : load.state === 'failed' ? (
          <NotOpen line={t(load.reason === 'offline' ? 'original.offline' : 'original.failed')}>
            <Button onClick={draft.reopen}>{t('original.retry')}</Button>
          </NotOpen>
        ) : (
          <>
            <StandingLine standing={standing} />
            <section className="flex flex-col gap-2">
              <h2 className="px-1 font-sans text-sm font-semibold text-muted-foreground">
                {t('publishPage.changes')}
              </h2>
              <p className="px-1 text-pretty">
                {draft.drafted || !published
                  ? t('publishPage.changesDrafted')
                  : t('publishPage.changesNone')}
              </p>
            </section>
            <section className="flex flex-col gap-2">
              <h2 className="px-1 font-sans text-sm font-semibold text-muted-foreground">
                {t('publishPage.preview')}
              </h2>
              {preview}
            </section>
            {published ? (
              <section className="flex flex-col gap-3">
                <h2 className="px-1 font-sans text-sm font-semibold text-muted-foreground">
                  {t('publishPage.link')}
                </h2>
                <CopyLinkField url={`${window.location.origin}${path}`} />
                <ButtonLink variant="outline" size="lg" render={view}>
                  {t('publishPage.view')}
                </ButtonLink>
                <Button
                  variant="ghost"
                  size="lg"
                  className="justify-between"
                  onClick={() => setAsked('versions')}
                >
                  <span className="flex items-center gap-2">
                    <History aria-hidden />
                    {t('publishPage.versions')}
                  </span>
                  <OpensMark />
                </Button>
              </section>
            ) : null}
            <div className="mt-auto flex flex-col gap-3 pt-4">
              <RightsCheck checked={rights} onChange={setRights} />
              <Button
                size="lg"
                disabled={busy || !rights || (published === true && !draft.drafted)}
                onClick={publish}
              >
                {published ? t('publishPage.publishNew') : t('publishPage.publish')}
              </Button>
              {published && removable ? (
                <Button
                  size="lg"
                  variant="soft"
                  className="text-destructive"
                  disabled={busy}
                  onClick={() => setAsked('unpublish')}
                >
                  {t('publishPage.unpublish')}
                </Button>
              ) : null}
            </div>
          </>
        )}
      </div>
      <VersionsDialog
        open={asked === 'versions'}
        onOpenChange={(open) => (open ? undefined : setAsked(null))}
        title={title}
        busy={busy}
        versions={draft.versions}
        onRestore={(version) => {
          setAsked(null)
          setRestoring(version)
        }}
      />
      <ConfirmDialog
        open={restoring !== null}
        onOpenChange={(open) => (open ? undefined : setRestoring(null))}
        title={t('publishPage.restoreTitle')}
        body={t('publishPage.restoreBody')}
        action={t('original.restore')}
        onConfirm={() => {
          const version = restoring
          setRestoring(null)
          if (version) void run(() => draft.restore(version), t('original.restored'), draft.reopen)
        }}
      />
      <ConfirmDialog
        open={asked === 'unpublish'}
        onOpenChange={(open) => (open ? undefined : setAsked(null))}
        title={t('publishPage.unpublishTitle', { title })}
        body={t('publishPage.unpublishBody')}
        action={t('publishPage.unpublish')}
        onConfirm={() => {
          setAsked(null)
          void run(
            () => editing.unpublish(kind, id),
            t('publishPage.unpublished'),
            () => setPublished(false),
          )
        }}
      />
    </div>
  )
}
