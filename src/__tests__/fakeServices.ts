import { vi } from 'vitest'
import type { DatabridgeRow } from '@/shared/databridge'
import { sampleAisProperties } from './fakeAis'
import { toGatewayReply } from './fakeGateway'

/**
 * Two real permits for 1234 MARKET ST, RAW as the gateway sent them before 2026-10-23: bare
 * Philadelphia timestamps, the form it still uses on ArcGIS failover. Kept bare so the fakes
 * exercise normalizeTimestamps' zone conversion; the gateway's everyday form is now '…+00:00'.
 */
export const samplePermitRows: DatabridgeRow[] = [
  {
    objectid: 861683,
    permitnumber: 'CP-2025-006422',
    permitdescription: 'Commercial Building Permit',
    permittype: 'Building',
    permitissuedate: '2026-02-04T00:00:00',
    status: 'Completed',
    typeofwork: 'Addition and/or Alteration',
    address: '1234 MARKET ST',
    zip: '19107-3721',
    contractorname: 'HERMAN GOLDNER CO INC',
    opa_account_num: '883309050',
  },
  {
    objectid: 124487,
    permitnumber: 'EP-2026-004102',
    permitdescription: 'Electrical Permit',
    permittype: 'Electrical',
    permitissuedate: '2026-09-15T00:00:00',
    status: 'Issued',
    typeofwork: 'Addition and/or Alteration',
    address: '1234 MARKET ST',
    zip: '19107-3721',
    contractorname: 'SJ Thomas Company Inc',
    opa_account_num: '883309050',
  },
]

/** Two real investigations for 1234 MARKET ST, RAW as the gateway sends them. */
export const sampleInvestigationRows: DatabridgeRow[] = [
  {
    objectid: 85541,
    casenumber: 'CF-2020-020872',
    investigationprocessid: 236599620,
    casetype: 'NOTICE OF VIOLATION',
    caseresponsibility: 'CLIP',
    casepriority: 'STANDARD',
    investigationtype: null,
    investigationcompleted: '2020-05-29T10:24:12',
    investigationstatus: 'FAILED',
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    opa_account_num: '883309050',
    systemofrecord: 'ECLIPSE',
  },
  {
    objectid: 64952,
    casenumber: '722473',
    investigationprocessid: 212381307,
    casetype: 'NOTICE OF VIOLATION',
    caseresponsibility: 'PROPERTY MAINTENANCE INVESTIGATOR',
    casepriority: 'STANDARD',
    investigationtype: null,
    investigationcompleted: '2022-10-17T14:18:33',
    investigationstatus: 'PASSED',
    address: '1234 MARKET ST',
    unit_type: 'STE',
    unit_num: 'STE 1945',
    zip: '19107-3704',
    opa_account_num: '883309050',
    systemofrecord: 'ECLIPSE',
  },
]

/**
 * Three real violations for 1234 MARKET ST, RAW as the gateway sends them: two of the six
 * in case 722473, and the only one in case CF-2024-105044.
 */
export const sampleViolationRows: DatabridgeRow[] = [
  {
    objectid: 82913,
    casenumber: '722473',
    casecreateddate: '2020-01-24T10:45:50',
    casecompleteddate: '2022-10-17T14:18:33',
    casetype: 'NOTICE OF VIOLATION',
    casestatus: 'CLOSED',
    caseresponsibility: 'PROPERTY MAINTENANCE INVESTIGATOR',
    caseprioritydesc: 'STANDARD',
    violationnumber: '211985313',
    violationdate: '2020-01-23T00:00:00',
    violationcode: 'FC-13-1007.2',
    violationcodetitle: 'EXIT SIGN ILLUMINATION',
    violationstatus: 'CLOSED',
    violationresolutiondate: '2022-10-06T00:00:00',
    violationresolutioncode: 'CLOSED - REISSUED/REWRITTEN',
    mostrecentinvestigation: '2022-10-17T14:18:33',
    publicnov: null,
    opa_account_num: '883309050',
    address: '1234 MARKET ST',
    unit_type: 'STE',
    unit_num: 'STE 1945',
    zip: '19107-3704',
    systemofrecord: 'ECLIPSE',
  },
  {
    objectid: 82914,
    casenumber: '722473',
    casecreateddate: '2020-01-24T10:45:50',
    casecompleteddate: '2022-10-17T14:18:33',
    casetype: 'NOTICE OF VIOLATION',
    casestatus: 'CLOSED',
    caseresponsibility: 'PROPERTY MAINTENANCE INVESTIGATOR',
    caseprioritydesc: 'STANDARD',
    violationnumber: '211985314',
    violationdate: '2020-01-23T00:00:00',
    violationcode: 'FC-13-904.5',
    violationcodetitle: 'WET CHEMICAL SYSTEM TEST',
    violationstatus: 'CLOSED',
    violationresolutiondate: '2022-10-06T00:00:00',
    violationresolutioncode: 'CLOSED - REISSUED/REWRITTEN',
    mostrecentinvestigation: '2022-10-17T14:18:33',
    publicnov: null,
    opa_account_num: '883309050',
    address: '1234 MARKET ST',
    unit_type: 'STE',
    unit_num: 'STE 1945',
    zip: '19107-3704',
    systemofrecord: 'ECLIPSE',
  },
  {
    objectid: 494400,
    casenumber: 'CF-2024-105044',
    casecreateddate: '2024-09-24T09:11:46',
    casecompleteddate: '2024-09-24T09:13:42',
    casetype: 'NOTICE OF VIOLATION',
    casestatus: 'CLOSED',
    caseresponsibility: 'CLIP',
    caseprioritydesc: 'STANDARD',
    violationnumber: 'VI-2024-080555',
    violationdate: '2024-09-24T00:00:00',
    violationcode: 'PM15-302.4',
    violationcodetitle: 'EXTERIOR AREA WEEDS',
    violationstatus: 'CLOSED',
    violationresolutiondate: '2024-09-24T00:00:00',
    violationresolutioncode: 'CLOSED - ADMINISTRATIVELY',
    mostrecentinvestigation: '2024-09-24T09:13:41',
    publicnov:
      'https://eclipse.phila.gov/phillylmsprod/pub/ws/DocumentDownload/download?documentId=855505920&hash=87BB47DFECB74794BDC9D50DD1B800F99AB14473E34BBAD3D5D8D887C0AD4C28',
    opa_account_num: '883309050',
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    systemofrecord: 'ECLIPSE',
  },
]

