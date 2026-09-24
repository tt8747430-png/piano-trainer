import { Outlet } from '@tanstack/react-router'
import { AppNav } from '@/widgets/app-nav'
import { UpdatePrompt } from './providers/UpdatePrompt'

export function RootLayout() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pt-safe pb-28 lg:pb-8">
        <Outlet />
      </main>
      <AppNav />
      <UpdatePrompt />
    </>
  )
}
