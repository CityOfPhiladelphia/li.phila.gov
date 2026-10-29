import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchBuildings } from '../buildings'
import { fetchAddress } from '@/shared/ais'
import { stubGatewayPages } from '@/__tests__/fakeGateway'
import { sampleBuildingCertSummaryRows, sampleBuildingCertRows } from '@/__tests__/fakeServices'
import { sampleAddressRecord } from '@/__tests__/fakeAis'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchBuildings', () => {
  it('shapes gateway rows into building objects', async () => {
    stubGatewayPages([sampleBuildingCertSummaryRows, sampleBuildingCertRows])
    const buildings = await fetchBuildings(sampleAddressRecord)
    expect(buildings.map((b) => b.bin)).toEqual(['1496964', '1530931', '1496963'])
    expect(buildings[1]!.statuses).toHaveLength(4)
    expect(buildings[1]!.certifications).toEqual([])
    expect(buildings[2]!.certifications.map((c) => c.certNumber)).toEqual([
      'BC-2023-016499',
      'BC-2023-010701',
    ])
    expect(buildings[1]!.statuses[0]).toMatchObject({
      type: 'Fire Alarm Certification',
      status: 'Expired',
      caseFile: 'CF-2026-141276',
    })
  })

  it("asks both tables for the property's BINs", async () => {
    const requests = stubGatewayPages([sampleBuildingCertSummaryRows, sampleBuildingCertRows])
    await fetchBuildings(sampleAddressRecord)
    expect(new URL(requests[0]!).searchParams.get('where')).toBe(
      "structure_id IN ('1496963', '1496964', '1530931')",
    )
    expect(new URL(requests[1]!).searchParams.get('where')).toBe(
      "bin IN ('1496963', '1496964', '1530931')",
    )
  })

  it.skipIf(!import.meta.env.VITE_GATEWAY_CLIENT_ID)(
    'finds buildings for 1234 Market St on the real services',
    async () => {
      const address = await fetchAddress('1234 Market St')
      expect(address).not.toBeNull()
      const buildings = await fetchBuildings(address!)
      const building = buildings.find((b) => b.bin === '1496963')
      const cert = building?.certifications.find((c) => c.certNumber === 'BC-2023-016499')
      expect(cert?.type).toBe('Facade Report')
    },
  )
})
