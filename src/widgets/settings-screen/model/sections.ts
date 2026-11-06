import {
  Bug,
  Cable,
  ChartColumn,
  FileText,
  Flag,
  HardDrive,
  History,
  Info,
  LayoutGrid,
  LifeBuoy,
  MessageSquareWarning,
  MessagesSquare,
  MoveHorizontal,
  Piano,
  Settings2,
  ShieldUser,
  SquareCheck,
  ToggleRight,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import type { Paint } from '@/shared/ui'

/** One of Settings' own pages: where it is, its name, its picture, and the paths that are its own. */
export interface SettingsPageEntry {
  readonly to:
    | '/settings/general'
    | '/settings/storage'
    | '/settings/on-screen-piano'
    | '/settings/connect-piano'
    | '/settings/select-toolbar'
    | '/settings/swipe-actions'
    | '/settings/how-to-use'
    | '/settings/feedback'
    | '/settings/about'
  readonly title:
    | 'pages.general'
    | 'pages.storage'
    | 'pages.onScreenPiano'
    | 'pages.connectPiano'
    | 'pages.selectionToolbar'
    | 'pages.swipeActions'
    | 'pages.guide'
    | 'pages.feedback'
    | 'pages.about'
  readonly icon: LucideIcon
  readonly paint: Paint
  /** Its pages under it, marked with it (the MIDI log under MIDI devices, the legal pages under About). */
  readonly under?: readonly string[]
}

/** A group of Settings' pages under its heading. */
export interface SettingsGroupEntry {
  readonly title:
    'groups.general.label' | 'groups.piano.label' | 'groups.library.label' | 'groups.support.label'
  readonly pages: readonly SettingsPageEntry[]
}

/**
 * Settings' pages, in their groups and order (R32): one model for the phone's list and the laptop's
 * sidebar. Only what concerns the whole app: a screen's own settings are behind its gear.
 */
export const SETTINGS_GROUPS: readonly SettingsGroupEntry[] = [
  {
    title: 'groups.general.label',
    pages: [
      { to: '/settings/general', title: 'pages.general', icon: Settings2, paint: 'sky' },
      { to: '/settings/storage', title: 'pages.storage', icon: HardDrive, paint: 'grass' },
    ],
  },
  {
    title: 'groups.piano.label',
    pages: [
      {
        to: '/settings/on-screen-piano',
        title: 'pages.onScreenPiano',
        icon: Piano,
        paint: 'lilac',
      },
      {
        to: '/settings/connect-piano',
        title: 'pages.connectPiano',
        icon: Cable,
        paint: 'sky',
        under: ['/settings/connect-piano/'],
      },
    ],
  },
  {
    title: 'groups.library.label',
    pages: [
      {
        to: '/settings/select-toolbar',
        title: 'pages.selectionToolbar',
        icon: SquareCheck,
        paint: 'sky',
      },
      {
        to: '/settings/swipe-actions',
        title: 'pages.swipeActions',
        icon: MoveHorizontal,
        paint: 'sand',
      },
    ],
  },
  {
    title: 'groups.support.label',
    pages: [
      { to: '/settings/how-to-use', title: 'pages.guide', icon: LifeBuoy, paint: 'sky' },
      {
        to: '/settings/feedback',
        title: 'pages.feedback',
        icon: MessageSquareWarning,
        paint: 'lilac',
      },
      {
        to: '/settings/about',
        title: 'pages.about',
        icon: Info,
        paint: 'sand',
        under: ['/legal/'],
      },
    ],
  },
]

/** The Administration's sections, an administrator's alone (ADR 0116), in their order. */
export const ADMIN_SECTIONS = [
  'overview',
  'accounts',
  'groups',
  'flags',
  'reports',
  'feedback',
  'errors',
  'activity',
  'drafts',
  'components',
] as const
export type AdminSection = (typeof ADMIN_SECTIONS)[number]

/** Whether a path's segment names one of the Administration's sections. */
export const isAdminSection = (value: string): value is AdminSection =>
  (ADMIN_SECTIONS as readonly string[]).includes(value)

/** Each section's picture: the people and the content first, then the logs and the tools. */
export const ADMIN_PICTURES: Readonly<Record<AdminSection, { icon: LucideIcon; paint: Paint }>> = {
  overview: { icon: ChartColumn, paint: 'sky' },
  accounts: { icon: UsersRound, paint: 'grass' },
  groups: { icon: UsersRound, paint: 'yellow' },
  flags: { icon: ToggleRight, paint: 'lilac' },
  reports: { icon: Flag, paint: 'sand' },
  feedback: { icon: MessagesSquare, paint: 'sky' },
  errors: { icon: Bug, paint: 'sand' },
  activity: { icon: History, paint: 'grass' },
  drafts: { icon: FileText, paint: 'yellow' },
  components: { icon: LayoutGrid, paint: 'lilac' },
}

/** The Administration's own row in the phone's list. */
export const ADMIN_ENTRY = { icon: ShieldUser, paint: 'lilac' } as const satisfies {
  icon: LucideIcon
  paint: Paint
}

/** What Settings has open: one of its pages, the account, an Administration section, or none. */
export type SettingsPlace =
  | { readonly kind: 'page'; readonly to: SettingsPageEntry['to'] }
  | { readonly kind: 'account' }
  | { readonly kind: 'admin'; readonly section: AdminSection | null }

/**
 * The Settings page a path belongs to, marked in its list (R32): a page or one under it, the account
 * and its pages, an Administration section (or the Administration's list); null for a page Settings
 * does not list (a Practice page's Settings, opened from its gear).
 */
export function settingsPlaceOf(path: string): SettingsPlace | null {
  if (path === '/settings/account' || path.startsWith('/settings/account/'))
    return { kind: 'account' }
  if (path === '/settings/privacy') return { kind: 'account' }
  if (path === '/admin' || path === '/admin/') return { kind: 'admin', section: null }
  if (path.startsWith('/admin/')) {
    const section = path.slice('/admin/'.length).split('/')[0] ?? ''
    return isAdminSection(section) ? { kind: 'admin', section } : null
  }
  for (const group of SETTINGS_GROUPS)
    for (const page of group.pages)
      if (path === page.to || page.under?.some((prefix) => path.startsWith(prefix)))
        return { kind: 'page', to: page.to }
  return null
}
