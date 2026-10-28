/**
 * A learner's document as the sync carries it (ADR 0116): its data, the device's clock of its last
 * change, and whether it was deleted. The server keeps the same in its mirror tables.
 */
export interface SyncDocument {
  readonly id: string
  readonly data: Readonly<Record<string, unknown>>
  /** When it last changed, an ISO time from the device that changed it. */
  readonly updatedAt: string
  readonly deleted: boolean
}

export interface MergeRules {
  /** A field both sides changed: how to settle it, else the newer side has it. */
  readonly both?: Readonly<
    Record<string, (mine: unknown, theirs: unknown, base: unknown) => unknown>
  >
}

function sameValue(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every(
    (key) =>
      Object.hasOwn(b, key) &&
      sameValue((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
  )
}

/**
 * Two devices' copies of one document merged a field at a time against the copy both started from
 * (memory-palaces' ADR 0005): a field only one side changed takes that side; one both changed goes
 * to its rule, else to the newer clock. Neither whole copy wins over the other's work. A deletion
 * stands where the other side changed nothing; where it meets a change, the changed copy is kept
 * and the two `clash`, for the learner to settle. The merged clock is the later one.
 */
export function mergeDocuments(
  mine: SyncDocument,
  theirs: SyncDocument,
  base: SyncDocument,
  { both = {} }: MergeRules = {},
): { document: SyncDocument; clash: boolean } {
  const updatedAt = mine.updatedAt >= theirs.updatedAt ? mine.updatedAt : theirs.updatedAt
  const changed = (side: SyncDocument) => !sameValue(side.data, base.data)
  if (mine.deleted !== theirs.deleted) {
    const [gone, kept] = mine.deleted ? [mine, theirs] : [theirs, mine]
    return changed(kept)
      ? { document: { ...kept, updatedAt }, clash: true }
      : { document: { ...gone, updatedAt }, clash: false }
  }
  const newer = mine.updatedAt >= theirs.updatedAt ? mine : theirs
  const data: Record<string, unknown> = {}
  for (const key of new Set([...Object.keys(mine.data), ...Object.keys(theirs.data)])) {
    const mineChanged = !sameValue(mine.data[key], base.data[key])
    const theirsChanged = !sameValue(theirs.data[key], base.data[key])
    const rule =
      mineChanged && theirsChanged
        ? (both[key] ?? itemRule(mine.data[key], theirs.data[key]))
        : undefined
    if (rule) {
      data[key] = rule(mine.data[key], theirs.data[key], base.data[key])
      continue
    }
    const from = mineChanged && theirsChanged ? newer : mineChanged ? mine : theirs
    if (Object.hasOwn(from.data, key)) data[key] = from.data[key]
  }
  return { document: { id: mine.id, data, updatedAt, deleted: mine.deleted }, clash: false }
}

const recordOf = (value: unknown): Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}

/**
 * A rule for a field that is a record of items by key (versions by song, records by trainer): each
 * key merged on its own against the base, an item one side removed gone unless the other changed it.
 */
export function byKey(mine: unknown, theirs: unknown, base: unknown): Record<string, unknown> {
  const [m, t, b] = [recordOf(mine), recordOf(theirs), recordOf(base)]
  const merged: Record<string, unknown> = {}
  for (const key of new Set([...Object.keys(m), ...Object.keys(t)])) {
    const mineChanged = !sameValue(m[key], b[key])
    const theirsChanged = !sameValue(t[key], b[key])
    const from = mineChanged ? m : theirsChanged ? t : m
    if (Object.hasOwn(from, key)) merged[key] = from[key]
    else if (mineChanged && theirsChanged && Object.hasOwn(t, key)) merged[key] = t[key]
  }
  return merged
}

/**
 * A rule for a field that is a list of items with an `id` (own songs, takes, patterns, folders): the
 * list read as a record by id, merged by `byKey`, in the order the items come on this device, the
 * other device's new ones after.
 */
export function byId(mine: unknown, theirs: unknown, base: unknown): unknown[] {
  const keyed = (list: unknown) =>
    Object.fromEntries(
      (Array.isArray(list) ? list : []).flatMap((item: unknown) => {
        const id = recordOf(item).id
        return typeof id === 'string' ? [[id, item]] : []
      }),
    )
  const merged = byKey(keyed(mine), keyed(theirs), keyed(base))
  const order = [...Object.keys(keyed(mine)), ...Object.keys(keyed(theirs))]
  return [...new Set(order)].flatMap((id) => (Object.hasOwn(merged, id) ? [merged[id]] : []))
}

const isRecord = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const hasIds = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((item) => isRecord(item) && typeof (item as Record<string, unknown>).id === 'string')

/**
 * The rule a field both sides changed takes where none is given: a record merges key by key, a list
 * of items with ids item by item, anything else goes to the newer side.
 */
function itemRule(mine: unknown, theirs: unknown): MergeRule | undefined {
  if (isRecord(mine) && isRecord(theirs)) return byKey
  const lists = Array.isArray(mine) && Array.isArray(theirs)
  return lists && (hasIds(mine) || hasIds(theirs)) ? byId : undefined
}
