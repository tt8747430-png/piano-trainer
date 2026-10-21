import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  ToolKey,
  ToolPalette,
  ToolPaletteActions,
  ToolPaletteFoot,
  ToolPalettePanel,
  ToolPaletteTab,
  ToolPaletteTabs,
} from './ToolPalette'

function Palette({ onUndo = () => {} }: { onUndo?: () => void }) {
  const [tab, setTab] = useState<'notes' | 'pitch' | 'hand'>('notes')
  return (
    <ToolPalette label="Tools" tab={tab} onTabChange={setTab}>
      <ToolPaletteActions label="Editing">
        <ToolKey label="Undo" onClick={onUndo}>
          ↶
        </ToolKey>
      </ToolPaletteActions>
      <ToolPaletteTabs label="Kinds of tools" end={<button type="button">Close tools</button>}>
        <ToolPaletteTab value="notes" label="Notes">
          ♪
        </ToolPaletteTab>
        <ToolPaletteTab value="pitch" label="Pitch">
          ♯
        </ToolPaletteTab>
        <ToolPaletteTab value="hand" label="Hand" disabled>
          ✋
        </ToolPaletteTab>
      </ToolPaletteTabs>
      <ToolPalettePanel value="notes">
        <ToolKey label="Quarter note" pressed>
          ♩
        </ToolKey>
        <ToolKey label="Rest" span="wide">
          𝄽
        </ToolKey>
        <ToolKey label="Chord" span="tall">
          C
        </ToolKey>
        <ToolKey label="Dotted" disabled>
          .
        </ToolKey>
      </ToolPalettePanel>
      <ToolPalettePanel value="pitch">
        <ToolKey label="Up a semitone">↑</ToolKey>
      </ToolPalettePanel>
      <ToolPaletteFoot>
        <span>Voice</span>
      </ToolPaletteFoot>
    </ToolPalette>
  )
}

describe('ToolPalette', () => {
  it('is a region named by its label: the actions, the kinds of tools as tabs, and the foot', () => {
    render(<Palette />)
    const palette = screen.getByRole('region', { name: 'Tools' })
    expect(within(palette).getByRole('group', { name: 'Editing' })).toBeInTheDocument()
    const tabs = within(palette).getByRole('tablist', { name: 'Kinds of tools' })
    expect(
      within(tabs)
        .getAllByRole('tab')
        .map((tab) => tab.getAttribute('aria-label')),
    ).toEqual(['Notes', 'Pitch', 'Hand'])
    expect(within(palette).getByRole('button', { name: 'Close tools' })).toBeInTheDocument()
    expect(within(palette).getByText('Voice')).toBeInTheDocument()
  })

  it('shows the chosen tab’s keys alone, and greys a tab out of reach', async () => {
    const user = userEvent.setup()
    render(<Palette />)
    expect(screen.getByRole('tab', { name: 'Notes' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Quarter note' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Up a semitone' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Pitch' }))
    expect(screen.getByRole('button', { name: 'Up a semitone' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Quarter note' })).not.toBeInTheDocument()
    const hand = screen.getByRole('tab', { name: 'Hand' })
    expect(hand).toHaveAttribute('aria-disabled', 'true')
    await user.click(hand)
    expect(screen.getByRole('tab', { name: 'Pitch' })).toHaveAttribute('aria-selected', 'true')
  })

  it('lays its keys in a grid, a wide one over two columns and a tall one over two rows', () => {
    render(<Palette />)
    expect(screen.getByRole('button', { name: 'Rest' })).toHaveClass('col-span-2')
    expect(screen.getByRole('button', { name: 'Chord' })).toHaveClass('row-span-2')
  })

  it('says which keys are on, and which are out of reach', async () => {
    const user = userEvent.setup()
    const onUndo = vi.fn()
    render(<Palette onUndo={onUndo} />)
    expect(screen.getByRole('button', { name: 'Quarter note' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Rest' })).not.toHaveAttribute('aria-pressed')
    expect(screen.getByRole('button', { name: 'Dotted' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onUndo).toHaveBeenCalledOnce()
  })
})
