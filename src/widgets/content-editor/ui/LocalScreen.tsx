import type { ReactNode } from 'react'
import { ScreenHeader, type EditAction } from '@/shared/ui'

/**
 * An editor's screen over what the learner keeps on their device (R30-5: their own lesson or course),
 * as `DraftScreen` is over a draft on the server, with nothing to open, publish or wait for: its
 * Back, Done at the bar's end, and the document.
 */
export function LocalScreen({
  heading,
  back,
  edit,
  children,
}: {
  /** The screen's heading: the item's title, shown in the bar once the document's scrolls away. */
  heading: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** Its Edit, in Edit: Done, which keeps what was written and reads it. */
  edit: EditAction
  children: ReactNode
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-8">
      <ScreenHeader title={heading} back={back} titleOnPage edit={edit} />
      {children}
    </div>
  )
}
