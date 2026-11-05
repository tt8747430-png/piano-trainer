import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OWN_NAME_MAX } from '@/entities/own-lessons'
import { NewSheet } from '@/shared/ui'

/**
 * A list's last row that makes one more of the learner's own (R30-5): "+ New lesson", "+ New course",
 * opening the app's New sheet: its name, then Create. `onCreate` hands back whether it was made, and
 * goes on to what was made itself.
 */
export function NewRow({
  label,
  createLabel,
  onCreate,
}: {
  /** The row's name, and the sheet's title: "New lesson". */
  label: string
  /** The sheet's button: "Create lesson". */
  createLabel: string
  onCreate: (name: string) => boolean
}) {
  const { t } = useTranslation('learn')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [failed, setFailed] = useState(false)
  const close = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setName('')
      setFailed(false)
    }
  }
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-16 w-full items-center gap-4 px-3 py-2 text-left font-semibold transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
      >
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-pill bg-muted"
        >
          <Plus className="size-5" />
        </span>
        {label}
      </button>
      <NewSheet
        open={open}
        onOpenChange={close}
        title={label}
        nameLabel={t('edit.order.name')}
        name={name}
        onName={setName}
        maxLength={OWN_NAME_MAX}
        createLabel={createLabel}
        failed={failed ? t('own.lessonFailed') : null}
        onCreate={() => {
          if (onCreate(name)) close(false)
          else setFailed(true)
        }}
      />
    </>
  )
}
