import { describe, expect, it } from 'vitest'
import { lookOf } from './group-look'

describe('a group’s look as the server keeps it (R32-C)', () => {
  it('reads a folder’s picture and a paint as they are', () => {
    expect(lookOf({ picture: 'church', paint: 'grass' })).toEqual({
      picture: 'church',
      paint: 'grass',
    })
  })

  it('draws the group’s people and lilac for what the app does not know', () => {
    expect(lookOf({ picture: 'users', paint: 'crimson' })).toEqual({
      picture: null,
      paint: 'lilac',
    })
  })
})
