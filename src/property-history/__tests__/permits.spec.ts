import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchPermits } from '../permits'
import { fetchAddress } from '@/shared/ais'
import { stubGatewayPages } from '@/__tests__/fakeGateway'
import { samplePermitRows } from '@/__tests__/fakeServices'
import { sampleAddressRecord } from '@/__tests__/fakeAis'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchPermits', () => {
  it('shapes gateway rows into permits, newest first', async () => {
    stubGatewayPages([samplePermitRows])
    const permits = await fetchPermits(sampleAddressRecord)
    expect(permits.map((p) => p.permitNumber)).toEqual(['EP-2026-004102', 'CP-2025-006422'])
    expect(permits[0]).toMatchObject({
      description: 'Electrical Permit',
      issuedDate: '2026-09-15T04:00:00Z',
      status: 'Issued',
      contractorName: 'SJ Thomas Company Inc',
    })
  })

  // Runs only where a client id is set (a developer's .env.local), so it stands down in CI.
  it.skipIf(!import.meta.env.VITE_GATEWAY_CLIENT_ID)(
    'finds two known permits for 1234 Market St on the real services',
    async () => {
      const address = await fetchAddress('1234 Market St')
      expect(address).not.toBeNull()
      const permits = await fetchPermits(address!)
      const byNumber = Object.fromEntries(permits.map((p) => [p.permitNumber, p.issuedDate]))
      expect(byNumber['EP-2026-004102']).toBe('2026-09-15T04:00:00Z') // summer
      expect(byNumber['CP-2025-006422']).toBe('2026-02-04T05:00:00Z') // winter
    },
  )
})
