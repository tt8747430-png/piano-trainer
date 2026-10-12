import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

import { bigNumber, packRows, parseQuestions, parseRewrite, routeOf } from '../hooks/logic'

const VOID = { value: undefined } as never
const ok = (value: unknown) => ({ value }) as never

const QUESTIONS = JSON.stringify({
  questions: [
    { question: 'Who is it for?', options: ['Developers', 'Customers'] },
    { question: 'What format?', options: ['Bullet list', 'Short essay', 'Table'] },
  ],
})
const REWRITE = '```json\n' + JSON.stringify({ prompt: 'Write a short essay for customers about [product]. Done means 300 words.', added: ['Audience', 'Format', 'Length'] }) + '\n```'

function world(on: On, opts: { fail?: boolean; placed?: boolean } = {}) {
  const clock = mock.clock(on, { now: 5000 })
  mock.store(on, {})
  const sent: string[] = []
  const filled: string[] = []
  const logs: string[] = []
  const models: string[] = []
  on('model.complete', async ($, e) => {
    models.push(e.model)
    if (opts.fail) return ok({ isAnswered: false, reason: 'api-error', status: 529, error: 'overloaded', usage: {} })
    return ok({ isAnswered: true, text: e.model === 'haiku' ? QUESTIONS : REWRITE, usage: {} })
  })
  on('command.register', async ($, e) => ok({ command: e.name }))
  on('session.start', async () => ({ cwd: '/w' }) as never)
  on('prompt.submit', async ($, e) => {
    sent.push(e.text)
    return { text: e.text } as never
  })
  on('prompt.fill', async ($, e) => {
    filled.push(e.text)
    return { isFilled: true, text: e.text, cursor: 0 } as never
  })
  on('ui.open', async () => ok(opts.placed === false ? { isPlaced: false, reason: 'narrow' } : { isPlaced: true }))
  on('ui.close', async () => VOID)
  on('ui.log', async ($, e) => {
    logs.push(e.text)
    return VOID
  })
  on('ui.copy', async () => ok({ isCopied: true }))
  return { clock, sent, filled, logs, models }
}

const start = ($: Engine) => $.session.start({ cwd: '/w', surface: 'terminal', isInteractive: true })
const better = ($: Engine, args: string) =>
  $.command.run({ command: 'better', args, origin: { kind: 'composer' }, presentation: { isFullscreen: true, columns: 120 } } as never)
const type = ($: Engine, text: string, extra: object = {}) =>
  $.prompt.submit({ text, wait: false, origin: { kind: 'composer' }, ...extra } as never)
const pane = (bodyColumns: number) =>
  ({
    component: 'Pane',
    requestId: 'prompt-upgrade',
    props: { title: 'Prompt Upgrade', isFocused: true, bodyColumns, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} } as never,
  }) as const

test('which prompts are intercepted and which pass through', () => {
  const base = { hasAttachments: false, isWorking: false, isComposer: true }
  expect(routeOf({ ...base, text: 'write a landing page for my bakery' })).toBe('upgrade')
  expect(routeOf({ ...base, text: '/compact' })).toBe('pass')
  expect(routeOf({ ...base, text: 'yes' })).toBe('pass')
  expect(routeOf({ ...base, text: 'keep going' })).toBe('pass')
  expect(routeOf({ ...base, text: '> send this exactly as typed' })).toBe('strip')
  expect(routeOf({ ...base, text: 'describe this screenshot please', hasAttachments: true })).toBe('pass')
  expect(routeOf({ ...base, text: 'also fix the footer links', isWorking: true })).toBe('pass')
  expect(routeOf({ ...base, text: 'write a landing page for my bakery', isComposer: false })).toBe('pass')
})

