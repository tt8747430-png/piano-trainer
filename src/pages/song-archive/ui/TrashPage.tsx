import { Ellipsis, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { useLibraryActs } from '@/features/manage-library'
import { ActionMenu, BackButton, GROUPED_LIST, say, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ArchivedRow } from './ArchivedRow'
import { DeleteSongAsk } from './DeleteSongAsk'
import { TrashEmpty } from './TrashEmpty'

/**
 * The Trash (R34, StemDeck's; the archive's shape, canvas 133), inside the archive: Empty Trash under
 * its bar; the learner's own
 * songs deleted, the newest first, each with Restore (back where it stood) and its More with Delete
 * permanently; emptying and deleting for good asked first. Empty, it says what it is for.
 */
export function TrashPage() {
  const { t } = useTranslation('songs')
  const { trash } = useLibraryLayout()
  const acts = useLibraryActs()
  const [deleting, setDeleting] = useState<PieceId | 'all' | null>(null)
  return (
    <div className="flex flex-col gap-6 pb-4">
      <ScreenHeader title={t('trash.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {trash.length === 0 ? (
          <TrashEmpty />
        ) : (
          <div className="flex flex-col gap-3">
            <Button
              variant="bar"
              className="self-start text-destructive"
              onClick={() => setDeleting('all')}
            >
              {t('trash.emptyAll')}
            </Button>
            <ul aria-label={t('trash.title')} className={GROUPED_LIST}>
              {trash.map((entry) => (
                <ArchivedRow
                  key={entry.id}
                  entry={{ kind: 'song', ...entry }}
                  onRestore={() => acts.untrash([entry.id])}
                  more={
                    <ActionMenu
                      label={t('library.more')}
                      align="end"
                      trigger={<Ellipsis aria-hidden />}
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-pill"
                          aria-label={t('library.more')}
                          title={t('library.more')}
                        />
                      }
                      actions={[
                        {
                          key: 'delete',
                          label: t('trash.deleteForGood'),
                          icon: Trash2,
                          destructive: true,
                          onSelect: () => setDeleting(entry.id),
                        },
                      ]}
                    />
                  }
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      <DeleteSongAsk
        song={deleting}
        count={trash.length}
        onOpenChange={(open) => (open ? undefined : setDeleting(null))}
        onDeleted={() => (deleting === 'all' ? say(t('trash.emptied')) : undefined)}
      />
    </div>
  )
}
