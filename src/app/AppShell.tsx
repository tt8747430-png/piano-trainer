import type { ReactNode } from 'react'
import { AppNav } from '@/widgets/app-nav'

/** A screen with the main navigation beside it: a bottom bar on phones, a left rail from 1024px. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pt-safe pb-28 lg:pb-8">{children}</main>
      <AppNav />
    </>
  )
}
