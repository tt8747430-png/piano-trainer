import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { ContentKind } from '@/shared/api/content'
import type { KeptVersion } from '@/shared/api/content-editing'
import type { NetFailed, NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'

/** How long an edit rests before it is saved to the draft. */
export const DRAFT_SAVE_DELAY_MS = 800

/** Where an item's draft stands as its editor opens: read, or not to be read. */
export type DraftLoad<T> =
  | { readonly state: 'loading' }
  | { readonly state: 'failed'; readonly reason: NetFailed['reason'] }
  | { readonly state: 'ready'; readonly value: T }

/** The last save of the draft: none yet, on its way, kept, or not kept (and why). */
export type DraftSaved = 'idle' | 'saving' | 'saved' | 'offline' | 'failed'

/** A publish refused before it is sent: the draft does not read as the item. */
export type Unreadable = { readonly ok: false; readonly reason: 'unreadable' }

/** How an item of one kind is drafted: read from a body, written as one, and as the device has it. */
export interface DraftSpec<T> {
  readonly kind: ContentKind
  /** The item's id in the database. */
  readonly id: string
  /** A body read as the item, words missing or not, or nothing where it does not read. */
  read(body: unknown): T | undefined
  /** Whether the item, as written, may be published (every text written); any that reads where not given. */
  publishable?(value: T): boolean
  /** The item as the database holds it: its body and what lists show of it. */
  write(value: T): { readonly body: unknown; readonly meta: Readonly<Record<string, unknown>> }
  /** The item as this device has it: where the server has none that reads. */
  readonly fallback: T
}

/**
 * An editor's draft of a built-in item (ADR 0116, round 6): opened on the draft, else on the item as
 * published now, else as this device has it; each edit saved to the draft once the editor rests;
 * published (once it reads as the item), discarded, or a kept version restored.
 */
export function useContentDraft<T>(spec: DraftSpec<T>) {
  const { kind, id, read, write, fallback, publishable } = spec
  const editing = useContentEditing()
  const [load, setLoad] = useState<DraftLoad<T>>({ state: 'loading' })
  const [saved, setSaved] = useState<DraftSaved>('idle')
  const [drafted, setDrafted] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const pending = useRef<{ value: T; timer: number } | null>(null)
  const last = useRef<{ value: T } | null>(null)

  useEffect(() => {
    let current = true
    void (async () => {
      const draft = await editing.draft(kind, id)
      if (!current) return
      if (!draft.ok) return setLoad({ state: 'failed', reason: draft.reason })
      const fromDraft = draft.value ? read(draft.value.body) : undefined
      if (fromDraft !== undefined) {
        setDrafted(true)
        return setLoad({ state: 'ready', value: fromDraft })
      }
      const published = await editing.published(kind, id)
      if (!current) return
      const fromServer = published.ok ? read(published.value) : undefined
      setLoad({ state: 'ready', value: fromServer ?? fallback })
    })()
    return () => {
      current = false
    }
  }, [editing, kind, id, read, fallback, attempt])

  const store = useCallback(
    async (value: T) => {
      setSaved('saving')
      const result = await editing.saveDraft(kind, id, write(value))
      if (result.ok) {
        setDrafted(true)
        setSaved('saved')
      } else setSaved(result.reason === 'offline' ? 'offline' : 'failed')
      return result
    },
    [editing, kind, id, write],
  )

  /** Saves what is waiting now, rather than once the editor rests. */
  const flush = useCallback(async (): Promise<NetResult<void> | null> => {
    const waiting = pending.current
    if (!waiting) return null
    window.clearTimeout(waiting.timer)
    pending.current = null
    return store(waiting.value)
  }, [store])

  const save = useCallback(
    (value: T) => {
      last.current = { value }
      if (pending.current) window.clearTimeout(pending.current.timer)
      pending.current = {
        value,
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
    const value = last.current?.value ?? (load.state === 'ready' ? load.value : undefined)
    if (value !== undefined) {
      const written = read(write(value).body)
      if (written === undefined || (publishable && !publishable(written)))
        return { ok: false, reason: 'unreadable' }
    }
    const result = await editing.publish(kind, id)
    if (result.ok) setDrafted(false)
    return result
  }, [editing, flush, load, kind, id, read, write, publishable])

  const discard = useCallback(async (): Promise<NetResult<void>> => {
    if (pending.current) window.clearTimeout(pending.current.timer)
    pending.current = null
    const result = await editing.discardDraft(kind, id)
    if (result.ok) setDrafted(false)
    return result
  }, [editing, kind, id])

  const versions = useCallback(
    (): Promise<NetResult<readonly KeptVersion[]>> => editing.versions(kind, id),
    [editing, kind, id],
  )
  const restore = useCallback(
    (version: string): Promise<NetResult<void>> => editing.restore(kind, id, version),
    [editing, kind, id],
  )

  return {
    load,
    saved,
    drafted,
    save,
    flush,
    publish,
    discard,
    versions,
    restore,
    /** How many times it has opened: the editor opens afresh on each. */
    opened: attempt,
    /** Opens the draft again: after a failure, or once the item's published copy changed. */
    reopen: () => {
      setLoad({ state: 'loading' })
      setSaved('idle')
      setDrafted(false)
      last.current = null
      setAttempt((count) => count + 1)
    },
  }
}

/** An item's draft as its editor drives it, whatever its kind. */
export type ContentDraft<T = unknown> = ReturnType<typeof useContentDraft<T>>
