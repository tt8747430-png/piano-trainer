import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import {
  musicOf,
  originalMusic,
  originalWith,
  pieceRecordBody,
  pieceRecordMeta,
  type ChartPiece,
  type PieceMusic,
} from '@/entities/piece'
import type { KeptVersion } from '@/shared/api/content-editing'
import type { NetFailed, NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'

/** How long the editor rests before its change is saved to the draft. */
export const DRAFT_SAVE_DELAY_MS = 800

/** Where the original's draft stands as the editor opens: read, or not to be read. */
export type DraftLoad =
  | { readonly state: 'loading' }
  | { readonly state: 'failed'; readonly reason: NetFailed['reason'] }
  | { readonly state: 'ready'; readonly music: PieceMusic; readonly drafted: boolean }

/** The last save of the draft: none yet, on its way, kept, or not kept (and why). */
export type DraftSaved = 'idle' | 'saving' | 'saved' | 'offline' | 'failed'

/** A publish refused before it is sent: the draft's music does not read as the song's. */
export type Unreadable = { readonly ok: false; readonly reason: 'unreadable' }

/**
 * An editor's draft of a built-in song's original (ADR 0116, round 6): opened on the draft, else on
 * the song as published now, else as this device has it; each change saved to the draft once the
 * editor rests; published (once it reads as the song), discarded, or a kept version restored.
 */
export function useOriginalDraft(piece: ChartPiece) {
  const editing = useContentEditing()
  const [load, setLoad] = useState<DraftLoad>({ state: 'loading' })
  const [saved, setSaved] = useState<DraftSaved>('idle')
  const [drafted, setDrafted] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const pending = useRef<{ music: PieceMusic; timer: number } | null>(null)
  const last = useRef<PieceMusic | null>(null)

  useEffect(() => {
    let current = true
    void (async () => {
      const draft = await editing.draft('piece', piece.id)
      if (!current) return
      if (!draft.ok) return setLoad({ state: 'failed', reason: draft.reason })
      const fromDraft = draft.value ? originalMusic(piece, draft.value.body) : undefined
      if (fromDraft) {
        setDrafted(true)
        return setLoad({ state: 'ready', music: fromDraft, drafted: true })
      }
      const published = await editing.published('piece', piece.id)
      if (!current) return
      const fromServer = published.ok ? originalMusic(piece, published.value) : undefined
      setLoad({ state: 'ready', music: fromServer ?? musicOf(piece), drafted: false })
    })()
    return () => {
      current = false
    }
  }, [editing, piece, attempt])

  const write = useCallback(
    async (music: PieceMusic) => {
      setSaved('saving')
      const original = originalWith(piece, music)
      const result = await editing.saveDraft('piece', piece.id, {
        body: pieceRecordBody(original),
        meta: pieceRecordMeta(original),
      })
      if (result.ok) {
        setDrafted(true)
        setSaved('saved')
      } else setSaved(result.reason === 'offline' ? 'offline' : 'failed')
      return result
    },
    [editing, piece],
  )

  /** Saves what is waiting now, rather than once the editor rests. */
  const flush = useCallback(async (): Promise<NetResult<void> | null> => {
    const waiting = pending.current
    if (!waiting) return null
    window.clearTimeout(waiting.timer)
    pending.current = null
    return write(waiting.music)
  }, [write])

  const save = useCallback(
    (music: PieceMusic) => {
      last.current = music
      if (pending.current) window.clearTimeout(pending.current.timer)
      pending.current = {
        music,
        timer: window.setTimeout(() => void flush(), DRAFT_SAVE_DELAY_MS),
      }
    },
    [flush],
  )

  // What waits when the editor closes is saved on the way out.
  const leave = useEffectEvent(() => void flush())
  useEffect(() => () => leave(), [])

  const publish = useCallback(async (): Promise<NetResult<string> | Unreadable> => {
    const flushed = await flush()
    if (flushed && !flushed.ok) return flushed
    const music = last.current ?? (load.state === 'ready' ? load.music : null)
    if (music && !originalMusic(piece, pieceRecordBody(originalWith(piece, music))))
      return { ok: false, reason: 'unreadable' }
    const result = await editing.publish('piece', piece.id)
    if (result.ok) setDrafted(false)
    return result
  }, [editing, flush, load, piece])

  const discard = useCallback(async (): Promise<NetResult<void>> => {
    if (pending.current) window.clearTimeout(pending.current.timer)
    pending.current = null
    const result = await editing.discardDraft('piece', piece.id)
    if (result.ok) setDrafted(false)
    return result
  }, [editing, piece])

  const versions = useCallback(
    (): Promise<NetResult<readonly KeptVersion[]>> => editing.versions('piece', piece.id),
    [editing, piece],
  )
  const restore = useCallback(
    (version: string): Promise<NetResult<void>> => editing.restore('piece', piece.id, version),
    [editing, piece],
  )

  return {
    load,
    /** How many times it has opened: the editor opens afresh on each. */
    opened: attempt,
    /** Opens the draft again: after a failure, or once the song's published music changed. */
    reopen: () => {
      setLoad({ state: 'loading' })
      setSaved('idle')
      setAttempt((count) => count + 1)
    },
    saved,
    drafted,
    save,
    publish,
    discard,
    versions,
    restore,
  }
}

export type OriginalDraft = ReturnType<typeof useOriginalDraft>
