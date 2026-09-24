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
  it('give Russian exactly the keys English has', () => {
    const keys = (tree: Tree) =>
      leaves(tree)
        .map(([key]) => key)
        .sort()
    expect(keys(ru)).toEqual(keys(en))
  })

  it('leave no string empty in either language', () => {
    for (const [key, text] of [...leaves(en), ...leaves(ru)]) expect(text.trim(), key).not.toBe('')
  })
})
