import { Plus, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NewSheet, SheetPart } from '@/shared/ui'

/** An item that may be added by its name: a lesson the course had, or one to add by reference. */
export interface Addable {
  readonly key: string
  readonly title: string
  /** A line under its name: where it is from. */
  readonly detail?: string | undefined
}

/** Items that may be added, under their heading, each wearing the group's picture. */
export interface AddGroup {
  readonly title: string
  readonly icon: LucideIcon
  readonly items: readonly Addable[]
  /** Listed only once something is typed: a long list found by name (the app's lessons). */
  readonly typed?: boolean
}

/**
 * A list's last row (round 25): "+ Add lesson", which opens the app's New sheet: its name, then
 * Create. Where items may be added (lessons taken out of a course; for the learner's own course, their
 * lessons and the app's, R30-5), the sheet lists them too in their groups, narrowed by the name typed,
 * each added by a tap. Why one was not made is said in the sheet.
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
  /** What may be added by its name, in groups. */
  found?: readonly AddGroup[]
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
  const groups = found.flatMap((group) => {
    if (group.typed && typed === '') return []
    const items = group.items.filter((item) => item.title.toLowerCase().includes(typed))
    return items.length > 0 ? [{ ...group, items }] : []
  })
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
        className="flex min-h-12 items-center gap-1 rounded-control pr-3 text-left font-medium text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted/60 hover:text-foreground"
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
        {groups.map(({ title: heading, icon: Icon, items }) => (
          <SheetPart key={heading} title={heading}>
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center gap-2 rounded-control px-2 py-1 text-left transition-colors duration-150 ease-out hover:bg-card"
                    onClick={() => {
                      onPick?.(item.key)
                      close(false)
                    }}
                  >
                    <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    <span className="flex min-w-0 flex-col">
                      {item.title}
                      {item.detail ? (
                        <span className="text-sm text-muted-foreground">{item.detail}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </SheetPart>
        ))}
      </NewSheet>
    </>
  )
}
