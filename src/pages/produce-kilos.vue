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
  { title: 'Weighed On', key: 'transTime' },
  { title: 'Recorded On', key: 'createdAt' },
  { title: 'Farmer', key: 'farmer.name' },
  { title: 'Net Units', key: 'netUnits' },
  { title: 'Payment Rate', key: 'paymentRate' },
  { title: 'Gross Pay', key: 'grossPay' },
  { title: 'ID Number', key: 'idNumber' },

  // { title: 'Farmer Code', key: 'farmerCode' },
]

// Computed properties for kilos data and pagination
const kilos = computed(() => store.state.kilos.kilos)
const loading = computed(() => store.state.kilos.loading)
const currentPage = computed(() => store.state.kilos.currentPage)
const totalPages = computed(() => store.state.kilos.totalPages)
const totalRecords = computed(() => store.state.kilos.totalRecords)
const limit = computed(() => store.state.kilos.limit)


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
    store.dispatch('kilos/setSearchQuery', newValue) // Dispatch the search query after delay
  }, 300) // Debounce delay (300ms)
})

// Watch pagination options to trigger updates
watch(
  options,
  newOptions => {
    if (newOptions.page !== currentPage.value) {
      store.dispatch('kilos/setPage', newOptions.page)
    }
  },
  { deep: true },
)

const niceDate = value => {
  return format(new Date(value), "yyyy-MM-dd h:mm a")
}


// Fetch kilos on component mount
onMounted(() => {
  store.dispatch('kilos/fetchKilos')
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
      </VRow>
    </VCardText>

    <!-- Data Table -->
    <VDataTable
      v-model:options="options"
      :headers="headers"
      :items="kilos"
      loading-text="Loading kilos... Please wait"
      :loading="loading"
    >
      <template #[`item.transTime`]="{ item }">
        {{ niceDate(item.transTime) }}
      </template>

      <template #[`item.createdAt`]="{ item }">
        {{ niceDate(item.createdAt) }}
      </template>

      <template #[`item.netUnits`]="{ item }">
        <VChip
          color="warning"
          class="font-weight-medium"
          size="small"
        >
          {{ item.netUnits }}
        </VChip>
      </template>

      <template #[`item.paymentRate`]="{ item }">
        <VChip
          color="info"
          class="font-weight-medium"
          size="small"
        >
          {{ item.paymentRate }}
        </VChip>
      </template>

      <template #[`item.grossPay`]="{ item }">
        <VChip
          color="success"
          class="font-weight-medium"
          size="small"
        >
          {{ item.grossPay }}
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
