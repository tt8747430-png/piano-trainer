import { Plus, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NewSheet, SheetPart } from '@/shared/ui'

/** An item that may be added back by its name: a lesson the course had. */
export interface Addable {
  readonly key: string
  readonly title: string
}

/**
 * A list's last row (round 25): "+ Add lesson", which opens the app's New sheet: its name, then
 * Create. Where items may be added back (lessons taken out of a course), the sheet lists them too,
 * narrowed by the name typed, each added by a tap. Why one was not made is said in the sheet.
 */
export function AddRow({
  label,
  title,
  createLabel,
  failed: failedLine,
  found = [],
  onPick,
  onCreate,
}: {
  /** The row's name: "Add lesson". */
  label: string
  /** The sheet's title: "New lesson". */
  title: string
  /** Its button: "Create lesson". */
  createLabel: string
  /** Said where a new one was not made. */
  failed: string
  /** What may be added back by its name. */
  found?: readonly Addable[]
  onPick?: (key: string) => void
  /** Makes a new one; false where it was not made. */
  onCreate: (name: string) => Promise<boolean>
}) {
  const { t } = useTranslation('learn')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const typed = name.trim().toLowerCase()
  const matches = found.filter((item) => item.title.toLowerCase().includes(typed))
  const close = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setName('')
      setFailed(false)
    }
  }
  const create = async () => {
    setBusy(true)
    setFailed(false)
    const made = await onCreate(name.trim())
    setBusy(false)
    if (made) close(false)
    else setFailed(true)
  }
  return (
    <>
      <button
        type="button"
        className="flex min-h-12 items-center gap-1 rounded-xl pr-3 text-left font-medium text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted/60 hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden className="grid size-11 shrink-0 place-items-center">
          <Plus className="size-4" />
        </span>
        {label}
      </button>
      <NewSheet
        open={open}
        onOpenChange={close}
        title={title}
        nameLabel={t('edit.order.name')}
        name={name}
        onName={setName}
        createLabel={createLabel}
        creatingLabel={t('edit.order.adding')}
        creating={busy}
        failed={failed ? failedLine : null}
        onCreate={() => void create()}
      >
        {matches.length > 0 ? (
          <SheetPart title={t('edit.order.addBack')}>
            <ul className="flex flex-col">
              {matches.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-left transition-colors duration-150 ease-out hover:bg-card"
                    onClick={() => {
                      onPick?.(item.key)
                      close(false)
                    }}
                  >
                    <Undo2 aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </SheetPart>
        ) : null}
      </NewSheet>
    </>
  )
}
