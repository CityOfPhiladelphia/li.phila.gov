import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchAppeals } from '../appeals'
import { fetchAddress } from '@/shared/ais'
import { stubGatewayPages } from '@/__tests__/fakeGateway'
import { sampleAppealRows } from '@/__tests__/fakeServices'
import { sampleAddressRecord } from '@/__tests__/fakeAis'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchAppeals', () => {
  it('shapes gateway rows into appeals, newest first', async () => {
    stubGatewayPages([sampleAppealRows])
    const appeals = await fetchAppeals(sampleAddressRecord)
    expect(appeals.map((a) => a.appealNumber)).toEqual(['HA-2022-002343', '1589'])
    expect(appeals[1]).toMatchObject({
      appealNumber: '1589',
      primaryAppellant: 'CARL PRIMAVERA, ESQ.',
      opaAccountNumber: '883309050',
      systemOfRecord: 'HANSEN',
    })
  })

  // Runs only where a client id is set (a developer's .env.local), so it stands down in CI.
  it.skipIf(!import.meta.env.VITE_GATEWAY_CLIENT_ID)(
    'finds two known appeals for 1234 Market St on the real services',
    async () => {
      const address = await fetchAddress('1234 Market St')
      expect(address).not.toBeNull()
      const appeals = await fetchAppeals(address!)
      const testHansen = appeals.find((a) => a.appealNumber === '1589')
      expect(testHansen?.primaryAppellant).toBe('CARL PRIMAVERA, ESQ.')
      const testEclipse = appeals.find((a) => a.appealNumber === 'HA-2022-002343')
      expect(testEclipse?.primaryAppellant).toBe('JIGNESH  PATEL')
    },
  )
})
