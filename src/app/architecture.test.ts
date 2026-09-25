// @vitest-environment node
import { resolve } from 'node:path'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const eslint = new ESLint({ cwd: process.cwd() })

async function rulesBrokenBy(file: string, code: string) {
  const [result] = await eslint.lintText(code, { filePath: resolve(file) })
  return (result?.messages ?? []).map((message) => message.ruleId)
}

describe('architecture rules (eslint)', { timeout: 60_000 }, () => {
  it('let a page import an entity through its barrel', async () => {
    const broken = await rulesBrokenBy(
      'src/pages/path/ui/Example.tsx',
      "import { selectTheme } from '@/entities/settings'\nexport const example = selectTheme\n",
    )
    expect(broken).not.toContain('boundaries/dependencies')
  })

  it('let a slice import another slice of its own layer through its barrel', async () => {
    const broken = await rulesBrokenBy(
      'src/widgets/app-nav/ui/Example.tsx',
      "import { TheoryNav } from '@/widgets/theory-nav'\nexport const example = TheoryNav\n",
    )
    expect(broken).not.toContain('boundaries/dependencies')
  })

  it('let a slice import its own files by any path', async () => {
    const broken = await rulesBrokenBy(
      'src/pages/settings/ui/Example.tsx',
      "import { ChoiceGroup } from './ChoiceGroup'\nexport const example = ChoiceGroup\n",
    )
    expect(broken).not.toContain('boundaries/dependencies')
  })

  it('let any layer reach into shared by path', async () => {
    const broken = await rulesBrokenBy(
      'src/app/Example.tsx',
      "import { Button } from '@/shared/ui/primitives/button'\nexport const example = Button\n",
    )
    expect(broken).not.toContain('boundaries/dependencies')
  })

  it('refuse an import from a higher layer', async () => {
    const broken = await rulesBrokenBy(
      'src/entities/settings/model/example.ts',
      "import { PathPage } from '@/pages/path'\nexport const example = PathPage\n",
    )
    expect(broken).toContain('boundaries/dependencies')
  })

  it('refuse shared reaching up into an entity', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/example.ts',
      "import { selectTheme } from '@/entities/settings'\nexport const example = selectTheme\n",
    )
    expect(broken).toContain('boundaries/dependencies')
  })

  it.each([
    ['the @ alias', '@/entities/settings/model/store'],
    ['a relative path', '../../../entities/settings/model/store'],
  ])('refuse a deep import into another slice through %s', async (_how, source) => {
    const broken = await rulesBrokenBy(
      'src/pages/path/ui/Example.tsx',
      `import { createSettingsStore } from '${source}'\nexport const example = createSettingsStore\n`,
    )
    expect(broken).toContain('boundaries/dependencies')
  })
})

describe('the music kernel and the arrangement engine (eslint)', { timeout: 60_000 }, () => {
  it.each(['@/shared/lib', '../cn', '@/entities/settings'])(
    'refuse music importing %s: it stays inside itself',
    async (source) => {
      const broken = await rulesBrokenBy(
        'src/shared/lib/music/example.ts',
        `import * as outside from '${source}'\nexport const example = outside\n`,
      )
      expect(broken).toContain('boundaries/dependencies')
    },
  )

  it('let music import its own files', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/music/example.ts',
      "import { pitchClass } from './pitch'\nexport const example = pitchClass\n",
    )
    expect(broken).toEqual([])
  })

  it('refuse music importing a package', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/music/example.ts',
      "import { useState } from 'react'\nexport const example = useState\n",
    )
    expect(broken).toContain('no-restricted-imports')
  })

  it('let arrangement import the music kernel', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/arrangement/example.ts',
      "import { pitchClass } from '@/shared/lib/music/pitch'\nexport const example = pitchClass\n",
    )
    expect(broken).toEqual([])
  })

  it('refuse arrangement importing the rest of shared', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/arrangement/example.ts',
      "import { cn } from '@/shared/lib'\nexport const example = cn\n",
    )
    expect(broken).toContain('boundaries/dependencies')
  })

  it('refuse arrangement importing a package', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/arrangement/example.ts',
      "import { createStore } from 'zustand'\nexport const example = createStore\n",
    )
    expect(broken).toContain('no-restricted-imports')
  })

  it.each(['src/entities/settings/model/example.ts', 'src/shared/lib/example.ts'])(
    'let %s use the kernel',
    async (file) => {
      const broken = await rulesBrokenBy(
        file,
        "import { pitchClass } from '@/shared/lib/music/pitch'\nexport const example = pitchClass\n",
      )
      expect(broken).not.toContain('boundaries/dependencies')
    },
  )
})
