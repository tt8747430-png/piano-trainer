import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  OWN_PROGRESSION_NAME_MAX,
  usePracticeLibraryStoreApi,
  type OwnProgressionId,
} from '@/entities/practice-library'
import { saveProgression } from '@/features/manage-practice-library'
import { keyFromParam, keyParam, type ChurchMode, type KeyParam } from '@/shared/lib/music'
import { NewSheet, SheetPart } from '@/shared/ui'
import { ProgressionField } from './ProgressionField'

/** What the sheet starts from: a line and the key it is read in, a name, and the mode, if any. */
export interface KeepStart {
  readonly name: string
  readonly line: string
  readonly key: KeyParam
  readonly mode?: ChurchMode
}

/**
 * New progression, Keep in Mine and Edit (R30-4), the app's New sheet: its name, and its numerals or
 * chords typed (ADR 0052), read in the key they were typed in. Keep progression keeps it in Mine
 * (`editing`: in its place) and hands back its id and key; a name and a line that reads it needs.
 */
export function KeepProgressionSheet({
  open,
  onOpenChange,
  start,
  editing,
  onKept,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  start: KeepStart
  /** The learner's progression changed in its place. */
  editing?: OwnProgressionId
  onKept: (id: OwnProgressionId, key: KeyParam) => void
}) {
  const { t } = useTranslation('practice')
  const store = usePracticeLibraryStoreApi()
  const [name, setName] = useState(start.name)
  const [line, setLine] = useState({ p: start.line, key: start.key })
  const keep = () => {
    const kept = saveProgression(
      store,
      {
        name,
        line: line.p,
        minor: keyFromParam(line.key).minor,
        ...(start.mode ? { mode: start.mode } : {}),
      },
      editing,
    )
    if (!kept) return
    onOpenChange(false)
    onKept(kept, line.key)
  }
  return (
    <NewSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t(editing ? 'progressions.mine.edit' : 'progressions.mine.new')}
      nameLabel={t('progressions.mine.name')}
      name={name}
      onName={setName}
      maxLength={OWN_PROGRESSION_NAME_MAX}
      createLabel={t(editing ? 'progressions.mine.save' : 'progressions.mine.create')}
      onCreate={keep}
    >
      <SheetPart title={t('progressions.mine.line')}>
        <ProgressionField
          progression={line.p}
          musicKey={keyFromParam(line.key)}
          inMode={start.mode !== undefined}
          onChange={(p, key) => setLine({ p, key: keyParam(key) })}
        />
      </SheetPart>
    </NewSheet>
  )
}
