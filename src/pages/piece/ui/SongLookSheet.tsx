import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLibrary, useLibraryStoreApi, type FolderLook } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { LookFields, setSongLook } from '@/features/manage-library'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** What a song's look starts at before it has one: a note on sand. */
const FIRST_LOOK: FolderLook = { picture: 'music', paint: 'sand' }

/**
 * A song's colour and picture (R29 B9, Appearance; a folder's look fields): Save keeps them, its row
 * then wearing them; Remove puts the row back as the app draws it.
 */
export function SongLookSheet({
  id,
  open,
  onOpenChange,
}: {
  id: PieceId
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('piece')
  const store = useLibraryStoreApi()
  const saved = useLibrary((state) => state.songLooks[id])
  const [look, setLook] = useState<FolderLook>(saved ?? FIRST_LOOK)
  const done = (next: FolderLook | null) => {
    setSongLook(store, id, next)
    onOpenChange(false)
  }
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setLook(saved ?? FIRST_LOOK)
        onOpenChange(next)
      }}
    >
      <SheetContent
        title={t('settings.look')}
        footer={
          <div className="flex w-full flex-col gap-2">
            <Button size="lg" className="w-full" onClick={() => done(look)}>
              {t('settings.lookSave')}
            </Button>
            {saved ? (
              <Button size="lg" variant="ghost" className="w-full" onClick={() => done(null)}>
                {t('settings.lookRemove')}
              </Button>
            ) : null}
          </div>
        }
      >
        <LookFields look={look} onChange={setLook} />
      </SheetContent>
    </Sheet>
  )
}
