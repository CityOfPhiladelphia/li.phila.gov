import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchAddress } from '../ais'
import {
  sampleAisProperties,
  sampleAddressRecord,
  stubAis,
  stubAisFound,
} from '@/__tests__/fakeAis'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchAddress', () => {
  it('shapes an AIS feature into an address record', async () => {
    stubAisFound()
    const record = await fetchAddress('1234 market st')
    expect(record).toEqual(sampleAddressRecord)
  })

  it('gives empty lists when the pipe-separated ids are missing', async () => {
    stubAis(200, {
      features: [{ properties: { ...sampleAisProperties, eclipse_location_id: null, bin: '' } }],
    })
    const record = await fetchAddress('1234 market st')
    expect(record?.eclipseLocationIds).toEqual([])
    expect(record?.bins).toEqual([])
  })

  it('shows 2 owners correctly', async () => {
    stubAis(200, {
      features: [{ properties: { ...sampleAisProperties, opa_owners: ['A', 'B'] } }],
    })
    expect((await fetchAddress('x'))?.owners).toBe('A, B')
  })

  it('shows no owners when opa_owners is null', async () => {
    stubAis(200, {
      features: [{ properties: { ...sampleAisProperties, opa_owners: null } }],
    })
    expect((await fetchAddress('x'))?.owners).toBe('')
  })

  it('returns null when AIS has no match', async () => {
    stubAis(404)
    expect(await fetchAddress('asdfqwerty')).toBeNull()
  })

  it('throws when AIS fails for any other reason', async () => {
    stubAis(500)
    await expect(fetchAddress('1234 market st')).rejects.toThrow('status 500')
  })

  // Runs only where a client id is set (a developer's .env.local), so it stands down in CI.
  it.skipIf(!import.meta.env.VITE_GATEWAY_CLIENT_ID)(
    'finds 1234 Market St on the real service',
    async () => {
      const record = await fetchAddress('1234 Market St')
      expect(record?.streetAddress).toBe('1234 MARKET ST')
      expect(record?.liDistrict).toBe('CENTRAL EAST')
      expect(record?.bins.length).toBeGreaterThan(0)
    },
  )
})
