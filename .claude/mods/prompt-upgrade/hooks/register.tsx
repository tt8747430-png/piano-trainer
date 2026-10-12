import { atom, read, update } from 'claude-code'
import type { Elements, EngineInterface, Register } from 'claude-code'

import type { UpgradeEntry, UpgradeFlow, UpgradeStep } from '../types'
import {
  AMBER,
  GOLD,
  GREEN,
  HAIR,
  INK,
  MUTED,
  QUESTIONS_SYSTEM,
  REWRITE_SYSTEM,
  TEXT,
  bigNumber,
  fit,
  packRows,
  parseQuestions,
  parseRewrite,
  questionsPrompt,
  rewritePrompt,
  routeOf,
  stripQuote,
  wordCount,
} from './logic'

const PANE = 'prompt-upgrade'
const TITLE = 'Prompt Upgrade'
const FAST_MODEL = 'haiku'
const REWRITE_MODEL = 'sonnet'
const STORE_AUTO = 'auto'
const STORE_HISTORY = 'history'
const HISTORY_MAX = 20

const flowAtom = atom({ plugin: 'prompt-upgrade', key: 'flow' } as const, null)
const viewAtom = atom({ plugin: 'prompt-upgrade', key: 'view' } as const, 'flow')
const autoAtom = atom({ plugin: 'prompt-upgrade', key: 'isAuto' } as const, false)
const historyAtom = atom({ plugin: 'prompt-upgrade', key: 'history' } as const, [])

type $ = EngineInterface
type Els = Elements['terminal']

/** Prompts the mod itself is sending, so they never come back to the pane. */
const sending = new Set<string>()
/** Flows with a model call in flight in this copy of the module. */
const inFlight = new Set<string>()

function newFlow(original: string, at: number): UpgradeFlow {
  return {
    id: `u${at}`,
    original,
    step: 'reading',
    questions: [],
    answers: [],
    otherIndex: -1,
    upgraded: '',
    added: [],
    isEditing: false,
    failedAt: null,
    error: '',
  }
}

async function patch($: $, id: string, change: (f: UpgradeFlow) => UpgradeFlow): Promise<boolean> {
  let hit = false
  await update($, flowAtom, f => {
    if (!f || f.id !== id) return f
    hit = true
    return change(f)
  })
  return hit
}

/** Opens the pane in the background; when it cannot be placed, puts the words back. */
async function openPane($: $) {
  try {
    const r = await $.ui.open({ id: PANE, title: TITLE, focus: true })
    if (r.isPlaced) return
    const f = await read($, flowAtom)
    if (f) await $.prompt.fill({ text: f.original, mode: 'replace' })
    await update($, flowAtom, () => null)
    $.ui.log('Prompt Upgrade: the window is too narrow for its pane, so your words are back in the prompt box.')
  } catch {
    $.ui.log('Prompt Upgrade: could not open its pane.')
  }
}

export async function startFlow($: $, original: string) {
  const f = newFlow(original, await $.clock.now())
  await update($, flowAtom, () => f)
  await update($, viewAtom, () => 'flow' as const)
  void openPane($)
  void askQuestions($, f.id)
}

async function failed($: $, id: string, at: 'questions' | 'rewrite', why: string) {
  await patch($, id, f => ({ ...f, step: 'error', failedAt: at, error: why }))
}

async function askQuestions($: $, id: string) {
  const f = await read($, flowAtom)
  if (!f || f.id !== id || inFlight.has(id)) return
  inFlight.add(id)
  try {
    await patch($, id, x => ({ ...x, step: 'reading' }))
    const r = await $.model.complete({
      model: FAST_MODEL,
      system: QUESTIONS_SYSTEM,
      prompt: questionsPrompt(f.original),
      maxTokens: 600,
      timeoutMs: 30000,
    })
    if (!r.isAnswered) return await failed($, id, 'questions', 'The model did not answer.')
    const questions = parseQuestions(r.text)
    if (questions === undefined) return await failed($, id, 'questions', 'The model sent questions I could not read.')
    if (questions.length === 0) {
      inFlight.delete(id)
      return await rewrite($, id)
    }
    await patch($, id, x => ({ ...x, step: 'questions', questions, answers: questions.map(() => null) }))
  } catch {
    await failed($, id, 'questions', 'The model call failed.')
  } finally {
    inFlight.delete(id)
  }
}

