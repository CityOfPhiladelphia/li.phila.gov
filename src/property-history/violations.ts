import { cellText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
import type { AddressRecord } from '@/shared/ais'
import { propertyRecordsWhere } from '@/property-history/propertyRecordsWhere'

/** One violation, in our names. The gateway sends one row per violation. */
export interface Violation {
  violationNumber: string
  code: string
  codeTitle: string
  /** UTC timestamp, e.g. "2024-09-24T04:00:00Z" (midnight in Philadelphia). */
  date: string
  status: string
  resolutionDate: string
  resolutionCode: string
  /** Link to the Notice of Violation document, when L&I has published one. */
  noticeUrl: string
}

/**
 * One case, in our names, with its violations. Every row of a case repeats the case's
 * fields, so these come from the case's first row.
 */
export interface ViolationCase {
  caseNumber: string
  type: string
  status: string
  priority: string
  responsibility: string
  /** UTC timestamp, e.g. "2020-01-24T15:45:50Z" (10:45 am in Philadelphia). */
  createdDate: string
  completedDate: string
  mostRecentInvestigation: string
  address: string
  unitType: string
  unitNumber: string
  zipCode: string
  opaAccountNumber: string
  violations: Violation[]
}

function toViolation(row: DatabridgeRow): Violation {
  return {
    violationNumber: cellText(row.violationnumber),
    code: cellText(row.violationcode),
    codeTitle: cellText(row.violationcodetitle),
    date: cellText(row.violationdate),
    status: cellText(row.violationstatus),
    resolutionDate: cellText(row.violationresolutiondate),
    resolutionCode: cellText(row.violationresolutioncode),
    noticeUrl: cellText(row.publicnov),
  }
}

/** The rows of one case: every violation the gateway sent for that case number. */
type CaseRows = DatabridgeRow[]

function toViolationCase(rows: CaseRows): ViolationCase {
  // A case's rows always include the one that started the bundle.
  const first = rows[0]!
  return {
    caseNumber: cellText(first.casenumber),
    type: cellText(first.casetype),
    status: cellText(first.casestatus),
    priority: cellText(first.caseprioritydesc),
    responsibility: cellText(first.caseresponsibility),
    createdDate: cellText(first.casecreateddate),
    completedDate: cellText(first.casecompleteddate),
    mostRecentInvestigation: cellText(first.mostrecentinvestigation),
    address: cellText(first.address),
    unitType: cellText(first.unit_type),
    unitNumber: cellText(first.unit_num),
    zipCode: cellText(first.zip),
    opaAccountNumber: cellText(first.opa_account_num),
    violations: rows.map(toViolation),
  }
}

/** Returns the rows bundled by case number, each bundle in the order its rows arrived. */
function groupByCase(rows: DatabridgeRow[]): CaseRows[] {
  const groups = new Map<string, CaseRows>()
  for (const row of rows) {
    const caseNumber = cellText(row.casenumber)
    const group = groups.get(caseNumber)
    if (group) {
      group.push(row)
    } else {
      groups.set(caseNumber, [row])
    }
  }
  return Array.from(groups.values())
}

/** Returns every violation case for the property, newest first; cases with no date last. */
export async function fetchViolationCases(address: AddressRecord): Promise<ViolationCase[]> {
  const rows = await fetchAllRows({ table: 'violations', where: propertyRecordsWhere(address) })
  return groupByCase(rows)
    .map(toViolationCase)
    .sort((a, b) => b.createdDate.localeCompare(a.createdDate))
}
