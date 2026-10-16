import { cellText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
import type { AddressRecord } from '@/shared/ais'
import { propertyRecordsWhere } from '@/property-history/propertyRecordsWhere'

/** One permit, in our names. The table shows three fields; the detail page will use the rest. */
export interface Permit {
  id: number
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
  const unitNumber = cellText(row.unit_num)
  const unitType = cellText(row.unit_type) || 'Unit'
  const contractorAddress = [
    cellText(row.contractoraddress1),
    cellText(row.contractoraddress2),
    [cellText(row.contractorcity), cellText(row.contractorstate), cellText(row.contractorzip)]
      .join(' ')
      .trim(),
  ]
    .filter((line) => line !== '')
    .join(', ')

  return {
    id: Number(row.objectid),
    permitNumber: cellText(row.permitnumber),
    description: cellText(row.permitdescription),
    type: cellText(row.permittype),
    typeOfWork: cellText(row.typeofwork),
    status: cellText(row.status),
    issuedDate: cellText(row.permitissuedate),
    scopeOfWork: cellText(row.approvedscopeofwork),
    address: cellText(row.address),
    unit: unitNumber ? `${unitType} ${unitNumber}` : '',
    zipCode: cellText(row.zip),
    contractorName: cellText(row.contractorname),
    contractorAddress,
    opaAccountNumber: cellText(row.opa_account_num),
  }
}

/** Returns every permit for the property, newest first. */
export async function fetchPermits(address: AddressRecord): Promise<Permit[]> {
  const rows = await fetchAllRows({ table: 'permits', where: propertyRecordsWhere(address) })
  return rows.map(toPermit).sort((a, b) => b.issuedDate.localeCompare(a.issuedDate))
}
