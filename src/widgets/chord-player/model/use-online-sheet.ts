import { useEffect, useRef, useState } from 'react'
import { selectSaved, useChordSheets, useChordSheetsStoreApi } from '@/entities/chord-sheet'
import { sendUnsent, takeOnline } from '@/features/share-chord-sheet'
import type { LivePlace, SheetLine } from '@/shared/api/chord-share'
import { useChordShare } from '@/shared/lib/chord-share'
import type { BoxPlace } from './engine'

/** A shared sheet's live side (R39-10): whether it is shared, and the chord another copy plays now. */
export interface OnlineSheetState {
  /** Whether the sheet in hand is shared live. */
  readonly live: boolean
  /** The chord another open copy plays now: its box and beat; none while nobody else plays. */
  readonly remote: LivePlace | null
}

/**
 * Keeps a shared sheet live (R39-10, owner 2026-11-14: "the chords that are being played are also online"):
 * its Realtime line open while it is in hand; each change another copy saves taken in (a draft rebased on
 * it bar by bar); a save made offline sent once the connection is back; and the chord this copy plays sent
 * to every other copy, theirs shown here while this one is stopped.
 */
export function useOnlineSheet(
  sheetId: string | undefined,
  lit: BoxPlace | null,
  beat: number | null,
): OnlineSheetState {
  const port = useChordShare()
  const store = useChordSheetsStoreApi()
  const linkId = useChordSheets(selectSaved(sheetId))?.online?.id
  const [remote, setRemote] = useState<LivePlace | null>(null)
  const line = useRef<SheetLine | null>(null)

  useEffect(() => {
    if (sheetId === undefined || linkId === undefined) return
    const revision = () =>
      store.getState().mine.find((sheet) => sheet.id === sheetId)?.online?.revision ?? 0
    let reading = false
    const catchUp = async () => {
      if (reading) return
      reading = true
      // A save made offline goes first, merged with what others saved meanwhile.
      await sendUnsent(port, store, sheetId)
      const read = await port.read(linkId)
      reading = false
      if (read.ok && read.value && read.value.revision > revision())
        takeOnline(store, sheetId, read.value)
    }
    line.current = port.open(linkId, {
      onChanged: (next) => {
        if (next > revision()) void catchUp()
      },
      onPlaying: setRemote,
    })
    void catchUp()
    const back = () => void catchUp()
    window.addEventListener('online', back)
    return () => {
      window.removeEventListener('online', back)
      line.current?.close()
      line.current = null
      setRemote(null)
    }
  }, [port, store, sheetId, linkId])

  // The chord this copy plays, sent as it changes; none when it stops.
  const section = lit?.section
  const index = lit?.index
  useEffect(() => {
    line.current?.sendPlaying(
      section === undefined || index === undefined ? null : { section, index, beat },
    )
  }, [section, index, beat])

  return { live: linkId !== undefined, remote }
}
