<script setup>
import { format } from "date-fns"
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

// Access Vuex store
const store = useStore()

// Reactive data for the search input
const search = ref('')
let debounceTimeout = null // Declare a variable for debounce timeout

// Table headers for Kilos
const headers = [
  { title: 'Sent On', key: 'createdAt' },
  { title: 'Amount (KES)', key: 'amount' },
  { title: 'Charges', key: 'charge' },
  { title: 'Transaction Code', key: 'transactionId' },
  { title: 'Farmer (Sender)', key: 'farmer.name' },
  { title: 'Farmer Code', key: 'farmer.farmerCode' },
  { title: 'Recipient', key: 'transferDetails.recipientPhoneNumber' },
  { title: 'Tranc Status', key: 'status' },
]

// Computed properties for monies data and pagination
const monies = computed(() => store.state.monies.monies)
const loading = computed(() => store.state.monies.loading)
const currentPage = computed(() => store.state.monies.currentPage)
const totalPages = computed(() => store.state.monies.totalPages)
const totalRecords = computed(() => store.state.monies.totalRecords)
const limit = computed(() => store.state.monies.limit)


// Options for pagination and rows per page
const options = ref({
  page: currentPage,
  itemsPerPage: limit,
  sortBy: [],
  sortDesc: [],
})


// Watch the search input to trigger updates with debounce
watch(search, newValue => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout) // Clear the previous timeout
  }

  debounceTimeout = setTimeout(() => {
    store.dispatch('monies/setSearchQuery', newValue) // Dispatch the search query after delay
  }, 300) // Debounce delay (300ms)
})

// Watch pagination options to trigger updates
watch(
  options,
  newOptions => {
    if (newOptions.page !== currentPage.value) {
      store.dispatch('monies/setPage', newOptions.page)
    }
  },
  { deep: true },
)

const niceDate = value => {
  return format(new Date(value), "yyyy-MM-dd h:mm a")
}


// Fetch kilos on component mount
onMounted(() => {
  store.dispatch('monies/fetchMonies')
})

const resolveStatusVariant = status => {
  if (status === 'completed')
    return { color: 'success', text: 'Complete' }
  else
    return { color: 'warning', text: 'Pending' }
}
</script>

<template>
  <VCard>
    <VCardText>
      <!-- Search Input -->
      <VRow>
        <VCol
          cols="12"
          md="4"
          class="mt-4"
        >
          <h2>Total records: <i>{{ totalRecords }}</i></h2>
        </VCol>
       
        
        <VCol
          cols="12"
          md="4"
          class="ms-auto"
        >
          <VTextField
            v-model="search"
            placeholder="Search ...(Transaction Code)"
            append-inner-icon="mdi-magnify"
            single-line
            dense
            outlined
          />
        </VCol>
      </VRow>
    </VCardText>

    <!-- Data Table -->
    <VDataTable
      v-model:options="options"
      :headers="headers"
      :items="monies"
      loading-text="Loading monies... Please wait"
      :loading="loading"
    >
      <template #[`item.createdAt`]="{ item }">
        {{ niceDate(item.createdAt) }}
      </template>

      <template #[`item.amount`]="{ item }">
        <VChip
          color="primary"
          class="font-weight-medium"
          size="small"
        >
          {{ item.amount }}
        </VChip>
      </template>

      <template #[`item.status`]="{ item }">
        <VChip
          :color="resolveStatusVariant(item.status).color"
          class="font-weight-medium"
          size="small"
        >
          {{ resolveStatusVariant(item.status).text }}
        </VChip>
      </template>

      
      <template #bottom>
        <VCardText>
          <div class="d-flex flex-wrap justify-center justify-sm-space-between">
            <!-- Rows Per Page Selector -->
            <VSelect
              v-model="options.itemsPerPage"
              :items="[5, 10, 25, 50]"
              label="Rows per page"
              variant="underlined"
              style="max-inline-size: 8rem; min-inline-size: 5rem;"
            />

            <!-- Pagination -->
            <VPagination
              v-model="options.page"
              :total-visible="$vuetify.display.smAndDown ? 2 : 5"
              :length="totalPages"
            />
          </div>
        </VCardText>
      </template>
    </VDataTable>
  </VCard>
</template>