async function rewrite($: $, id: string) {
  const f = await read($, flowAtom)
  if (!f || f.id !== id || inFlight.has(id)) return
  inFlight.add(id)
  try {
    await patch($, id, x => ({ ...x, step: 'rewrite', otherIndex: -1 }))
    const qa = f.questions.flatMap((q, i) => {
      const a = f.answers[i]
      return typeof a === 'string' && a.trim() ? [{ question: q.question, answer: a.trim() }] : []
    })
    const r = await $.model.complete({
      model: REWRITE_MODEL,
      system: REWRITE_SYSTEM,
      prompt: rewritePrompt(f.original, qa),
      maxTokens: 2000,
      timeoutMs: 60000,
    })
    if (!r.isAnswered) return await failed($, id, 'rewrite', 'The model did not answer.')
    const out = parseRewrite(r.text)
    if (!out) return await failed($, id, 'rewrite', 'The model sent a rewrite I could not read.')
    const hit = await patch($, id, x => ({ ...x, step: 'review', upgraded: out.prompt, added: out.added }))
    if (hit) {
      const entry: UpgradeEntry = { at: await $.clock.now(), original: f.original, upgraded: out.prompt, added: out.added }
      await update($, historyAtom, list => [entry, ...list].slice(0, HISTORY_MAX))
      await $.store.set(STORE_HISTORY, await read($, historyAtom))
    }
  } catch {
    await failed($, id, 'rewrite', 'The model call failed.')
  } finally {
    inFlight.delete(id)
  }
}

async function answer($: $, id: string, index: number, value: string) {
  let isDone = false
  await patch($, id, f => {
    const answers = f.answers.slice()
    answers[index] = value
    isDone = answers.every(a => a !== null)
    return { ...f, answers, otherIndex: -1 }
  })
  if (isDone) await rewrite($, id)
}

export async function runText($: $, text: string) {
  await update($, flowAtom, () => null)
  await $.ui.close({ id: PANE })
  sending.add(text)
  try {
    await $.prompt.submit({ text, asUser: true })
  } finally {
    sending.delete(text)
  }
}

export async function cancel($: $) {
  const f = await read($, flowAtom)
  await update($, flowAtom, () => null)
  await $.ui.close({ id: PANE })
  if (f) await $.prompt.fill({ text: f.original, mode: 'replace' })
}

async function setAuto($: $, value: boolean) {
  await update($, autoAtom, () => value)
  await $.store.set(STORE_AUTO, value)
}

