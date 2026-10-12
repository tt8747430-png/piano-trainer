import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

import { IDLE, plan, report, visibleRows } from '../hooks/checklist'
import { cleanName } from '../hooks/names'

const VOID = { value: undefined } as never
const ok = (value: unknown) => ({ value }) as never
const PLAN = 'mcp__clean-view__plan_steps'
const REPORT = 'mcp__clean-view__report_progress'

function world(on: On) {
  const clock = mock.clock(on, { now: 1_000_000 })
  mock.store(on, {})
  mock.env(on, { TMPDIR: '/tmp' })
  const toasts: string[] = []
  const tools: string[] = []
  on('session.id', async () => ok('S1'))
  on('session.start', async () => ({ cwd: '/w' }) as never)
  on('command.register', async ($, e) => ok({ command: e.name }))
  on('tool.register', async ($, e) => {
    tools.push(e.name)
    return ok({ tool: `mcp__clean-view__${e.name}` })
  })
  on('process.run', async () => ok({ code: 0, stdout: '', stderr: '' }))
  on('fs.write', async () => VOID)
  on('ui.toast', async ($, e) => {
    toasts.push(e.text)
    return VOID
  })
  on('ui.render', async $ => ({ type: 'Text', props: {}, children: ['engine'] }) as never)
  on('turn.start', async ($, e) => ({ turnId: e.turnId }))
  on('turn.complete', async ($, e) => ({ text: e.answer }))
  on('prompt.compose', async () => ({ sections: [] }))
  on('classic.Notification', async () => ({}) as never)
  on('tool.call', async ($, e) => {
    if (e.tool === 'TodoWrite') return { result: { oldTodos: [], newTodos: [] } } as never
    if (e.tool === 'Bash' && e.command === 'false') return { isError: true, result: 'Exit code 1', text: 'Exit code 1' } as never
    return { result: 'fine' } as never
  })
  return { clock, toasts, tools }
}

const start = ($: Engine) => $.session.start({ cwd: '/w', surface: 'terminal', isInteractive: true })
const ask = ($: Engine, text: string) => $.turn.start({ text, turnId: 't1' })
const band = { component: 'AbovePrompt', props: { hasSurvey: false, isWorking: true, maxRows: 12, bodyColumns: 80 } as never } as const
const call = ($: Engine, input: object) => $.tool.call(input as never)

async function bandTexts($: Engine, surface: 'terminal' | 'desktop' = 'terminal') {
  const ui = await $.ui.mount({ plugin: 'clean-view', surface, ...band })
  const texts = (await ui.findAll({ type: 'Text' })).map(t => t.text)
  const button = await ui.find({ key: 'clean-view-toggle' })
  await ui.unmount()
  return { texts, button }
}

test('1. names are cleaned and kept to 48 characters', () => {
  expect(cleanName('Build the pricing section in `src/ui/Pricing.tsx`')).toBe('Build the pricing section in Pricing.tsx')
  const long = cleanName('refactor the authentication middleware so that every request validates tokens')
  expect(long.length).toBeLessThanOrEqual(48)
  expect(long.endsWith('…')).toBe(true)
  expect(cleanName('   ')).toBe('Working on it')
})

test('2. a to-do list plus a 60% report renders done, 60%, Next and Up next, and a long plan shows five rows', async ($, on) => {
  world(on)
  await start($)
  await ask($, 'build my landing page with pricing and contact')
  await call($, {
    tool: 'TodoWrite',
    todos: [
      { content: 'Read your brand notes', status: 'completed', activeForm: 'Reading' },
      { content: 'Build the pricing section', status: 'in_progress', activeForm: 'Building' },
      { content: 'Add the contact form', status: 'pending', activeForm: 'Adding' },
      { content: 'Polish the footer', status: 'pending', activeForm: 'Polishing' },
    ],
  })
  await call($, { tool: REPORT, task: 'Build the pricing section', percent: 60 })
  for (const surface of ['terminal', 'desktop'] as const) {
    const { texts, button } = await bandTexts($, surface)
    const joined = texts.join('\n')
    expect(joined).toMatch(/✓ Read your brand notes[\s\S]*Done/)
    expect(joined).toMatch(/▶ Build the pricing section[\s\S]*60%/)
    expect(joined).toMatch(/○ Add the contact form[\s\S]*Next/)
    expect(joined).toMatch(/○ Polish the footer[\s\S]*Up next/)
    expect(button?.props.label).toBe('● Clean View: ON')
  }
  const nine = report(plan(IDLE, 'Ship the app', Array.from({ length: 9 }, (_, i) => `Do step ${i + 1}`), 0), 'Do step 5', 50, 1)
  const rows = visibleRows(nine.tasks)
  expect(rows.filter(r => r.kind === 'task').length).toBeLessThanOrEqual(5)
  expect(rows[0]).toEqual({ kind: 'done-fold', count: 4 })
})

