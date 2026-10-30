import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import { useState, type FormEvent, type ReactElement } from 'react'
import { useRender } from '@base-ui/react/use-render'
import { useTranslation } from 'react-i18next'
import { NameField, say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** A row of an ordered list an editor arranges: its name, a line under it, and where it opens. */
export interface OrderRow {
  readonly key: string
  readonly title: string
  readonly detail?: string | undefined
  /** A router `Link` to the item's editor; a row without one is named alone. */
  readonly link?: ReactElement | undefined
}

function RowName({ title, detail, link }: Omit<OrderRow, 'key'>) {
  const face = (
    <>
      <span className="line-clamp-2 font-medium">{title}</span>
      {detail ? <span className="text-sm text-muted-foreground">{detail}</span> : null}
    </>
  )
  return useRender({
    defaultTagName: 'span',
    render: link,
    props: {
      className: `flex min-h-11 min-w-0 flex-1 flex-col justify-center py-2${link ? ' hover:underline' : ''}`,
      children: face,
    },
  })
}

/**
 * What an editor puts in order (a course's lessons, a journey's chapters and a chapter's steps): one
 * card of numbered rows, each opened from its name, moved up or down, or removed (said, with Undo).
 */
export function OrderList({
  label,
  rows,
  onChange,
}: {
  /** What the list is, for a screen reader. */
  label: string
  rows: readonly OrderRow[]
  /** The rows' keys in their new order. */
  onChange: (keys: readonly string[]) => void
}) {
  const { t } = useTranslation('learn')
  const keys = rows.map((row) => row.key)
  const move = (at: number, by: -1 | 1) => {
    const next = [...keys]
    const [key] = next.splice(at, 1)
    if (key !== undefined) next.splice(at + by, 0, key)
    onChange(next)
  }
  return (
    <ol aria-label={label} className="flex flex-col card p-1.5">
      {rows.map(({ key, ...row }, at) => (
        <li key={key} className="flex min-h-14 items-center gap-2 rounded-xl pl-2">
          <span
            aria-hidden
            className="w-6 shrink-0 text-center text-sm text-muted-foreground tabular-nums"
          >
            {at + 1}
          </span>
          <RowName {...row} />
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('edit.order.moveUp', { title: row.title })}
            disabled={at === 0}
            onClick={() => move(at, -1)}
          >
            <ArrowUp aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('edit.order.moveDown', { title: row.title })}
            disabled={at === rows.length - 1}
            onClick={() => move(at, 1)}
          >
            <ArrowDown aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('edit.order.remove', { title: row.title })}
            className="text-destructive"
            onClick={() => {
              onChange(keys.filter((each) => each !== key))
              say(t('edit.order.removed', { title: row.title }), {
                label: t('edit.order.undo'),
                onClick: () => onChange(keys),
              })
            }}
          >
            <X aria-hidden />
          </Button>
        </li>
      ))}
    </ol>
  )
}

/**
 * A new item named and added at a list's end (a lesson, a chapter): its name's field and the Add
 * button beside it, and why it was not made where it was not.
 */
export function AddByName({
  label,
  action,
  failed: failedLine,
  onAdd,
}: {
  /** The field's name: "New lesson". */
  label: string
  /** The button's: "Add lesson". */
  action: string
  /** Said where it was not made. */
  failed: string
  /** Makes it; false where it was not made. */
  onAdd: (name: string) => Promise<boolean>
}) {
  const { t } = useTranslation('learn')
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const [failed, setFailed] = useState(false)
  const add = async (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '' || adding) return
    setAdding(true)
    setFailed(false)
    const made = await onAdd(name)
    setAdding(false)
    if (made) setName('')
    else setFailed(true)
  }
  return (
    <>
      <form onSubmit={(event) => void add(event)} className="flex items-end gap-2">
        <NameField
          label={label}
          className="min-w-0 flex-1"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="submit" size="lg" disabled={name.trim() === '' || adding}>
          <Plus data-icon="inline-start" aria-hidden />
          {adding ? t('edit.order.adding') : action}
        </Button>
      </form>
      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          {failedLine}
        </p>
      ) : null}
    </>
  )
}
