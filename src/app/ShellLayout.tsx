import { Outlet } from '@tanstack/react-router'
import { AppShell } from './AppShell'

/** The layout of every screen reached from the main navigation. */
export function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
