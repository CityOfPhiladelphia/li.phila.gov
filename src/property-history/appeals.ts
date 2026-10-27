import { toText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
import type { AddressRecord } from '@/shared/ais'
import { propertyRecordsWhere } from '@/property-history/propertyRecordsWhere'

/** One appeal, in our names. The table shows four fields; the detail page will use the rest. */
export interface Appeal {
  appealNumber: string
  applicationType: string
  type: string
  /** UTC timestamp, e.g. "2007-06-13T17:00:00Z" (1 pm in Philadelphia). */
  scheduledDate: string
  status: string
  decision: string
  systemOfRecord: string
  primaryAppellant: string
  grounds: string
  createdDate: string
  completedDate: string
  decisionDate: string
  proviso: string
  coordinatingRco: string
  address: string
  unitType: string
  unitNumber: string
  zipCode: string
  opaAccountNumber: string
}

function toAppeal(row: DatabridgeRow): Appeal {
  return {
    appealNumber: toText(row.appealnumber),
    applicationType: toText(row.applicationtype),
    type: toText(row.appealtype),
    scheduledDate: toText(row.scheduleddate),
    status: toText(row.appealstatus),
    decision: toText(row.decision),
    systemOfRecord: toText(row.systemofrecord),
    primaryAppellant: toText(row.primaryappellant),
    grounds: toText(row.appealgrounds),
    createdDate: toText(row.createddate),
    completedDate: toText(row.completeddate),
    decisionDate: toText(row.decisiondate),
    proviso: toText(row.proviso),
    coordinatingRco: toText(row.coordinatingrco),
    address: toText(row.address),
    unitType: toText(row.unit_type),
    unitNumber: toText(row.unit_num),
    zipCode: toText(row.zip),
    opaAccountNumber: toText(row.opa_account_num),
  }
}

/** Returns every appeal for the property, newest first; appeals with no date last. */
export async function fetchAppeals(address: AddressRecord): Promise<Appeal[]> {
  const rows = await fetchAllRows({ table: 'appeals', where: propertyRecordsWhere(address) })
  return rows.map(toAppeal).sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))
}