/**
 * Two real appeals for 1234 MARKET ST, RAW as the gateway sends them (labeled UTC): the one
 * zoning-board appeal, and a review-board appeal with a hearing date and a decision.
 */
export const sampleAppealRows: DatabridgeRow[] = [
  {
    objectid: 4656,
    appealnumber: '1589',
    applicationtype: 'RB_ZBA',
    appealtype: null,
    appealstatus: 'CLOSED',
    decision: 'WITHDRAWN',
    proviso: null,
    scheduleddate: '2007-06-13T17:00:00+00:00',
    createddate: '2007-03-26T19:00:00+00:00',
    completeddate: null,
    decisiondate: '2007-06-13T04:00:00+00:00',
    primaryappellant: 'CARL PRIMAVERA, ESQ.',
    appealgrounds:
      'PERMIT FOR THE ERECTION OF A NON-ACCESSORY OUTDOOR ADVERTISING SIGN ABOVE THE BOTTOM OF THE 2ND. FLOOR OF AN EXISTING BUILDING.',
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3615',
    opa_account_num: '883309050',
    systemofrecord: 'HANSEN',
  },
  {
    objectid: 30881,
    appealnumber: 'HA-2022-002343',
    applicationtype: 'L&I Review Board Other',
    appealtype: 'LIRB-H Tobacco',
    appealstatus: 'Closed',
    decision: 'City Affirmed',
    proviso: 'CITY AFFIRMED FOR LACK OF APPEARANCE',
    scheduleddate: '2023-02-02T18:15:00+00:00',
    createddate: '2022-05-25T12:15:41+00:00',
    completeddate: '2023-02-03T18:26:59+00:00',
    decisiondate: '2023-02-06T13:16:41+00:00',
    primaryappellant: 'JIGNESH  PATEL',
    appealgrounds: 'See Attached\r\n\r\n4th and Market Street SW Corner 19106',
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    opa_account_num: '883309050',
    systemofrecord: 'ECLIPSE',
  },
]

/**
 * Two real business licenses for 1234 MARKET ST, RAW as the gateway sends them: SEPTA's
 * High Rise license (inactive) and its dumpster license (active, no expiration). Both are
 * company licenses; the owner-contact columns, which can hold a private person's home
 * address, are left out.
 */
