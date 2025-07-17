<script setup>
import { format } from 'date-fns'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const search = ref('')
let debounceTimeout = null

// Stats cards data
const stats = ref([
  { title: 'TOTAL LOAN', icon: 'mdi-cash', key: 'totalLoanAmount', color: 'primary' },
  { title: 'TOTAL AIRTIME', icon: 'mdi-phone', key: 'totalAirtimeAmount', color: 'info' },
  { title: 'TOTAL TRANSFER', icon: 'mdi-bank-transfer', key: 'totalTransferAmount', color: 'success' },
  { title: 'TOTAL KGS', icon: 'mdi-scale', key: 'totalKgs', color: 'warning' },
  { title: 'FARMERS', icon: 'mdi-account-group', key: 'numberOfFarmersWhoBorrowed', color: 'error' },
])

// Table headers with consistent alignment
const headers = [
  { title: 'DATE', key: 'date', width: '140px', align: 'start' },
  { title: 'LOANS (KES)', key: 'totalLoanAmount', align: 'end', width: '150px' },
  { title: 'AIRTIME (KES)', key: 'totalAirtimeAmount', align: 'end', width: '150px' },
  { title: 'TRANSFERS (KES)', key: 'totalTransferAmount', align: 'end', width: '160px' },
  { title: 'KILOS (KG)', key: 'totalKgs', align: 'end', width: '150px' },
  { title: 'FARMERS', key: 'numberOfFarmersWhoBorrowed', align: 'end', width: '140px' },
  { title: 'ACTIONS', key: 'actions', sortable: false, align: 'center', width: '100px' },
]

// Computed properties
const dailyReports = computed(() => store.state.dailyReports.dailyReports)
const loading = computed(() => store.state.dailyReports.loading)
const currentPage = computed(() => store.state.dailyReports.currentPage)
const totalPages = computed(() => store.state.dailyReports.totalPages)
const totalRecords = computed(() => store.state.dailyReports.totalRecords)
const limit = computed(() => store.state.dailyReports.limit)
const options = ref({ page: currentPage, itemsPerPage: limit })

// Watchers
watch(search, newValue => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    store.dispatch('dailyReports/setSearchQuery', newValue)
  }, 300)
})

watch(options, newOptions => {
  if (newOptions.page !== currentPage.value) {
    store.dispatch('dailyReports/setPage', newOptions.page)
  }
}, { deep: true })

// Formatting functions
const formatDate = dateString => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const formatCurrency = value => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatNumber = value => {
  return new Intl.NumberFormat().format(value)
}

// Initial fetch
onMounted(() => {
  store.dispatch('dailyReports/fetchDailyReports')
})
</script>

