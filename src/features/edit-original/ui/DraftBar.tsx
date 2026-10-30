import { CloudCheck, CloudOff, Ellipsis, History, LoaderCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetResult } from '@/shared/api/network'
import { cn } from '@/shared/lib'
import { ActionMenu, say, type MenuAction } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
import type { ContentDraft, Unreadable } from '../model/use-content-draft'
import { VersionsDialog } from './VersionsDialog'

type Asked = 'publish' | 'discard' | 'versions' | null

type DraftState = Pick<ContentDraft, 'drafted' | 'saved'>

/** What the status says of the draft: saved, saving, published as it is, or not saved (and why). */
function statusKey(draft: DraftState) {
  if (draft.saved === 'saving') return 'original.saving' as const
  if (draft.saved === 'offline') return 'original.notSavedOffline' as const
  if (draft.saved === 'failed') return 'original.notSaved' as const
  if (!draft.drafted) return 'original.unchanged' as const
  return draft.saved === 'saved' ? ('original.saved' as const) : ('original.drafted' as const)
}

/**
 * Where an editor's draft stands (round 21), in the screen's bar beside Publish, never a line of its
 * own under it (the owner's rule, round 25): a cloud and its word, saved, saving, published as it is,
 * or not saved (offline, or failed, the cloud struck out). On a phone the cloud alone, its word
 * still heard and in its tooltip.
 */
export function DraftStatus({ draft, className }: { draft: DraftState; className?: string }) {
  const { t } = useTranslation('editor')
  const unsaved = draft.saved === 'offline' || draft.saved === 'failed'
  const said = t(statusKey(draft))
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
      <span className="truncate max-sm:sr-only">{said}</span>
    </p>
  )
}

/**
 * The draft's actions in the screen's bar (ADR 0116, round 21): its menu (Versions, to restore one,
 * and Discard) and Publish, the bar's one accent. What publishing, discarding or restoring changes is
 * asked first; after discarding or restoring, the editor opens again on the item as published
 * (`onReset`).
 */
export function DraftActions({
  draft,
  title,
  unreadable,
  onReset,
  more = [],
}: {
  draft: Pick<ContentDraft, 'drafted' | 'saved' | 'publish' | 'discard' | 'versions' | 'restore'>
  title: string
  /** What else the menu holds, over the draft's own actions (the language the document is written in). */
  more?: readonly MenuAction[]
  /** What is said where a publish is refused for a draft that does not read as the item. */
  unreadable: string
  onReset: () => void
}) {
  const { t } = useTranslation('editor')
  const [asked, setAsked] = useState<Asked>(null)
  const [busy, setBusy] = useState(false)

  /** Runs what was asked, says how it went, and closes the dialog. */
  const run = async (
    act: () => Promise<NetResult<unknown> | Unreadable>,
    done: string,
    then?: () => void,
  ) => {
    setBusy(true)
    const result = await act()
    setBusy(false)
    setAsked(null)
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
            className="size-11 shrink-0 rounded-full"
            aria-label={t('original.more')}
            title={t('original.more')}
          />
        }
        actions={[
          ...more,
          {
            key: 'versions',
            ...(more.length > 0 ? { group: t('original.draft') } : {}),
            label: t('original.versions'),
            icon: History,
            onSelect: () => setAsked('versions'),
          },
          {
            key: 'discard',
            label: t('original.discard'),
            icon: Trash2,
            destructive: true,
            disabled: !draft.drafted,
            onSelect: () => setAsked('discard'),
          },
        ]}
      />
      <Button
        className="h-11 shrink-0 rounded-full px-4"
        disabled={!draft.drafted || busy}
        onClick={() => setAsked('publish')}
      >
        {t('original.publish')}
      </Button>

      <AlertDialog open={asked === 'publish'} onOpenChange={(open) => !open && setAsked(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('original.publishTitle', { title })}</AlertDialogTitle>
            <AlertDialogDescription>{t('original.publishBody')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('original.cancel')}</AlertDialogCancel>
            <Button
              disabled={busy}
              onClick={() => void run(draft.publish, t('original.published'))}
            >
              {t('original.publish')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={asked === 'discard'} onOpenChange={(open) => !open && setAsked(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('original.discardTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('original.discardBody')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('original.cancel')}</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => void run(draft.discard, t('original.discarded'), onReset)}
            >
              {t('original.discard')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VersionsDialog
        open={asked === 'versions'}
        onOpenChange={(open) => !open && setAsked(null)}
        title={title}
        busy={busy}
        versions={draft.versions}
        onRestore={(version) =>
          void run(() => draft.restore(version), t('original.restored'), onReset)
        }
      />
    </>
  )
}
