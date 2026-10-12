// Lean output's trimming as pure functions: a command and its output in, the text Claude reads out.

export const LINE_LIMIT = 80
export const CHAR_LIMIT = 8000
export const HEAD = 20
export const TAIL = 40
export const TAIL_FAILED = 120
export const MIDDLE_MAX = 40
export const LINE_MAX = 2000
export const MARKER_TAG = 'trimmed by Clean View'

/** Commands whose output is the content asked for: never trimmed. */
const READERS = /(^|[\s;&|()`$])(curl|wget|cat|head|tail|sed|awk|jq|grep|rg|ls|find|tree|wc|gh|terminal-browser|git\s+(?:-\S+\s+)*(?:diff|show|log|status|blame))(?=$|[\s;&|()`])/

const ERRORISH = /error|fail|warn|exception|traceback|✗|×/i

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function isExempt(command: string, keep: readonly string[] = []): boolean {
  if (READERS.test(command)) return true
  return keep.some(k => k.trim() !== '' && new RegExp(`(^|[\\s;&|()\`$/])${escape(k.trim())}(?=$|[\\s;&|()\`])`).test(command))
}

export function isOverLimit(text: string): boolean {
  return text.length > CHAR_LIMIT || countLines(text) > LINE_LIMIT
}

function countLines(text: string): number {
  let n = 1
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) n++
  return n
}

export function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]/g, '')
}

/** A line a progress bar or spinner overwrote keeps only what was drawn last. */
function lastDrawn(line: string): string {
  if (!line.includes('\r')) return line
  const parts = line.split('\r').filter(p => p !== '')
  return parts[parts.length - 1] ?? ''
}

export function fold(lines: readonly string[]): string[] {
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]!
    let j = i + 1
    while (j < lines.length && lines[j] === line) j++
    const n = j - i
    if (line.trim() === '') out.push('')
    else out.push(n > 1 ? `${line} (×${n})` : line)
    i = j
  }
  return out
}

export function commas(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export type Trimmed = { text: string; dropped: number }

/**
 * Shortens one stream of a command's output, or answers undefined when it is
 * under the limit or already trimmed. `path` is where the full text is kept.
 */
export function trimOutput(text: string, opts: { isFailed: boolean; path: string }): Trimmed | undefined {
  if (!isOverLimit(text) || text.includes(MARKER_TAG)) return undefined
  const lines = fold(stripAnsi(text).replace(/\r\n/g, '\n').split('\n').map(lastDrawn)).map(l =>
    l.length > LINE_MAX ? `${l.slice(0, LINE_MAX)}…` : l,
  )
  const cleaned = lines.join('\n')
  if (!isOverLimit(cleaned)) return { text: cleaned, dropped: 0 }

  const tail = opts.isFailed ? TAIL_FAILED : TAIL
  const keep = new Set<number>()
  for (let i = 0; i < Math.min(HEAD, lines.length); i++) keep.add(i)
  for (let i = Math.max(0, lines.length - tail); i < lines.length; i++) keep.add(i)
  let middle = 0
  for (let i = HEAD; i < lines.length - tail && middle < MIDDLE_MAX; i++) {
    if (!ERRORISH.test(lines[i]!)) continue
    middle++
    for (const j of [i - 1, i, i + 1]) if (j >= 0 && j < lines.length) keep.add(j)
  }
  const dropped = lines.length - keep.size
  const out: string[] = []
  let isMarked = false
  for (let i = 0; i < lines.length; i++) {
    if (keep.has(i)) {
      out.push(lines[i]!)
      continue
    }
    if (i > 0 && !keep.has(i - 1)) continue
    out.push(isMarked ? '…' : `… ${commas(dropped)} lines ${MARKER_TAG}. Full output: ${opts.path}`)
    isMarked = true
  }
  return { text: out.join('\n'), dropped }
}
