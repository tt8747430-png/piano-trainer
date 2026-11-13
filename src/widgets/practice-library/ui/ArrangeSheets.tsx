import { Check, Folder, FolderPlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ARRANGED_NAME_MAX,
  renameItem,
  renamePlace,
  usePracticeLibraryStoreApi,
  type ArrangedPlace,
} from '@/entities/practice-library'
import { arrangeLibrary, makeLibraryFolder } from '@/features/manage-practice-library'
import { NewSheet, say, Sheet, SheetContent } from '@/shared/ui'
import { useMoveItem, type ArrangeSheet } from '../model/use-arranged-library'
import type { LibraryKind } from '../model/library-words'

/** A name asked for in a sheet: the item's or place's new name, or a new folder's. */
export function NameSheet({
  sheet,
  onClose,
  kind,
}: {
  sheet: Extract<ArrangeSheet, { kind: 'renameItem' | 'renamePlace' | 'newFolder' }>
  onClose: () => void
  kind: LibraryKind
}) {
  const { t } = useTranslation('practice')
  const store = usePracticeLibraryStoreApi()
  const [name, setName] = useState(sheet.kind === 'newFolder' ? '' : sheet.name)
  const save = () => {
    if (sheet.kind === 'newFolder') {
      if (makeLibraryFolder(store, kind, name)) say(t('library.edit.made', { name: name.trim() }))
    } else if (sheet.kind === 'renameItem')
      arrangeLibrary(store, kind, (each) => renameItem(each, sheet.id, name))
    else arrangeLibrary(store, kind, (each) => renamePlace(each, sheet.id, name))
    onClose()
  }
  return (
    <NewSheet
      open
      onOpenChange={(open) => (open ? null : onClose())}
      title={t(sheet.kind === 'newFolder' ? 'library.edit.newFolder' : 'library.edit.renameTitle')}
      nameLabel={t('library.edit.name')}
      name={name}
      onName={setName}
      maxLength={ARRANGED_NAME_MAX}
      createLabel={t(sheet.kind === 'newFolder' ? 'library.edit.create' : 'library.edit.save')}
      createIcon={sheet.kind === 'newFolder' ? <FolderPlus aria-hidden /> : undefined}
      onCreate={save}
    />
  )
}

/** Move to…: every place of the library, the row's present one checked, a tap moving it there. */
function MoveSheet({
  sheet,
  places,
  current,
  onClose,
  kind,
}: {
  sheet: Extract<ArrangeSheet, { kind: 'move' }>
  places: readonly ArrangedPlace[]
  current: string
  onClose: () => void
  kind: LibraryKind
}) {
  const { t } = useTranslation('practice')
  const move = useMoveItem(kind)
  return (
    <Sheet open onOpenChange={(open) => (open ? null : onClose())}>
      <SheetContent title={t('library.edit.moveTitle', { name: sheet.name })}>
        <ul className="card flex flex-col divide-y divide-hairline overflow-hidden">
          {places.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                aria-current={place.id === current ? 'true' : undefined}
                onClick={() => {
                  onClose()
                  if (place.id !== current) move(sheet, place)
                }}
                className="flex min-h-12 w-full items-center gap-3 px-4 text-left transition-colors duration-200 ease-out hover:bg-muted"
              >
                <Folder aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">{place.name}</span>
                {place.id === sheet.home ? (
                  <span className="text-sm text-muted-foreground">
                    {t('library.edit.ownPlace')}
                  </span>
                ) : null}
                {place.id === current ? (
                  <Check aria-hidden className="size-5 shrink-0" strokeWidth={3} />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}

/** What is open over a library while it is arranged (R32): a name to give, or a place to move to. */
export function ArrangeSheets({
  sheet,
  onClose,
  kind,
  places,
  placeOf,
}: {
  sheet: ArrangeSheet | null
  onClose: () => void
  kind: LibraryKind
  places: readonly ArrangedPlace[]
  /** Where a row stands now. */
  placeOf: (id: string) => string
}) {
  if (!sheet) return null
  if (sheet.kind === 'move')
    return (
      <MoveSheet
        sheet={sheet}
        places={places}
        current={placeOf(sheet.id)}
        onClose={onClose}
        kind={kind}
      />
    )
  return (
    <NameSheet
      key={sheet.kind === 'newFolder' ? 'new' : sheet.id}
      sheet={sheet}
      onClose={onClose}
      kind={kind}
    />
  )
}
