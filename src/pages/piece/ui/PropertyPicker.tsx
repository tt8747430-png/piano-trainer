import { useState, type ComponentProps, type ReactElement, type ReactNode } from 'react'
import { useMediaQuery, LAPTOP } from '@/shared/lib'
import { PanelPopover, RowTrigger, Sheet, SheetContent } from '@/shared/ui'

/** What an editor is given: how to close its picker, and the ref of the field it focuses as it opens. */
export interface PickerTools {
  readonly close: () => void
  readonly field: (node: HTMLInputElement | HTMLTextAreaElement | null) => void
}

/** The button that opens a picker, given the props that make it do so. */
type Trigger = (props: ComponentProps<'button'>) => ReactElement

/**
 * One property's editor over the page (R32-C, Notion's property values): a popover beside what opened
 * it on a laptop, a sheet on a phone, titled with the property's name. `trigger` draws the button
 * that opens it; `children` the editor, given how to close and which field takes the focus.
 */
export function Picker({
  title,
  trigger,
  children,
}: {
  title: string
  trigger: Trigger
  children: (tools: PickerTools) => ReactNode
}) {
  const laptop = useMediaQuery(LAPTOP)
  const [open, setOpen] = useState(false)
  // The field to focus, once the editor has drawn it: the sheet or popover then opens on it.
  const [field, setField] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const tools: PickerTools = { close: () => setOpen(false), field: setField }
  const focus = () => field ?? true
  if (laptop)
    return (
      <PanelPopover
        title={title}
        open={open}
        onOpenChange={setOpen}
        trigger={(props) => trigger(props)}
        align="end"
        initialFocus={focus}
        className="w-[min(24rem,calc(100vw-2rem))] text-base"
      >
        {open ? children(tools) : null}
      </PanelPopover>
    )
  return (
    <>
      {trigger({ onClick: () => setOpen(true), 'aria-haspopup': 'dialog' })}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent title={title} initialFocus={focus}>
          {open ? children(tools) : null}
        </SheetContent>
      </Sheet>
    </>
  )
}

/** A property as a row of its list: its name, its value (or `empty`) and a chevron; a tap edits it. */
export function PropertyRow({
  title,
  value,
  empty,
  children,
}: {
  title: string
  value: string
  /** What an unset value reads. */
  empty: string
  children: (tools: PickerTools) => ReactNode
}) {
  return (
    <Picker
      title={title}
      trigger={(props) => <RowTrigger {...props} title={title} value={value || empty} />}
    >
      {children}
    </Picker>
  )
}