test('3. a permission prompt shows Needs you', async ($, on) => {
  world(on)
  await start($)
  await ask($, 'deploy the site to staging now')
  await call($, { tool: PLAN, title: 'Deploy to staging', steps: ['Build the site', 'Upload the build'] })
  await $.classic.Notification({ message: 'Claude needs your permission to use Bash', notification_type: 'permission_prompt' })
  const { texts } = await bandTexts($)
  expect(texts).toContain(' Needs you ')
  expect(texts.join('\n')).toContain('Claude needs your OK to continue')
  expect(texts.join('\n')).toContain('‖ ')
})

test('4. /simple off hides the band and brings the hidden rows back', async ($, on) => {
  world(on)
  await start($)
  await ask($, 'build my landing page with pricing')
  await call($, { tool: PLAN, title: 'Build my landing page', steps: ['Read the notes', 'Build pricing'] })
  const readRow = { component: 'ToolUse', props: { tool_use_id: 'r1', tool: 'Read', input: {}, isRunning: false, isErrored: false, isInterrupted: false } as never } as const
  let ui = await $.ui.mount({ plugin: 'clean-view', surface: 'terminal', ...readRow })
  expect(await ui.find({ type: 'Text', text: 'engine' })).toBeUndefined()
  await ui.unmount()
  const out = await $.command.run({ command: 'simple', args: 'off', origin: { kind: 'composer' }, presentation: { isFullscreen: true, columns: 80 } } as never)
  expect(out.text).toContain('off')
  expect((await bandTexts($)).button).toBeUndefined()
  ui = await $.ui.mount({ plugin: 'clean-view', surface: 'terminal', ...readRow })
  expect(await ui.find({ type: 'Text', text: 'engine' })).toBeDefined()
  await ui.unmount()
})

test('5. plan_steps then report_progress at 100 checks off step one and starts step two', async ($, on) => {
  world(on)
  await start($)
  await ask($, 'build my landing page with pricing')
  const planned = await call($, { tool: PLAN, title: 'Build my landing page', steps: ['Read your brand notes', 'Build the pricing section', 'Add the contact form'] })
  expect(planned.result).toBe('Planned 3 steps. The first one has started.')
  const noted = await call($, { tool: REPORT, task: 'Read your brand notes', percent: 140 })
  expect(noted.result).toBe('Progress noted: 100%.')
  const joined = (await bandTexts($)).texts.join('\n')
  expect(joined).toMatch(/✓ Read your brand notes/)
  expect(joined).toMatch(/▶ Build the pricing section[\s\S]*Working/)
})

test('6. no tool is denied when no plan exists', async ($, on) => {
  world(on)
  await start($)
  const ran = await call($, { tool: 'Read', file_path: '/w/a.ts' })
  expect(ran.deny).toBeUndefined()
  expect(ran.result).toBe('fine')
  const compose = await $.prompt.compose({ model: 'm', promptModel: 'm', surfaces: [], tools: [], outputStyle: null, traits: [] } as never)
  expect(compose.sections.map(s => s.id).sort()).toEqual(['clean-view:checklist', 'clean-view:lean'])
})

test("7. a read's row is hidden; an edit's row and an error's row stay", async ($, on) => {
  world(on)
  await start($)
  const row = (tool: string, isErrored: boolean) =>
    ({ component: 'ToolUse', props: { tool_use_id: tool, tool, input: {}, isRunning: false, isErrored, isInterrupted: false } as never }) as const
  for (const [tool, isErrored, isShown] of [['Read', false, false], ['Grep', false, false], ['Bash', false, false], ['Edit', false, true], ['Bash', true, true], ['Read', true, true]] as const) {
    const ui = await $.ui.mount({ plugin: 'clean-view', surface: 'terminal', ...row(tool, isErrored) })
    expect([tool, isErrored, (await ui.find({ type: 'Text', text: 'engine' })) !== undefined]).toEqual([tool, isErrored, isShown])
    await ui.unmount()
  }
})

test('the job finishes with All done and shrinks to one line after 5 seconds', async ($, on) => {
  const w = world(on)
  await start($)
  await ask($, 'build my landing page with pricing')
  await call($, { tool: PLAN, title: 'Build my landing page', steps: ['Read the notes', 'Build pricing'] })
  await w.clock.advance(74_000)
  await call($, { tool: REPORT, task: 'Build pricing', percent: 100 })
  await $.turn.complete({ answer: 'done', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  let texts = (await bandTexts($)).texts
  expect(texts.join('\n')).toContain('✓ All done · Build my landing page · took 1m 14s')
  expect(texts.some(t => t.includes('Build pricing'))).toBe(true)
  await w.clock.advance(5000)
  texts = (await bandTexts($)).texts
  expect(texts.some(t => t.includes('Build pricing'))).toBe(false)
})
