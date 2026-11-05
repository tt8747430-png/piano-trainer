import { useTranslation } from 'react-i18next'
import type { NetResult } from '@/shared/api/network'
import { say } from '@/shared/ui'
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
import type { DraftAsk } from '../model/use-draft-ask'
import { VersionsDialog } from './VersionsDialog'

/** The draft's acts a screen offers: what they act on, and what it says where they fail. */
export type DraftActing = Pick<
  ContentDraft,
  'drafted' | 'saved' | 'publish' | 'discard' | 'versions' | 'restore'
>

/**
 * The dialogs a draft's acts open (ADR 0116, round 21), one implementation for the bar's menu and the
 * score editor's gear: Publish and Discard asked first, Versions to restore one; each says how it
 * went and, after discarding or restoring, the editor opens again on the item (`onReset`).
 */
export function DraftDialogs({
  ask,
  draft,
  title,
  unreadable,
  onReset,
}: {
  ask: DraftAsk
  draft: DraftActing
  title: string
  unreadable: string
  onReset: () => void
}) {
  const { t } = useTranslation('editor')
  const { asked, setAsked, busy, setBusy } = ask
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
