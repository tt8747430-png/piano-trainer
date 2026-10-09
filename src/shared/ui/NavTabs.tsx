import { createLink, type LinkComponent } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'

/**
 * One of a subject's pages: a router link drawn as a tab. Which page is shown is the page's to say
 * (`current`), not the router's: the router counts a link active on a child path or a looser search
 * (Build on Find, the first view under a search param), so the tab sets its own `aria-current` and
 * drops the router's mark and class.
 */
function TabAnchor({ current, ...props }: ComponentProps<'a'> & { current: boolean }) {
  return (
    <li className="flex">
      <a
        {...props}
        className="tab"
        aria-current={current ? 'page' : undefined}
        data-status={undefined}
      />
    </li>
  )
}

const TabLink = createLink(TabAnchor)

/** A tab of `NavTabs`: a router link (`to`, `search`, `replace`, …) and whether its page is shown. */
export const NavTab: LinkComponent<typeof TabAnchor> = (props) => <TabLink {...props} />

/**
 * The pages of one subject as a strip of tabs that are links: the tabs primitive's look, a
 * navigation's meaning (the page shown is `aria-current`), each tab its own page with its own URL.
 */
export function NavTabs({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav aria-label={label} className="-mx-gutter px-gutter">
      <ul className="tab-strip">{children}</ul>
    </nav>
  )
}
