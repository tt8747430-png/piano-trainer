import type { AccountRole } from '../auth'
import { netResult } from '../network'
import type {
  AdminAccount,
  AdminPort,
  ErrorEntry,
  FeaturesPort,
  FeatureSwitch,
  Group,
  LogEntry,
  Report,
} from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 400 })

/**
 * The admin's tools in memory for tests, behaving as the server does: `accounts`, `reports` to
 * start with; `online` the device's connection; what it was told is kept, and logged.
 */
export function createFakeAdmin({
  accounts = [],
  reports = [],
  errors = [],
  online = () => true,
  self = '',
}: {
  accounts?: readonly AdminAccount[]
  reports?: readonly Report[]
  errors?: readonly ErrorEntry[]
  online?: () => boolean
  /** The admin's own account id: they cannot take their own role away. */
  self?: string
} = {}): AdminPort & { readonly log: readonly LogEntry[]; readonly blocked: ReadonlySet<string> } {
  const people = new Map(accounts.map((account) => [account.id, account]))
  const groups = new Map<string, Group>()
  const switches = new Map<string, FeatureSwitch>()
  let held = [...reports]
  const blocked = new Set<string>()
  const log: LogEntry[] = []
  let next = 1
  const ask = <T>(run: () => Promise<T>) => netResult(run, { online })
  const note = (action: string, target: string) =>
    void log.unshift({
      at: new Date(Date.UTC(2026, 9, 29, 12, log.length)).toISOString(),
      action,
      target,
    })
  return {
    log,
    blocked,
    accounts: (query) =>
      ask(async () =>
        [...people.values()].filter((account) =>
          `${account.email} ${account.name}`.toLowerCase().includes(query.trim().toLowerCase()),
        ),
      ),
    setRole: (userId, role: AccountRole) =>
      ask(async () => {
        const account = people.get(userId)
        if (!account) throw refused('not_found')
        if (userId === self && role !== 'admin')
          throw refused('An admin cannot take away their own role')
        people.set(userId, { ...account, role })
        note('set-role', userId)
      }),
    groups: () => ask(async () => [...groups.values()]),
    createGroup: (name) =>
      ask(async () => {
        if ([...groups.values()].some((group) => group.name === name)) throw refused('duplicate')
        const group: Group = { id: `group-${next++}`, name, members: [] }
        groups.set(group.id, group)
        note('create-group', name)
        return group
      }),
    deleteGroup: (id) =>
      ask(async () => {
        groups.delete(id)
        note('delete-group', id)
      }),
    setMember: (groupId, userId, member) =>
      ask(async () => {
        const group = groups.get(groupId)
        if (!group) throw refused('not_found')
        const others = group.members.filter((each) => each !== userId)
        groups.set(groupId, { ...group, members: member ? [...others, userId] : others })
        note(member ? 'add-member' : 'remove-member', `${groupId} ${userId}`)
      }),
    switches: () => ask(async () => [...switches.values()]),
    saveSwitch: (feature) =>
      ask(async () => {
        switches.set(feature.key, feature)
        note('save-switch', feature.key)
      }),
    deleteSwitch: (key) =>
      ask(async () => {
        switches.delete(key)
        note('delete-switch', key)
      }),
    reports: () => ask(async () => held),
    hide: (itemId, hidden) =>
      ask(async () => {
        held = held.map((report) => (report.itemId === itemId ? { ...report, hidden } : report))
        note(hidden ? 'hide' : 'show', itemId)
      }),
    block: (userId) =>
      ask(async () => {
        blocked.add(userId)
        note('block', userId)
      }),
    dismiss: (itemId, reporterId) =>
      ask(async () => {
        held = held.filter(
          (report) => !(report.itemId === itemId && report.reporterId === reporterId),
        )
        note('dismiss', itemId)
      }),
    activity: () => ask(async () => log),
    errors: () => ask(async () => errors),
  }
}

/** Feature switches for tests: these keys are on. */
export const createFakeFeatures = (on: readonly string[] = []): FeaturesPort => ({
  mine: async () => ({ ok: true, value: on }),
})
