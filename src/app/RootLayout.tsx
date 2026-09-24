import { Outlet } from '@tanstack/react-router'
import { UpdatePrompt } from './providers/UpdatePrompt'

export function RootLayout() {
  return (
    <>
      <Outlet />
      <UpdatePrompt />
    </>
  )
}
