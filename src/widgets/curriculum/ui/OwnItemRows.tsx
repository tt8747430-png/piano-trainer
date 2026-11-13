import { Copy, PencilLine } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { OWN_NAME_MAX } from '@/entities/own-lessons'
import { DangerGroup, DangerRow, NewSheet, RowButton, say, SettingsGroup } from '@/shared/ui'

/** What the rows say of the item: a lesson's words or a course's. */
export interface OwnItemWords {
  /** Its group's name: The lesson, The course. */
  readonly group: string
  /** Rename's sheet: Rename lesson. */
  readonly rename: string
  /** Delete's row: Delete lesson. */
  readonly delete: string
}

/**
 * A lesson's or a course's of the learner's own (R30-5), on its Settings: its group, Rename (in the
 * New sheet's shape, its name filled in) and Duplicate.
 */
export function OwnItemRows({
  title,
  words,
  onRename,
  onDuplicate,
  children,
}: {
  /** The item's name now. */
  title: string
  words: Pick<OwnItemWords, 'group' | 'rename'>
  /** Renames it; false where the name is not kept. */
  onRename: (name: string) => boolean
  onDuplicate: () => void
  /** Its other rows, between Rename and Duplicate (a lesson's In courses). */
  children?: ReactNode
}) {
  const { t } = useTranslation('learn')
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(title)
  const [failed, setFailed] = useState(false)
  const open = (next: boolean) => {
    setRenaming(next)
    setName(title)
    setFailed(false)
  }
  return (
    <SettingsGroup flush title={words.group}>
      <RowButton
        title={t('edit.order.name')}
        value={title}
        icon={PencilLine}
        paint="sky"
        onClick={() => open(true)}
      />
      {children}
      <RowButton title={t('own.duplicate')} icon={Copy} paint="grass" onClick={onDuplicate} />
      <NewSheet
        open={renaming}
        onOpenChange={open}
        title={words.rename}
        nameLabel={t('edit.order.name')}
        name={name}
        onName={setName}
        maxLength={OWN_NAME_MAX}
        createLabel={t('own.rename')}
        failed={failed ? t('own.lessonFailed') : null}
        onCreate={() => {
          if (!onRename(name)) return setFailed(true)
          setRenaming(false)
          say(t('own.renamed'))
        }}
      />
    </SettingsGroup>
  )
}

/**
 * Its Delete, the Settings page's last group alone (R25), what goes with it named under it; it is
 * deleted at once, the page's toast offering Undo (R38).
 */
export function OwnDeleteGroup({
  words,
  onDelete,
}: {
  words: Pick<OwnItemWords, 'delete'>
  onDelete: () => void
}) {
  return (
    <DangerGroup>
      <DangerRow title={words.delete} onClick={onDelete} />
    </DangerGroup>
  )
}
