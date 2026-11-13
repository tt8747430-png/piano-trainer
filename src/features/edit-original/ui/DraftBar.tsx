import { CloudCheck, CloudOff, Ellipsis, History, LoaderCircle, Trash2, Upload } from 'lucide-react'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ActionMenu, ButtonLink, RowButton, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { ContentDraft } from '../model/use-content-draft'
import { useDraftAsk } from '../model/use-draft-ask'
import { DraftDialogs, type DraftActing } from './DraftDialogs'

type DraftState = Pick<ContentDraft, 'drafted' | 'saved'>

/** What the status says of the changes: saved, saving, or not saved (and why); nothing while none. */
function statusKey(draft: DraftState) {
  if (draft.saved === 'saving') return 'original.saving' as const
  if (draft.saved === 'offline') return 'original.notSavedOffline' as const
  if (draft.saved === 'failed') return 'original.notSaved' as const
  if (!draft.drafted) return null
  return draft.saved === 'saved' ? ('original.saved' as const) : ('original.drafted' as const)
}

/**
 * Where an editor's changes stand (round 21), in the screen's bar beside Publish, or beside the score
 * editor's gear's title (R31-E), never a line of its own under it (the owner's rule, round 25): a
 * cloud and its word, saved, saving, or not saved (offline, or failed, the cloud struck out). Nothing
 * while the item is as published (round 28). In a bar on a phone the cloud alone (`compact`), its
 * word still heard and in its tooltip.
 */
export function DraftStatus({
  draft,
  compact = true,
  className,
}: {
  draft: DraftState
  compact?: boolean
  className?: string
}) {
  const { t } = useTranslation('editor')
  const key = statusKey(draft)
  if (!key) return null
  const unsaved = draft.saved === 'offline' || draft.saved === 'failed'
  const said = t(key)
  const Icon = unsaved ? CloudOff : draft.saved === 'saving' ? LoaderCircle : CloudCheck
  return (
    <p
      role="status"
      title={said}
      className={cn(
        'flex min-w-0 shrink items-center gap-1.5 text-sm text-muted-foreground',
        unsaved && 'text-destructive',
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn('size-4 shrink-0', draft.saved === 'saving' && 'motion-safe:animate-spin')}
      />
      <span className={cn('truncate', compact && 'max-sm:sr-only')}>{said}</span>
    </p>
  )
}

/** The item's Publish page (R29 B6): a router `Link` to it, and the way there from a menu or a row. */
interface PublishPage {
  readonly link: ReactElement
  readonly open: () => void
}

/**
 * The draft's actions in the screen's bar (ADR 0116, round 21): its menu (Versions, to restore one,
 * and Discard) and Publish, the bar's one accent. An item with a Publish page (R29 B6: a song, a
 * lesson, a course, a progression) has Publish as the way to it, the rights ticked there each time,
 * and Versions there too; its menu keeps Discard. What publishing, discarding or restoring changes is
 * asked first (`DraftDialogs`); after discarding or restoring, the editor opens again on the item as
 * published (`onReset`).
 */
export function DraftActions({
  draft,
  title,
  unreadable,
  onReset,
  more = [],
  publishPage,
}: {
  draft: DraftActing
  title: string
  /** What else the menu holds, over the draft's own actions (the language the document is written in). */
  more?: readonly MenuAction[]
  /** What is said where a publish is refused for a draft that does not read as the item. */
  unreadable: string
  onReset: () => void
  publishPage?: PublishPage | undefined
}) {
  const { t } = useTranslation('editor')
  const ask = useDraftAsk()
  const { setAsked, busy } = ask
  return (
    <>
      <ActionMenu
        label={t('original.more')}
        align="end"
        trigger={<Ellipsis aria-hidden />}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 rounded-pill"
            aria-label={t('original.more')}
            title={t('original.more')}
          />
        }
        actions={[
          ...more,
          ...(publishPage
            ? []
            : [
                {
                  key: 'versions',
                  ...(more.length > 0 ? { group: t('original.draft') } : {}),
                  label: t('original.versions'),
                  icon: History,
                  onSelect: () => setAsked('versions'),
                },
              ]),
          {
            key: 'discard',
            label: t('original.discard'),
            icon: Trash2,
            destructive: true,
            hidden: !draft.drafted,
            onSelect: () => setAsked('discard'),
          },
        ]}
      />
      {publishPage ? (
        <ButtonLink className="h-11 shrink-0 rounded-pill px-4" render={publishPage.link}>
          {t('original.publish')}
        </ButtonLink>
      ) : (
        <Button
          className="h-11 shrink-0 rounded-pill px-4"
          disabled={!draft.drafted || busy}
          onClick={() => setAsked('publish')}
        >
          {t('original.publish')}
        </Button>
      )}
      <DraftDialogs
        ask={ask}
        draft={draft}
        title={title}
        unreadable={unreadable}
        onReset={onReset}
      />
    </>
  )
}

/**
 * The draft's acts as rows (R31-E), the score editor's gear's last group, Flat's one menu: Publish…
 * (its page, the rights ticked there), Versions, and Discard changes, asked first as the bar's menu
 * asks (`DraftDialogs`).
 */
export function DraftRows({
  draft,
  title,
  unreadable,
  onReset,
  publishPage,
}: {
  draft: DraftActing
  title: string
  unreadable: string
  onReset: () => void
  publishPage: PublishPage
}) {
  const { t } = useTranslation('editor')
  const ask = useDraftAsk()
  return (
    <>
      <RowButton
        title={t('original.publishMore')}
        icon={Upload}
        paint="sky"
        onClick={publishPage.open}
      />
      <RowButton
        title={t('original.versions')}
        icon={History}
        paint="sand"
        onClick={() => ask.setAsked('versions')}
      />
      <RowButton
        title={t('original.discard')}
        icon={Trash2}
        paint="sand"
        destructive
        disabled={!draft.drafted}
        reason={t('original.nothingToDiscard')}
        onClick={() => ask.setAsked('discard')}
      />
      <DraftDialogs
        ask={ask}
        draft={draft}
        title={title}
        unreadable={unreadable}
        onReset={onReset}
      />
    </>
  )
}
