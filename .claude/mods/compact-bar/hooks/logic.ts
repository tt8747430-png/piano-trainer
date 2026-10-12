// Pure parts of compact-bar: no engine, so the tests drive them directly.

export const FIVE_MIN = 5 * 60 * 1000
export const ONE_HOUR = 60 * 60 * 1000
export const DEFAULT_THRESHOLD = 83
export const BOXES = 20

export type Weather = { emoji: string; isStorm: boolean }

/** ☀️ up to half the threshold, 🌧️ up to 80% of it, ⛈️ above. */
export function weatherOf(percent: number | null, threshold: number): Weather {
  const p = percent ?? 0
  if (p <= threshold * 0.5) return { emoji: '☀️', isStorm: false }
  if (p <= threshold * 0.8) return { emoji: '🌧️', isStorm: false }
  return { emoji: '⛈️', isStorm: true }
}

/** Whole minutes left, rounded up, and the share left 0..1. */
export function cacheLeft(lastAt: number | null, ttlMs: number, now: number): { minutes: number; share: number } | null {
  if (lastAt === null) return null
  const left = Math.max(0, lastAt + ttlMs - now)
  return { minutes: Math.ceil(left / 60000), share: left / ttlMs }
}

/** green, yellow in the last quarter, red in the last 10%. */
export function meterColor(share: number): 'success' | 'warning' | 'error' {
  if (share <= 0.1) return 'error'
  if (share <= 0.25) return 'warning'
  return 'success'
}

export function meter(share: number, boxes = BOXES): { full: string; empty: string } {
  const n = Math.max(0, Math.min(boxes, Math.round(share * boxes)))
  return { full: '■'.repeat(n), empty: '□'.repeat(boxes - n) }
}

export type Usage = {
  input_tokens: number
  cache_read_input_tokens: number
  cache_creation_input_tokens: number
}

export function hitRateOf(u: Usage): number | null {
  const total = u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens
  return total > 0 ? Math.round((u.cache_read_input_tokens / total) * 100) : null
}

/**
 * Learns the TTL from what a response shows: a cache read after more than five
 * minutes of quiet means the hour lifetime; a full rewrite after 5–60 minutes
 * with nothing read means five minutes.
 */
export function ttlSeen(gapMs: number, u: Usage): number | null {
  if (gapMs > FIVE_MIN + 15000 && u.cache_read_input_tokens > 0) return ONE_HOUR
  if (gapMs > FIVE_MIN + 15000 && gapMs < ONE_HOUR && u.cache_read_input_tokens === 0 && u.cache_creation_input_tokens > 1000) return FIVE_MIN
  return null
}

export function fmtTokens(n: number | undefined): string {
  if (n === undefined) return '?'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${Math.round(n / 1000)}k`
  return String(n)
}

/** Splits text at paragraph breaks into pieces of at most `max` characters; a paragraph longer than that is split at lines, then at spaces. */
export function splitSummary(text: string, max = 1800): string[] {
  const out: string[] = []
  let cur = ''
  const push = (piece: string) => {
    if (cur && cur.length + 2 + piece.length > max) {
      out.push(cur)
      cur = ''
    }
    cur = cur ? `${cur}\n\n${piece}` : piece
  }
  for (const para of text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)) {
    if (para.length <= max) {
      push(para)
      continue
    }
    for (const part of hardSplit(para, max)) push(part)
  }
  if (cur) out.push(cur)
  return out
}

function hardSplit(text: string, max: number): string[] {
  const out: string[] = []
  let rest = text
  while (rest.length > max) {
    let at = rest.lastIndexOf('\n', max)
    if (at < max / 2) at = rest.lastIndexOf(' ', max)
    if (at < max / 2) at = max
    out.push(rest.slice(0, at).trimEnd())
    rest = rest.slice(at).trimStart()
  }
  if (rest) out.push(rest)
  return out
}
