import { describe, expect, it } from 'vitest'
import { inviteCodeOf } from './invite-code'

describe('the invite code in a pasted link (R32-C)', () => {
  it('reads a whole invite link, one without its address, and the code alone', () => {
    expect(inviteCodeOf(' https://piano.app/songs/groups/join?code=8f2c1a90b3d4e5f6a7b8 ')).toBe(
      '8f2c1a90b3d4e5f6a7b8',
    )
    expect(inviteCodeOf('/songs/groups/join?code=abcdef1234#top')).toBe('abcdef1234')
    expect(inviteCodeOf('8f2c1a90b3d4e5f6a7b8')).toBe('8f2c1a90b3d4e5f6a7b8')
  })

  it('reads nothing from a link to anything else, or from text', () => {
    expect(inviteCodeOf('https://example.com/?code=abcdef1234')).toBeNull()
    expect(inviteCodeOf('join my choir')).toBeNull()
    expect(inviteCodeOf('')).toBeNull()
  })
})
