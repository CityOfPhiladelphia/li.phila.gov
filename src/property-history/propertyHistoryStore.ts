import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchAddress, type AddressRecord } from '@/shared/ais'
import { fetchPermits, type Permit } from './permits'
import { fetchInvestigations, type Investigation } from './investigations'
import { fetchViolationCases, type ViolationCase } from './violations'
import { fetchAppeals, type Appeal } from './appeals'

/** The AIS lookup returns one record or nothing, so "nothing" is a state of the search. */
export type AddressSearchStatus = 'idle' | 'loading' | 'found' | 'not-found' | 'error'
/** A dataset returns a list; "nothing" is a loaded, empty list, not a status. */
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * The property the user has searched for, and everything loaded about it. One copy for
 * the whole app, so the results page, breadcrumbs, and detail pages all read the same data.
 */
export const usePropertyHistoryStore = defineStore('propertyHistory', () => {
  const address = ref<AddressRecord | null>(null)
  const addressStatus = ref<AddressSearchStatus>('idle')
  /** What the user typed, kept for the "No results found for …" message. */
  const searchedAddress = ref('')

  const permits = ref<Permit[]>([])
  const permitsStatus = ref<LoadStatus>('idle')

  const investigations = ref<Investigation[]>([])
  const investigationsStatus = ref<LoadStatus>('idle')

  const violationCases = ref<ViolationCase[]>([])
  const violationCasesStatus = ref<LoadStatus>('idle')

  const appeals = ref<Appeal[]>([])
  const appealsStatus = ref<LoadStatus>('idle')

  /** Looks up the typed address, then loads everything the app shows for that property. */
  async function loadProperty(typedAddress: string) {
    searchedAddress.value = typedAddress
    addressStatus.value = 'loading'
    address.value = null
    permits.value = []
    permitsStatus.value = 'idle'
    investigations.value = []
    investigationsStatus.value = 'idle'
    violationCases.value = []
    violationCasesStatus.value = 'idle'
    appeals.value = []
    appealsStatus.value = 'idle'

    try {
      const found = await fetchAddress(typedAddress)
      // A newer search may have started while we waited; let it win.
      if (typedAddress !== searchedAddress.value) return
      address.value = found
      addressStatus.value = found ? 'found' : 'not-found'
      if (found) await loadAllDatasets(found, typedAddress)
    } catch {
      if (typedAddress !== searchedAddress.value) return
      addressStatus.value = 'error'
    }
  }

  async function loadAllDatasets(addressRecord: AddressRecord, typedAddress: string) {
    await Promise.all([
      loadDataset(fetchPermits, permits, permitsStatus, addressRecord, typedAddress),
      loadDataset(
        fetchInvestigations,
        investigations,
        investigationsStatus,
        addressRecord,
        typedAddress,
      ),
      loadDataset(
        fetchViolationCases,
        violationCases,
        violationCasesStatus,
        addressRecord,
        typedAddress,
      ),
      loadDataset(fetchAppeals, appeals, appealsStatus, addressRecord, typedAddress),
    ])
  }

  async function loadDataset<T>(
    fetchRecords: (addressRecord: AddressRecord) => Promise<T[]>,
    records: Ref<T[]>,
    status: Ref<LoadStatus>,
    addressRecord: AddressRecord,
    typedAddress: string,
  ) {
    status.value = 'loading'
    const fetched = await fetchRecords(addressRecord).catch(() => null)
    if (typedAddress !== searchedAddress.value) return
    if (fetched) {
      records.value = fetched
      status.value = 'loaded'
    } else {
      status.value = 'error'
    }
  }

  return {
    address,
    addressStatus,
    searchedAddress,
    permits,
    permitsStatus,
    investigations,
    investigationsStatus,
    violationCases,
    violationCasesStatus,
    appeals,
    appealsStatus,
    loadProperty,
  }
})
