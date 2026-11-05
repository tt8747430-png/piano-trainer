import type { NetResult } from '../network'
import type { Json } from '../supabase'

/** The longest a group's name is. */
export const GROUP_NAME_MAX = 60

/** A group the learner belongs to (R30 S6): a class, a choir, a band. */
export interface LearnerGroup {
  readonly id: string
  readonly name: string
  readonly picture: string
  readonly paint: string
  /** Whether the learner made it: they rename it, change its link, remove members and delete it. */
  readonly mine: boolean
  /** Its invite link's code, and whether the link still lets people join. */
  readonly inviteCode: string
  readonly inviteOpen: boolean
  readonly members: number
}

/** One of a group's members, as the others see them. */
export interface GroupMember {
  readonly userId: string
  readonly name: string
  readonly owner: boolean
  readonly me: boolean
}

/** What an invite link opens before joining: the group's name and how many it has. */
export interface GroupInvite {
  readonly id: string
  readonly name: string
  readonly members: number
}

/** A folder as it is shared: its name, look and songs, each as the library writes it (`songs`, raw). */
export interface FolderShare {
  /** The owner's own folder it copies. */
  readonly folderKey: string
  readonly name: string
  readonly picture: string
  readonly paint: string
  readonly songs: readonly Json[]
}

/** A folder shared with one of the learner's groups, theirs or another member's. */
export interface SharedFolder extends FolderShare {
  readonly id: string
  readonly groupId: string
  readonly canEdit: boolean
  /** Whether the learner shared it. */
  readonly mine: boolean
  /** Who shared it, as the group names them. */
  readonly ownerName: string
  readonly updatedAt: string
}

/**
 * The learner's groups and the folders shared with them, on the server (R30 S6). Every call needs an
 * account; every result is a value.
 */
export interface GroupsPort {
  groups(): Promise<NetResult<readonly LearnerGroup[]>>
  members(groupId: string): Promise<NetResult<readonly GroupMember[]>>
  create(name: string): Promise<NetResult<LearnerGroup>>
  rename(groupId: string, name: string): Promise<NetResult<void>>
  setInviteOpen(groupId: string, open: boolean): Promise<NetResult<void>>
  /** Deletes a group the learner made, with what was shared with it. */
  remove(groupId: string): Promise<NetResult<void>>
  leave(groupId: string): Promise<NetResult<void>>
  removeMember(groupId: string, userId: string): Promise<NetResult<void>>
  /** An open invite link's group; none for a link that is off or wrong. */
  invite(code: string): Promise<NetResult<GroupInvite | null>>
  join(code: string): Promise<NetResult<string>>
  /** Every folder shared with the learner's groups. */
  shared(): Promise<NetResult<readonly SharedFolder[]>>
  /** Shares a folder with a group, or writes it again: its songs, look, and whether the group may edit. */
  share(groupId: string, folder: FolderShare, canEdit: boolean): Promise<NetResult<void>>
  unshare(groupId: string, folderKey: string): Promise<NetResult<void>>
  /** A member's write to a folder they may edit: its songs. */
  writeSongs(sharedId: string, songs: readonly Json[]): Promise<NetResult<void>>
}
