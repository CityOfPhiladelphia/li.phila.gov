import { describe, it, expect } from 'vitest'
import { countOf } from '../countOf'

describe('countOf', () => {
  it('checks that the countOf function is outputting correctly', () => {
    expect(countOf(0, 'Permit', 'Permits')).toBe('No Permits')
    expect(countOf(1, 'Permit', 'Permits')).toBe('1 Permit')
    expect(countOf(2, 'Permit', 'Permits')).toBe('2 Permits')
  })
})
