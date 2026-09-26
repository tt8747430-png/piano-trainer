import type { ReactNode } from 'react'
import { AppNav } from '@/widgets/app-nav'

/**
 * A screen with the main navigation beside it: a bar docked at the bottom on phones, a sidebar from
 * 1024px, where the screen takes the width it is given, up to 72rem, for its columns.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="px-4 pt-safe pb-28 lg:pb-12 lg:pl-60">
        <div className="mx-auto w-full max-w-3xl lg:max-w-6xl lg:px-10">{children}</div>
      </main>
      <AppNav />
    </>
  )
}
