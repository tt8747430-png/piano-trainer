import { Settings } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { RoundButton, Sheet, SheetContent } from '@/shared/ui'

/**
 * A Practice page's gear in its bar, named by the settings it opens ("Interval settings") and saying
 * whether they are open. `SettingsGear` draws it with its sheet; Scales, whose sheet its explorer
 * holds, draws the gear alone.
 */
export function GearButton({
  title,
  open,
  onOpen,
}: {
  title: string
  open: boolean
  onOpen: () => void
}) {
  return (
    <RoundButton
      label={title}
      icon={Settings}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={onOpen}
    />
  )
}

/**
 * A Practice page's gear in its bar and the settings it opens in place, as each page's board draws
 * them (`setOn`): a bottom sheet on a phone, on a laptop the card hung under the gear with nothing
 * dimmed behind it. `title` heads the sheet and names the gear ("Interval settings").
 */
export function SettingsGear({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <GearButton title={title} open={open} onOpen={() => setOpen(true)} />
      <Sheet hung="header" open={open} onOpenChange={setOpen}>
        <SheetContent title={title}>{children}</SheetContent>
      </Sheet>
    </>
  )
}
