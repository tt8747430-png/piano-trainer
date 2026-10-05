import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

describe('Learn', () => {
  it('lists the lessons under their module, each with what it is about and its level', async () => {
    await renderApp('/learn')
    const fundamentals = await screen.findByRole('region', { name: 'Fundamentals' })
    const lesson = within(fundamentals).getByRole('link', {
      name: /^How to read chord symbols Chords/,
    })
    expect(lesson).toHaveAttribute('href', '/learn/lessons/reading-chord-symbols')
    expect(within(lesson).getByRole('img', { name: 'Level 1' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Accompaniment' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Gospel' })).toBeInTheDocument()
  })

  it('numbers a module’s lessons in the order they are taught', async () => {
    await renderApp('/learn')
    const gospel = await screen.findByRole('region', { name: 'Gospel' })
    expect(
      within(gospel)
        .getAllByRole('link')
        .map((link) => link.querySelector('[data-slot="row-tile"]')?.textContent),
    ).toEqual(['1', '2', '3'])
  })

  it('holds lessons only: what is explored and practised is on Practice', async () => {
    await renderApp('/learn')
    await screen.findByRole('region', { name: 'Fundamentals' })
    expect(screen.queryByRole('link', { name: 'Chord finder' })).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/learn', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
