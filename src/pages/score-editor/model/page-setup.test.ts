import { describe, expect, it } from 'vitest'
import { savedLayout } from '@/entities/piece'
import { pageSetup } from './page-setup'

describe('the Layout’s page (A40)', () => {
  it('is an upright A4 with Flat’s standard margins and staff where the score says none', () => {
    expect(pageSetup(undefined)).toMatchObject({
      width: 210,
      height: 297,
      margins: { top: 15, bottom: 15, left: 15, right: 15 },
      staffMm: 7,
      noteSpacing: 0.5,
      measureNumbers: 'system',
      hideEmpty: 'never',
      font: 'Bravura',
      systemBars: undefined,
    })
  })

  it('turns the page, sets its size, margins, staff, spacing, systems and font', () => {
    const page = pageSetup({
      pageSize: 'letter',
      orientation: 'landscape',
      margins: { top: 1, bottom: 2, left: 2.5, right: 0.5 },
      staffSize: 8.5,
      noteSpacing: 100,
      barsPerLine: 4,
      font: 'Petaluma',
    })
    expect(page).toMatchObject({
      width: 279.4,
      height: 215.9,
      margins: { top: 10, bottom: 20, left: 25, right: 5 },
      staffMm: 8.5,
      noteSpacing: 1,
      systemBars: 4,
      font: 'Petaluma',
    })
  })

  it('keeps a saved layout field by field, in range, the standard ones left out', () => {
    expect(
      savedLayout({
        pageSize: 'a3',
        orientation: 'portrait',
        staffSize: 12,
        staffSpace: 'wide',
        margins: { top: 1, bottom: 1, left: 1 },
        hideEmpty: 'always',
        font: 'Gootville',
      }),
    ).toEqual({ pageSize: 'a3', staffSize: 9, hideEmpty: 'always' })
    expect(savedLayout({ staffSize: 7, measureNumbers: 'system' })).toBeUndefined()
  })
})