test('reading the questions and the rewrite', () => {
  expect(parseQuestions(QUESTIONS)).toEqual([
    { question: 'Who is it for?', options: ['Developers', 'Customers'] },
    { question: 'What format?', options: ['Bullet list', 'Short essay', 'Table'] },
  ])
  expect(parseQuestions('{"questions":[{"question":"one option","options":["a"]},{"question":"q","options":["a","b","c","d","e"]}]}')).toEqual([
    { question: 'q', options: ['a', 'b', 'c', 'd'] },
  ])
  expect(parseQuestions('{"questions":[]}')).toEqual([])
  expect(parseQuestions('not json')).toBeUndefined()
  expect(parseRewrite(REWRITE)?.added).toEqual(['Audience', 'Format', 'Length'])
  expect(parseRewrite('{"prompt":""}')).toBeUndefined()
  expect(bigNumber(10)).toEqual([' ╻  ┏━┓', ' ┃  ┃ ┃', ' ╹  ┗━┛'])
  expect(packRows(['aaaa', 'bbbb', 'cccc'], 13)).toEqual([[0, 1], [2]])
})

test('the full flow from /better to Run, narrow and wide', async ($, on) => {
  const w = world(on)
  await start($)
  for (const cols of [44, 120]) {
    const out = await better($, 'write about our product')
    expect(out.text).toContain('Nothing runs until you press Run')
    await w.clock.settle()
    let ui = await $.ui.mount({ plugin: 'prompt-upgrade', surface: 'terminal', ...pane(cols) })
    expect(await ui.find({ type: 'Text', text: /Who is it for/ })).toBeDefined()
    await ui.press({ key: 'q0o1' })
    await ui.press({ key: 'q1skip' })
    await w.clock.settle()
    await ui.unmount()
    ui = await $.ui.mount({ plugin: 'prompt-upgrade', surface: 'terminal', ...pane(cols) })
    expect(await ui.find({ type: 'Text', text: /\[product\]/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Audience' })).toBeDefined()
    await ui.press({ key: 'run' })
    await ui.unmount()
    expect(w.sent.at(-1)).toBe('Write a short essay for customers about [product]. Done means 300 words.')
    expect(w.models.slice(-2)).toEqual(['haiku', 'sonnet'])
  }
})

test('Cancel puts the original prompt back, and a failed call offers Try again', async ($, on) => {
  const w = world(on, { fail: true })
  await start($)
  await better($, 'plan a team offsite for spring')
  await w.clock.settle()
  const ui = await $.ui.mount({ plugin: 'prompt-upgrade', surface: 'desktop', ...pane(90) })
  expect(await ui.find({ type: 'Text', text: /Your prompt is safe/ })).toBeDefined()
  expect(await ui.find({ key: 'retry' })).toBeDefined()
  await ui.press({ key: 'cancel' })
  await ui.unmount()
  expect(w.filled).toEqual(['plan a team offsite for spring'])
  expect(w.sent).toEqual([])
})

test('the on and off switch, and the upgraded prompt never loops back', async ($, on) => {
  const w = world(on)
  await start($)
  await type($, 'write a landing page for my bakery')
  expect(w.sent).toEqual(['write a landing page for my bakery'])
  await better($, 'on')
  const dropped = await type($, 'write a landing page for my bakery')
  expect(dropped).toEqual({ drop: expect.stringContaining('Prompt Upgrade') })
  expect(w.sent).toEqual(['write a landing page for my bakery'])
  await type($, '> send it as typed please')
  expect(w.sent.at(-1)).toBe('send it as typed please')
  await w.clock.settle()
  const ui = await $.ui.mount({ plugin: 'prompt-upgrade', surface: 'terminal', ...pane(100) })
  await ui.press({ key: 'skip-rest' })
  await w.clock.settle()
  await ui.press({ key: 'run' })
  await ui.unmount()
  expect(w.sent.at(-1)).toContain('[product]')
  await better($, 'off')
  await type($, 'write a landing page for my bakery')
  expect(w.sent.at(-1)).toBe('write a landing page for my bakery')
})

test('a pane that cannot be placed puts the words back', async ($, on) => {
  const w = world(on, { placed: false })
  await start($)
  await better($, 'write about our product')
  await w.clock.settle()
  expect(w.filled).toEqual(['write about our product'])
  expect(w.logs[0]).toContain('too narrow')
})
