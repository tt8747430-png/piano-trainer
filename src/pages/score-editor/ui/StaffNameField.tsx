import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { STAFF_NAME_MAX, useStaffNames } from '@/entities/piece'
import { useScoreEditorContext } from '../model/editor-context'
import { useStaffHeads } from '../model/use-staff-heads'
import { SheetField } from './SheetField'

/**
 * A single staff's name typed where it is printed (ADR 0097, Flat's): the sheet's field over its name
 * at the first line's head, holding the name it has (none for a staff of no name). Enter, or leaving
 * the field, names the staff as typed, an empty field taking its name away; Undo brings the old one
 * back.
 */
export function StaffNameField({
  place,
  anchor,
  onClose,
}: {
  place: number
  /** The staff's name printed, the field over it. */
  anchor: HTMLElement | null
  onClose: () => void
}) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const names = useStaffNames(useStaffHeads())
  const shown = names[place] ?? ''
  const [text, setText] = useState(shown)
  const close = () => {
    // The name as it was, in the learner's language, is no new name: a song's own stays as written.
    if (text.trim() !== shown) actions.dispatch({ type: 'renameStaff', place, name: text })
    onClose()
  }
  return (
    <SheetField
      kind="staffName"
      anchor={anchor}
      label={t('printed.staffName')}
      text={text}
      onText={setText}
      at={String(place)}
      maxLength={STAFF_NAME_MAX}
      onGo={(direction) => {
        if (direction === 1) close()
      }}
      onClose={close}
    />
  )
}
