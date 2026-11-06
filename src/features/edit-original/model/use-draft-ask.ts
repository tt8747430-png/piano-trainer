import { useState } from 'react'

/** What a draft's act asks first: publishing it, discarding it, or a version to restore. */
export type DraftAsked = 'publish' | 'discard' | 'versions' | null

/**
 * What is asked now, and whether an act is under way: the screen's menu or rows and their dialogs
 * (`DraftDialogs`) share it.
 */
export function useDraftAsk() {
  const [asked, setAsked] = useState<DraftAsked>(null)
  const [busy, setBusy] = useState(false)
  return { asked, setAsked, busy, setBusy }
}

export type DraftAsk = ReturnType<typeof useDraftAsk>
