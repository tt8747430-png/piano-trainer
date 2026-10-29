import { CloudOff, Ellipsis, History, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetResult } from '@/shared/api/network'
import { ActionMenu, say } from '@/shared/ui'
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
import type { OriginalDraft, Unreadable } from '../model/use-original-draft'
import { VersionsDialog } from './VersionsDialog'

type Asked = 'publish' | 'discard' | 'versions' | null

/**
 * The strip an editor's draft of a built-in song's original stands under (ADR 0116): where the draft
 * stands (saved, saving, not saved), Publish, and the draft's menu: Versions, to restore one, and
 * Discard. What publishing, discarding or restoring changes is asked first; after discarding or
 * restoring, the editor opens again on the song as published (`onReset`).
 */
export function OriginalStrip({
  draft,
  title,
  onReset,
}: {
  draft: OriginalDraft
  title: string
  onReset: () => void
}) {
  const { t } = useTranslation('editor')
  const [asked, setAsked] = useState<Asked>(null)
  const [busy, setBusy] = useState(false)
  const status = draft.drafted
    ? (
        {
          idle: 'original.drafted',
          saving: 'original.saving',
          saved: 'original.saved',
          offline: 'original.notSavedOffline',
          failed: 'original.notSaved',
        } as const
      )[draft.saved]
    : draft.saved === 'saving'
      ? ('original.saving' as const)
      : ('original.unchanged' as const)
  const unsaved = draft.saved === 'offline' || draft.saved === 'failed'

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
        ? t('original.unreadable')
        : result.reason === 'offline'
          ? t('original.actionOffline')
          : t('original.actionFailed'),
    )
  }

  return (
    <div
      role="group"
      aria-label={t('original.label')}
      className="pointer-events-auto flex items-center gap-1 rounded-full border border-hairline bg-card/95 py-1 pr-1 pl-3 shadow-md backdrop-blur"
    >
      {unsaved ? <CloudOff aria-hidden className="size-4 shrink-0 text-destructive" /> : null}
      <p aria-live="polite" className="min-w-0 truncate text-sm text-muted-foreground">
        {t(status)}
      </p>
      <ActionMenu
        label={t('original.more')}
        align="end"
        trigger={<Ellipsis aria-hidden />}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-full"
            aria-label={t('original.more')}
            title={t('original.more')}
          />
        }
        actions={[
          {
            key: 'versions',
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
        className="h-9 shrink-0 rounded-full px-4"
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
    </div>
  )
}
