import { FilePlus2, Plus } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

/** An item that may be added back by its name: a lesson the course had. */
export interface Addable {
  readonly key: string
  readonly title: string
}

/**
 * A list's last row (round 21): "Add lesson", typed into in place. What is typed finds the items to
 * add by their name, and offers a new one of that name; Enter adds the first found, else the new
 * one. Why one was not made is said under it.
 */
export function AddRow({
  label,
  newLabel,
  failed: failedLine,
  found = [],
  onPick,
  onCreate,
}: {
  /** The field's name and placeholder: "Add lesson". */
  label: string
  /** The offer to make a new one of the name typed: "New lesson “Blues”". */
  newLabel: (name: string) => string
  /** Said where a new one was not made. */
  failed: string
  /** What may be added by its name. */
  found?: readonly Addable[]
  onPick?: (key: string) => void
  /** Makes a new one; false where it was not made. */
  onCreate: (name: string) => Promise<boolean>
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const typed = name.trim()
  const matches =
    typed === ''
      ? []
      : found.filter((item) => item.title.toLowerCase().includes(typed.toLowerCase()))
  const create = async () => {
    if (typed === '' || busy) return
    setBusy(true)
    setFailed(false)
    const made = await onCreate(typed)
    setBusy(false)
    if (made) setName('')
    else setFailed(true)
  }
  const pick = (key: string) => {
    onPick?.(key)
    setName('')
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const first = matches[0]
    if (first) pick(first.key)
    else void create()
  }
  return (
    <form onSubmit={submit} className="flex flex-col">
      <div className="flex min-h-12 items-center gap-1 rounded-xl transition-colors duration-150 ease-out focus-within:bg-muted/60 hover:bg-muted/60">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center text-muted-foreground"
        >
          <Plus className="size-4" />
        </span>
        <input
          id={id}
          aria-label={label}
          placeholder={label}
          value={name}
          disabled={busy}
          autoComplete="off"
          onChange={(event) => setName(event.target.value)}
          className="min-h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </div>
      {typed === '' ? null : (
        <ul aria-label={label} className="flex flex-col pl-11">
          {matches.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center rounded-xl px-2 text-left transition-colors duration-150 ease-out hover:bg-muted"
                onClick={() => pick(item.key)}
              >
                {item.title}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              disabled={busy}
              className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-left font-medium transition-colors duration-150 ease-out hover:bg-muted"
              onClick={() => void create()}
            >
              <FilePlus2 aria-hidden className="size-4 text-muted-foreground" />
              {busy ? t('edit.order.adding') : newLabel(typed)}
            </button>
          </li>
        </ul>
      )}
      {failed ? (
        <p role="alert" className="pl-11 text-sm text-destructive">
          {failedLine}
        </p>
      ) : null}
    </form>
  )
}
