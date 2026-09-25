import { act, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { Credits } from './Credits'
import { SourceLine } from './SourceLine'
import { useSectionHeading } from './use-section-heading'

describe('section headings', () => {
  it('assembles kind, number, last and detail in the learner’s language', () => {
    const { result } = renderHook(() => useSectionHeading())
    const verse4 = {
      kind: 'verse',
      n: 4,
      detail: { en: 'and ending', ru: 'и окончание' },
      lines: [],
    } as const
    const lastChorus = {
      kind: 'chorus',
      last: true,
      detail: { en: 'in A minor', ru: 'в ля миноре' },
      lines: [],
    } as const
    expect(result.current(verse4)).toBe('Verse 4 and ending')
    expect(result.current(lastChorus)).toBe('Last chorus in A minor')
    expect(result.current({ kind: 'part', label: 'B', lines: [] })).toBe('Part B')
  })

  it('follows a switch to Russian at once', () => {
    const { result } = renderHook(() => useSectionHeading())
    act(() => void i18n.changeLanguage('ru'))
    expect(
      result.current({
        kind: 'verse',
        n: 4,
        detail: { en: 'and ending', ru: 'и окончание' },
        lines: [],
      }),
    ).toBe('4-й куплет и окончание')
  })
})

describe('credits and source', () => {
  it('labels each credit’s role and keeps the names as printed', () => {
    render(
      <Credits
        credits={[{ role: 'words-and-music', names: 'Надежда Боброва' }, { role: 'unknown' }]}
      />,
    )
    expect(screen.getByText('Words and music:')).toBeInTheDocument()
    expect(screen.getByText('Надежда Боброва')).toBeInTheDocument()
    expect(screen.getByText('Author unknown')).toBeInTheDocument()
  })

  it('cites the book, number and page', () => {
    render(<SourceLine source={{ book: 'bozhe-spasibo', number: 5, page: 16 }} />)
    expect(screen.getByText('«Боже, спасибо» · No. 5 · p. 16')).toBeInTheDocument()
  })
})
