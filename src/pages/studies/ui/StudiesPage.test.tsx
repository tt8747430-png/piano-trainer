import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

const tabs = () =>
  within(screen.getByRole('navigation', { name: 'Accompaniment' })).getAllByRole('link')

describe('Practice → Accompaniment → Studies', () => {
  it('is Accompaniment’s second tab, listing the studies, each opening its page', async () => {
    await renderApp('/practice/studies')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Accompaniment' }),
    ).toBeInTheDocument()
    expect(tabs().map((tab) => [tab.textContent, tab.getAttribute('aria-current')])).toEqual([
      ['Patterns', null],
      ['Studies', 'page'],
    ])
    const rows = within(screen.getByRole('main')).getAllByRole('link')
    expect(rows.some((row) => row.getAttribute('href') === '/practice/studies/ex3')).toBe(true)
  })

  it('changes page from a tab, without a new step of history', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/studies')
    await screen.findByRole('heading', { level: 1, name: 'Accompaniment' })
    const before = router.history.length
    await user.click(screen.getByRole('link', { name: 'Patterns' }))
    expect(await screen.findByRole('region', { name: 'Rhythm styles' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/practice/patterns')
    expect(router.history.length).toBe(before)
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/studies', { locale: 'ru' })
    expect(await screen.findByRole('link', { name: 'Этюды' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(untranslated(document.body)).toEqual([])
  })
})
