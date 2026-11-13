import { ChevronDown, Plus } from 'lucide-react'
import { ActionMenu, type MenuAction } from './ActionMenu'
import { Fab, FloatingActions, SpeedDial, SpeedDialAction } from './FloatingActions'
import { Button } from './primitives/button'

interface NewProps {
  /** New, in the screen's words. */
  readonly label: string
  /** What New makes here, the most made first. */
  readonly actions: readonly MenuAction[]
}

/**
 * New on a phone (canvas 169: one dial on every library): the floating honey +, its card of rows
 * opening above it with the most made nearest the thumb. One thing to make is the + alone.
 */
export function NewDial({ label, actions, className }: NewProps & { readonly className?: string }) {
  const shown = actions.filter((action) => !action.hidden)
  const only = shown.length === 1 ? shown[0] : undefined
  return (
    <FloatingActions className={className}>
      {only ? (
        <Fab label={only.label} icon={Plus} onClick={only.onSelect} />
      ) : (
        <SpeedDial label={label} icon={Plus} main>
          {shown.toReversed().map((action) => (
            <SpeedDialAction
              key={action.key}
              label={action.label}
              icon={action.icon ?? Plus}
              onClick={action.onSelect}
            />
          ))}
        </SpeedDial>
      )}
    </FloatingActions>
  )
}

/**
 * New on a laptop (canvas 169): the same rows as a menu from the honey New ▾ at the bar's end, since a
 * floating + would cover a table's last rows. One thing to make is its own button.
 */
export function NewMenu({ label, actions }: NewProps) {
  const shown = actions.filter((action) => !action.hidden)
  const only = shown.length === 1 ? shown[0] : undefined
  if (only) {
    const Icon = only.icon ?? Plus
    return (
      <Button onClick={only.onSelect}>
        <Icon aria-hidden data-icon="inline-start" />
        {only.label}
      </Button>
    )
  }
  return (
    <ActionMenu
      label={label}
      align="end"
      trigger={
        <>
          <Plus aria-hidden />
          {label}
          <ChevronDown aria-hidden />
        </>
      }
      render={<Button />}
      actions={actions}
    />
  )
}
