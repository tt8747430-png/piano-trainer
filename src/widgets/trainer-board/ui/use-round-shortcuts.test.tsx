import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { ShortcutsProvider, useListedShortcuts } from '@/shared/lib/shortcuts'
import { useRoundShortcuts } from './use-round-shortcuts'

function Round({ act }: { act: (() => void) | null }) {
  useRoundShortcuts({ act, answers: [], hear: null })
  const listed = useListedShortcuts()
  return (
    <ul>
      {listed.flatMap((group) => group.rows.map((row) => <li key={row.label}>{row.label}</li>))}
    </ul>
  )
}

const render = (act: (() => void) | null) =>
  renderWithSettings(
    <ShortcutsProvider mac={false}>
      <Round act={act} />
    </ShortcutsProvider>,
  )

const enterTaken = () => !fireEvent.keyDown(document.body, { key: 'Enter', code: 'Enter' })
const rows = () => screen.queryAllByRole('listitem').map((row) => row.textContent)

describe('useRoundShortcuts', () => {
  it('binds Enter to the round’s action, and lists it', () => {
    const act = vi.fn()
    render(act)
    expect(enterTaken()).toBe(true)
    expect(act).toHaveBeenCalledOnce()
    expect(rows()).toContain('Check, then the next round')
  })

  it('leaves Enter alone, and unlisted, while there is nothing to check', () => {
    render(null)
    expect(enterTaken()).toBe(false)
    expect(rows()).not.toContain('Check, then the next round')
  })
})
