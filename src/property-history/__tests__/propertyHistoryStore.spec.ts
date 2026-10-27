import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePropertyHistoryStore } from '../propertyHistoryStore'
import { stubAis, stubAisFound } from '@/__tests__/fakeAis'
import { stubServices, stubServicesHoldingAis } from '@/__tests__/fakeServices'

// A store needs a Pinia to live in. In the app, main.ts provides one; here we make a
// fresh one before each test so no test sees another's leftovers.
beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('property history store', () => {
  it('starts with no address and nothing searched', () => {
    const propertyHistoryStore = usePropertyHistoryStore()
    expect(propertyHistoryStore.addressStatus).toBe('idle')
    expect(propertyHistoryStore.address).toBeNull()
    expect(propertyHistoryStore.searchedAddress).toBe('')
  })

  it('holds the address after a successful search', async () => {
    stubAisFound()
    const propertyHistoryStore = usePropertyHistoryStore()
    await propertyHistoryStore.loadProperty('1234 market st')
    expect(propertyHistoryStore.addressStatus).toBe('found')
    expect(propertyHistoryStore.address?.streetAddress).toBe('1234 MARKET ST')
    expect(propertyHistoryStore.searchedAddress).toBe('1234 market st')
  })

  it('reports not-found when AIS has no match', async () => {
    stubAis(404)
    const propertyHistoryStore = usePropertyHistoryStore()
    await propertyHistoryStore.loadProperty('asdfqwerty')
    expect(propertyHistoryStore.addressStatus).toBe('not-found')
    expect(propertyHistoryStore.address).toBeNull()
  })

  it('reports an error when AIS fails', async () => {
    stubAis(500)
    const propertyHistoryStore = usePropertyHistoryStore()
    await propertyHistoryStore.loadProperty('1234 market st')
    expect(propertyHistoryStore.addressStatus).toBe('error')
    expect(propertyHistoryStore.address).toBeNull()
  })

  it('loads every dataset after the address is found', async () => {
    stubServices()
    const propertyHistoryStore = usePropertyHistoryStore()
    await propertyHistoryStore.loadProperty('1234 market st')
    expect(propertyHistoryStore.permitsStatus).toBe('loaded')
    expect(propertyHistoryStore.permits[0]?.address).toEqual('1234 MARKET ST')
    expect(propertyHistoryStore.investigationsStatus).toBe('loaded')
    expect(propertyHistoryStore.investigations[1]?.caseNumber).toEqual('CF-2020-020872')
    expect(propertyHistoryStore.violationCasesStatus).toBe('loaded')
    expect(propertyHistoryStore.violationCases[1]?.violations.length).toBe(2)
    expect(propertyHistoryStore.appealsStatus).toBe('loaded')
    expect(propertyHistoryStore.appeals[0]?.appealNumber).toEqual('HA-2022-002343')
    expect(propertyHistoryStore.businessLicensesStatus).toBe('loaded')
    expect(propertyHistoryStore.businessLicenses[0]?.licenseNumber).toEqual('524068')
  })

  it('handles a failed dataset load', async () => {
    stubServices({ violations: 'fail' })
    const propertyHistoryStore = usePropertyHistoryStore()
    await propertyHistoryStore.loadProperty('1234 market st')
    expect(propertyHistoryStore.violationCasesStatus).toBe('error')
    expect(propertyHistoryStore.permitsStatus).toBe('loaded')
    expect(propertyHistoryStore.investigationsStatus).toBe('loaded')
    expect(propertyHistoryStore.appealsStatus).toBe('loaded')
    expect(propertyHistoryStore.businessLicensesStatus).toBe('loaded')
  })

  it('resets when a new search is initiated', async () => {
    stubServices()
    const propertyHistoryStore = usePropertyHistoryStore()
    await propertyHistoryStore.loadProperty('1234 market st')
    expect(propertyHistoryStore.permitsStatus).toBe('loaded')
    expect(propertyHistoryStore.permits).toHaveLength(2)
    const secondSearch = propertyHistoryStore.loadProperty('1233 market st')
    expect(propertyHistoryStore.permitsStatus).toBe('idle')
    expect(propertyHistoryStore.permits).toEqual([])
    expect(propertyHistoryStore.investigationsStatus).toBe('idle')
    expect(propertyHistoryStore.investigations).toEqual([])
    expect(propertyHistoryStore.violationCasesStatus).toBe('idle')
    expect(propertyHistoryStore.violationCases).toEqual([])
    expect(propertyHistoryStore.appealsStatus).toBe('idle')
    expect(propertyHistoryStore.appeals).toEqual([])
    expect(propertyHistoryStore.businessLicensesStatus).toBe('idle')
    expect(propertyHistoryStore.businessLicenses).toEqual([])
    await secondSearch
  })

  it('handles overlapping AIS searches where the first comes back first', async () => {
    const ais = stubServicesHoldingAis()
    const propertyHistoryStore = usePropertyHistoryStore()

    const first = propertyHistoryStore.loadProperty('1234 market st')
    const second = propertyHistoryStore.loadProperty('1233 market st')

    ais.release('1234 market st') // the OLD search answers first
    await first
    expect(propertyHistoryStore.address).toBeNull()
    expect(propertyHistoryStore.addressStatus).toBe('loading')
    expect(propertyHistoryStore.searchedAddress).toBe('1233 market st')

    ais.release('1233 market st')
    await second
    expect(propertyHistoryStore.addressStatus).toBe('found')
    expect(propertyHistoryStore.address?.streetAddress).toBe('1233 MARKET ST')
    expect(propertyHistoryStore.permitsStatus).toBe('loaded')
  })

  it('handles overlapping AIS searches where the second comes back first', async () => {
    const ais = stubServicesHoldingAis()
    const propertyHistoryStore = usePropertyHistoryStore()

    const first = propertyHistoryStore.loadProperty('1234 market st')
    const second = propertyHistoryStore.loadProperty('1233 market st')

    ais.release('1233 market st') // the NEW search answers first
    await second
    expect(propertyHistoryStore.addressStatus).toBe('found')
    expect(propertyHistoryStore.address?.streetAddress).toBe('1233 MARKET ST')
    expect(propertyHistoryStore.permitsStatus).toBe('loaded')

    ais.release('1234 market st')
    await first
    expect(propertyHistoryStore.addressStatus).toBe('found')
    expect(propertyHistoryStore.address?.streetAddress).toBe('1233 MARKET ST')
    expect(propertyHistoryStore.permitsStatus).toBe('loaded')
  })
})
