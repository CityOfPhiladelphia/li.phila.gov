import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchBusinessLicenses } from '../businessLicenses'
import { fetchAddress } from '@/shared/ais'
import { stubGatewayPages } from '@/__tests__/fakeGateway'
import { sampleBusinessLicenseRows } from '@/__tests__/fakeServices'
import { sampleAddressRecord } from '@/__tests__/fakeAis'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchBusinessLicenses', () => {
  it('shapes gateway rows into business licenses, newest first', async () => {
    stubGatewayPages([sampleBusinessLicenseRows])
    const licenses = await fetchBusinessLicenses(sampleAddressRecord)
    expect(licenses.map((l) => l.licenseNumber)).toEqual(['524068', '298972'])
    expect(licenses[0]).toMatchObject({
      licenseNumber: '524068',
      type: 'Dumpster License - Private Property',
      businessName: 'SEPTA (US EQUITIES ASSET MGT LLC)',
      opaAccountNumber: '883309050',
    })
  })

  // Runs only where a client id is set (a developer's .env.local), so it stands down in CI.
  it.skipIf(!import.meta.env.VITE_GATEWAY_CLIENT_ID)(
    'finds two business licenses for 1234 Market St on the real services',
    async () => {
      const address = await fetchAddress('1234 Market St')
      expect(address).not.toBeNull()
      const licenses = await fetchBusinessLicenses(address!)
      const testLicense = licenses.find((l) => l.licenseNumber === '524068')
      expect(testLicense?.type).toBe('Dumpster License - Private Property')
    },
  )
})
