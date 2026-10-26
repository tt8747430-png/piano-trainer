import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, useLibraryLayout, type ShelvedFolder } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { useLibraryActs } from '@/features/manage-library'
import { RowCheck, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { LibraryPage } from '../model/use-library-page'

/**
 * Move songs here (an empty folder's, Apple Music's Add Music): every song of the library outside
 * this folder, under its place's name, each a check; Move moves those ticked in, with Undo.
 */
export function MoveInSheet({
  page,
  folder,
  open,
  onOpenChange,
}: {
  page: LibraryPage
  folder: ShelvedFolder
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const layout = useLibraryLayout()
  const acts = useLibraryActs()
  const nameOf = useFolderName()
  const [ticked, setTicked] = useState<ReadonlySet<PieceId>>(new Set())
  const lists = [
    ...layout.folders
      .filter((each) => each.id !== folder.id)
      .map((each) => ({ key: each.id, name: nameOf(each), songs: each.songs })),
    { key: 'home', name: t('library.home'), songs: layout.home },
  ].filter((list) => list.songs.length > 0)
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setTicked(new Set())
        onOpenChange(next)
      }}
    >
      <SheetContent
        title={t('folder.moveIn')}
        footer={
          <Button
            size="lg"
            className="w-full"
            disabled={ticked.size === 0}
            onClick={() => {
              acts.move({ songs: [...ticked], folders: [] }, folder.id)
              setTicked(new Set())
              onOpenChange(false)
            }}
          >
            {t('move.toCount', { count: ticked.size })}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          {lists.map((list) => (
            <section key={list.key} className="flex flex-col gap-1">
              <h3 className="text-lg">{list.name}</h3>
              <ul className="flex flex-col">
                {list.songs.map((id) => (
                  <li key={id}>
                    <RowCheck
                      title={page.titleOf(id)}
                      checked={ticked.has(id)}
                      onCheckedChange={(on) =>
                        setTicked((was) => {
                          const next = new Set(was)
                          if (on) next.add(id)
                          else next.delete(id)
                          return next
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
