import { toText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
import type { AddressRecord } from '@/shared/ais'
import { propertyRecordsWhere } from '@/property-history/propertyRecordsWhere'

/** One permit, in our names. The table shows three fields; the detail page will use the rest. */
export interface Permit {
  permitNumber: string
  description: string
  type: string
  typeOfWork: string
  status: string
  /** UTC timestamp, e.g. "2022-06-15T04:00:00Z" (midnight in Philadelphia). */
  issuedDate: string
  scopeOfWork: string
  address: string
  unit: string
  zipCode: string
  contractorName: string
  contractorAddress: string
  opaAccountNumber: string
}

function toPermit(row: DatabridgeRow): Permit {
  const unitNumber = toText(row.unit_num)
  const unitType = toText(row.unit_type) || 'Unit'
  const contractorAddress = [
    toText(row.contractoraddress1),
    toText(row.contractoraddress2),
    [toText(row.contractorcity), toText(row.contractorstate), toText(row.contractorzip)]
      .join(' ')
      .trim(),
  ]
    .filter((line) => line !== '')
    .join(', ')

  return {
    permitNumber: toText(row.permitnumber),
    description: toText(row.permitdescription),
    type: toText(row.permittype),
    typeOfWork: toText(row.typeofwork),
    status: toText(row.status),
    issuedDate: toText(row.permitissuedate),
    scopeOfWork: toText(row.approvedscopeofwork),
    address: toText(row.address),
    unit: unitNumber ? `${unitType} ${unitNumber}` : '',
    zipCode: toText(row.zip),
    contractorName: toText(row.contractorname),
    contractorAddress,
    opaAccountNumber: toText(row.opa_account_num),
  }
}

/** Returns every permit for the property, newest first. */
export async function fetchPermits(address: AddressRecord): Promise<Permit[]> {
  const rows = await fetchAllRows({ table: 'permits', where: propertyRecordsWhere(address) })
  return rows.map(toPermit).sort((a, b) => b.issuedDate.localeCompare(a.issuedDate))
}
