import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FOLDER_NAME_MAX,
  FOLDER_PAINTS,
  libraryCatalog,
  useFolderName,
  useLibraryLayout,
  useLibraryStoreApi,
  type FolderId,
  type FolderLook,
  type OwnFolderId,
} from '@/entities/library'
import { useRepertoire } from '@/entities/piece'
import { nextName } from '@/shared/lib'
import { MakeSheet, NameField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { makeFolder } from '../make-folder'

/** What the folder sheet is open on: a new folder, in a folder or at Home. */
export interface FolderSheetTarget {
  readonly kind: 'new'
  readonly parent: FolderId | null
}

/**
 * New folder (R72's, the canvas's NEWNAME): its name alone (suggested, "New folder", "New folder 2")
 * and Create, Cancel in its header; made where the learner is, last there (`onMade` hears its id),
 * its paint the next of the five; a centred dialog on a laptop (`MakeSheet`). A folder is edited in
 * place on its page (`FolderEditPanel`).
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
  const { t } = useTranslation('songs')
  return (
    <MakeSheet
      open={target !== null}
      onOpenChange={onOpenChange}
      title={t('folder.new')}
      footer={
        <Button type="submit" form={FOLDER_FORM} size="lg" className="w-full">
          {t('folder.create')}
        </Button>
      }
    >
      {target ? (
        <FolderForm
          target={target}
          onDone={(id) => {
            onOpenChange(false)
            if (id) onMade?.(id)
          }}
        />
      ) : null}
    </MakeSheet>
  )
}

/** The form's id, which Create at the sheet's foot submits. */
const FOLDER_FORM = 'new-folder'

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
  // The field starts empty, what it would answer its placeholder (Mindscape's `PromptSheet`): text
  // put in a field has to be selected to be replaced, and a selection in a sheet is what iOS reveals
  // by lifting the whole app over the keyboard.
  const suggestion = nextName(
    t('folder.baseName'),
    layout.folders.map((folder) => nameOf(folder)),
  )
  const [name, setName] = useState('')
  // Its paint the next of the five, so folders made one after another differ; ··· › Colour changes it.
  const look: FolderLook = {
    picture: 'music',
    paint: FOLDER_PAINTS[layout.folders.length % FOLDER_PAINTS.length] ?? 'sand',
  }
  const typed = name.trim()
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const catalog = libraryCatalog(repertoire)
    onDone(
      makeFolder(store, catalog, { name: typed || suggestion, ...look }, { parent: target.parent }),
    )
  }
  return (
    <form id={FOLDER_FORM} onSubmit={submit} className="flex flex-col gap-6">
      <NameField
        label={t('folder.name')}
        autoFocus
        value={name}
        placeholder={suggestion}
        enterKeyHint="done"
        maxLength={FOLDER_NAME_MAX}
        onChange={(event) => setName(event.target.value)}
      />
    </form>
  )
}
