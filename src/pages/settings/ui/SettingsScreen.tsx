import type { ReactNode } from 'react'
import { BackButton, ScreenHeader } from '@/shared/ui'

/** A page of Settings: its title with Back to Settings, its groups in two columns from a laptop's width. */
export function SettingsScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={title} back={<BackButton fallback={{ to: '/settings' }} />} />
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        {children}
      </div>
    </div>
  )
}
