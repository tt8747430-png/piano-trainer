import { Outlet } from '@tanstack/react-router'
import { UpdatePrompt } from './update-prompt/UpdatePrompt'

export function RootLayout() {
  return (
    <>
      <Outlet />
      <UpdatePrompt />
    </>
  )
}
