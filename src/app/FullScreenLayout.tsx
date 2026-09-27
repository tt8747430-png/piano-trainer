import { Outlet } from '@tanstack/react-router'

/**
 * A screen on its own, without the main navigation: the Player and the Check. It is the viewport's
 * height, so a screen can share it out (the Player's keyboard takes what is left), and scrolls inside
 * when its content is taller.
 */
export function FullScreenLayout() {
  return (
    <main className="mx-auto flex h-dvh max-w-6xl flex-col overflow-y-auto px-4 pt-safe pb-safe lg:px-10">
      <Outlet />
    </main>
  )
}
