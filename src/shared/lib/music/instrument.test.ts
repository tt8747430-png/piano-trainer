import { describe, expect, it } from 'vitest'
import { INSTRUMENT_FAMILIES, INSTRUMENTS, instrumentsIn } from './instrument'

describe('instrumentsIn', () => {
  it('lists every instrument under its one family', () => {
    expect(instrumentsIn('strings')).toEqual(['violin', 'cello'])
    expect(INSTRUMENT_FAMILIES.flatMap(instrumentsIn).sort()).toEqual([...INSTRUMENTS].sort())
  })
})
