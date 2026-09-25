import type { ReactNode } from 'react'
import { AppNav } from '@/widgets/app-nav'

/** A screen with the main navigation beside it: a floating tab bar on phones, a left rail from 1024px. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="mx-auto max-w-2xl px-4 pt-safe pb-32 lg:pb-10">{children}</main>
      <AppNav />
    </>
  )
}
