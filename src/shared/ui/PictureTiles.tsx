import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** A tile: its picture over its name; greyed where it cannot be chosen, `reason` its tooltip. */
export interface PictureTile<V extends string> {
  readonly value: V
  readonly label: string
  readonly picture: ReactNode
  readonly reason?: string | undefined
}

/** A row's tiles: four in a row where a phone is not narrow, two by two where it is. */
const COLUMNS = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4 narrow-phone:grid-cols-2',
} as const

/**
 * One choice of a few, each a tile of its picture over its name (ADR 0099, 0115): the View's views
 * and its layouts. A radio group named by its label; the arrows move to a choice and choose it. The
 * one chosen is outlined on the muted fill; one that cannot be chosen is greyed, its reason its
 * tooltip. `columns`, how many stand in a row.
 */
export function PictureTiles<V extends string>({
  label,
  value,
  tiles,
  columns,
  onChange,
}: {
  label: string
  value: V
  tiles: readonly PictureTile<V>[]
  columns: 2 | 3 | 4
  onChange: (value: V) => void
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const tile = tiles.find((each) => each.value === next)
        if (tile && tile.value !== value) onChange(tile.value)
      }}
      className={cn('grid gap-2', COLUMNS[columns])}
    >
      {tiles.map((tile) => (
        <Radio.Root
          key={tile.value}
          value={tile.value}
          disabled={tile.reason !== undefined}
          aria-label={tile.label}
          title={tile.reason}
          className="flex min-h-11 min-w-0 cursor-default flex-col items-center gap-1.5 rounded-2xl border border-input bg-card px-1.5 py-2.5 text-center text-sm leading-tight font-medium text-pretty text-muted-foreground transition-colors duration-200 ease-out select-none hover:bg-muted data-checked:border-foreground data-checked:bg-muted data-checked:text-foreground data-disabled:opacity-40 data-disabled:hover:bg-card"
        >
          {tile.picture}
          <span>{tile.label}</span>
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
