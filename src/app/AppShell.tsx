import type { ReactNode } from 'react'
import { selectSidebar, useSettings } from '@/entities/settings'
import { ScreenBarProvider } from '@/shared/ui'
import { TooltipProvider } from '@/shared/ui/primitives/tooltip'
import { AppNav } from '@/widgets/app-nav'

/**
 * A screen with the main navigation beside it: a bar docked at the bottom on phones, a sidebar from
 * 1024px, open or collapsed to its icons. The screen takes all the width the navigation leaves, its
 * gutter growing with it. Its own bar, the screen's header, hides while the page is read downwards
 * and comes back on the way up.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const sidebar = useSettings(selectSidebar)
  return (
    <ScreenBarProvider>
      <TooltipProvider>
        <main
          data-sidebar={sidebar}
          className="px-gutter pt-safe pb-28 lg:pb-12 lg:pl-sidebar lg:data-[sidebar=collapsed]:pl-sidebar-collapsed"
        >
          {children}
        </main>
        <AppNav />
      </TooltipProvider>
    </ScreenBarProvider>
  )
}
