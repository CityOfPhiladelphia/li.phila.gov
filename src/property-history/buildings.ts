import { toText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
import { quoteList } from '@/shared/sql'
import type { AddressRecord } from '@/shared/ais'

/** One building certification from the building_certs table */
export interface BuildingCert {
  certNumber: string
  type: string
  inspectionDate: string
  inspectionResult: string
  expirationDate: string
  contractorName: string
  contractorAddress: string
  address: string
  unitType: string
  unitNumber: string
  zipCode: string
}

function toBuildingCert(row: DatabridgeRow): BuildingCert {
  return {
    certNumber: toText(row.buildingcertnumber),
    type: toText(row.buildingcerttype),
    inspectionDate: toText(row.inspectiondate),
    inspectionResult: toText(row.inspectionresult),
    expirationDate: toText(row.expirationdate),
    contractorName: toText(row.contractorname),
    contractorAddress: toText(row.contractoraddress),
    address: toText(row.address),
    unitType: toText(row.unit_type),
    unitNumber: toText(row.unit_num),
    zipCode: toText(row.zip),
  }
}

/** the 11 certification types and their corresponding prefixes */
const certificationTypes = [
  { type: 'Standpipe Certification', prefix: 'standpipe' },
  { type: 'Fire Alarm Certification', prefix: 'fire_alarm' },
  { type: 'Smoke Control Certification', prefix: 'smoke_control' },
  { type: 'Pier Report', prefix: 'pier' },
  { type: 'Fire Escape Report', prefix: 'fire_escape' },
  { type: 'Private Bridge Report', prefix: 'private_bridge' },
  { type: 'Emergency and Standby Power Systems Certification', prefix: 'emer_stdby_pwr_sys' },
  { type: 'Special Hazards Certification', prefix: 'special_hazards' },
  { type: 'Facade Report', prefix: 'facade' },
  { type: 'Sprinkler Certification', prefix: 'sprinkler' },
  { type: 'Damper Certification', prefix: 'damper' },
]

/** One Certification Status from the building_cert_summary table */
export interface CertificationStatus {
  type: string
  status: string
  caseFile: string
}

function toCertificationStatus(
  row: DatabridgeRow,
  type: string,
  prefix: string,
): CertificationStatus {
  return {
    type,
    status: toText(row[`${prefix}_status`]),
    caseFile: toText(row[`${prefix}_casefile`]),
  }
}

function toCertificationStatuses(row: DatabridgeRow): CertificationStatus[] {
  const statuses = certificationTypes.map((t) => toCertificationStatus(row, t.type, t.prefix))
  return statuses.filter((s) => s.status !== '')
}

/** One building, from the building_certs and building_cert_summary tables */
export interface Building {
  bin: string
  statuses: CertificationStatus[]
  certifications: BuildingCert[]
}

/** Returns one building from its summary row and the cert rows that share its BIN. */
function toBuilding(summaryRow: DatabridgeRow, certRows: DatabridgeRow[]): Building {
  const certifications = certRows.map(toBuildingCert)
  certifications.sort((a, b) => b.inspectionDate.localeCompare(a.inspectionDate))
  return {
    bin: toText(summaryRow.structure_id),
    statuses: toCertificationStatuses(summaryRow),
    certifications,
  }
}

/** Returns the rows bundled by BIN number, each bundle in the order its rows arrived. */
function groupByBin(rows: DatabridgeRow[]): Map<string, DatabridgeRow[]> {
  const groups = new Map<string, DatabridgeRow[]>()
  for (const row of rows) {
    const bin = toText(row.bin)
    const group = groups.get(bin)
    if (group) {
      group.push(row)
    } else {
      groups.set(bin, [row])
    }
  }
  return groups
}

/** Returns every building at the property that has certification records, by BIN */
export async function fetchBuildings(address: AddressRecord): Promise<Building[]> {
  const bins = quoteList(address.bins)
  const [summaryRows, certRows] = await Promise.all([
    fetchAllRows({ table: 'building_cert_summary', where: `structure_id IN (${bins})` }),
    fetchAllRows({ table: 'building_certs', where: `bin IN (${bins})` }),
  ])
  const certsByBin = groupByBin(certRows)
  return summaryRows.map((row) => toBuilding(row, certsByBin.get(toText(row.structure_id)) ?? []))
}
