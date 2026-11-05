import { Link } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { Avatar, TreeHeading, TreeItem, TreeList, TreeSwatch } from '@/shared/ui'
import {
  ADMIN_PICTURES,
  ADMIN_SECTIONS,
  SETTINGS_GROUPS,
  type SettingsPlace,
} from '../model/sections'

/**
 * Settings' sidebar on a laptop (R32, macOS System Settings' and Songs' tree): the account first,
 * then each group of pages under its heading, and for an administrator the Administration's
 * sections; each a tree row with its painted swatch, the page shown marked. It stands under the bar
 * and scrolls on its own (`sticky`, its own height and overflow), so the page beside it scrolls with
 * the window and never drags it along; the row shown is brought into its view.
 */
export function SettingsNav({ place }: { place: SettingsPlace }) {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const aside = useRef<HTMLElement>(null)
  const picture = state.kind === 'ready' ? state.profile.avatar : null
  const name = account ? account.name || account.email : ''
  const marked = (to: string) => place.kind === 'page' && place.to === to
  useLayoutEffect(() => {
    const pane = aside.current
    const current = pane?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!pane || !current) return
    const below = current.offsetTop + current.offsetHeight - (pane.scrollTop + pane.clientHeight)
    if (below > 0 || current.offsetTop < pane.scrollTop)
      pane.scrollTop = current.offsetTop - pane.clientHeight / 2
  }, [place])
  return (
    <aside
      ref={aside}
      aria-label={t('settings:title')}
      data-slot="settings-nav"
      className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain pb-4"
    >
      <TreeList>
        {account ? (
          <TreeItem
            picture={<Avatar name={name} picture={picture} size="tree" />}
            label={name}
            current={place.kind === 'account'}
            render={<Link to="/settings/account" />}
          />
        ) : (
          <TreeItem
            picture={<TreeSwatch icon={LogIn} paint="yellow" />}
            label={t('settings:account.signIn')}
            current={false}
            render={<Link to="/account/sign-in" />}
          />
        )}
      </TreeList>
      {SETTINGS_GROUPS.map((group) => (
        <nav key={group.title} aria-label={t(`settings:${group.title}`)}>
          <TreeHeading>{t(`settings:${group.title}`)}</TreeHeading>
          <TreeList>
            {group.pages.map((page) => (
              <TreeItem
                key={page.to}
                picture={<TreeSwatch icon={page.icon} paint={page.paint} />}
                label={t(`settings:${page.title}`)}
                current={marked(page.to)}
                render={<Link to={page.to} />}
              />
            ))}
          </TreeList>
        </nav>
      ))}
      {account?.role === 'admin' ? (
        <nav aria-label={t('admin:title')}>
          <TreeHeading>{t('admin:title')}</TreeHeading>
          <TreeList>
            {ADMIN_SECTIONS.map((section) => (
              <TreeItem
                key={section}
                picture={
                  <TreeSwatch
                    icon={ADMIN_PICTURES[section].icon}
                    paint={ADMIN_PICTURES[section].paint}
                  />
                }
                label={t(`admin:sections.${section}`)}
                current={place.kind === 'admin' && place.section === section}
                render={<Link to="/admin/$section" params={{ section }} />}
              />
            ))}
          </TreeList>
        </nav>
      ) : null}
    </aside>
  )
}
