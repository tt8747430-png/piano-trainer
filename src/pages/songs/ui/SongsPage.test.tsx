import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Songs', () => {
  it('lists the collections, marking listings with no chart', async () => {
    await renderApp('/songs')
    expect(
      await screen.findByRole('heading', { level: 2, name: '«Боже, спасибо»' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('No chart yet').length).toBeGreaterThan(0)
  })

  it('searches through the URL and opens a song', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await user.type(await screen.findByRole('searchbox', { name: 'Search songs' }), 'душа')
    expect(router.state.location.search).toMatchObject({ q: 'душа' })
    expect(await screen.findByRole('link', { name: /Still, my soul, be still/ })).toHaveAttribute(
      'href',
      '/songs/bz5',
    )
  })

  it('says so when nothing matches, and clears the filters', async () => {
    const user = userEvent.setup()
    await renderApp('/songs?q=zzzz')
    expect(await screen.findByText('No songs match.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(
      await screen.findByRole('heading', { level: 2, name: '«Боже, спасибо»' }),
    ).toBeInTheDocument()
  })

  it('keeps one collection, which its chip names instead of a heading', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    const collections = await screen.findByRole('group', { name: 'Collections' })
    await user.click(within(collections).getByRole('button', { name: 'Hymns' }))
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })
})
