import { describe, expect, it } from 'vitest'
import { settings as en } from '@/shared/i18n/locales/en/settings'
import { GUIDE } from './guide'

describe('How to use', () => {
  it('says every step of a part under it, and nothing more than its title and its steps', () => {
    const words = en.howToUse as unknown as Record<string, Record<string, string>>
    for (const part of GUIDE) {
      for (const step of part.steps) expect(step.key).toMatch(`howToUse.${part.id}.`)
      expect(Object.keys(words[part.id] ?? {}).sort()).toEqual(
        ['title', ...part.steps.map((step) => step.key.split('.').at(-1))].sort(),
      )
    }
  })

  it('has a part for every part it has words for', () => {
    expect(Object.keys(en.howToUse).filter((key) => key !== 'title')).toEqual(
      GUIDE.map((part) => part.id),
    )
  })
})
