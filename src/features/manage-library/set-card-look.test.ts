import { describe, expect, it } from 'vitest'
import { createLibraryStore, DEFAULT_CARD_LOOK } from '@/entities/library'
import { createMemoryStorage } from '@/shared/lib'
import { resetCardLook, setCardLook } from './set-card-look'

describe('a place’s card look (R29 B9)', () => {
  it('is kept for each place it is applied to, and forgotten on Reset', () => {
    const store = createLibraryStore({
      storage: createMemoryStorage(),
      otherTabs: new EventTarget(),
    })
    const look = { ...DEFAULT_CARD_LOOK, density: 'large' as const }
    setCardLook(store, ['home', 'folder-1'], look)
    expect(store.getState().cardLooks).toEqual({ home: look, 'folder-1': look })
    resetCardLook(store, 'home')
    expect(store.getState().cardLooks).toEqual({ 'folder-1': look })
  })
})
