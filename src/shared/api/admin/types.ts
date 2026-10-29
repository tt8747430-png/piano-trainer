import type { AccountRole } from '../auth'
import type { NetResult } from '../network'

/** An account as the admin sees it. */
export interface AdminAccount {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly role: AccountRole
  readonly joinedAt: string
  readonly lastSignInAt: string | null
}

export interface Group {
  readonly id: string
  readonly name: string
  /** Its members' account ids. */
  readonly members: readonly string[]
}

/** Who a feature switch turns a feature on for. */
export type SwitchState = 'everyone' | 'nobody' | 'groups'

export interface FeatureSwitch {
  readonly key: string
  readonly label: string
  readonly state: SwitchState
  /** The groups it is on for, when its state is `groups`. */
  readonly groups: readonly string[]
}

/** A report of a Public library song, with the song it is about. */
export interface Report {
  readonly itemId: string
  readonly itemTitle: string
  readonly authorId: string
  readonly authorName: string
  readonly hidden: boolean
  readonly reporterId: string
  readonly reason: string
  readonly note: string
  readonly reportedAt: string
}

/** One thing an admin did: when, what, to what. */
export interface LogEntry {
  readonly at: string
  readonly action: string
  readonly target: string
}

/**
 * The admin's tools (ADR 0116): accounts and their roles, groups, feature switches, the Public
 * library's reports, and the activity log. Every call's result is a value; every change is logged.
 */
export interface AdminPort {
  accounts(query: string): Promise<NetResult<readonly AdminAccount[]>>
  setRole(userId: string, role: AccountRole): Promise<NetResult<void>>
  groups(): Promise<NetResult<readonly Group[]>>
  createGroup(name: string): Promise<NetResult<Group>>
  deleteGroup(id: string): Promise<NetResult<void>>
  setMember(groupId: string, userId: string, member: boolean): Promise<NetResult<void>>
  switches(): Promise<NetResult<readonly FeatureSwitch[]>>
  saveSwitch(feature: FeatureSwitch): Promise<NetResult<void>>
  deleteSwitch(key: string): Promise<NetResult<void>>
  reports(): Promise<NetResult<readonly Report[]>>
  /** Hides a song from the Public library, or shows it again. */
  hide(itemId: string, hidden: boolean): Promise<NetResult<void>>
  /** Stops an author publishing. */
  block(userId: string): Promise<NetResult<void>>
  /** Lets a report go, dealt with. */
  dismiss(itemId: string, reporterId: string): Promise<NetResult<void>>
  activity(): Promise<NetResult<readonly LogEntry[]>>
}

/** The feature switches on for whoever is signed in (or no one). */
export interface FeaturesPort {
  mine(): Promise<NetResult<readonly string[]>>
}
