import { vi } from 'vitest'
import type { AisProperties, AddressRecord } from '../shared/ais'

// The test property is 1234 MARKET ST (owned by SEPTA). Real values from the AIS reply,
// trimmed to the fields we read.
export const sampleAisProperties: AisProperties = {
  street_address: '1234 MARKET ST',
  opa_address: '1234 MARKET ST',
  opa_account_num: '883309050',
  pwd_parcel_id: '542611',
  li_address_key: '410516',
  eclipse_location_id:
    '129832656|137826423|137828178|15495782|508268848|508336487|508336499|508336511',
  bin: '1496963|1496964|1530931',
  li_district: 'CENTRAL EAST',
  opa_owners: ['SEPTA'],
  unit_type: '',
  unit_num: '',
  zip_code: '19107',
}

/** The same property as fetchAddress returns it: sampleAisProperties, translated. */
export const sampleAddressRecord: AddressRecord = {
  streetAddress: '1234 MARKET ST',
  opaAddress: '1234 MARKET ST',
  opaAccountNumber: '883309050',
  pwdParcelId: '542611',
  liAddressKeys: ['410516'],
  eclipseLocationIds: [
    '129832656',
    '137826423',
    '137828178',
    '15495782',
    '508268848',
    '508336487',
    '508336499',
    '508336511',
  ],
  bins: ['1496963', '1496964', '1530931'],
  liDistrict: 'CENTRAL EAST',
  owners: 'SEPTA',
  unitType: '',
  unitNumber: '',
  zipCode: '19107',
}

/** Pretends AIS answered with this status and body. Undo with vi.unstubAllGlobals(). */
export function stubAis(status: number, body?: unknown) {
  vi.stubGlobal('fetch', async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }))
}

/** Pretends AIS found the sample address. */
export function stubAisFound() {
  stubAis(200, { features: [{ properties: sampleAisProperties }] })
}
