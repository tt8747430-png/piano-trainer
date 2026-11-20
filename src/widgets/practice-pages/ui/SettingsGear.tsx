import { Settings } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { RoundButton, Sheet, SheetContent } from '@/shared/ui'

/**
 * A Practice page's gear in its bar and the settings it opens in place, as each page's board draws
 * them (`setOn`): a bottom sheet on a phone, on a laptop the card hung under the gear with nothing
 * dimmed behind it. `title` heads the sheet and names the gear ("Interval settings").
 */
export function SettingsGear({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <RoundButton
        label={title}
        icon={Settings}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      />
      <Sheet hung="header" open={open} onOpenChange={setOpen}>
        <SheetContent title={title}>{children}</SheetContent>
      </Sheet>
    </>
  )
}
