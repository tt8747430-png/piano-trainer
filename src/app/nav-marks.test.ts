import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = resolve(import.meta.dirname, '..')

/** The marks R23 keeps to the shared components: Back's ‹, a row's ›, and the arrows. */
const MARKS = ['ChevronRight', 'ChevronLeft', 'ArrowLeft', 'ArrowRight']

/**
 * Where they may be drawn: the shared marks (`NavMarks`, Back), and the controls that move rather
 * than navigate (R23): the transport's bar back and on, a lesson's previous
 * and next section, a lesson's previous and next lesson.
 */
const ALLOWED = [
  'shared/ui/NavMarks.tsx',
  'shared/ui/BackButton.tsx',
  'widgets/practice-player/ui/Transport.tsx',
  'widgets/lesson-view/ui/LessonView.tsx',
  'pages/lesson/ui/LessonLayout.tsx',
  // The Streak calendar's month back and on.
  'widgets/practice-days/ui/PracticeCalendar.tsx',
]

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sources(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

describe('one set of navigation marks (R23, A16)', () => {
  it('draws ‹ › ← → only in the shared marks and the controls that move', () => {
    const strays = sources(SRC)
      .map((path) => ({ path: relative(SRC, path), text: readFileSync(path, 'utf8') }))
      .filter(({ text }) => {
        const icons = /import\s*\{([^}]*)\}\s*from\s*'lucide-react'/.exec(text)?.[1] ?? ''
        return icons.split(',').some((name) => MARKS.includes(name.trim()))
      })
      .map(({ path }) => path)
      .filter((path) => !ALLOWED.includes(path))
    expect(strays).toEqual([])
  })

  it('keeps no allowance that has gone', () => {
    const gone = ALLOWED.filter((path) => {
      const text = readFileSync(join(SRC, path), 'utf8')
      return !MARKS.some((mark) => new RegExp(`\\b${mark}\\b`).test(text))
    })
    expect(gone).toEqual([])
  })
})
