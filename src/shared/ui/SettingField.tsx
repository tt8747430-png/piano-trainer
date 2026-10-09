import type { ReactNode } from 'react'

/** One choice in Settings: its name as a row's text (the group around it has the heading), its control under it. */
export function SettingField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-foreground">{label}</span>
      {children}
    </div>
  )
}
