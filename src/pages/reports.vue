<script setup>
import FarmersExport from '@/components/FarmersExport.vue'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Computed properties
const loading = computed(() => store.state.profits.loading)
const dailyProfit = computed(() => store.state.profits.dailyProfit)
const weeklyProfit = computed(() => store.state.profits.weeklyProfit)
const monthlyProfit = computed(() => store.state.profits.monthlyProfit)
const topFarmers = computed(() => store.state.profits.topFarmers)
const totalBorrowers = computed(() => store.state.profits.totalBorrowers)
const allTimeTotal = computed(() => store.state.profits.allTimeTotal)

// Transaction type formatting
const formatTransactionType = type => {
  const types = {
    loan: 'Loan Services',
    money_transfer: 'Money Transfers',
    airtime_purchase: 'Airtime Sales',
  }
  
  return types[type] || type
}

onMounted(() => {
  store.dispatch('profits/fetchProfitData')
})

// Table headers for top farmers
const farmerHeaders = [
  { title: 'Farmer Name', key: 'name', align: 'start' },
  { title: 'Farmer Code', key: 'farmerCode', align: 'center' },
  { title: 'Total Charges', key: 'totalCharges', align: 'center' },
  { title: 'Transactions', key: 'transactionCount', align: 'center' },
]
</script>

<template>
  <VContainer>
    <!-- Loading Spinner -->
    <VRow
      v-if="loading"
      justify="center"
      align="center"
      class="fill-height"
    >
      <VCol cols="auto">
        <VProgressCircular
          indeterminate
          color="primary"
          size="64"
        />
      </VCol>
    </VRow>

    <!-- Main Content -->
    <template v-else>
      <!-- Summary Cards -->
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VCard class="pa-4 elevation-3 gradient-card primary">
            <VCardTitle class="text-h5 text-white">
              <VIcon
                color="white"
                mr-2
              >
                mdi-account-group
              </VIcon>
              Total Borrowers
            </VCardTitle>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-white">
                {{ (totalBorrowers ?? 0).toLocaleString() }}
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VCard class="pa-4 elevation-3 gradient-card success">
            <VCardTitle class="text-h5 text-white">
              <VIcon
                color="white"
                mr-2
              >
                mdi-chart-line
              </VIcon>
              All-Time Total Charges
            </VCardTitle>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-white">
                KES {{ (allTimeTotal ?? 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Profit Breakdown Cards -->
      <VRow class="mt-4">
        <VCol
          v-for="(period, title) in { daily: dailyProfit, weekly: weeklyProfit, monthly: monthlyProfit }"
          :key="title"
          cols="12"
          md="4"
        >
          <VCard class="pa-4 elevation-3">
            <VCardTitle class="d-flex align-center">
              <VIcon
                :color="title === 'daily' ? 'primary' : title === 'weekly' ? 'success' : 'warning'"
                mr-2
              >
                mdi-{{ title === 'daily' ? 'calendar-today' : title === 'weekly' ? 'calendar-week' : 'calendar-month' }}
              </VIcon>
              <span class="text-h6">{{ title }} Profit</span>
            </VCardTitle>
            <VDivider class="my-2" />
            <VCardText>
              <div class="d-flex justify-space-between mb-3">
                <div>
                  <div class="text-caption">
                    Total Charges
                  </div>
                  <div class="text-h6 font-weight-bold">
                    KES {{ (period?.totalCharges ?? 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </div>
                <div>
                  <div class="text-caption">
                    Total Amount
                  </div>
                  <div class="text-h6 font-weight-bold">
                    KES {{ (period?.totalAmount ?? 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </div>
              </div>

              <VList dense>
                <VListSubheader>Breakdown by Service</VListSubheader>
                <VListItem
                  v-for="(service, type) in period?.breakdown ?? {}"
                  :key="type"
                >
                  <VListItemTitle>
                    {{ formatTransactionType(type) }}
                    <VChip
                      x-small
                      color="primary"
                      ml-2
                    >
                      {{ (service?.count ?? 0).toLocaleString() }}
                    </VChip>
                  </VListItemTitle>
                  <VListItemSubtitle class="d-flex justify-space-between">
                    <span>Charges: KES {{ (service?.charges ?? 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                    <span>Amount: KES {{ (service?.amount ?? 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Top Farmers Table -->
      <VRow class="mt-4">
        <VCol cols="12">
          <VCard class="elevation-3">
            <VCardTitle class="d-flex align-center primary white--text pa-4">
              <VIcon mr-2>
                mdi-account-tie
              </VIcon>
              <span class="text-h5">Top Performing Farmers</span>
            </VCardTitle>
            <VDataTable
              :headers="farmerHeaders"
              :items="topFarmers"
              :items-per-page="5"
              class="elevation-1"
            >
              <template #[`item.totalCharges`]="{ item }">
                <VChip color="success">
                  KES {{ (item?.totalCharges ?? 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </VChip>
              </template>
              <template #[`item.transactionCount`]="{ item }">
                <VChip color="info">
                  {{ (item?.transactionCount ?? 0).toLocaleString() }}
                </VChip>
              </template>
            </VDataTable>
          </VCard>
        </VCol>
      </VRow>
    </template>
    <FarmersExport />
  </VContainer>
</template>

<style scoped>
.gradient-card {
  background: #1976d2;
  transition: transform 0.3s ease;
}

.gradient-card.success {
  background:  #43a047;
}

.gradient-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
}

.v-list-item {
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.v-data-table-header {
  background-color: #1976d2;
  color: white;
}

.v-data-table-header th {
  font-size: 1rem;
  font-weight: 600;
}
</style>
