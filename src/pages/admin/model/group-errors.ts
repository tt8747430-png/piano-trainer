import type { ErrorEntry } from '@/shared/api/admin'
import { feedbackText } from '@/shared/lib/error-reports'

/** The reports of one message: how many, on how many screens, and the latest of them. */
export interface ErrorGroup {
  readonly message: string
  readonly count: number
  /** How many screens (paths) it happened on. */
  readonly places: number
  readonly latest: ErrorEntry
}

/** The errors reported, one group a message, the group most recently seen first. */
export function groupErrors(entries: readonly ErrorEntry[]): readonly ErrorGroup[] {
  const byMessage = new Map<string, ErrorEntry[]>()
  for (const entry of entries)
    byMessage.set(entry.message, [...(byMessage.get(entry.message) ?? []), entry])
  return [...byMessage]
    .map(([message, all]) => {
      const latest = all.reduce((a, b) => (b.at > a.at ? b : a))
      return { message, count: all.length, places: new Set(all.map((e) => e.path)).size, latest }
    })
    .sort((a, b) => b.latest.at.localeCompare(a.latest.at))
}

/** A learner's own report (Settings › Report a problem): what they wrote, when, where, which build. */
export interface Feedback {
  readonly text: string
  readonly at: string
  readonly path: string
  readonly build: string
}

/**
 * The error reports told apart (R32): the learners' own reports, the newest first, for Feedback; and
 * the errors, without them, for the Error log.
 */
export function splitReports(entries: readonly ErrorEntry[]): {
  feedback: readonly Feedback[]
  errors: readonly ErrorEntry[]
} {
  const feedback: Feedback[] = []
  const errors: ErrorEntry[] = []
  for (const entry of entries) {
    const text = feedbackText(entry.message)
    if (text === null) errors.push(entry)
    else feedback.push({ text, at: entry.at, path: entry.path, build: entry.build })
  }
  return { feedback: feedback.sort((a, b) => b.at.localeCompare(a.at)), errors }
}
