<script setup>
import { format } from "date-fns"
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const search = ref('')
let debounceTimeout = null

// Enhanced table headers
const headers = [
  { title: 'DATE/TIME', key: 'createdAt', width: '160px' },
  { title: 'FARMER', key: 'farmer.name', width: '220px' },
  { title: 'CODE', key: 'farmer.farmerCode', width: '120px' },
  { title: 'ACTION', key: 'action', width: '180px' },
  { title: 'ENDPOINT', key: 'endpoint', width: '200px' },
  { title: 'METHOD', key: 'method', width: '100px' },
  { title: 'IP ADDRESS', key: 'ipAddress', width: '140px' },
  { title: 'STATUS', key: 'status', width: '120px' },
  { title: 'DETAILS', key: 'details', width: '120px', sortable: false },
]

const activities = computed(() => store.state.activities.activities)
const loading = computed(() => store.state.activities.loading)
const currentPage = computed(() => store.state.activities.currentPage)
const totalPages = computed(() => store.state.activities.totalPages)
const totalRecords = computed(() => store.state.activities.totalRecords)
const limit = computed(() => store.state.activities.limit)

const options = ref({
  page: currentPage,
  itemsPerPage: limit,
  sortBy: [],
  sortDesc: [],
})

watch(search, newValue => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    store.dispatch('activities/setSearchQuery', newValue)
  }, 300)
})

watch(options, newOptions => {
  if (newOptions.page !== currentPage.value) {
    store.dispatch('activities/setPage', newOptions.page)
  }
  if (newOptions.itemsPerPage !== limit.value) {
    store.dispatch('activities/setLimit', newOptions.itemsPerPage)
  }
}, { deep: true })

const niceDate = value => {
  return format(new Date(value), "MMM dd, yyyy h:mm a")
}

onMounted(() => {
  store.dispatch('activities/fetchActivities')
})

const resolveStatusVariant = status => {
  return status === 'success' 
    ? { color: 'success', icon: 'mdi-check-circle' } 
    : { color: 'error', icon: 'mdi-alert-circle' }
}

const resolveMethodVariant = method => {
  const variants = {
    GET: { color: 'info', icon: 'mdi-download' },
    POST: { color: 'success', icon: 'mdi-plus-circle' },
    PUT: { color: 'warning', icon: 'mdi-pencil' },
    DELETE: { color: 'error', icon: 'mdi-delete' },
    PATCH: { color: 'secondary', icon: 'mdi-cog' },
  }
  
  return variants[method] || { color: 'primary', icon: 'mdi-help-circle' }
}

const formatAction = action => {
  const actionMap = {
    'farmer_viewed_produce': 'Viewed Produce',
    'pin_verified': 'PIN Verified',
    'loan_requested': 'Loan Requested',
    'money_transfer': 'Money Transfer',
  }
  
  return actionMap[action] || action.replace(/_/g, ' ').toUpperCase()
}

const formatDetails = details => {
  if (!details) return 'No details'
  try {
    return Object.entries(details)
      .map(([key, value]) => {
        if (typeof value === 'object') {
          return Object.entries(value)
            .map(([subKey, subVal]) => `${subKey}: ${subVal}`)
            .join(', ')
        }
        
        return `${key}: ${value}`
      })
      .join('; ')
  } catch {
    return JSON.stringify(details)
  }
}
</script>

