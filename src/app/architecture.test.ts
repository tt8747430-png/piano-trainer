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
    expect(broken).not.toContain('no-restricted-imports')
  })

  it('let a slice import another slice of its own layer through its barrel', async () => {
    const broken = await rulesBrokenBy(
      'src/widgets/app-nav/ui/Example.tsx',
      "import { TheoryNav } from '@/widgets/theory-nav'\nexport const example = TheoryNav\n",
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

  it('refuse a deep import into another slice', async () => {
    const broken = await rulesBrokenBy(
      'src/pages/path/ui/Example.tsx',
      "import { createSettingsStore } from '@/entities/settings/model/store'\nexport const example = createSettingsStore\n",
    )
    expect(broken).toContain('no-restricted-imports')
  })
})
