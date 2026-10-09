import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { inPopUp, isTyping, takesKey } from './guards'
import { createShortcutRegistry } from './registry'
import { ShortcutsContext } from './shortcuts-context'

/** A Mac's keyboard: Cmd where others have Ctrl, and the caps a Mac prints. */
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform)

/**
 * The computer's shortcuts: one listener over what the screens bind (`useShortcuts`). A key is left
 * alone while a field is typed in or a pop-up has it, when something already handled it, on
 * auto-repeat unless its shortcut repeats, and (Space, Enter) on a control the keyboard moved the
 * focus to: a control a pointer pressed keeps the focus but not the key.
 */
export function ShortcutsProvider({
  mac = isMac(),
  children,
}: {
  mac?: boolean
  children: ReactNode
}) {
  const [registry] = useState(createShortcutRegistry)

  useEffect(() => {
    // How the focus last moved: by the keyboard (Tab), or by a pointer.
    let focusByKeyboard = false
    const onPointerDown = () => {
      focusByKeyboard = false
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') focusByKeyboard = true
      if (event.defaultPrevented || event.isComposing) return
      if (isTyping(event.target) || inPopUp(event.target)) return
      const shortcut = registry.find(event, mac)
      if (!shortcut) return
      const presses = event.key === ' ' || event.key === 'Enter'
      if (presses && focusByKeyboard && takesKey(event.target)) return
      event.preventDefault()
      if (!event.repeat || shortcut.repeat) shortcut.run()
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [registry, mac])

  const shortcuts = useMemo(() => ({ registry, mac }), [registry, mac])
  return <ShortcutsContext value={shortcuts}>{children}</ShortcutsContext>
}
