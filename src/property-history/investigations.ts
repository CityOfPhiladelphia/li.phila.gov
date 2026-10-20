import { cellText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
import type { AddressRecord } from '@/shared/ais'
import { propertyRecordsWhere } from '@/property-history/propertyRecordsWhere'

/** One investigation, in our names. */
export interface Investigation {
  /** L&I's id for this investigation. A case can have several, so caseNumber alone doesn't identify one. */
  processId: string
  caseNumber: string
  caseType: string
  caseResponsibility: string
  casePriority: string
  type: string
  /** UTC timestamp, e.g. "2020-05-29T14:24:12Z" (10:24 am in Philadelphia). */
  completed: string
  status: string
  address: string
  unitType: string
  unitNumber: string
  zipCode: string
  opaAccountNumber: string
}

function toInvestigation(row: DatabridgeRow): Investigation {
  return {
    processId: cellText(row.investigationprocessid),
    caseNumber: cellText(row.casenumber),
    caseType: cellText(row.casetype),
    caseResponsibility: cellText(row.caseresponsibility),
    casePriority: cellText(row.casepriority),
    type: cellText(row.investigationtype),
    completed: cellText(row.investigationcompleted),
    status: cellText(row.investigationstatus),
    address: cellText(row.address),
    unitType: cellText(row.unit_type),
    unitNumber: cellText(row.unit_num),
    zipCode: cellText(row.zip),
    opaAccountNumber: cellText(row.opa_account_num),
  }
}

/** Returns every investigation for the property, newest first. */
export async function fetchInvestigations(address: AddressRecord): Promise<Investigation[]> {
  const rows = await fetchAllRows({
    table: 'case_investigations',
    where: propertyRecordsWhere(address),
  })
  return rows.map(toInvestigation).sort((a, b) => b.completed.localeCompare(a.completed))
}