async function better($: $, raw: string): Promise<{ text: string }> {
  const args = raw.trim()
  const word = args.toLowerCase()
  if (word === 'on' || word === 'off') {
    await setAuto($, word === 'on')
    return {
      text: word === 'on'
        ? 'Automatic mode is on: prompts you type go to Prompt Upgrade first. Start one with ">" to send it as is.'
        : 'Automatic mode is off.',
    }
  }
  if (word === 'history') {
    await update($, viewAtom, () => 'history' as const)
    void openPane($)
    const n = (await read($, historyAtom)).length
    return { text: n === 0 ? 'No upgrades yet.' : `Showing your last ${n} upgrade${n === 1 ? '' : 's'}.` }
  }
  if (args === '') {
    await update($, flowAtom, () => null)
    await update($, viewAtom, () => 'input' as const)
    void openPane($)
    return { text: 'Type the prompt to upgrade in the Prompt Upgrade pane.' }
  }
  await startFlow($, args)
  return { text: 'Upgrading your prompt. Nothing runs until you press Run.' }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    try {
      await $.command.register({
        name: 'better',
        description: 'Upgrade a rough prompt before sending it',
        argumentHint: '<prompt> | on | off | history',
      })
      await update($, autoAtom, () => false)
      if ((await $.store.get(STORE_AUTO)) === true) await update($, autoAtom, () => true)
      const saved = await $.store.get(STORE_HISTORY)
      if (Array.isArray(saved)) await update($, historyAtom, () => (saved as UpgradeEntry[]).slice(0, HISTORY_MAX))
      // A reload mid-step: pick the step back up.
      const f = await read($, flowAtom)
      if (f?.step === 'reading') void askQuestions($, f.id)
      if (f?.step === 'rewrite') void rewrite($, f.id)
    } catch {
      // the command still answers
    }
    return r
  })

  on('command.run', { command: 'better' }, async ($, e) => {
    try {
      return await better($, e.args)
    } catch {
      return { text: 'Prompt Upgrade hit a problem. Your prompt was not sent.' }
    }
  })

  on('prompt.submit', async ($, e, next) => {
    if (sending.has(e.text)) return next(e)
    const route = routeOf({
      text: e.text,
      hasAttachments: (e.attachments?.length ?? 0) > 0,
      isWorking: e.turnId !== undefined,
      isComposer: e.origin.kind === 'composer',
    })
    if (route === 'strip') return next({ ...e, text: stripQuote(e.text) })
    if (route === 'pass' || !(await read($, autoAtom))) return next(e)
    await startFlow($, e.text)
    return { drop: 'Sent to Prompt Upgrade. Nothing runs until you press Run.' }
  }).catch(($, e, next) => next(e))

  on('ui.close', async ($, e, next) => {
    const r = await next(e)
    if (e.id === PANE && e.origin.kind === 'person') {
      const f = await read($, flowAtom)
      if (f) {
        await update($, flowAtom, () => null)
        await $.prompt.fill({ text: f.original, mode: 'replace' })
      }
    }
    return r
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const els = $.ui.resolve(e) as unknown as Els
    const { Box, Text } = els
    const cols = Math.max(20, e.props.bodyColumns)
    const view = await read($, viewAtom)
    const flow = await read($, flowAtom)
    const history = await read($, historyAtom)
    const hasInput = e.surface !== 'mobile'

    const body =
      view === 'history' && !flow
        ? historyView($, els, cols, history)
        : view === 'input' && !flow
          ? inputView($, els, cols, hasInput)
          : flow
            ? flowView($, els, cols, flow, hasInput, e.surface)
            : <Text color={MUTED}>Nothing to upgrade. Type /better and a prompt.</Text>

    return (
      <Box flexDirection="column">
        {titleBlock(els, cols)}
        {body}
      </Box>
    )
  })
}

// ── drawing ──────────────────────────────────────────────────────────────────

function titleBlock(els: Els, cols: number) {
  const { Box, Text } = els
  const title = 'PROMPT UPGRADE'
  const gold = Math.min(title.length, cols)
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={TEXT}>{fit(title, cols)}</Text>
      <Text>
        <Text color={GOLD}>{'━'.repeat(gold)}</Text>
        <Text color={HAIR}>{'─'.repeat(Math.max(0, cols - gold))}</Text>
      </Text>
    </Box>
  )
}

function heading(els: Els, cols: number, label: string) {
  const { Text } = els
  const head = fit(label.toUpperCase(), cols)
  return (
    <Text>
      <Text color={MUTED}>{head}</Text>
      <Text color={HAIR}>{` ${'─'.repeat(Math.max(0, cols - head.length - 1))}`}</Text>
    </Text>
  )
}

