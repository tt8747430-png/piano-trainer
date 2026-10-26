import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  createDiagramInversionsStore,
  DiagramInversionsStoreProvider,
} from '@/entities/diagram-inversion'
import { createMemoryStorage } from '@/shared/lib'
import { usePieceInversions } from '../model/use-piece-inversions'
import { PieceInversions } from './PieceInversions'

/** What a diagram below reads: the piece's inversions, and a way to choose D minor's. */
function Reader() {
  const inversions = usePieceInversions()
  if (!inversions) return <p>No piece</p>
  return (
    <button
      type="button"
      onClick={() => inversions.choose('Dm', { chosen: 2, folded: 1 })}
    >{`Dm: ${inversions.chosen.Dm ?? 'folded'}`}</button>
  )
}

const renderUnder = (ui: React.ReactNode) => {
  const store = createDiagramInversionsStore({
    storage: createMemoryStorage(),
    otherTabs: new EventTarget(),
  })
  render(<DiagramInversionsStoreProvider store={store}>{ui}</DiagramInversionsStoreProvider>)
  return store
}

describe('PieceInversions', () => {
  it('gives the diagrams under it their piece’s inversions, and chooses one for it', () => {
    const store = renderUnder(
      <PieceInversions pieceId="bz5">
        <Reader />
      </PieceInversions>,
    )
    act(() => screen.getByRole('button', { name: 'Dm: folded' }).click())
    expect(store.getState().pieces).toEqual({ bz5: { Dm: 2 } })
    expect(screen.getByRole('button', { name: 'Dm: 2' })).toBeInTheDocument()
  })

  it('gives none to music of no piece: a walk, a progression, an exercise', () => {
    renderUnder(<Reader />)
    expect(screen.getByText('No piece')).toBeInTheDocument()
  })
})
