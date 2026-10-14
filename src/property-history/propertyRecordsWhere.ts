import type { AddressRecord } from '@/shared/ais'
import { quote, quoteList } from '@/shared/sql'

/**
 * The WHERE clause that picks a property's rows in the permits-style tables (permits,
 * violations, investigations, appeals share these columns). L&I has two systems of record:
 * HANSEN rows match the address, the L&I address keys, or the OPA account; eCLIPSE rows
 * match the eCLIPSE location ids, the parcel, or the OPA account. Copied from vue3-atlas,
 * where the two arms were proven to return the same rows as the old app's UNION.
 */
export function propertyRecordsWhere(address: AddressRecord): string {
  const opa = address.opaAccountNumber
    ? ` OR opa_account_num IN (${quote(address.opaAccountNumber)})`
    : ''
  const hansen =
    `address = ${quote(address.streetAddress)} ` +
    `OR addressobjectid IN (${quoteList(address.liAddressKeys)}) AND systemofrecord IN ('HANSEN')${opa}`
  const eclipse =
    `addressobjectid IN (${quoteList(address.eclipseLocationIds)}) ` +
    `OR parcel_id_num IN (${quote(address.pwdParcelId)}) AND systemofrecord IN ('ECLIPSE')${opa}`
  return `(${hansen}) OR (${eclipse})`
}
