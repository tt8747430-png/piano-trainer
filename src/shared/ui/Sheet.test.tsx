import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Sheet, SheetContent } from './Sheet'

describe('Sheet', () => {
  it('covers the whole screen behind it, scrolled or not: its backdrop is fixed on every browser', async () => {
    render(
      <Sheet open>
        <SheetContent title="Export">
          <p>MusicXML</p>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByText('MusicXML')
    const backdrop = document.querySelector<HTMLElement>('[data-slot="drawer-overlay"]')
    // Safari's own variant once placed it `absolute`, at the page's top: scrolled, a band was left bare.
    expect(backdrop?.className.split(/\s+/)).toContain('fixed')
    expect(backdrop?.className).not.toMatch(/(^|\s|:)absolute(\s|$)/)
  })
})
