import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { cellCentre, signatureCount, wedgePath } from './circle-layout'

describe('cellCentre', () => {
  it('puts C at the top and goes clockwise by fifths, the minors inside', () => {
    expect(cellCentre(0, 'major')).toEqual({ x: 50, y: 8.5 })
    expect(cellCentre(3, 'major')).toEqual({ x: 91.5, y: 50 })
    expect(cellCentre(6, 'minor')).toEqual({ x: 50, y: 76 })
  })
})

describe('wedgePath', () => {
  it('draws a place’s thirty degrees of its ring’s band', () => {
    const path = wedgePath(0, 'major')
    expect(path.startsWith('M ')).toBe(true)
    expect(path).toContain('A 49 49 0 0 1')
    expect(path).toContain('A 34 34 0 0 0')
    expect(path.endsWith(' Z')).toBe(true)
  })
})

describe('signatureCount', () => {
  it('writes a signature as its count of sharps or flats, and nothing for none', () => {
    expect(signatureCount({ tonic: note('E', -1), minor: false })).toBe('3♭')
    expect(signatureCount({ tonic: note('A'), minor: false })).toBe('3#')
    expect(signatureCount({ tonic: note('A'), minor: true })).toBe('')
  })
})
