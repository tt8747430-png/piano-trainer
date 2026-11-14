import { useCallback, useEffect, useRef } from 'react'
import type { PieceId } from '@/entities/piece'
import { useProgressStoreApi, withSongStretch } from '@/entities/progress'

/** A stretch of a song being played, until it stops. */
interface Stretch {
  readonly since: number
  readonly played: Set<number>
  bar: number
}

/**
 * Keeps a song's place as the Player plays it (canvas 125): each start counted, each bar the
 * transport moves on from played through, and where it stops the bar Continue opens on; a stop on
 * its last bar plays that through too and opens it from the start next time. Written when it stops
 * and when the screen closes. `bar` is the bar sounding, as written, from 0.
 */
export function useSongPlayRecord(
  pieceId: PieceId,
  playing: boolean,
  bar: number,
  lastBar: number,
): void {
  const store = useProgressStoreApi()
  const stretch = useRef<Stretch | null>(null)
  const write = useCallback(
    (at: number) => {
      const now = stretch.current
      if (!now) return
      stretch.current = null
      const end = at >= lastBar
      if (end) now.played.add(at)
      const state = store.getState()
      const songs = withSongStretch(state.songs, pieceId, {
        played: [...now.played],
        at: end ? 0 : at,
        started: true,
        seconds: (Date.now() - now.since) / 1000,
        bars: lastBar + 1,
      })
      if (songs !== state.songs) store.setState({ songs })
    },
    [store, pieceId, lastBar],
  )
  useEffect(() => {
    const now = stretch.current
    if (!playing) {
      if (now) write(bar)
      return
    }
    if (!now) stretch.current = { since: Date.now(), played: new Set(), bar }
    else if (bar !== now.bar) {
      now.played.add(now.bar)
      now.bar = bar
    }
  }, [playing, bar, write])
  useEffect(
    () => () => {
      const now = stretch.current
      if (now) write(now.bar)
    },
    [write],
  )
}
