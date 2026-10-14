import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchInvestigations } from '../investigations'
import { fetchAddress } from '@/shared/ais'
import { stubGatewayPages } from '@/__tests__/fakeGateway'
import { sampleInvestigationRows } from '@/__tests__/fakeServices'
import { sampleAddressRecord } from '@/__tests__/fakeAis'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchInvestigations', () => {
  it('shapes gateway rows into investigations, newest first', async () => {
    stubGatewayPages([sampleInvestigationRows])
    const investigations = await fetchInvestigations(sampleAddressRecord)
    expect(investigations.map((i) => i.caseNumber)).toEqual(['722473', 'CF-2020-020872'])
    expect(investigations[0]).toMatchObject({
      id: 64952,
      caseNumber: '722473',
      caseType: 'NOTICE OF VIOLATION',
      caseResponsibility: 'PROPERTY MAINTENANCE INVESTIGATOR',
      casePriority: 'STANDARD',
      completed: '2022-10-17T18:18:33Z',
    })
  })

  // Runs only where a client id is set (a developer's .env.local), so it stands down in CI.
  it.skipIf(!import.meta.env.VITE_GATEWAY_CLIENT_ID)(
    'finds two known investigations for 1234 Market St on the real services',
    async () => {
      const address = await fetchAddress('1234 Market St')
      expect(address).not.toBeNull()
      const investigations = await fetchInvestigations(address!)
      // Case numbers repeat (one case can have several investigations), so find rows by id.
      const passed = investigations.find((i) => i.id === 64952)
      expect(passed?.completed).toBe('2022-10-17T18:18:33Z')
      const failed = investigations.find((i) => i.id === 85541)
      expect(failed?.completed).toBe('2020-05-29T14:24:12Z')
    },
  )
})