function chip(els: Els, key: string, label: string, kind: 'gold' | 'slate' | 'quiet', onPress: () => unknown, hotkey?: string) {
  const { Button, Text } = els
  if (kind === 'quiet') {
    return (
      <Button key={key} plain hotkey={hotkey} onPress={() => void onPress()}>
        <Text color={MUTED}>{label}</Text>
      </Button>
    )
  }
  return (
    <Button key={key} plain hotkey={hotkey} onPress={() => void onPress()}>
      <Text backgroundColor={kind === 'gold' ? GOLD : HAIR} color={kind === 'gold' ? INK : TEXT} bold={kind === 'gold'}>
        {` ${label} `}
      </Text>
    </Button>
  )
}

const STEPS: Array<{ label: string; steps: UpgradeStep[] }> = [
  { label: 'Your prompt', steps: ['reading'] },
  { label: 'Questions', steps: ['questions'] },
  { label: 'Rewrite', steps: ['rewrite'] },
  { label: 'Review', steps: ['review'] },
]

function tracker(els: Els, cols: number, flow: UpgradeFlow) {
  const { Text } = els
  const at = flow.step === 'error' ? (flow.failedAt === 'rewrite' ? 2 : 0) : STEPS.findIndex(s => s.steps.includes(flow.step))
  const short = cols < 60
  const parts = STEPS.map((s, i) => {
    const done = i < at || (flow.step === 'review' && i === 3)
    const mark = done ? '✓' : i === at ? '●' : '○'
    const color = done ? GREEN : i === at ? (flow.step === 'error' ? AMBER : GOLD) : MUTED
    const label = short ? s.label.split(' ').pop() ?? s.label : s.label
    return { text: `${mark} ${label}`, color }
  })
  return (
    <Text>
      {parts.flatMap((p, i) => [
        ...(i > 0 ? [<Text color={HAIR}>{short ? ' · ' : '  ──  '}</Text>] : []),
        <Text color={p.color} bold={p.color === GOLD}>{p.text}</Text>,
      ])}
    </Text>
  )
}

function card(els: Els, width: number | string, title: string, text: string, isGold: boolean) {
  const { Box, Text } = els
  return (
    <Box flexDirection="column" borderStyle="round" borderColor={isGold ? GOLD : HAIR} paddingX={1} width={width} flexGrow={1}>
      <Text color={isGold ? GOLD : MUTED} bold={isGold}>{title.toUpperCase()}</Text>
      <Text color={TEXT} wrap="wrap">{text}</Text>
    </Box>
  )
}

function bigTile(els: Els, value: number, label: string, isWide: boolean) {
  const { Box, Text } = els
  if (!isWide) {
    return (
      <Box borderStyle="round" borderColor={HAIR} paddingX={1} flexDirection="column">
        <Text bold color={TEXT}>{String(value)}</Text>
        <Text color={MUTED}>{label}</Text>
      </Box>
    )
  }
  const rows = bigNumber(value)
  return (
    <Box borderStyle="round" borderColor={HAIR} paddingX={1} flexDirection="column" alignItems="center">
      {rows.map(r => <Text color={TEXT}>{r}</Text>)}
      <Text color={MUTED}>{label}</Text>
    </Box>
  )
}

