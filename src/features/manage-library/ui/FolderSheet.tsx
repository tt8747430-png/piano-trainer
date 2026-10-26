import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FOLDER_NAME_MAX,
  FOLDER_PAINTS,
  libraryCatalog,
  useFolderName,
  useLibraryLayout,
  useLibraryStoreApi,
  type FolderLook,
  type OwnFolderId,
  type ShelvedFolder,
} from '@/entities/library'
import { useRepertoire, type PieceId } from '@/entities/piece'
import { nextName } from '@/shared/lib'
import { NameField, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { editFolder } from '../edit-folder'
import { makeFolder } from '../make-folder'
import { LookFields } from './LookFields'

/** What the folder sheet is open on: a new folder (holding these songs), or a folder to edit. */
export type FolderSheetTarget =
  | { readonly kind: 'new'; readonly songs?: readonly PieceId[] }
  | { readonly kind: 'edit'; readonly folder: ShelvedFolder }

/**
 * New folder and Edit folder, one sheet (Mindscape's `FolderSheet`): its name (a new one's
 * suggested, "New folder", "New folder 2"), its picture and its paint. A new folder is made at Home,
 * last, holding the songs it was made for (`onMade` hears its id); a built-in folder whose name is
 * left as its collection's keeps saying it in either language.
 */
export function FolderSheet({
  target,
  onOpenChange,
  onMade,
}: {
  target: FolderSheetTarget | null
  onOpenChange: (open: boolean) => void
  onMade?: (id: OwnFolderId) => void
}) {
  return (
    <Sheet open={target !== null} onOpenChange={onOpenChange}>
      {target ? (
        <FolderForm
          key={target.kind === 'edit' ? target.folder.id : 'new'}
          target={target}
          onDone={(id) => {
            onOpenChange(false)
            if (id) onMade?.(id)
          }}
        />
      ) : null}
    </Sheet>
  )
}

function FolderForm({
  target,
  onDone,
}: {
  target: FolderSheetTarget
  onDone: (id: OwnFolderId | null) => void
}) {
  const { t } = useTranslation('songs')
  const store = useLibraryStoreApi()
  const repertoire = useRepertoire()
  const layout = useLibraryLayout()
  const nameOf = useFolderName()
  const editing = target.kind === 'edit' ? target.folder : null
  const shown = editing ? nameOf(editing) : ''
  const suggested = nextName(
    t('folder.baseName'),
    layout.folders.map((folder) => nameOf(folder)),
  )
  const [name, setName] = useState(shown)
  const [look, setLook] = useState<FolderLook>(
    editing
      ? { picture: editing.picture, paint: editing.paint }
      : {
          picture: 'music',
          paint: FOLDER_PAINTS[layout.folders.length % FOLDER_PAINTS.length] ?? 'sand',
        },
  )
  // A new folder takes its suggested name where none is typed; an edited one needs one of its own.
  const answer = name.trim() || (editing ? '' : suggested)
  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    if (!answer) return
    const catalog = libraryCatalog(repertoire)
    if (!editing) {
      onDone(
        makeFolder(
          store,
          catalog,
          { name: answer, ...look },
          target.kind === 'new' ? target.songs : [],
        ),
      )
      return
    }
    // A built-in folder's name left as its collection's stays its collection's, in either language.
    const keepsItsOwn = editing.builtIn && !editing.name && answer === shown
    editFolder(store, catalog, editing.id, { name: keepsItsOwn ? undefined : answer, ...look })
    onDone(null)
  }
  return (
    <SheetContent
      title={t(editing ? 'folder.edit' : 'folder.new')}
      footer={
        <Button size="lg" className="w-full" disabled={!answer} onClick={() => submit()}>
          {t(editing ? 'folder.save' : 'folder.create')}
        </Button>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-6">
        <NameField
          label={t('folder.name')}
          value={name}
          placeholder={editing ? undefined : suggested}
          maxLength={FOLDER_NAME_MAX}
          onChange={(event) => setName(event.target.value)}
        />
        <LookFields look={look} onChange={setLook} />
      </form>
    </SheetContent>
  )
}
