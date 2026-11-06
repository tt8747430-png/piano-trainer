import { useTranslation } from 'react-i18next'
import { FOLDER_NAME_MAX, type FolderLook } from '@/entities/library'
import { NameField } from '@/shared/ui'
import { LookFields } from './LookFields'

/** A folder's name and look while it is edited in place: what the panel holds until Done. */
export interface FolderEdit {
  readonly name: string
  readonly look: FolderLook
}

/**
 * A folder in Edit (its ✎ beside its name, Mindscape's and Apple Notes' rename in place): its name, its
 * picture and its paint, under the bar where the folder reads. Done saves it (`editFolder`).
 */
export function FolderEditPanel({
  value,
  placeholder,
  onChange,
  onDone,
}: {
  value: FolderEdit
  /** What an empty name keeps: the folder's own. */
  placeholder: string
  onChange: (value: FolderEdit) => void
  onDone: () => void
}) {
  const { t } = useTranslation('songs')
  return (
    <form
      aria-label={t('folder.edit')}
      onSubmit={(event) => {
        event.preventDefault()
        onDone()
      }}
      className="flex flex-col gap-6 card p-4"
    >
      <NameField
        label={t('folder.name')}
        value={value.name}
        placeholder={placeholder}
        enterKeyHint="done"
        maxLength={FOLDER_NAME_MAX}
        onChange={(event) => onChange({ ...value, name: event.target.value })}
      />
      <LookFields look={value.look} onChange={(look) => onChange({ ...value, look })} />
    </form>
  )
}
