import { describe, expect, it } from 'vitest'
import { en } from './locales/en'
import { ru } from './locales/ru'

type Tree = { readonly [key: string]: string | Tree }

function leaves(tree: Tree, prefix = ''): [key: string, text: string][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string'
      ? [[`${prefix}${key}`, value] as [string, string]]
      : leaves(value, `${prefix}${key}.`),
  )
}

describe('locales', () => {
  it('give Russian exactly the keys English has, and every plural form a count needs', () => {
    const keys = (tree: Tree) =>
      leaves(tree)
        .map(([key]) => key)
        .sort()
    const english = keys(en)
    const counted = english.flatMap((key) => (key.endsWith('_other') ? [key.slice(0, -6)] : []))
    // Russian counts in one, few, many and other: those beyond English's are its own.
    const more = counted.flatMap((base) => [`${base}_few`, `${base}_many`])
    expect(keys(ru).filter((key) => !more.includes(key))).toEqual(english)
    for (const key of more) expect(keys(ru), key).toContain(key)
  })

  it('leave no string empty in either language', () => {
    for (const [key, text] of [...leaves(en), ...leaves(ru)]) expect(text.trim(), key).not.toBe('')
  })
})
