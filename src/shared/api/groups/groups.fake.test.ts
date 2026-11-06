import { describe, expect, it } from 'vitest'
import { createFakeGroups } from './fake'

/** Two learners on one server: `as` changes who is signed in. */
function server() {
  let me: string | null = 'ana'
  const port = createFakeGroups({ who: () => me })
  return { port, as: (who: string | null) => void (me = who) }
}

const value = <T>(result: { ok: true; value: T } | { ok: false }) => {
  if (!result.ok) throw new Error('refused')
  return result.value
}

describe('the groups fake keeps the server’s rules (R30 S6)', () => {
  it('makes a group whose maker is its owner member, and lets another join by its open link', async () => {
    const { port, as } = server()
    const choir = value(await port.create(' Choir '))
    expect(choir).toMatchObject({ name: 'Choir', mine: true, members: 1, inviteOpen: true })
    as('mihai')
    expect(value(await port.invite(choir.inviteCode))).toEqual({
      id: choir.id,
      name: 'Choir',
      members: 1,
    })
    expect(value(await port.join(choir.inviteCode))).toBe(choir.id)
    expect(value(await port.members(choir.id)).map((m) => [m.name, m.owner, m.me])).toEqual([
      ['Ana', true, false],
      ['Mihai', false, true],
    ])
  })

  it('shows a shared folder to the group alone, written by its owner or an editor', async () => {
    const { port, as } = server()
    const choir = value(await port.create('Choir'))
    const folder = {
      folderKey: 'folder-1',
      name: 'Advent',
      picture: 'music',
      paint: 'yellow',
      songs: [{ kind: 'built-in', id: 'silent' }],
    }
    await port.share(choir.id, folder, false)
    as('ira')
    expect(value(await port.shared())).toEqual([])
    as('mihai')
    await port.join(choir.inviteCode)
    const [seen] = value(await port.shared())
    expect(seen).toMatchObject({ name: 'Advent', mine: false, canEdit: false, ownerName: 'Ana' })
    expect((await port.writeSongs(seen?.id ?? '', [])).ok).toBe(false)
    as('ana')
    await port.share(choir.id, folder, true)
    as('mihai')
    expect((await port.writeSongs(seen?.id ?? '', [])).ok).toBe(true)
  })

  it('keeps the owner in its group, lets a member leave, and closes the link', async () => {
    const { port, as } = server()
    const choir = value(await port.create('Choir'))
    expect((await port.leave(choir.id)).ok).toBe(false)
    await port.setInviteOpen(choir.id, false)
    as('mihai')
    expect(value(await port.invite(choir.inviteCode))).toBeNull()
    expect((await port.join(choir.inviteCode)).ok).toBe(false)
    as(null)
    expect((await port.groups()).ok).toBe(false)
  })
})
