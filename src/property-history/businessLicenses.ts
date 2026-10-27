import { toText, fetchAllRows, type DatabridgeRow } from '@/shared/databridge'
import type { AddressRecord } from '@/shared/ais'
import { quote, quoteList } from '@/shared/sql'

/** One business license record in our names. */
export interface BusinessLicense {
  licenseNumber: string
  type: string
  revenueCode: string
  status: string
  businessName: string
  legalName: string
  legalEntityType: string
  rentalCategory: string
  numberOfUnits: string
  issuedDate: string
  mostRecentIssuedDate: string
  expirationDate: string
  inactiveDate: string
  businessMailingAddress: string
  address: string
  unitType: string
  unitNumber: string
  zipCode: string
  opaAccountNumber: string
}

function toBusinessLicense(row: DatabridgeRow): BusinessLicense {
  return {
    licenseNumber: toText(row.licensenum),
    type: toText(row.licensetype),
    revenueCode: toText(row.revenuecode),
    status: toText(row.licensestatus),
    businessName: toText(row.business_name),
    legalName: toText(row.legalname),
    legalEntityType: toText(row.legalentitytype),
    rentalCategory: toText(row.rentalcategory),
    numberOfUnits: toText(row.numberofunits),
    issuedDate: toText(row.initialissuedate),
    mostRecentIssuedDate: toText(row.mostrecentissuedate),
    expirationDate: toText(row.expirationdate),
    inactiveDate: toText(row.inactivedate),
    businessMailingAddress: toText(row.business_mailing_address),
    address: toText(row.address),
    unitType: toText(row.unit_type),
    unitNumber: toText(row.unit_num),
    zipCode: toText(row.zip),
    opaAccountNumber: toText(row.opa_account_num),
  }
}

/**
 * Returns the WHERE clause for the property's licenses. Not propertyRecordsWhere: this table
 * has no system-of-record column, its addressobjectid holds eCLIPSE ids, and only licenses
 * addressed to the property count (addressed_license = 'Yes'), as the old app filtered.
 */
function businessLicensesWhere(address: AddressRecord): string {
  const addressObjectId = quoteList(address.eclipseLocationIds)
  const addressText = quote(address.streetAddress)
  const parcelIdNum = quote(address.pwdParcelId)
  const opaAccountNum = quote(address.opaAccountNumber)
  return `(addressobjectid IN (${addressObjectId}) OR address = ${addressText} OR parcel_id_num IN (${parcelIdNum}) OR opa_account_num IN (${opaAccountNum})) AND addressed_license = 'Yes'`
}

/** Returns every business license for the property, newest first. */
export async function fetchBusinessLicenses(address: AddressRecord): Promise<BusinessLicense[]> {
  const rows = await fetchAllRows({
    table: 'business_licenses',
    where: businessLicensesWhere(address),
  })
  return rows.map(toBusinessLicense).sort((a, b) => b.issuedDate.localeCompare(a.issuedDate))
}
