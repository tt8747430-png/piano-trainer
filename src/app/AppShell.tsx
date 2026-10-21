import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectFloating, selectSidebar, useSettings } from '@/entities/settings'
import { FloatingHost, ScreenBarProvider } from '@/shared/ui'
import { TooltipProvider } from '@/shared/ui/primitives/tooltip'
import { AppNav } from '@/widgets/app-nav'

/**
 * A screen with the main navigation beside it: a bar docked at the bottom on phones, a sidebar from
 * 1024px, open or collapsed to its icons. The screen takes all the width the navigation leaves, its
 * gutter growing with it. Its own bar, the screen's header, hides while the page is read downwards
 * and comes back on the way up. The navigation comes first in the page, as the sidebar is drawn
 * first, after a link past it to the screen. The screen's floating actions stand in one column at its
 * foot, where the learner chose, or at its side over keys docked on a wide screen; the screen pads
 * clear of the tab bar, the docked keys and the actions wherever they stand.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const sidebar = useSettings(selectSidebar)
  const floating = useSettings(selectFloating)
  const screen = useRouterState({ select: (state) => state.location.pathname })
  return (
    <ScreenBarProvider>
      <TooltipProvider>
        <a
          href="#content"
          // Focus moves to the content without a history entry of its own: Back still goes back.
          onClick={(event) => {
            event.preventDefault()
            document.getElementById('content')?.focus()
          }}
          className="sr-only z-50 rounded-lg bg-card px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-[calc(env(safe-area-inset-top)+0.5rem)] focus:left-4"
        >
          {t('skipToContent')}
        </a>
        <AppNav />
        <main
          id="content"
          tabIndex={-1}
          data-sidebar={sidebar}
          className="group/main pt-safe pr-floating pb-foot-6 pl-(--gutter) outline-none print:p-0 landscape-phone:pb-foot-4 landscape-phone:pl-rail lg:pb-foot-12 lg:pl-sidebar lg:data-[sidebar=collapsed]:pl-sidebar-collapsed"
        >
          <FloatingHost place={floating.place} labels={floating.labels} screen={screen}>
            {children}
          </FloatingHost>
        </main>
      </TooltipProvider>
    </ScreenBarProvider>
  )
}
