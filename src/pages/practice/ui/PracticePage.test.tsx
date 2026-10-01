import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { recordAnswer } from '@/features/record-answer'
import { recordRun } from '@/features/record-run'

describe('Practice', () => {
  it('lists the studies and the progressions, each opening on Practice', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    const studies = screen.getByRole('region', { name: 'Studies' })
    expect(within(studies).getAllByRole('link')[0]?.getAttribute('href')).toMatch(
      /^\/practice\/studies\//,
    )
    const progressions = screen.getByRole('region', { name: 'Progressions' })
    expect(within(progressions).getAllByRole('link')[0]?.getAttribute('href')).toMatch(
      /^\/practice\/progressions\//,
    )
  })

  it('offers the trainers in three groups, each opening its trainer', async () => {
    await renderApp('/practice')
    const theory = await screen.findByRole('region', { name: 'Theory' })
    expect(
      within(theory)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([
      '/practice/trainers/build-chord',
      '/practice/trainers/name-chord',
      '/practice/trainers/build-scale',
      '/practice/trainers/gaps',
    ])
    const ear = screen.getByRole('region', { name: 'By ear' })
    expect(within(ear).getByRole('link', { name: 'Intervals by ear' })).toHaveAttribute(
      'href',
      '/practice/trainers/intervals-by-ear',
    )
    const reading = screen.getByRole('region', { name: 'Reading and keys' })
    expect(within(reading).getAllByRole('link')).toHaveLength(4)
  })

  it('says how many runs a trainer has, over all its levels', async () => {
    const { progressStore } = await renderApp('/practice')
    await screen.findByRole('region', { name: 'Theory' })
    act(() => {
      recordRun(progressStore, 'reading-notes:anchors', { accuracy: 90, streak: 9 })
      recordRun(progressStore, 'reading-notes:treble', { accuracy: 70, streak: 3 })
    })
    expect(screen.getByRole('link', { name: 'Reading notes Runs: 2' })).toBeInTheDocument()
  })

  it('says how many skills My gaps holds to check, gaps and unknowns alike', async () => {
    const { progressStore } = await renderApp('/practice')
    await screen.findByRole('region', { name: 'Theory' })
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    expect(screen.getByRole('link', { name: 'My gaps To check: 1' })).toBeInTheDocument()
  })

  it('lists the exercises by group, each with its level, opening in the Player', async () => {
    await renderApp('/practice')
    const scales = await screen.findByRole('region', { name: 'Scales' })
    expect(within(scales).getByRole('link', { name: 'Scale Beginner' })).toHaveAttribute(
      'href',
      '/play/exercise/scale',
    )
    const harris = screen.getByRole('region', { name: 'Barry Harris' })
    expect(within(harris).getByRole('link', { name: 'Drop-2 7ths Advanced' })).toHaveAttribute(
      'href',
      '/play/exercise/drop-two',
    )
    const chords = screen.getByRole('region', { name: 'Chords in a scale' })
    expect(
      within(chords).getByRole('link', { name: 'Chords by semitones Elementary' }),
    ).toHaveAttribute('href', '/play/chromatic')
  })

  it('opens a progression through the keys in the progression Player', async () => {
    await renderApp('/practice')
    const progressions = await screen.findByRole('region', { name: 'Progressions in every key' })
    expect(
      within(progressions).getByRole('link', { name: 'ii–V–I through the keys Elementary' }),
    ).toHaveAttribute('href', '/play/progression?p=ii7-V7-IMaj7&walk=fifths')
  })
})
