import { useId, type ReactNode } from 'react'

/**
 * Why a control is greyed, said the one way (Needs MIDI input): the browser's tooltip, and to a
 * screen reader through a hidden note the control is described by; never a line under it. `props`
 * go on the control, `note` inside it. Nothing while it is enabled or has no reason.
 */
export function useDisabledReason(
  disabled: boolean,
  reason: string | undefined,
): { props: { title?: string; 'aria-describedby'?: string }; note: ReactNode } {
  const id = useId()
  const why = disabled ? reason : undefined
  if (!why) return { props: {}, note: null }
  return {
    props: { title: why, 'aria-describedby': id },
    note: (
      <span id={id} hidden>
        {why}
      </span>
    ),
  }
}