function flowView($: $, els: Els, cols: number, flow: UpgradeFlow, hasInput: boolean, surface: string) {
  const { Box, Text, Input } = els
  const top = (
    <Box flexDirection="column" marginBottom={1}>
      {tracker(els, cols, flow)}
    </Box>
  )

  if (flow.step === 'reading' || flow.step === 'rewrite') {
    return (
      <Box flexDirection="column">
        {top}
        {card(els, cols, 'Your prompt', flow.original, false)}
        <Text color={MUTED}>{fit(flow.step === 'reading' ? 'Reading your prompt and choosing the questions that would help most.' : 'Rewriting your prompt with what you told me.', cols)}</Text>
        <Box marginTop={1}>{chip(els, 'cancel', 'Cancel', 'quiet', () => cancel($))}</Box>
      </Box>
    )
  }

  if (flow.step === 'error') {
    return (
      <Box flexDirection="column">
        {top}
        <Box flexDirection="column" borderStyle="round" borderColor={AMBER} paddingX={1}>
          <Text color={AMBER} bold>Something went wrong</Text>
          <Text color={TEXT} wrap="wrap">{`${flow.error} Your prompt is safe and nothing was sent.`}</Text>
        </Box>
        <Box flexDirection="row" gap={1} marginTop={1}>
          {chip(els, 'retry', 'Try again', 'gold', () => (flow.failedAt === 'rewrite' ? rewrite($, flow.id) : askQuestions($, flow.id)))}
          {chip(els, 'original', 'Send my original', 'slate', () => runText($, flow.original))}
          {chip(els, 'cancel', 'Cancel', 'quiet', () => cancel($))}
        </Box>
      </Box>
    )
  }

  if (flow.step === 'questions') {
    const answered = flow.answers.filter(a => a !== null).length
    return (
      <Box flexDirection="column">
        {top}
        {heading(els, cols, `Questions · ${answered} of ${flow.questions.length} answered`)}
        {flow.questions.map((q, i) => {
          const a = flow.answers[i]
          const isDone = a !== null && a !== undefined
          const labels = [...q.options, 'Other (type it)']
          const rows = packRows(labels, Math.max(10, cols - 4))
          return (
            <Box key={`q${i}`} flexDirection="column" marginTop={1}>
              <Text>
                {isDone ? <Text color={GREEN} bold>{' ✓ '}</Text> : <Text backgroundColor={GOLD} color={INK} bold>{` ${i + 1} `}</Text>}
                <Text color={isDone ? MUTED : TEXT} bold={!isDone}>{` ${fit(q.question, cols - 4)}`}</Text>
              </Text>
              {isDone ? (
                <Text color={MUTED}>{`    ${fit(a === '' ? 'Skipped' : a ?? '', cols - 4)}`}</Text>
              ) : (
                <Box flexDirection="column" paddingLeft={4}>
                  {rows.map((row, r) => (
                    <Box key={`q${i}r${r}`} flexDirection="row" gap={1}>
                      {row.map(j => {
                        const label = labels[j] ?? ''
                        return j < q.options.length
                          ? chip(els, `q${i}o${j}`, label, 'slate', () => answer($, flow.id, i, label))
                          : chip(els, `q${i}other`, label, 'slate', () => patch($, flow.id, f => ({ ...f, otherIndex: i })))
                      })}
                      {r === rows.length - 1 ? chip(els, `q${i}skip`, 'Skip', 'quiet', () => answer($, flow.id, i, '')) : null}
                    </Box>
                  ))}
                  {flow.otherIndex === i && hasInput ? (
                    <Input key={`q${i}input`} label="Your answer" placeholder="Type it and press Enter" autoFocus onSubmit={value => (value.trim() ? answer($, flow.id, i, value.trim()) : undefined)} />
                  ) : null}
                </Box>
              )}
            </Box>
          )
        })}
        <Box flexDirection="row" gap={1} marginTop={1}>
          {chip(els, 'skip-rest', 'Skip the rest, upgrade now', 'gold', () => rewrite($, flow.id))}
          {chip(els, 'cancel', 'Cancel', 'quiet', () => cancel($))}
        </Box>
      </Box>
    )
  }

  // review
  const before = wordCount(flow.original)
  const after = wordCount(flow.upgraded)
  const isWide = cols >= 50
  const isSideBySide = cols >= 70
  const half = Math.floor((cols - 1) / 2)
  return (
    <Box flexDirection="column">
      {top}
      <Box flexDirection="row" gap={1}>
        {bigTile(els, before, 'words before', isWide)}
        {bigTile(els, after, 'words after', isWide)}
        {bigTile(els, flow.added.length, 'details added', isWide)}
      </Box>
      {flow.isEditing && hasInput ? (
        <Box flexDirection="column" marginTop={1}>
          <Input key="edit" label="Edit the upgrade" value={flow.upgraded} submitLabel="Run" autoFocus onSubmit={value => (value.trim() ? runText($, value.trim()) : undefined)} />
          <Box flexDirection="row" gap={1}>
            {chip(els, 'edit-done', 'Back', 'slate', () => patch($, flow.id, f => ({ ...f, isEditing: false })))}
            {chip(els, 'cancel', 'Cancel', 'quiet', () => cancel($))}
          </Box>
        </Box>
      ) : (
        <Box flexDirection="row" gap={1} marginTop={1}>
          {chip(els, 'run', 'Run it', 'gold', () => runText($, flow.upgraded), 'r')}
          {hasInput ? chip(els, 'edit', 'Edit', 'slate', () => patch($, flow.id, f => ({ ...f, isEditing: true })), 'e') : null}
          {chip(els, 'copy', 'Copy', 'slate', () => $.ui.copy({ text: flow.upgraded, surface: surface as 'terminal' }), 'c')}
          {chip(els, 'cancel', 'Cancel', 'quiet', () => cancel($))}
        </Box>
      )}
      <Box flexDirection="column" marginTop={1}>
        {heading(els, cols, 'What I added')}
        {flow.added.length === 0 ? (
          <Text color={MUTED}>Nothing new: your prompt was already clear.</Text>
        ) : (
          flow.added.map(a => (
            <Text>
              <Text color={GREEN}>{'+ '}</Text>
              <Text color={TEXT}>{fit(a, cols - 2)}</Text>
            </Text>
          ))
        )}
      </Box>
      <Box flexDirection={isSideBySide ? 'row' : 'column'} gap={isSideBySide ? 1 : 0} marginTop={1}>
        {card(els, isSideBySide ? half : cols, 'Your prompt', flow.original, false)}
        {card(els, isSideBySide ? cols - half - 1 : cols, 'The upgrade', flow.upgraded, true)}
      </Box>
    </Box>
  )
}

