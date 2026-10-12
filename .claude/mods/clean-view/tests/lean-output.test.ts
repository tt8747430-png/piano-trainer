import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

import { isExempt, trimOutput } from '../hooks/trim'

const VOID = { value: undefined } as never
const ok = (value: unknown) => ({ value }) as never

const passing = Array.from({ length: 500 }, (_, i) => `\u001b[32m✓\u001b[0m test ${i + 1} passes`).join('\n')
const failingLines = Array.from({ length: 600 }, (_, i) => `line ${i + 1}`)
failingLines[200] = 'Error: expected 2 to be 3'
failingLines[300] = 'FAIL src/math.test.ts'
const failing = failingLines.join('\n')
const longFile = Array.from({ length: 900 }, (_, i) => `row ${i}`).join('\n')

type Answer = { stdout?: string; stderr?: string; error?: string; persisted?: string }

function world(on: On, answers: Record<string, Answer>) {
  mock.clock(on, { now: 1_000_000 })
  mock.store(on, {})
  mock.env(on, { TMPDIR: '/tmp' })
  const files: Record<string, string> = {}
  on('session.id', async () => ok('S1'))
  on('session.start', async () => ({ cwd: '/w' }) as never)
  on('command.register', async ($, e) => ok({ command: e.name }))
  on('tool.register', async ($, e) => ok({ tool: `mcp__clean-view__${e.name}` }))
  on('process.run', async () => ok({ code: 0, stdout: '', stderr: '' }))
  on('fs.write', async ($, e) => {
    files[e.path] = e.text
    return VOID
  })
  on('prompt.compose', async () => ({ sections: [] }))
  on('tool.call', async ($, e) => {
    if (e.tool === 'WebFetch') return { result: { result: longFile, url: e.url } } as never
    if (e.tool !== 'Bash') return { result: 'fine' } as never
    const a = answers[e.command] ?? {}
    if (a.error !== undefined) return { isError: true, result: a.error, text: a.error } as never
    return { result: { stdout: a.stdout ?? '', stderr: a.stderr ?? '', interrupted: false, persistedOutputPath: a.persisted } } as never
  })
  return { files }
}

const start = ($: Engine) => $.session.start({ cwd: '/w', surface: 'terminal', isInteractive: true })
const bash = ($: Engine, command: string) => $.tool.call({ tool: 'Bash', command } as never)
const lean = ($: Engine, args: string) =>
  $.command.run({ command: 'lean', args, origin: { kind: 'composer' }, presentation: { isFullscreen: true, columns: 80 } } as never)
const stdoutOf = (r: { result?: unknown }) => (r.result as { stdout: string }).stdout

test('8. a 500-line passing test run is trimmed to head, tail and the marker, and the file holds the full text', async ($, on) => {
  const w = world(on, { 'npx vitest run': { stdout: passing } })
  await start($)
  const out = stdoutOf(await bash($, 'npx vitest run'))
  const lines = out.split('\n')
  expect(lines[0]).toBe('✓ test 1 passes')
  expect(lines[19]).toBe('✓ test 20 passes')
  expect(lines[20]).toMatch(/^… 440 lines trimmed by Clean View\. Full output: \/tmp\/claude-clean-view\/S1\/.+\.txt$/)
  expect(lines.at(-1)).toBe('✓ test 500 passes')
  expect(lines.length).toBe(61)
  const path = /Full output: (\S+)/.exec(out)?.[1] ?? ''
  expect(w.files[path]).toBe(passing)
  expect((await lean($, '')).text).toContain('trimmed 1 result')
})

test('9. a failing run keeps its error lines and its last 120 lines', async ($, on) => {
  world(on, { 'npm test': { error: failing } })
  await start($)
  const r = await bash($, 'npm test')
  expect(r.isError).toBe(true)
  const text = String(r.text)
  expect(text).toContain('Error: expected 2 to be 3')
  expect(text).toContain('line 200\nError: expected 2 to be 3\nline 202')
  expect(text).toContain('FAIL src/math.test.ts')
  expect(text.split('\n').slice(-120)).toEqual(failingLines.slice(-120))
  expect(text).toContain('trimmed by Clean View')
})

test('10. a WebFetch result, curl output and the cat of a long file pass through unchanged', async ($, on) => {
  world(on, { 'curl -s https://example.com': { stdout: longFile }, 'cat big.log': { stdout: longFile }, 'cd x && git diff': { stdout: longFile } })
  await start($)
  const fetched = await $.tool.call({ tool: 'WebFetch', url: 'https://example.com', prompt: 'all' } as never)
  expect((fetched.result as { result: string }).result).toBe(longFile)
  expect(stdoutOf(await bash($, 'curl -s https://example.com'))).toBe(longFile)
  expect(stdoutOf(await bash($, 'cat big.log'))).toBe(longFile)
  expect(stdoutOf(await bash($, 'cd x && git diff'))).toBe(longFile)
  expect(isExempt('npm run build')).toBe(false)
})

test('11. /lean off stops the trimming, and /lean keep vitest exempts that command', async ($, on) => {
  world(on, { 'npx vitest run': { stdout: passing }, 'npm run build': { stdout: passing } })
  await start($)
  expect((await lean($, 'keep vitest')).text).toContain('vitest is on the keep list')
  expect(stdoutOf(await bash($, 'npx vitest run'))).toBe(passing)
  expect(stdoutOf(await bash($, 'npm run build'))).not.toBe(passing)
  expect((await lean($, 'off')).text).toContain('off')
  expect(stdoutOf(await bash($, 'npm run build'))).toBe(passing)
  expect((await lean($, '')).text).toContain('Keep list: vitest.')
})

test('12. a result that was trimmed is not trimmed again', async ($, on) => {
  const once = trimOutput(passing, { isFailed: false, path: '/tmp/a.txt' })?.text ?? ''
  expect(once).toContain('trimmed by Clean View')
  const padded = `${once}\n${'more\n'.repeat(200)}`
  expect(trimOutput(padded, { isFailed: false, path: '/tmp/b.txt' })).toBeUndefined()
  const w = world(on, { 'npm run build': { stdout: padded, persisted: '/tmp/saved.txt' } })
  await start($)
  expect(stdoutOf(await bash($, 'npm run build'))).toBe(padded)
  expect(Object.keys(w.files)).toEqual([])
})
