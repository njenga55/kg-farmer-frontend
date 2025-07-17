<script setup>
import FarmerTransactionsDialog from '@/Dialogs/FarmerTransactionsDialog.vue'
import { format } from "date-fns"
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

// Access Vuex store
const store = useStore()

// Reactive data for the search input
const search = ref('')
let debounceTimeout = null // Declare a variable for debounce timeout

// Table headers for Farmers
const headers = [
  { title: 'Created On', key: 'createdAt' },
  { title: 'Name', key: 'name' },
  { title: 'Farmer Code', key: 'farmerCode' },
  { title: 'Phone Number', key: 'phoneNumber' },
  { title: 'ID Number', key: 'idNumber' },
  { title: 'Route Name', key: 'routeName' },
  { 
    title: 'Borrow Status', 
    key: 'canBorrow',
    align: 'center',
    sortable: false,
    width: '200px',
  },
  { 
    title: 'Transactions',
    key: 'actions',
    align: 'center',
    sortable: false,
    width: '100px',
  },
]

// Computed properties for farmers data and pagination
const farmers = computed(() => store.state.farmers.farmers)
const loading = computed(() => store.state.farmers.loading)
const currentPage = computed(() => store.state.farmers.currentPage)
const totalPages = computed(() => store.state.farmers.totalPages)
const totalRecords = computed(() => store.state.farmers.totalRecords)
const limit = computed(() => store.state.farmers.limit)


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
    store.dispatch('farmers/setSearchQuery', newValue) // Dispatch the search query after delay
  }, 300) // Debounce delay (300ms)
})

// Watch pagination options to trigger updates
watch(
  options,
  newOptions => {
    if (newOptions.page !== currentPage.value) {
      store.dispatch('farmers/setPage', newOptions.page)
    }
  },
  { deep: true },
)

// Update borrowing
// In script setup
const updateBorrowStatus = async farmer => {
  try {
    await store.dispatch('farmers/updateFarmer', {
      id: farmer._id,
      values: {
        canBorrow: farmer.canBorrow,
      },
    })
    store.dispatch('farmers/fetchFarmers')
  } catch (error) {
    // Handle error
    console.error('Update failed:', error)
    store.dispatch('farmers/fetchFarmers')
  }
}

const showTransactionsDialog = ref(false)
const selectedFarmerId = ref(null)

const openTransactionsDialog = farmerId => {
  selectedFarmerId.value = farmerId
  showTransactionsDialog.value = true
}

const niceDate = value => {
  return format(new Date(value), "yyyy-MM-dd h:mm a")
}


// Fetch farmers on component mount
onMounted(() => {
  store.dispatch('farmers/fetchFarmers')
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
      :items="farmers"
      loading-text="Loading farmers... Please wait"
      :loading="loading"
    >
      <template #[`item.createdAt`]="{ item }">
        {{ niceDate(item.createdAt) }}
      </template>

      <template #[`item.canBorrow`]="{ item }">
        <VSwitch
          v-model="item.canBorrow"
          :color="item.canBorrow ? 'success' : 'error'"
          inset
          @click.stop
          @change="updateBorrowStatus(item)"
        >
          <template #label>
            <span :class="`text-${item.canBorrow ? 'success' : 'error'}`">
              {{ item.canBorrow ? 'Allowed' : 'Blocked' }}
            </span>
          </template>
        </VSwitch>
      </template>

      <template #[`item.actions`]="{ item }">
        <VIcon
          color="primary"
          class="cursor-pointer"
          @click="openTransactionsDialog(item._id)"
        >
          mdi-eye
        </VIcon>
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
 
  <!-- ... existing content -->
  <FarmerTransactionsDialog
    v-model="showTransactionsDialog"
    :farmer-id="selectedFarmerId"
  />
</template>
