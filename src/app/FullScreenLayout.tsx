import { Outlet } from '@tanstack/react-router'

/** A screen on its own, without the main navigation: the Player. */
export function FullScreenLayout() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-safe pb-safe">
      <Outlet />
    </main>
  )
}
