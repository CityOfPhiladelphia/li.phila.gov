import { describe, it, expect } from 'vitest'
import { propertyRecordsWhere } from '../propertyRecordsWhere'
import { sampleAddressRecord } from '@/__tests__/fakeAis'

describe('propertyRecordsWhere', () => {
  it('matches HANSEN rows by address or L&I key and eCLIPSE rows by location id or parcel', () => {
    const where = propertyRecordsWhere(sampleAddressRecord)
    expect(where).toContain("address = '1234 MARKET ST'")
    expect(where).toContain("addressobjectid IN ('410516') AND systemofrecord IN ('HANSEN')")
    expect(where).toContain("addressobjectid IN ('129832656', '137826423', '137828178',")
    expect(where).toContain("parcel_id_num IN ('542611') AND systemofrecord IN ('ECLIPSE')")
    expect(where).toContain("opa_account_num IN ('883309050')")
  })

  it("doubles apostrophes so an address like O'NEILL ST is valid SQL", () => {
    const where = propertyRecordsWhere({ ...sampleAddressRecord, streetAddress: "100 O'NEILL ST" })
    expect(where).toContain("address = '100 O''NEILL ST'")
  })

  it('matches nothing on a key the property lacks, instead of writing invalid SQL', () => {
    const where = propertyRecordsWhere({ ...sampleAddressRecord, eclipseLocationIds: [] })
    expect(where).toContain("addressobjectid IN ('')")
    expect(where).not.toContain('IN ()')
  })
})
