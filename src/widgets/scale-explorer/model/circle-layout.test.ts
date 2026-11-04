import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { cellCentre, signatureCount, wedgePath } from './circle-layout'

describe('cellCentre', () => {
  it('puts C at the top and goes clockwise by fifths, the minors inside', () => {
    expect(cellCentre(0, 'major')).toEqual({ x: 50, y: 8.5 })
    expect(cellCentre(3, 'major')).toEqual({ x: 91.5, y: 50 })
    expect(cellCentre(6, 'minor')).toEqual({ x: 50, y: 76 })
  })

  it('puts a split wedge’s halves either side of its centre, the sharps’ half anticlockwise', () => {
    expect(cellCentre(0, 'major', -1).x).toBeLessThan(50)
    expect(cellCentre(0, 'major', 1).x).toBeGreaterThan(50)
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

  it('draws a half as fifteen degrees, the halves meeting on the place’s centre line', () => {
    expect(wedgePath(0, 'major', -1)).toContain('50 1 L 50 16')
    expect(wedgePath(0, 'major', 1).startsWith('M 50 1 A')).toBe(true)
  })
})

describe('signatureCount', () => {
  it('writes a signature as its count of sharps or flats, and nothing for none', () => {
    expect(signatureCount({ tonic: note('E', -1), minor: false })).toBe('3♭')
    expect(signatureCount({ tonic: note('A'), minor: false })).toBe('3♯')
    expect(signatureCount({ tonic: note('A'), minor: true })).toBe('')
  })
})