<template>
  <VCard class="elevation-4">
    <VCardText class="d-flex align-center flex-wrap gap-4 py-4">
      <h2 class="text-h6 font-weight-bold">
        <VIcon
          icon="mdi-chart-line"
          class="mr2"
        /> Daily Reports
      </h2>
      <VSpacer />
      <VTextField
        v-model="search"
        placeholder="Search dates..."
        append-inner-icon="mdi-magnify"
        single-line
        dense
        outlined
        hide-details
        class="search-field"
      />
    </VCardText>

    <VDivider />

    <!-- Stats Cards - Fixed Height -->
    <VContainer
      fluid
      class="px-4 py-4 bg-grey-lighten-4"
    >
      <VRow class="align-stretch">
        <VCol
          v-for="stat in stats"
          :key="stat.title"
          cols="12"
          sm="6"
          md="4"
          lg="2"
          class="d-flex"
        >
          <VCard
            border
            :color="stat.color"
            variant="tonal"
            class="stat-card flex-grow-1 d-flex flex-column"
          >
            <VCardText class="d-flex align-center flex-grow-1 pa-4">
              <VAvatar
                rounded
                :color="stat.color"
                variant="tonal"
                size="44"
                class="me-3"
              >
                <VIcon :icon="stat.icon" />
              </VAvatar>
              <div>
                <span class="text-caption text-disabled">{{ stat.title }}</span>
                <h3 class="text-h6 font-weight-bold mt-1">
                  <template v-if="['totalLoanAmount', 'totalAirtimeAmount', 'totalTransferAmount'].includes(stat.key)">
                    {{ formatCurrency(dailyReports[0]?.[stat.key] || 0) }}
                  </template>
                  <template v-else>
                    {{ formatNumber(dailyReports[0]?.[stat.key] || 0) }}
                  </template>
                </h3>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>

    <!-- Data Table with Improved Alignment -->
    <VDataTable
      :headers="headers"
      :items="dailyReports"
      :items-per-page="limit"
      :page="currentPage"
      :loading="loading"
      loading-text="Loading daily reports..."
      class="reports-table"
      :footer-props="{ 'items-per-page-options': [5, 10, 25, 50] }"
    >
      <!-- Date Column -->
      <template #[`item.date`]="{ item }">
        <div class="d-flex flex-column">
          <span class="font-weight-bold">{{ formatDate(item.date) }}</span>
          <span class="text-caption text-disabled">
            {{ format(new Date(item.date), 'EEEE') }}
          </span>
        </div>
      </template>

      <!-- Numeric Columns with Consistent Alignment -->
      <template #[`item.totalLoanAmount`]="{ item }">
        <div class="text-right">
          <VChip
            v-if="item.totalLoanAmount > 0"
            color="primary"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ formatCurrency(item.totalLoanAmount) }}
          </VChip>
          <span
            v-else
            class="text-disabled"
          >-</span>
        </div>
      </template>

      <template #[`item.totalAirtimeAmount`]="{ item }">
        <div class="text-right">
          <VChip
            v-if="item.totalAirtimeAmount > 0"
            color="info"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ formatCurrency(item.totalAirtimeAmount) }}
          </VChip>
          <span
            v-else
            class="text-disabled"
          >-</span>
        </div>
      </template>

      <template #[`item.totalTransferAmount`]="{ item }">
        <div class="text-right">
          <VChip
            v-if="item.totalTransferAmount > 0"
            color="success"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ formatCurrency(item.totalTransferAmount) }}
          </VChip>
          <span
            v-else
            class="text-disabled"
          >-</span>
        </div>
      </template>

      <template #[`item.totalKgs`]="{ item }">
        <div class="d-flex align-center justify-end">
          <template v-if="item.totalKgs > 0">
            <VProgressCircular
              :model-value="Math.min(item.totalKgs / 50, 100)"
              :size="36"
              :width="3"
              color="warning"
              class="me-2"
            >
              <span class="text-caption font-weight-medium">{{ Math.round(item.totalKgs) }}</span>
            </VProgressCircular>
            <span class="font-weight-medium">kg</span>
          </template>
          <span
            v-else
            class="text-disabled"
          >-</span>
        </div>
      </template>

      <template #[`item.numberOfFarmersWhoBorrowed`]="{ item }">
        <div class="text-right">
          <VChip
            v-if="item.numberOfFarmersWhoBorrowed > 0"
            color="error"
            variant="tonal"
            class="font-weight-medium"
          >
            <VIcon
              icon="mdi-account"
              start
              size="small"
            />
            {{ item.numberOfFarmersWhoBorrowed }}
          </VChip>
          <span
            v-else
            class="text-disabled"
          >-</span>
        </div>
      </template>

      <!-- Actions -->
      <template #[`item.actions`]>
        <div class="text-center">
          <VBtn
            icon
            variant="text"
            size="small"
            color="primary"
          >
            <VIcon icon="mdi-chart-bar" />
            <VTooltip activator="parent">
              View Detailed Report
            </VTooltip>
          </VBtn>
        </div>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <div class="py-8 text-center">
          <VIcon
            icon="mdi-database-remove"
            size="64"
            class="text-disabled mb-2"
          />
          <p class="text-h6">
            No daily reports found
          </p>
          <p class="text-disabled">
            Try adjusting your search criteria
          </p>
        </div>
      </template>

      <!-- Bottom Pagination -->
      <template #bottom>
        <div class="d-flex flex-wrap justify-space-between align-center pa-4 border-top">
          <div class="d-flex align-center text-disabled text-caption">
            Showing {{ Math.min(limit, dailyReports.length) }} of {{ totalRecords }} records
          </div>
          
          <div class="d-flex flex-wrap align-center gap-3">
            <div class="text-caption mr2">
              Rows per page:
            </div>
            <VSelect
              v-model="options.itemsPerPage"
              :items="[5, 10, 25, 50]"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 100px;"
              class="page-select"
            />
            
            <VPagination
              v-model="options.page"
              :total-visible="5"
              :length="totalPages"
              density="comfortable"
              class="pagination-controls"
            />
          </div>
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

<style lang="scss" scoped>
.reports-table {
  :deep(.v-data-table-header) {
    th {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.75rem;
      vertical-align: middle;
      white-space: nowrap;
      
      &:not(:first-child) {
        padding-left: 16px;
      }
    }
  }
  
  :deep(td) {
    vertical-align: middle;
    height: 64px;
    
    &:not(:first-child) {
      padding-left: 16px;
    }
  }
  
  :deep(.v-chip) {
    min-width: 80px;
    justify-content: center;
  }
}

.stat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.search-field {
  max-width: 300px;
}

.v-card {
  overflow: visible;
}

.page-select {
  :deep(.v-field) {
    background: transparent;
  }
}

.pagination-controls {
  :deep(.v-pagination__item) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>
