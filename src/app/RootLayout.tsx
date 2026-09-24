import { Outlet } from '@tanstack/react-router'
import { AppNav } from '@/widgets/app-nav'

export function RootLayout() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-28 lg:pb-8">
        <Outlet />
      </main>
      <AppNav />
    </>
  )
}
