import { useEffect } from 'react'
import { useServices } from '@/shared/lib/services'
import { takesKey } from '@/shared/lib/shortcuts'

/**
 * Space holds the sustain while it is held (spec 2026-10-09 §2.3), where Space has no other job: not
 * in a field or on a focused control, with no modifier. Its auto-repeat scrolls nothing; letting go,
 * the window losing the focus, the hook switched off or the screen gone lift the pedal it put down.
 */
export function useSpacePedal({ enabled }: { enabled: boolean }): void {
  const { audio } = useServices()
  useEffect(() => {
    if (!enabled) return
    let holding = false
    const lift = () => {
      if (!holding) return
      holding = false
      audio.pedal('sustain', false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      if (holding) {
        event.preventDefault()
        return
      }
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
      if (takesKey(event.target)) return
      event.preventDefault()
      holding = true
      audio.pedal('sustain', true)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') lift()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', lift)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', lift)
      lift()
    }
  }, [enabled, audio])
}
