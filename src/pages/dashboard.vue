<script setup>
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue'
import { useStore } from 'vuex'

// Access Vuex store
const store = useStore()

// 👉 Images
import airtime from '@images/cards/airtime-info.png'
import farmers from '@images/cards/farmers-primary.png'
import kilos from '@images/cards/kilos-success.png'
import kplc from '@images/cards/kplc.png'
import loan from '@images/cards/loan-error.png'
import sentMoney from '@images/cards/send-money-success.png'
import users from '@images/cards/users-warning.png'
import walletPrimary from '@images/cards/wallet-primary.png'

// Computed properties for stats data and pagination
const stats = computed(() => store.state.stats.stats)
const loading = computed(() => store.state.stats.loading)

// Fetch kilos on component mount
onMounted(() => {
  store.dispatch('stats/getDashboardStats')
})
</script>

<template>
  <div
    v-if="loading"
    class="d-flex justify-center align-center"
    style="height: 100vh;"
  >
    <VProgressCircular
      indeterminate
      color="primary"
      size="64"
      width="6"
    />
  </div>
  <VRow v-else>
    <VCol
      cols="12"
      md="3"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'Active Loans',
          image: loan,
          stats: `KES ${(stats.transactions?.loan ?? 0).toLocaleString()}`,
          change: 0,
        }"
      />
    </VCol> 

    <VCol
      cols="12"
      md="3"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'Money Transfer Stats',
          image: sentMoney,
          stats: `KES ${(stats.transactions?.money_transfer ?? 0).toLocaleString()}`,
          change: 0,
        }"
      />
    </VCol> 

    <VCol
      cols="12"
      md="3"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'Airtime Stats',
          image: airtime,
          stats: `KES ${(stats.transactions?.airtime_purchase ?? 0).toLocaleString()}`,
          change: 0,
        }"
      />
    </VCol>

    <VCol
      cols="12"
      md="3"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'Paybill Balance',
          image: walletPrimary,
          stats: `KES ${(stats.payBillAvailableAmount + 5311 ?? 0).toLocaleString()}`,
          change: 0,
        }"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'Airtime Balance',
          image: airtime,
          stats: `KES ${(250000).toLocaleString()}`,
          change: 0,
        }"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'KPLC Tokens Balance',
          image: kplc,
          stats: `KES ${(150000).toLocaleString()}`,
          change: 0,
        }"
      />
    </VCol>
    
    
    <VCol
      cols="12"
      sm="8"
      md="4"
      order="1"
      order-md="2"
    >
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <CardStatisticsVertical
            v-bind=" {
              title: 'Farmers',
              image: farmers,
              stats: `${(stats.farmers ?? 0).toLocaleString()}`,
              change: 0,
            }"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <CardStatisticsVertical
            v-bind="{
              title: 'Admins',
              image: users,
              stats: `${(stats.users ?? 0).toLocaleString()}`,
              change: 0,
            }"
          />
        </VCol>
      </VRow>
    </VCol>

    <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'Registered produce',
          image: kilos,
          stats: `${(stats.kilos[0]?.totalNetUnits ?? 0).toLocaleString()} Kgs`,
          change: 0,
        }"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <AnalyticsTransactions
        :loan-data="(stats.revenueBreakDown?.loan?.percentageAmount ?? 0).toLocaleString()"
        :send-money-data="(stats.revenueBreakDown?.money_transfer?.percentageAmount ?? 0).toLocaleString()"
        :airtime-data="(stats.revenueBreakDown?.airtime_purchase?.percentageAmount ?? 0).toLocaleString()"
      />
    </VCol>
  </VRow>
</template>
