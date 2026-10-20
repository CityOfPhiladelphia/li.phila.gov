import { vi } from 'vitest'
import type { DatabridgeRow } from '@/shared/databridge'
import { sampleAisProperties } from './fakeAis'
import { gatewayReply } from './fakeGateway'

/** Two real permits for 1234 MARKET ST, RAW as the gateway sends them (bare local timestamps). */
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
 * Pretends both services answer: AIS finds the sample address, and the gateway returns
 * these permit rows. Routes by URL, since both go through fetch.
 */
export function stubAisFoundAndPermits(permitRows: DatabridgeRow[] = samplePermitRows) {
  vi.stubGlobal('fetch', async (url: string) => {
    const body = url.includes('/ais/')
      ? { features: [{ properties: sampleAisProperties }] }
      : gatewayReply(permitRows)
    return { ok: true, status: 200, json: async () => body }
  })
}
