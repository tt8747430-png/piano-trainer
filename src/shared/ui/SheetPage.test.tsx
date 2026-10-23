import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PAGE, PAGE_STRETCH } from '@/shared/lib'
import { SheetPage } from './SheetPage'

const blocks = ['First line', 'Second line', 'Third line'].map((text) => ({
  key: text,
  content: <p>{text}</p>,
}))

const gaps = () => [...document.querySelectorAll<HTMLElement>('[data-slot="page-gap"]')]

describe('SheetPage', () => {
  it('spreads its systems down a full page, each gap growing at most by the stretch (LilyPond’s ragged-bottom off)', () => {
    render(<SheetPage number={1} filled gap={16} blocks={blocks} />)
    const page = screen.getByText('First line').closest('[data-slot="sheet-page"]')
    expect(page).toHaveStyle({ width: `${PAGE.width}px`, minHeight: `${PAGE.height}px` })
    // Between the blocks, never before the first or after the last: the last line meets the margin.
    expect(gaps()).toHaveLength(2)
    for (const gap of gaps())
      expect(gap).toHaveStyle({
        flexGrow: '1',
        flexBasis: '16px',
        maxHeight: `${16 + PAGE_STRETCH}px`,
      })
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('leaves the last page ragged: its gaps as they are', () => {
    render(<SheetPage number={3} filled={false} gap={16} blocks={blocks} />)
    for (const gap of gaps()) expect(gap).toHaveStyle({ flexGrow: '0', flexBasis: '16px' })
  })
})
