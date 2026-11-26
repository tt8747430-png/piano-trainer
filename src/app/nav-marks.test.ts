import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = resolve(import.meta.dirname, '..')

/** The marks R23 keeps to the shared components: Back's ‹, a row's ›, and the arrows. */
const MARKS = ['ChevronRight', 'ChevronLeft', 'ArrowLeft', 'ArrowRight']

/**
 * Where they may be drawn: the shared marks (`NavMarks`, Back, See all), the controls that move
 * rather than navigate (R23), the text links the boards draw with a trailing ›, the disclosures
 * whose › turns down as they open, and the Settings window's own Back.
 */
const ALLOWED = [
  'shared/ui/NavMarks.tsx',
  'shared/ui/BackButton.tsx',
  // A section head's See all, its › after the count.
  'shared/ui/ShowAll.tsx',
  // The transport's bar back and on, a lesson's previous and next section.
  'widgets/practice-player/ui/Transport.tsx',
  'widgets/lesson-view/ui/LessonView.tsx',
  // The Streak calendar's month back and on.
  'widgets/practice-days/ui/PracticeCalendar.tsx',
  // The loop's grips, ‹ at its start and › at its end, which move the loop.
  'shared/ui/LoopGrip.tsx',
  // Text links with a trailing ›: an exercise's next key, a run's All practice, a key's place on the
  // circle of fifths, the next chord's All.
  'pages/player/ui/ExercisePlayerPage.tsx',
  'widgets/run-results/ui/RunResults.tsx',
  'widgets/scale-explorer/ui/KeyFifths.tsx',
  'widgets/chord-explorer/ui/NextChordSheet.tsx',
  // A folder's row on a phone, its › where a pointer shows its menu instead.
  'widgets/song-library/ui/FolderRow.tsx',
  // Disclosures, the › turning down as they open: your lessons in a course, a pattern's card.
  'widgets/curriculum/ui/OwnLibrary.tsx',
  'widgets/player-setup/ui/PatternFoldCard.tsx',
  // The Settings window's Back to its list, on a laptop and in its nav.
  'widgets/settings-screen/ui/SettingsScreen.tsx',
  'widgets/settings-screen/ui/SettingsNav.tsx',
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
