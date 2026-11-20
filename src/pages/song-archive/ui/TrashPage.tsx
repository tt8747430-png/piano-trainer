import { RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { useLibraryActs } from '@/features/manage-library'
import { say } from '@/shared/ui'
import { DeleteSongAsk } from './DeleteSongAsk'
import { ShelfList, type ShelfItem } from './ShelfList'
import { TrashEmpty } from './TrashEmpty'

/** A song's key in the Trash. */
const keyOf = (id: PieceId) => `song:${id}`

/**
 * The Trash (R34, StemDeck's; the Trash boards, canvas v408), its own place: the learner's own songs
 * deleted, the newest first, each with its ··· (Restore, back where it stood; Delete permanently,
 * asked first); Select restores or deletes what is picked, or all of it, deleting asked first as it
 * cannot be undone. Empty, it says what it is for.
 */
export function TrashPage() {
  const { t } = useTranslation('songs')
  const { trash } = useLibraryLayout()
  const acts = useLibraryActs()
  const [deleting, setDeleting] = useState<readonly PieceId[] | 'all' | null>(null)
  const idsOf = (keys: readonly string[]) =>
    trash.filter((entry) => keys.includes(keyOf(entry.id))).map((entry) => entry.id)
  const items: ShelfItem[] = trash.map((entry) => ({
    key: keyOf(entry.id),
    entry: { kind: 'song', id: entry.id, from: entry.from, at: entry.at },
    at: entry.at,
    actions: [
      {
        key: 'restore',
        label: t('shelf.restore'),
        icon: RotateCcw,
        onSelect: () => acts.untrash([entry.id]),
      },
      {
        key: 'delete',
        label: t('trash.deleteForGood'),
        icon: Trash2,
        destructive: true,
        onSelect: () => setDeleting([entry.id]),
      },
    ],
  }))
  return (
    <>
      <ShelfList
        title={t('trash.title')}
        when={t('table.deleted')}
        search={t('trash.search')}
        items={items}
        count={t('folder.songCount', { count: items.length })}
        empty={<TrashEmpty />}
        acts={{
          restoreIcon: RotateCcw,
          restore: (keys) => acts.untrash(idsOf(keys)),
          loss: {
            label: t('shelf.delete'),
            allLabel: t('shelf.deleteAll'),
            icon: Trash2,
            can: (keys) => keys.length > 0,
            run: (keys) => setDeleting(keys.length === trash.length ? 'all' : idsOf(keys)),
          },
        }}
      />
      <DeleteSongAsk
        songs={deleting}
        count={trash.length}
        onOpenChange={(open) => (open ? undefined : setDeleting(null))}
        onDeleted={() => (deleting === 'all' ? say(t('trash.emptied')) : undefined)}
      />
    </>
  )
}
