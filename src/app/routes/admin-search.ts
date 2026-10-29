import type { AdminTab, AdminView } from '@/pages/admin'
import { routeSearch, type Raw } from './read-search'

// The Admin area: the tab shown. The list is the page's (typed against it): a search file imports
// types only, or the Admin chunk would load with the router.
const TABS = [
  'accounts',
  'groups',
  'switches',
  'reports',
  'errors',
  'activity',
] as const satisfies readonly AdminTab[]
// Every tab the page has is read: one left out here fails to compile.
const EVERY_TAB: readonly (typeof TABS)[number][] = [] as readonly AdminTab[]
void EVERY_TAB
const ADMIN_DEFAULTS: AdminView = { tab: 'accounts' }
const readAdminSearch = (raw: Raw): AdminView => ({
  tab: TABS.find((tab) => tab === raw.tab) ?? ADMIN_DEFAULTS.tab,
})
export const adminSearch = routeSearch(readAdminSearch, ADMIN_DEFAULTS)
