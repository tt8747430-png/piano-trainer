import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { TrainerRecordLine } from './TrainerRecordLine'

const record = { runs: 3, best: 90, last: 75, bestStreak: 4 }

describe('TrainerRecordLine', () => {
  it('says the best and the last run in percent', () => {
    render(<TrainerRecordLine record={record} />)
    expect(screen.getByText('Best: 90%')).toBeInTheDocument()
    expect(screen.getByText('Last: 75%')).toBeInTheDocument()
  })

  it('writes the percent the Russian way', () => {
    act(() => void i18n.changeLanguage('ru'))
    render(<TrainerRecordLine record={record} />)
    expect(screen.getByText('Лучший: 90 %')).toBeInTheDocument()
  })
})
