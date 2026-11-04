import { describe, expect, it } from 'vitest'
import { actPlace, ASKS_FIRST, ITEM_ACTS, PUBLISHED_KINDS, PUBLISHERS, SETTINGS_ROWS } from './acts'

describe('one publishing model (R29 B6)', () => {
  it('gives every item every act, in the same place', () => {
    for (const act of ITEM_ACTS) {
      const places = new Set(PUBLISHED_KINDS.map((kind) => actPlace(kind, act)))
      expect([act, places.size]).toEqual([act, 1])
    }
  })

  it('puts Edit and Settings in the bar, Publish and Share link on Settings, Delete last there', () => {
    expect(actPlace('lesson', 'edit')).toBe('bar')
    expect(actPlace('course', 'settings')).toBe('bar')
    expect(actPlace('song', 'publish')).toBe('settings')
    expect(actPlace('progression', 'shareLink')).toBe('settings')
    expect(actPlace('pattern', 'delete')).toBe('settings-danger')
    expect(actPlace('lesson', 'versions')).toBe('publish-page')
    expect(actPlace('course', 'unpublish')).toBe('publish-foot')
  })

  it('orders Settings’ rows Publish…, Share link, Delete', () => {
    expect(SETTINGS_ROWS).toEqual(['publish', 'shareLink', 'delete'])
  })

  it('asks before Unpublish, Delete and restoring a version', () => {
    expect([...ASKS_FIRST].toSorted()).toEqual(['delete', 'unpublish', 'versions'])
  })

  it('lets a learner publish their own song or pattern to Explore, and nothing else', () => {
    expect(PUBLISHED_KINDS.filter((kind) => PUBLISHERS[kind].learner === 'explore')).toEqual([
      'song',
      'pattern',
    ])
  })
})