<template>
  <VCard class="activity-log">
    <VCardText class="py-4">
      <VRow class="align-center">
        <VCol
          cols="12"
          md="6"
        >
          <h2 class="text-h5 font-weight-bold">
            System Activities
            <VChip
              color="primary"
              class="ml2"
            >
              {{ totalRecords }} records
            </VChip>
          </h2>
        </VCol>
       
        <VCol
          cols="12"
          md="6"
          class="text-right"
        >
          <VTextField
            v-model="search"
            placeholder="Search farmer, action, IP..."
            prepend-inner-icon="mdi-magnify"
            single-line
            dense
            outlined
            clearable
            hide-details
          />
        </VCol>
      </VRow>
    </VCardText>

    <VDivider />

    <VDataTable
      v-model:options="options"
      :headers="headers"
      :items="activities"
      :loading="loading"
      loading-text="Loading activities..."
      class="activity-table"
      item-value="_id"
      :items-per-page="limit"
      :footer-props="{
        'items-per-page-options': [5, 10, 25, 50]
      }"
    >
      <template #loading>
        <VSkeletonLoader type="table-row@10" />
      </template>

      <!-- Date Column -->
      <template #[`item.createdAt`]="{ item }">
        <div class="d-flex flex-column">
          <span class="font-weight-medium">{{ niceDate(item.createdAt).split(',')[0] }}</span>
          <span class="text-caption text-disabled">{{ niceDate(item.createdAt).split(',')[1] }}</span>
        </div>
      </template>

      <!-- Farmer Column -->
      <template #[`item.farmer.name`]="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="36"
            color="primary"
            class="mr3"
          >
            <span class="white--text text-h6">{{ item.farmer.name.charAt(0) }}</span>
          </VAvatar>
          <div>
            <div class="font-weight-medium">
              {{ item.farmer.name }}
            </div>
            <div class="text-caption text-disabled">
              ID: {{ item.farmer.idNumber }}
            </div>
          </div>
        </div>
      </template>

      <!-- Farmer Code -->
      <template #[`item.farmer.farmerCode`]="{ item }">
        <VChip
          label
          color="primary"
          small
        >
          {{ item.farmer.farmerCode }}
        </VChip>
      </template>

      <!-- Action Column -->
      <template #[`item.action`]="{ item }">
        <div class="d-flex align-center">
          <VIcon
            :color="resolveMethodVariant(item.method).color"
            class="mr2"
          >
            {{ resolveMethodVariant(item.method).icon }}
          </VIcon>
          <span class="font-weight-medium">{{ formatAction(item.action) }}</span>
        </div>
      </template>

      <!-- Endpoint Column -->
      <template #[`item.endpoint`]="{ item }">
        <div class="text-truncate endpoint-cell">
          {{ item.endpoint }}
        </div>
      </template>

      <!-- Method Column -->
      <template #[`item.method`]="{ item }">
        <VChip
          :color="resolveMethodVariant(item.method).color"
          small
          label
        >
          {{ item.method }}
        </VChip>
      </template>

      <!-- IP Address Column -->
      <template #[`item.ipAddress`]="{ item }">
        <VChip
          small
          outlined
        >
          {{ item.ipAddress }}
        </VChip>
      </template>

      <!-- Status Column -->
      <template #[`item.status`]="{ item }">
        <VChip
          :color="resolveStatusVariant(item.status).color"
          small
        >
          <VIcon
            small
            class="mr1"
          >
            {{ resolveStatusVariant(item.status).icon }}
          </VIcon>
          {{ item.status.toUpperCase() }}
        </VChip>
      </template>

      <!-- Details Column -->
      <template #[`item.details`]="{ item }">
        <VTooltip top>
          <template #activator="{ on, attrs }">
            <VBtn 
              icon
              small
              v-bind="attrs"
              color="info"
              v-on="on"
            >
              <VIcon small>
                mdi-information-outline
              </VIcon>
            </VBtn>
          </template>
          <span class="details-tooltip">
            <div class="text-caption font-weight-bold mb-1">Activity Details:</div>
            <div class="text-caption">{{ formatDetails(item.details) }}</div>
            <div
              v-if="item.userAgent"
              class="text-caption mt-2"
            >
              <div class="font-weight-bold">User Agent:</div>
              {{ item.userAgent }}
            </div>
          </span>
        </VTooltip>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <div class="py-8 text-center">
          <VIcon
            size="64"
            color="grey lighten-1"
          >
            mdi-clipboard-text-outline
          </VIcon>
          <div class="text-h6 mt-2">
            No activities found
          </div>
          <div class="text-body-2 mt-1">
            Try adjusting your search filters
          </div>
        </div>
      </template>

      <!-- Footer/Pagination -->
      <template #[`footer.page-text`]="{ pageStart, pageStop, itemsLength }">
        <div class="text-caption">
          {{ pageStart }}-{{ pageStop }} of {{ itemsLength }}
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

<style scoped>
.activity-log {
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.activity-table :deep(.v-data-table-header) {
  background-color: #f5f7fa;
}

.activity-table :deep(th) {
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.75rem !important;
}

.endpoint-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-tooltip {
  max-width: 300px;
  white-space: normal;
  line-height: 1.4;
}
</style>
