import { createLink, type LinkComponent } from '@tanstack/react-router'
import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react'

/**
 * One of a subject's pages: a router link drawn as a tab. Which page is shown is the page's to say
 * (`current`), not the router's: the router counts a link active on a child path or a looser search
 * (Build on Find, the first view under a search param), so the tab sets its own `aria-current` and
 * drops the router's mark and class. The page's tab is scrolled into the strip's view, where the strip
 * is wider than the screen.
 */
function TabAnchor({ current, ref, ...props }: ComponentProps<'a'> & { current: boolean }) {
  const tab = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const strip = tab.current?.closest('ul')
    if (!current || !tab.current || !strip) return
    const { offsetLeft, offsetWidth } = tab.current
    if (
      offsetLeft < strip.scrollLeft ||
      offsetLeft + offsetWidth > strip.scrollLeft + strip.clientWidth
    )
      strip.scrollLeft = offsetLeft - (strip.clientWidth - offsetWidth) / 2
  }, [current])
  return (
    <li className="flex">
      <a
        {...props}
        ref={(element) => {
          tab.current = element
          if (typeof ref === 'function') return ref(element)
          if (ref) ref.current = element
        }}
        // The page shown is already open: its tab does not open it afresh, its choices dropped.
        onClick={current ? (event) => event.preventDefault() : props.onClick}
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
