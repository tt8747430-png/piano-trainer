import { ChevronRight, LayoutGrid, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { PAINT, Sheet, SheetContent, SheetTrigger, type Paint } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'

/** A row of the Tools sheet: an act (a page or a sheet opened, `opens`), or a switch. */
export type ToolRow = {
  readonly key: string
  readonly label: string
  readonly icon: LucideIcon
  readonly paint: Paint
  /** What it is set to, said at its end (Voice commands' Off or On). */
  readonly value?: string | undefined
  /** Why it is greyed, said while it is. */
  readonly disabled?: string | undefined
} & (
  | { readonly kind: 'act'; readonly opens?: boolean; onSelect(): void }
  | { readonly kind: 'switch'; readonly checked: boolean; onCheckedChange(on: boolean): void }
)

/** The Tools sheet's groups, top down (R29 B8, B11). */
export interface ToolGroup {
  readonly key: string
  readonly title: string
  readonly rows: readonly ToolRow[]
}

function Row({ row, close }: { row: ToolRow; close: () => void }) {
  const Icon = row.icon
  const face = (
    <>
      <span
        aria-hidden
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-control',
          PAINT[row.paint].fill,
          PAINT[row.paint].ink,
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1 text-left break-words">{row.label}</span>
    </>
  )
  const reach =
    'flex min-h-12 w-full items-center gap-3 rounded-control px-3 py-1.5 disabled:opacity-50'
  if (row.kind === 'switch')
    return (
      <label className={cn(reach, 'cursor-pointer')} title={row.disabled}>
        {face}
        <Switch
          checked={row.checked}
          disabled={row.disabled !== undefined}
          onCheckedChange={row.onCheckedChange}
        />
      </label>
    )
  return (
    <button
      type="button"
      className={cn(reach, 'hover:bg-muted disabled:hover:bg-transparent')}
      disabled={row.disabled !== undefined}
      title={row.disabled}
      onClick={() => {
        close()
        row.onSelect()
      }}
    >
      {face}
      {row.value ? <span className="text-sm text-muted-foreground">{row.value}</span> : null}
      {row.opens ? <ChevronRight aria-hidden className="size-4 text-muted-foreground" /> : null}
    </button>
  )
}

/**
 * The Tools sheet (R29 B8, B11's), from the Tools button in the bar before ⚙ (a grid): groups of rows,
 * each its coloured picture and name: the quick tools, the score's, how the Player listens, and ways
 * to the Player's other places (Audio/MIDI, Transpose, Change version, Display). A row that opens a
 * page or another sheet closes this one first, so a sheet never opens over a sheet.
 */
export function ToolsSheet({
  groups,
  open,
  onOpenChange,
}: {
  groups: readonly ToolGroup[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('player')
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="tool"
            size="icon"
            aria-label={t('toolsSheet.open')}
            title={t('toolsSheet.open')}
          />
        }
      >
        <LayoutGrid aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('toolsSheet.open')}>
        <div className="flex flex-col gap-4">
          {groups
            .filter((group) => group.rows.length > 0)
            .map((group) => (
              <section key={group.key} aria-label={group.title} className="flex flex-col gap-1">
                <h3 className="px-3 text-sm font-semibold text-muted-foreground">{group.title}</h3>
                <ul className="card flex flex-col p-1">
                  {group.rows.map((row) => (
                    <li key={row.key}>
                      <Row row={row} close={() => onOpenChange(false)} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
