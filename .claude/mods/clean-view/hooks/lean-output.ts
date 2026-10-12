import { atom, read, update } from 'claude-code'
import type { EngineInterface, On } from 'claude-code'

import { MARKER_TAG, isExempt, trimOutput } from './trim'

type $ = EngineInterface

const leanEnabledAtom = atom({ plugin: 'clean-view', key: 'leanEnabled' } as const, true)
const leanAtom = atom({ plugin: 'clean-view', key: 'lean' } as const, { trimmedCount: 0, charsSaved: 0 })
const STORE_LEAN = 'leanEnabled'
const STORE_KEEP = 'keepList'

export const LEAN_TEXT = `# Lean output (Clean View)
Long command output arrives trimmed, with a marker line that names the file holding the full text. Read the part you need from that file instead of running the command again. When the person asks for a command's full output, read the file and show it to them.`

let keepList: string[] = []
let baseDir = ''
let sessionDir = ''

async function folderFor($: $): Promise<string> {
  if (sessionDir) return sessionDir
  const tmp = (await $.env.get('TMPDIR')) ?? (await $.env.get('TEMP')) ?? '/tmp'
  baseDir = `${tmp.replace(/\/+$/, '')}/claude-clean-view`
  sessionDir = `${baseDir}/${await $.session.id()}`
  return sessionDir
}

async function saveKeep($: $, list: string[]) {
  keepList = list
  await $.store.set(STORE_KEEP, list)
}

async function lean($: $, raw: string): Promise<{ text: string }> {
  const args = raw.trim()
  const [word = '', ...rest] = args.split(/\s+/)
  const target = rest.join(' ').trim()
  const cmd = word.toLowerCase()
  if (cmd === 'on' || cmd === 'off') {
    await update($, leanEnabledAtom, () => cmd === 'on')
    await $.store.set(STORE_LEAN, cmd === 'on')
    return { text: cmd === 'on' ? 'Lean output is on: long command output is trimmed before it reaches Claude.' : 'Lean output is off: command output reaches Claude whole.' }
  }
  if (cmd === 'keep' || cmd === 'drop') {
    if (!target) return { text: `Name the command: /lean ${cmd} <command>.` }
    const list = cmd === 'keep' ? [...new Set([...keepList, target])] : keepList.filter(k => k !== target)
    await saveKeep($, list)
    return { text: cmd === 'keep' ? `${target} is on the keep list: its output is never trimmed.` : `${target} is off the keep list.` }
  }
  const isOn = await read($, leanEnabledAtom)
  const stats = await read($, leanAtom)
  const tokens = Math.round(stats.charsSaved / 4)
  return {
    text: [
      `Lean output is ${isOn ? 'on' : 'off'}.`,
      `This session it trimmed ${stats.trimmedCount} result${stats.trimmedCount === 1 ? '' : 's'}, keeping about ${tokens.toLocaleString('en-US')} tokens out of the context.`,
      `Keep list: ${keepList.length === 0 ? 'empty' : keepList.join(', ')}.`,
    ].join('\n'),
  }
}

type BashRecord = {
  stdout: string
  stderr: string
  isImage?: boolean
  backgroundTaskId?: string
  persistedOutputPath?: string
}

/** Session start for lean output: its switch, its keep list, /lean, and the week-old sweep. */
async function startLeanOutput($: $) {
  await update($, leanEnabledAtom, () => true)
  if ((await $.store.get(STORE_LEAN)) === false) await update($, leanEnabledAtom, () => false)
  const saved = await $.store.get(STORE_KEEP)
  keepList = Array.isArray(saved) ? saved.filter((k): k is string => typeof k === 'string') : []
  await $.command.register({ name: 'lean', description: 'Clean View: trim long command output before it reaches Claude', argumentHint: 'on | off | keep <command> | drop <command>' })
  await folderFor($)
  void $.process
    .run(['find', baseDir, '-mindepth', '1', '-maxdepth', '1', '-mtime', '+7', '-exec', 'rm', '-rf', '{}', '+'])
    .catch(() => undefined)
}

async function leanSection($: $) {
  return (await read($, leanEnabledAtom)) ? [{ id: 'clean-view:lean', text: LEAN_TEXT, scope: 'session' as const }] : []
}

export function registerLeanOutput(on: On) {
  // Matched on every session and every model: the view registers its own unmatched hooks for these two events.
  on('session.start', { cwd: /^/ }, async ($, e, next) => {
    const r = await next(e)
    try {
      await startLeanOutput($)
    } catch {
      // trimming works with its defaults
    }
    return r
  })

  on('prompt.compose', { model: /^/ }, async ($, e, next) => {
    const r = await next(e)
    return { sections: [...r.sections, ...(await leanSection($))] }
  }).catch(($, e, next) => next(e))

  on('session.end', async ($, e, next) => {
    try {
      if (sessionDir) await $.process.run(['rm', '-rf', sessionDir])
    } catch {
      // the seven-day sweep catches it next time
    }
    return next(e)
  })

  on('command.run', { command: 'lean' }, async ($, e) => {
    try {
      return await lean($, e.args)
    } catch {
      return { text: 'Lean output could not do that. Try /lean again.' }
    }
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    if (ran.deny !== undefined || e.run_in_background === true) return ran
    if (!(await read($, leanEnabledAtom)) || isExempt(e.command, keepList)) return ran

    const folder = await folderFor($)
    if (ran.isError === true) {
      const text = ran.text ?? (typeof ran.result === 'string' ? ran.result : '')
      if (text.includes(MARKER_TAG)) return ran
      const path = `${folder}/${e.tool_use_id}.txt`
      const t = trimOutput(text, { isFailed: true, path })
      if (!t) return ran
      await $.fs.write(path, text)
      await count($, text.length - t.text.length)
      return { isError: true, result: t.text, text: t.text, context: ran.context }
    }

    const rec = ran.result as BashRecord | undefined
    if (!rec || rec.isImage || rec.backgroundTaskId || typeof rec.stdout !== 'string') return ran
    const path = rec.persistedOutputPath ?? `${folder}/${e.tool_use_id}.txt`
    const out = trimOutput(rec.stdout, { isFailed: false, path })
    const err = trimOutput(rec.stderr ?? '', { isFailed: true, path })
    if (!out && !err) return ran
    if (!rec.persistedOutputPath) {
      const full = rec.stderr ? `${rec.stdout}\n--- stderr ---\n${rec.stderr}` : rec.stdout
      await $.fs.write(path, full)
    }
    const stdout = out?.text ?? rec.stdout
    const stderr = err?.text ?? rec.stderr
    await count($, rec.stdout.length + (rec.stderr ?? '').length - stdout.length - (stderr ?? '').length)
    return { result: { ...(ran.result as object), stdout, stderr }, context: ran.context }
  }).catch(($, e, next) => next(e))
}

async function count($: $, saved: number) {
  await update($, leanAtom, s => ({ trimmedCount: s.trimmedCount + 1, charsSaved: s.charsSaved + Math.max(0, saved) }))
}
