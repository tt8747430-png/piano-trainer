import { useRef, type ReactNode } from 'react'
import { MIN_KEYS_PX } from '@/shared/ui'
import { useKeysHeight } from '../model/use-keys-height'
import { KeysDivider, type DividerEdge } from './KeysDivider'

/**
 * The keys' place at the screen's edge (R34, R36): the keys, or the hands at the keys, as tall as its
 * divider sets them (on the side facing the music), kept per size of screen, never over half the
 * screen. `children` draws what stands in it at that height, or at its own where none is set.
 */
export function KeysPlace({
  divider,
  children,
}: {
  readonly divider: DividerEdge
  readonly children: (height: number | undefined) => ReactNode
}) {
  const keysHeight = useKeysHeight()
  const box = useRef<HTMLDivElement>(null)
  const most = Math.max(MIN_KEYS_PX, Math.round(window.innerHeight / 2))
  const height =
    keysHeight.height === null
      ? undefined
      : Math.min(most, Math.max(MIN_KEYS_PX, keysHeight.height))
  const resize = (
    <KeysDivider
      edge={divider}
      height={height ?? null}
      least={MIN_KEYS_PX}
      most={most}
      measure={() => box.current?.getBoundingClientRect().height ?? MIN_KEYS_PX}
      onResize={keysHeight.set}
    />
  )
  return (
    <div className="flex flex-col">
      {divider === 'above' ? resize : null}
      <div ref={box}>{children(height)}</div>
      {divider === 'below' ? resize : null}
    </div>
  )
}
