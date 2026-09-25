import { Check } from 'lucide-react'

export interface ChoiceItem<V> {
  readonly value: V
  readonly label: string
  readonly description?: string
  /** Why the choice is not open to this piece; shown instead of the description, and the row is disabled. */
  readonly disabledNote?: string
}

/** A list of choices on a sheet's page: one chosen, some disabled with the reason. */
export function ChoiceList<V>({
  items,
  value,
  onChoose,
}: {
  items: readonly ChoiceItem<V>[]
  value: V
  onChoose: (value: V) => void
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.label}>
          <button
            type="button"
            disabled={item.disabledNote !== undefined}
            aria-pressed={item.value === value}
            onClick={() => onChoose(item.value)}
            className="flex min-h-14 w-full items-center gap-3 border-b border-border py-2 text-left transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{item.label}</span>
              {item.disabledNote || item.description ? (
                <span className="block text-sm text-muted-foreground">
                  {item.disabledNote ?? item.description}
                </span>
              ) : null}
            </span>
            {item.value === value ? <Check aria-hidden className="size-5 text-primary" /> : null}
          </button>
        </li>
      ))}
    </ul>
  )
}
