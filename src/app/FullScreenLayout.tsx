import { Outlet } from '@tanstack/react-router'

/**
 * A screen on its own, without the main navigation: the Player, the score editor and the Check. It is
 * the viewport's height and width, so a screen can share them out, and scrolls inside when its
 * content is taller.
 */
export function FullScreenLayout() {
  return (
    <main className="flex h-dvh flex-col overflow-y-auto px-gutter pt-safe pb-safe">
      <Outlet />
    </main>
  )
}
