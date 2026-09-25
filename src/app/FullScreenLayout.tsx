import { Outlet } from '@tanstack/react-router'

/** A screen on its own, without the main navigation: the Player and the Check. */
export function FullScreenLayout() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pt-safe pb-safe landscape-phone:h-dvh landscape-phone:overflow-y-auto">
      <Outlet />
    </main>
  )
}