export const sampleBusinessLicenseRows: DatabridgeRow[] = [
  {
    objectid: 57283,
    addressobjectid: 15495782,
    addressed_license: 'Yes',
    licensenum: '298972',
    revenuecode: '3629',
    licensetype: 'High Rise',
    rentalcategory: null,
    initialissuedate: '2000-11-02T05:00:00+00:00',
    mostrecentissuedate: '2014-05-15T20:22:09+00:00',
    expirationdate: '2015-04-30T04:00:00+00:00',
    inactivedate: '2015-06-29T04:00:00+00:00',
    licensestatus: 'Inactive',
    numberofunits: null,
    legalname: 'SEPTA',
    legalentitytype: 'Company',
    business_name: 'SEPTA',
    business_mailing_address: '1234 MARKET ST PHILADELPHIA, PA  19107 USA',
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    opa_account_num: '883309050',
  },
  {
    objectid: 180506,
    addressobjectid: 15495782,
    addressed_license: 'Yes',
    licensenum: '524068',
    revenuecode: '3230',
    licensetype: 'Dumpster License - Private Property',
    rentalcategory: null,
    initialissuedate: '2011-01-25T20:17:07+00:00',
    mostrecentissuedate: '2013-08-13T21:32:27+00:00',
    expirationdate: null,
    inactivedate: null,
    licensestatus: 'Active',
    numberofunits: null,
    legalname: 'SEPTA',
    legalentitytype: null,
    business_name: 'SEPTA (US EQUITIES ASSET MGT LLC)',
    business_mailing_address: '1234 MARKET ST MEZZ LEVEL PHILADELPHIA, PA  19107 USA',
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    opa_account_num: '883309050',
  },
]

/**
 * Three real building certifications for 1234 MARKET ST, RAW as the gateway sends them (labeled
 * UTC): one for BIN 1496964, two for BIN 1496963, and none for BIN 1530931. Given out of date
 * order, so the shaping test proves the sort.
 */
export const sampleBuildingCertRows: DatabridgeRow[] = [
  {
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    buildingcertnumber: 'BC-2023-010701',
    buildingcerttype: 'Fire Alarm Certification',
    inspectiondate: '2023-04-26T04:00:00+00:00',
    inspectionresult: 'Certified',
    expirationdate: '2024-04-26T04:00:00+00:00',
    bin: '1496963',
    contractorname: 'JOHNSON CONTROLS US HOLDINGS INC',
    contractoraddress:
      'JOHNSON CONTROLS US HOLDINGS INC\r\n9 ROSZEL ROAD POB 8799\r\nPRINCETON, NJ  08543\r\nUSA',
    council_district: '1',
    posse_jobid: '602113878',
    objectid: 100127,
  },
  {
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    buildingcertnumber: 'BC-2024-026422',
    buildingcerttype: 'Sprinkler Certification',
    inspectiondate: '2024-08-09T04:00:00+00:00',
    inspectionresult: 'Certified',
    expirationdate: '2025-08-09T04:00:00+00:00',
    bin: '1496964',
    contractorname: 'ONEIDA FIRE PROTECTION INC',
    contractoraddress:
      'ONEIDA FIRE PROTECTION INC\r\n421 N 7TH ST., SUITE 202  \r\nPHILADELPHIA, PA  19123\r\nUSA',
    council_district: '1',
    posse_jobid: '795387494',
    objectid: 15683,
  },
  {
    address: '1234 MARKET ST',
    unit_type: null,
    unit_num: null,
    zip: '19107-3721',
    buildingcertnumber: 'BC-2023-016499',
    buildingcerttype: 'Facade Report',
    inspectiondate: '2023-06-20T04:00:00+00:00',
    inspectionresult: 'Safe',
    expirationdate: '2028-06-20T04:00:00+00:00',
    bin: '1496963',
    contractorname: "O'DONNELL & NACCARATO INC",
    contractoraddress:
      "O'DONNELL & NACCARATO INC\r\n701 MARKET STREET\r\nSUITE 6000\r\nPHILADELPHIA, PA  19106\r\nUSA",
    council_district: '1',
    posse_jobid: '631274279',
    objectid: 70661,
  },
]

/**
 * The three real building certification summaries for 1234 MARKET ST, RAW as the gateway sends
 * them: one row per BIN, with a status and case-file column for each of the eleven
 * certification types. BIN 1530931 has four statuses, two of them with case files, and no
 * cert rows above; BIN 1496963 has three statuses, none with a case file; BIN 1496964 has one.
 */
