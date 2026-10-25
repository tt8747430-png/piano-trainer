import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * Settings' rows, one under the other as an app's settings list has them (ADR 0096): each choice a
 * compact row (a `SettingField`, a `SwitchRow`, its name in the body's size), a hairline between
 * them (a switch row's own line drawn as one), nothing over the first or under the last.
 */
export function SettingRows({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col divide-y divide-hairline [&>*]:py-3 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0 [&>[data-slot=switch-row]]:border-hairline [&>[data-slot=switch-row]]:text-base [&>[data-slot=switch-row]:last-child]:border-b-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
