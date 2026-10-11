import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectSidebar, useSettings } from '@/entities/settings'
import { ScreenBarProvider } from '@/shared/ui'
import { TooltipProvider } from '@/shared/ui/primitives/tooltip'
import { AppNav } from '@/widgets/app-nav'

/**
 * A screen with the main navigation beside it: a bar docked at the bottom on phones, a sidebar from
 * 1024px, open or collapsed to its icons. The screen takes all the width the navigation leaves, its
 * gutter growing with it. Its own bar, the screen's header, hides while the page is read downwards
 * and comes back on the way up. The navigation comes first in the page, as the sidebar is drawn
 * first, after a link past it to the screen.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const sidebar = useSettings(selectSidebar)
  return (
    <ScreenBarProvider>
      <TooltipProvider>
        <a
          href="#content"
          className="sr-only z-50 rounded-lg bg-card px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-[calc(env(safe-area-inset-top)+0.5rem)] focus:left-4"
        >
          {t('skipToContent')}
        </a>
        <AppNav />
        <main
          id="content"
          tabIndex={-1}
          data-sidebar={sidebar}
          className="px-gutter pt-safe pb-28 outline-none print:p-0 landscape-phone:pb-8 landscape-phone:pl-rail lg:pb-12 lg:pl-sidebar lg:data-[sidebar=collapsed]:pl-sidebar-collapsed"
        >
          {children}
        </main>
      </TooltipProvider>
    </ScreenBarProvider>
  )
}
