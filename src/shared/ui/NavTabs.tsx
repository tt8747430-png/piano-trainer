import { useRender } from '@base-ui/react/use-render'

export interface NavTab {
  readonly id: string
  readonly label: string
  /** Whether its page is the one shown. */
  readonly current: boolean
  /** The link (a router `Link`). */
  readonly render: useRender.RenderProp
}

function NavTabLink({ tab }: { tab: NavTab }) {
  return useRender({
    defaultTagName: 'a',
    render: tab.render,
    props: {
      className: 'tab',
      'aria-current': tab.current ? ('page' as const) : undefined,
      children: tab.label,
    },
  })
}

/**
 * The pages of one subject as a strip of tabs that are links: the tabs primitive's look, a
 * navigation's meaning (the page shown is `aria-current`), each tab its own page with its own URL.
 */
export function NavTabs({ label, tabs }: { label: string; tabs: readonly NavTab[] }) {
  return (
    <nav aria-label={label} className="-mx-gutter px-gutter">
      <ul className="tab-strip">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex">
            <NavTabLink tab={tab} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
