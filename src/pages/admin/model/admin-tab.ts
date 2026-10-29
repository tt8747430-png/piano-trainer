/** The Admin area's views, in its tabs' order. */
export const ADMIN_TABS = [
  'accounts',
  'groups',
  'switches',
  'reports',
  'errors',
  'activity',
] as const
export type AdminTab = (typeof ADMIN_TABS)[number]

/** The Admin area's URL: the view shown. */
export interface AdminView {
  readonly tab: AdminTab
}
