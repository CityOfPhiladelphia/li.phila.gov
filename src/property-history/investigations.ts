import { toText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
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
    processId: toText(row.investigationprocessid),
    caseNumber: toText(row.casenumber),
    caseType: toText(row.casetype),
    caseResponsibility: toText(row.caseresponsibility),
    casePriority: toText(row.casepriority),
    type: toText(row.investigationtype),
    completed: toText(row.investigationcompleted),
    status: toText(row.investigationstatus),
    address: toText(row.address),
    unitType: toText(row.unit_type),
    unitNumber: toText(row.unit_num),
    zipCode: toText(row.zip),
    opaAccountNumber: toText(row.opa_account_num),
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