function inputView($: $, els: Els, cols: number, hasInput: boolean) {
  const { Box, Text, Input } = els
  return (
    <Box flexDirection="column">
      {heading(els, cols, 'Your prompt')}
      {hasInput ? (
        <Input key="new" label="Prompt to upgrade" placeholder="Type a rough prompt and press Enter" autoFocus onSubmit={value => (value.trim() ? startFlow($, value.trim()) : undefined)} />
      ) : (
        <Text color={MUTED}>Type /better and your prompt here.</Text>
      )}
      <Box marginTop={1}>{chip(els, 'cancel', 'Cancel', 'quiet', () => $.ui.close({ id: PANE }))}</Box>
    </Box>
  )
}

function historyView($: $, els: Els, cols: number, history: readonly UpgradeEntry[]) {
  const { Box, Text, Button } = els
  return (
    <Box flexDirection="column">
      {heading(els, cols, `Your last ${history.length} upgrades`)}
      {history.length === 0 ? <Text color={MUTED}>No upgrades yet. Type /better and a prompt.</Text> : null}
      {history.map((entry, i) => (
        <Button
          key={`h${entry.at}`}
          plain
          onPress={async () => {
            const f: UpgradeFlow = {
              ...newFlow(entry.original, entry.at),
              id: `h${entry.at}-${i}`,
              step: 'review',
              upgraded: entry.upgraded,
              added: entry.added,
            }
            await update($, flowAtom, () => f)
            await update($, viewAtom, () => 'flow' as const)
          }}
        >
          <Text color={TEXT}>{fit(entry.original.replace(/\s+/g, ' '), cols - 12)}</Text>
          <Text color={MUTED}>{`  +${entry.added.length}`}</Text>
        </Button>
      ))}
      <Box marginTop={1}>{chip(els, 'close', 'Close', 'quiet', () => $.ui.close({ id: PANE }))}</Box>
    </Box>
  )
}
