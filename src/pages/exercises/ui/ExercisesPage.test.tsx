import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

describe('Practice → Exercises', () => {
  it('lists the drills of no other page in three groups, technique first', async () => {
    await renderApp('/practice/exercises')
    expect(await screen.findByRole('heading', { level: 1, name: 'Exercises' })).toBeInTheDocument()
    expect(
      screen.getAllByRole('region').map((region) => region.getAttribute('aria-labelledby')),
    ).toHaveLength(3)
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['Finger technique', 'Barry Harris', 'Piano With Jonny'])
  })

  it('marks an exercise’s level, says what it trains and opens it in the Player', async () => {
    await renderApp('/practice/exercises')
    const harris = await screen.findByRole('region', { name: 'Barry Harris' })
    const row = within(harris).getByRole('link', { name: /^Drop-2 7ths \S/ })
    expect(row).toHaveAttribute('href', '/play/exercise/drop-two')
    expect(within(row).getByRole('img', { name: 'Level 4' })).toBeInTheDocument()
  })

  it('leaves a scale’s and a chord’s exercises to their own pages', async () => {
    await renderApp('/practice/exercises')
    await screen.findByRole('region', { name: 'Finger technique' })
    for (const name of [/^Scale /, /^In 3rds /, /^Arpeggio /])
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/exercises', { locale: 'ru' })
    expect(await screen.findByRole('region', { name: 'Техника пальцев' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
