import type { ReactNode } from 'react'

/**
 * The one compact row of pickers at the top of an explorer (A5, Ultimate Piano's toolbar, Chord
 * Trainer's "C ⌃⌄ · Major ⌃⌄"): `Root C ⌃⌄ · Quality Major ⌃⌄ · Voicing Close ⌃⌄`, each a value with
 * ⌃⌄, wrapping onto a second line on a narrow phone rather than scrolling or fading.
 */
export function PickerRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 flex-wrap items-center gap-2">
      {children}
    </div>
  )
}
