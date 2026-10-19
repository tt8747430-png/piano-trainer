import { Outlet } from '@tanstack/react-router'

/** The full screen's scroll, as the router keeps it. */
export const FULL_SCREEN_SCROLL = 'full-screen'

/**
 * A screen on its own, without the main navigation: the Player, the score editor and the Check. It is
 * the viewport's height and width, so a screen can share them out, and scrolls inside when its
 * content is taller: the router keeps that scroll by its id, so Back returns to where it was, and a
 * new screen starts at its top. On a phone on its side its foot keeps a margin off the screen's
 * edge, where the Player's lowest notes would otherwise touch it.
 */
export function FullScreenLayout() {
  return (
    <main
      data-scroll-restoration-id={FULL_SCREEN_SCROLL}
      className="flex h-dvh flex-col overflow-y-auto px-gutter-safe pt-safe pb-safe landscape-phone:pb-safe-2"
    >
      <Outlet />
    </main>
  )
}
