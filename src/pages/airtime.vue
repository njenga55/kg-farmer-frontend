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
  { title: 'Purchased On', key: 'createdAt' },
  { title: 'Amount (KES)', key: 'amount' },
  { title: 'Farmer', key: 'farmer.name' },
  { title: 'Farmer Code', key: 'farmer.farmerCode' },
  { title: 'Provider', key: 'airtimeDetails.provider' },
  { title: 'Recipient Phone', key: 'airtimeDetails.recipientPhoneNumber' },
]

// Computed properties for airtimes data and pagination
const airtimes = computed(() => store.state.airtimes.airtimes)
const loading = computed(() => store.state.airtimes.loading)
const currentPage = computed(() => store.state.airtimes.currentPage)
const totalPages = computed(() => store.state.airtimes.totalPages)
const totalRecords = computed(() => store.state.airtimes.totalRecords)
const limit = computed(() => store.state.airtimes.limit)


// Options for pagination and rows per page
const options = ref({
  page: currentPage,
  itemsPerPage: limit,
  sortBy: [],
  sortDesc: [],
})


// Watch the search input to trigger updates with debounce
// watch(search, newValue => {
//   if (debounceTimeout) {
//     clearTimeout(debounceTimeout) // Clear the previous timeout
//   }

//   debounceTimeout = setTimeout(() => {
//     store.dispatch('kilos/setSearchQuery', newValue) // Dispatch the search query after delay
//   }, 300) // Debounce delay (300ms)
// })

// Watch pagination options to trigger updates
watch(
  options,
  newOptions => {
    if (newOptions.page !== currentPage.value) {
      store.dispatch('airtimes/setPage', newOptions.page)
    }
  },
  { deep: true },
)

const niceDate = value => {
  return format(new Date(value), "yyyy-MM-dd h:mm a")
}


// Fetch kilos on component mount
onMounted(() => {
  store.dispatch('airtimes/fetchAirtimes')
})
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
       
        <!--
          <VCol
          cols="12"
          md="4"
          class="ms-auto"
          >
          <VTextField
          v-model="search"
          placeholder="Search ..."
          append-inner-icon="mdi-magnify"
          single-line
          dense
          outlined
          />
          </VCol> 
        -->
      </VRow>
    </VCardText>

    <!-- Data Table -->
    <VDataTable
      v-model:options="options"
      :headers="headers"
      :items="airtimes"
      loading-text="Loading airtimes... Please wait"
      :loading="loading"
    >
      <template #[`item.createdAt`]="{ item }">
        {{ niceDate(item.createdAt) }}
      </template>

      <template #[`item.amount`]="{ item }">
        <VChip
          color="info"
          class="font-weight-medium"
          size="small"
        >
          {{ item.amount }}
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
