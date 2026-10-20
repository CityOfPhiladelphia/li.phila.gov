import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchViolationCases } from '../violations'
import { fetchAddress } from '@/shared/ais'
import { stubGatewayPages } from '@/__tests__/fakeGateway'
import { sampleViolationRows } from '@/__tests__/fakeServices'
import { sampleAddressRecord } from '@/__tests__/fakeAis'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchViolationCases', () => {
  it('bundles gateway rows into cases, newest case first', async () => {
    stubGatewayPages([sampleViolationRows])
    const cases = await fetchViolationCases(sampleAddressRecord)
    expect(cases.map((c) => c.caseNumber)).toEqual(['CF-2024-105044', '722473'])

    const older = cases[1]!
    expect(older).toMatchObject({
      status: 'CLOSED',
      priority: 'STANDARD',
      createdDate: '2020-01-24T15:45:50Z',
      completedDate: '2022-10-17T18:18:33Z',
      unitType: 'STE',
      unitNumber: 'STE 1945',
    })
    expect(older.violations.map((v) => v.violationNumber)).toEqual(['211985313', '211985314'])

    const newer = cases[0]!
    expect(newer.violations).toHaveLength(1)
    expect(newer.violations[0]).toMatchObject({
      id: 494400,
      code: 'PM15-302.4',
      codeTitle: 'EXTERIOR AREA WEEDS',
      date: '2024-09-24T04:00:00Z',
      resolutionCode: 'CLOSED - ADMINISTRATIVELY',
    })
    expect(newer.violations[0]!.noticeUrl).toContain('https://eclipse.phila.gov/')
  })

  it('puts a case with no created date last', async () => {
    const undated = { ...sampleViolationRows[0], casenumber: '555160', casecreateddate: null }
    stubGatewayPages([[undated, sampleViolationRows[2]!]])
    const cases = await fetchViolationCases(sampleAddressRecord)
    expect(cases.map((c) => c.caseNumber)).toEqual(['CF-2024-105044', '555160'])
    expect(cases[1]!.createdDate).toBe('')
  })

  // Runs only where a client id is set (a developer's .env.local), so it stands down in CI.
  it.skipIf(!import.meta.env.VITE_GATEWAY_CLIENT_ID)(
    'finds two known cases for 1234 Market St on the real services',
    async () => {
      const address = await fetchAddress('1234 Market St')
      expect(address).not.toBeNull()
      const cases = await fetchViolationCases(address!)
      const sixViolations = cases.find((c) => c.caseNumber === '722473')
      expect(sixViolations?.violations).toHaveLength(6)
      expect(sixViolations?.createdDate).toBe('2020-01-24T15:45:50Z') // winter
      const oneViolation = cases.find((c) => c.caseNumber === 'CF-2024-105044')
      expect(oneViolation?.violations).toHaveLength(1)
      expect(oneViolation?.completedDate).toBe('2024-09-24T13:13:42Z') // summer
    },
  )
})
