import { Outlet } from '@tanstack/react-router'
import { AppShell } from './AppShell'
import { SettingsDialogHost } from './settings-dialog/SettingsDialogHost'

/**
 * The layout of every screen reached from the main navigation; on a laptop, Settings opens over the
 * screen as its dialog (`SettingsDialogHost`).
 */
export function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
      <SettingsDialogHost />
    </AppShell>
  )
}
