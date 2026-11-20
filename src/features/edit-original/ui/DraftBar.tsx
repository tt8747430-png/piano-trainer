import { CloudCheck, CloudOff, Ellipsis, History, LoaderCircle, Trash2 } from 'lucide-react'
import { useState, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  ActionMenu,
  ActionRow,
  ButtonLink,
  GroupRow,
  RowButton,
  RowTrigger,
  say,
  SettingsGroup,
  type MenuAction,
  RoundButton,
} from '@/shared/ui'
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

/**
 * Where the score editor's draft stands, as its line under the menu's title on a phone and beside
 * Close on a laptop (the EditorDraft boards' status): saved, saving or not saved, and while it is as
 * published, Published · no changes. Not saved is said in crimson.
 */
export function DraftSaid({ draft }: { draft: DraftState }) {
  const { t } = useTranslation('editor')
  const unsaved = draft.saved === 'offline' || draft.saved === 'failed'
  return (
    <span role="status" className={unsaved ? 'text-destructive' : undefined}>
      {t(statusKey(draft) ?? 'original.asPublished')}
    </span>
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
        trigger={null}
        // The bar's glass circle, as every bar button on the boards (IB) and the song's ···.
        render={<RoundButton label={t('original.more')} icon={Ellipsis} className="shrink-0" />}
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
 * Publishing in one tap (owner, 2026-11-17: "i dont like this publish button and why it opens a third
 * … drawer"): published at once, its toast saying learners receive it, with Undo where an earlier
 * version stands to restore (the version before published again, the changes kept among the
 * Versions). The bar's Publish and Settings' Publish changes both act through it.
 */
function usePublishNow(draft: DraftActing, unreadable: string, onReset: () => void) {
  const { t } = useTranslation('editor')
  const [busy, setBusy] = useState(false)
  const failed = (reason: string) =>
    say(
      reason === 'unreadable'
        ? unreadable
        : reason === 'offline'
          ? t('original.actionOffline')
          : t('original.actionFailed'),
    )
  const publish = async () => {
    setBusy(true)
    // The version learners have now, to publish again should the editor undo.
    const kept = await draft.versions()
    const before = kept.ok ? kept.value[0] : undefined
    const result = await draft.publish()
    setBusy(false)
    if (!result.ok) return failed(result.reason)
    say(
      t('original.published'),
      before
        ? {
            label: t('undo'),
            onClick: () =>
              void draft.restore(before.version).then((restored) => {
                if (!restored.ok) return failed(restored.reason)
                say(t('original.unpublishedChange'))
                onReset()
              }),
          }
        : undefined,
    )
  }
  return { busy, publish }
}

/**
 * Publish in Edit's bar (the kit's EDITR): the glass word just before Done; a tap publishes
 * (`usePublishNow`). It reads Published, and waits, until the next change.
 */
export function PublishWord({
  draft,
  unreadable,
  onReset,
}: {
  draft: DraftActing
  /** What is said where a publish is refused for a draft that does not read as the item. */
  unreadable: string
  /** Opens the editor again on the item as published, after Undo. */
  onReset: () => void
}) {
  const { t } = useTranslation('editor')
  const { busy, publish } = usePublishNow(draft, unreadable, onReset)
  return (
    <Button
      variant="bar"
      className="shrink-0 px-4"
      disabled={!draft.drafted || busy}
      onClick={() => void publish()}
    >
      {t(draft.drafted ? 'original.publish' : 'original.publishedWord')}
    </Button>
  )
}

/**
 * An item's Publishing in its Settings (owner, 2026-11-18, the board's THINGSET): where it stands
 * (`status`), Versions (to restore one), and only while there are changes, Publish changes (one
 * tap) and Discard changes (asked first).
 */
export function DraftPublishing({
  draft,
  title,
  status,
  unreadable,
  onReset,
}: {
  draft: DraftActing
  title: string
  status: string | undefined
  unreadable: string
  onReset: () => void
}) {
  const { t } = useTranslation('editor')
  const ask = useDraftAsk()
  const { busy, publish } = usePublishNow(draft, unreadable, onReset)
  return (
    <>
      <SettingsGroup flush title={t('original.draft')}>
        <GroupRow label={t('publishPage.status')}>
          <span className="text-muted-foreground">{status}</span>
        </GroupRow>
        <RowButton title={t('original.versions')} onClick={() => ask.setAsked('versions')} />
      </SettingsGroup>
      {draft.drafted ? (
        <SettingsGroup flush>
          <ActionRow
            title={t('original.publishChanges')}
            disabled={busy}
            onClick={() => void publish()}
          />
          <ActionRow title={t('original.discard')} danger onClick={() => ask.setAsked('discard')} />
        </SettingsGroup>
      ) : null}
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
 * The draft's acts as rows (R31-E), in the score editor's menu as the EditorDraft board draws them:
 * `versions`, the first group's last row, opens the published versions to restore one; `publishing`,
 * the last group, is Publish… (its page, the rights ticked there) and Discard changes, asked first as
 * the bar's menu asks (`DraftDialogs`).
 */
export function DraftRows({
  part,
  draft,
  title,
  unreadable,
  onReset,
  publishPage,
}: {
  part: 'versions' | 'publishing'
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
      {part === 'versions' ? (
        <RowTrigger title={t('original.versions')} onClick={() => ask.setAsked('versions')} />
      ) : (
        <>
          <RowTrigger title={t('original.publishMore')} onClick={publishPage.open} />
          <RowButton
            title={t('original.discard')}
            destructive
            disabled={!draft.drafted}
            reason={t('original.nothingToDiscard')}
            onClick={() => ask.setAsked('discard')}
          />
        </>
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
