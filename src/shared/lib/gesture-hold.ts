import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type ReleaseReason = 'claimed' | 'outside'

export const SWIPE_SURFACE_ATTR = 'data-swipe-surface'

interface Holder {
  id: symbol
  node: HTMLElement | null
  release: (reason: ReleaseReason) => void
}

let holder: Holder | null = null
let listening = false

function onPointerDownCapture(event: PointerEvent) {
  const current = holder
  if (!current?.node) return
  const target = event.target as Element | null
  if (target && current.node.contains(target)) return
  releaseHolder(current, target?.closest(`[${SWIPE_SURFACE_ATTR}]`) ? 'claimed' : 'outside')
}

function listen() {
  if (listening || !holder?.node) return
  document.addEventListener('pointerdown', onPointerDownCapture, true)
  listening = true
}

function unlisten() {
  if (!listening) return
  document.removeEventListener('pointerdown', onPointerDownCapture, true)
  listening = false
}

function releaseHolder(current: Holder, reason: ReleaseReason) {
  if (holder !== current) return
  holder = null
  unlisten()
  current.release(reason)
}

export function holdGesture(
  id: symbol,
  node: HTMLElement | null,
  release: (reason: ReleaseReason) => void,
) {
  if (holder && holder.id !== id) releaseHolder(holder, 'claimed')
  holder = { id, node, release }
  listen()
}

export function dropGesture(id: symbol) {
  if (holder?.id !== id) return
  holder = null
  unlisten()
}

export interface SurfaceProps {
  ref: (node: HTMLElement | null) => void
  [SWIPE_SURFACE_ATTR]: ''
}

export interface GestureHold {
  surface: SurfaceProps
  hold: () => void
  drop: () => void
}

export function useGestureHold(onRelease: (reason: ReleaseReason) => void): GestureHold {
  const [token] = useState(() => Symbol('gesture-hold'))

  const node = useRef<HTMLElement | null>(null)
  const latest = useRef(onRelease)
  useEffect(() => {
    latest.current = onRelease
  })

  useEffect(() => () => dropGesture(token), [token])

  const hold = useCallback(() => {
    holdGesture(token, node.current, (reason) => latest.current(reason))
  }, [token])
  const drop = useCallback(() => dropGesture(token), [token])

  const surface = useMemo<SurfaceProps>(
    () => ({
      ref: (el: HTMLElement | null) => {
        node.current = el
      },
      [SWIPE_SURFACE_ATTR]: '',
    }),
    [],
  )

  return { surface, hold, drop }
}
