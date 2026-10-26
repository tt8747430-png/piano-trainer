/**
 * The library's folders as a tree (ADR 0106, Mindscape's `deck-tree`): each folder says the one it
 * stands in (`parent`, `null` at Home), and the folders of one place stand in the order they are
 * listed. Pure, over any list of such links.
 */
export interface TreeFolder<Id extends string = string> {
  readonly id: Id
  readonly parent: Id | null
}

/** The folders standing in one place (`null`: Home), in the order they are listed. */
export const childFolders = <F extends TreeFolder>(
  folders: readonly F[],
  parent: F['id'] | null,
): F[] => folders.filter((folder) => folder.parent === parent)

/** A folder and every folder under it, itself first, each once however the links run. */
export function subtreeIds<Id extends string>(folders: readonly TreeFolder<Id>[], root: Id): Id[] {
  const ids: Id[] = []
  const seen = new Set<Id>()
  const walk = (id: Id) => {
    if (seen.has(id)) return
    seen.add(id)
    ids.push(id)
    for (const child of childFolders(folders, id)) walk(child.id)
  }
  walk(root)
  return ids
}

/** The folders from Home down to this one, it last; none for a folder the list has not. */
export function folderPath<F extends TreeFolder>(folders: readonly F[], id: F['id']): F[] {
  const byId = new Map(folders.map((folder) => [folder.id, folder]))
  const path: F[] = []
  const seen = new Set<string>()
  for (
    let at = byId.get(id);
    at && !seen.has(at.id);
    at = at.parent ? byId.get(at.parent) : undefined
  ) {
    seen.add(at.id)
    path.unshift(at)
  }
  return path
}

/** Whether a folder may move into this place: anywhere but into itself or a folder under it. */
export const canMoveFolder = <Id extends string>(
  folders: readonly TreeFolder<Id>[],
  id: Id,
  to: Id | null,
): boolean => to === null || !subtreeIds(folders, id).includes(to)

/** Of folders chosen together, those no other chosen folder holds: moving one moves what is under it. */
export function withoutDescendants<Id extends string>(
  folders: readonly TreeFolder<Id>[],
  ids: readonly Id[],
): Id[] {
  const chosen = new Set(ids)
  return ids.filter((id) =>
    folderPath(folders, id)
      .slice(0, -1)
      .every((above) => !chosen.has(above.id)),
  )
}

/**
 * Every folder on a place the library can reach (Mindscape's `reachableDecks`): one whose folder is
 * gone, or whose links run in a loop, stands at Home, the folders under it still under it. Read,
 * never written; what stands somewhere is handed back as it is.
 */
export function reachableFolders<F extends TreeFolder>(folders: readonly F[]): F[] {
  const byId = new Map(folders.map((folder) => [folder.id, folder]))
  const onLoop = (folder: F): boolean => {
    const seen = new Set<string>()
    for (let up = folder.parent; up !== null; up = byId.get(up)?.parent ?? null) {
      if (up === folder.id) return true
      if (seen.has(up)) return false
      seen.add(up)
    }
    return false
  }
  return folders.map((folder) =>
    folder.parent !== null && (!byId.has(folder.parent) || onLoop(folder))
      ? { ...folder, parent: null }
      : folder,
  )
}
