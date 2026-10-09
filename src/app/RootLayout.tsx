import { Outlet, useRouterState } from '@tanstack/react-router'
import { ShortcutsHelp } from '@/features/shortcuts-help'
import { UpdatePrompt } from './update-prompt/UpdatePrompt'

export function RootLayout() {
  // An update waits while the Player or the Check has the screen: it would cut a practice off.
  const fullScreen = useRouterState({
    select: (state) => state.matches.some((match) => match.staticData.fullScreen === true),
  })
  return (
    <ShortcutsHelp>
      <Outlet />
      <UpdatePrompt offer={!fullScreen} />
    </ShortcutsHelp>
  )
}