export const sampleBuildingCertSummaryRows: DatabridgeRow[] = [
  {
    structure_id: '1496964',
    id_type: 'BIN',
    standpipe_status: null,
    standpipe_casefile: null,
    fire_alarm_status: null,
    fire_alarm_casefile: null,
    smoke_control_status: null,
    smoke_control_casefile: null,
    pier_status: null,
    pier_casefile: null,
    fire_escape_status: null,
    fire_escape_casefile: null,
    private_bridge_status: null,
    private_bridge_casefile: null,
    emer_stdby_pwr_sys_status: null,
    emer_stdby_pwr_sys_casefile: null,
    special_hazards_status: null,
    special_hazards_casefile: null,
    facade_status: null,
    facade_casefile: null,
    sprinkler_status: 'Expired',
    sprinkler_casefile: null,
    damper_status: null,
    damper_casefile: null,
    objectid: 6165,
  },
  {
    structure_id: '1530931',
    id_type: 'BIN',
    standpipe_status: null,
    standpipe_casefile: null,
    fire_alarm_status: 'Expired',
    fire_alarm_casefile: 'CF-2026-141276',
    smoke_control_status: null,
    smoke_control_casefile: null,
    pier_status: null,
    pier_casefile: null,
    fire_escape_status: null,
    fire_escape_casefile: null,
    private_bridge_status: null,
    private_bridge_casefile: null,
    emer_stdby_pwr_sys_status: null,
    emer_stdby_pwr_sys_casefile: null,
    special_hazards_status: 'Deficient',
    special_hazards_casefile: 'CF-2026-141191',
    facade_status: 'Expired',
    facade_casefile: null,
    sprinkler_status: 'Expired',
    sprinkler_casefile: 'CF-2026-141276',
    damper_status: null,
    damper_casefile: null,
    objectid: 18392,
  },
  {
    structure_id: '1496963',
    id_type: 'BIN',
    standpipe_status: null,
    standpipe_casefile: null,
    fire_alarm_status: 'Expired',
    fire_alarm_casefile: null,
    smoke_control_status: null,
    smoke_control_casefile: null,
    pier_status: null,
    pier_casefile: null,
    fire_escape_status: null,
    fire_escape_casefile: null,
    private_bridge_status: null,
    private_bridge_casefile: null,
    emer_stdby_pwr_sys_status: null,
    emer_stdby_pwr_sys_casefile: null,
    special_hazards_status: 'Active',
    special_hazards_casefile: null,
    facade_status: 'Active',
    facade_casefile: null,
    sprinkler_status: null,
    sprinkler_casefile: null,
    damper_status: null,
    damper_casefile: null,
    objectid: 25642,
  },
]

/** What the fake gateway answers for one table: rows, or a 500. */
type TableAnswer = DatabridgeRow[] | 'fail'

/** Answers per gateway table. A table left out gets its sample rows. */
export interface TableAnswers {
  permits?: TableAnswer
  case_investigations?: TableAnswer
  violations?: TableAnswer
  appeals?: TableAnswer
  business_licenses?: TableAnswer
  building_certs?: TableAnswer
  building_cert_summary?: TableAnswer
}

const sampleAnswers: TableAnswers = {
  permits: samplePermitRows,
  case_investigations: sampleInvestigationRows,
  violations: sampleViolationRows,
  appeals: sampleAppealRows,
  business_licenses: sampleBusinessLicenseRows,
  building_certs: sampleBuildingCertRows,
  building_cert_summary: sampleBuildingCertSummaryRows,
}

/**
 * Returns what AIS answers for this search URL: the sample address, with the street address
 * echoing what was searched for, so a test can tell one search's record from another's.
 */
function buildAisReply(url: string) {
  const searched = decodeURIComponent(new URL(url).pathname.split('/search/')[1] ?? '')
  const properties = { ...sampleAisProperties, street_address: searched.toUpperCase() }
  const body = { features: [{ properties }] }
  return { ok: true, status: 200, json: async () => body }
}

/** Returns what the gateway answers for this URL: the table's rows, or a 500. */
function buildGatewayReply(url: string, answers: TableAnswers) {
  const table = new URL(url).searchParams.get('table') as keyof TableAnswers
  const answer = answers[table] ?? sampleAnswers[table] ?? []
  if (answer === 'fail') {
    return { ok: false, status: 500, json: async () => ({}) }
  }
  return { ok: true, status: 200, json: async () => toGatewayReply(answer) }
}

/**
 * Pretends both services answer: AIS finds the searched address, and the gateway answers each
 * table with its sample rows unless told otherwise. Both go through fetch, so this routes by
 * URL: the AIS path, or the gateway's `table` query parameter.
 */
export function stubServices(answers: TableAnswers = {}) {
  vi.stubGlobal('fetch', async (url: string) => {
    return url.includes('/ais/') ? buildAisReply(url) : buildGatewayReply(url, answers)
  })
}

/** An AIS search the fake has received but not yet answered; calling respond() answers it. */
interface HeldSearch {
  url: string
  respond: () => void
}

/**
 * Like stubServices, but AIS stays silent until the test calls release(address). The gateway
 * still answers at once. For testing what happens when searches overlap.
 */
export function stubServicesHoldingAis() {
  const held: HeldSearch[] = []
  vi.stubGlobal('fetch', (url: string) => {
    if (!url.includes('/ais/')) return Promise.resolve(buildGatewayReply(url, {}))
    return new Promise((resolve) => {
      held.push({ url, respond: () => resolve(buildAisReply(url)) })
    })
  })
  return {
    /** Lets AIS answer the search for this address. */
    release(address: string) {
      const search = held.find((h) => h.url.includes(encodeURIComponent(address)))
      if (!search) throw new Error(`no AIS search is waiting for "${address}"`)
      search.respond()
    },
  }
}
