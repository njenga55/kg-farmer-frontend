<script setup>
import airtime from '@images/cards/airtime-info.png'
import loan from '@images/cards/loan-error.png'
import sentMoney from '@images/cards/send-money-success.png'
import { defineProps } from 'vue'

// Define props to accept data dynamically
const props = defineProps({
  loanData: {
    type: String,
    required: true,
  },
  sendMoneyData: {
    type: String,
    required: true,
  },
  airtimeData: {
    type: String,
    required: true,
  },
})

const moreList = [
  {
    title: 'Share',
    value: 'Share',
  },
  {
    title: 'Refresh',
    value: 'Refresh',
  },
  {
    title: 'Update',
    value: 'Update',
  },
]
</script>

<template>
  <VCard title="Revenue Breakdown (%)">
    <template #append>
      <div class="me-n3 mt-n2">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VCardText>
      <VList class="card-list">
        <!-- Loan item -->
        <VListItem>
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              :image="loan"
              class="me-3"
            />
          </template>

          <VListItemSubtitle class="text-disabled mb-1">
            Borrowed (10%)
          </VListItemSubtitle>
          <VListItemTitle>
            Loan
          </VListItemTitle>

          <template #append>
            <VListItemAction>
              <span class="me-1">{{ props.loanData }}</span>
              <span class="text-disabled">KES</span>
            </VListItemAction>
          </template>
        </VListItem>

        <!-- Send Money item -->
        <VListItem>
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              :image="sentMoney"
              class="me-3"
            />
          </template>

          <VListItemSubtitle class="text-disabled mb-1">
            M-Pesa (10%)
          </VListItemSubtitle>
          <VListItemTitle>
            Send money
          </VListItemTitle>

          <template #append>
            <VListItemAction>
              <span class="me-1">{{ props.sendMoneyData }}</span>
              <span class="text-disabled">KES</span>
            </VListItemAction>
          </template>
        </VListItem>

        <!-- Airtime item -->
        <VListItem>
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              :image="airtime"
              class="me-3"
            />
          </template>

          <VListItemSubtitle class="text-disabled mb-1">
            Safaricom (4%)
          </VListItemSubtitle>
          <VListItemTitle>
            Airtime
          </VListItemTitle>

          <template #append>
            <VListItemAction>
              <span class="me-1">{{ props.airtimeData }}</span>
              <span class="text-disabled">KES</span>
            </VListItemAction>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
  .card-list {
    --v-card-list-gap: 1.6rem;
  }
</style>


<!--
  <script setup>
  import airtime from '@images/cards/airtime-info.png'
  import loan from '@images/cards/loan-error.png'
  import sentMoney from '@images/cards/send-money-success.png'

  const moreList = [
  {
  title: 'Share',
  value: 'Share',
  },
  {
  title: 'Refresh',
  value: 'Refresh',
  },
  {
  title: 'Update',
  value: 'Update',
  },
  ]
  </script> 


  <template>
  <VCard title="Revenue Breakdown (%)">
  <template #append>
  <div class="me-n3 mt-n2">
  <MoreBtn :menu-list="moreList" />
  </div>
  </template>

  <VCardText>
  <VList class="card-list">
  <VListItem>
  <template #prepend>
  <VAvatar
  rounded
  variant="tonal"
  :color="info"
  :image="loan"
  class="me-3"
  />
  </template>

  <VListItemSubtitle class="text-disabled mb-1">
  Borrowed (10%)
  </VListItemSubtitle>
  <VListItemTitle>
  Loan
  </VListItemTitle>

  <template #append>
  <VListItemAction>
  <span class="me-1">data from prop(loan)</span>
  <span class="text-disabled">KES</span>
  </VListItemAction>
  </template>
  </VListItem>
  <VListItem>
  <template #prepend>
  <VAvatar
  rounded
  variant="tonal"
  :color="error"
  :image="sentMoney"
  class="me-3"
  />
  </template>

  <VListItemSubtitle class="text-disabled mb-1">
  M-Pesa (10%)
  </VListItemSubtitle>
  <VListItemTitle>
  Send money
  </VListItemTitle>

  <template #append>
  <VListItemAction>
  <span class="me-1">data from prop(send-money)</span>
  <span class="text-disabled">KES</span>
  </VListItemAction>
  </template>
  </VListItem>
  <VListItem>
  <template #prepend>
  <VAvatar
  rounded
  variant="tonal"
  :color="primary"
  :image="airtime"
  class="me-3"
  />
  </template>

  <VListItemSubtitle class="text-disabled mb-1">
  Safaricom (4%)
  </VListItemSubtitle>
  <VListItemTitle>
  Airtime
  </VListItemTitle>

  <template #append>
  <VListItemAction>
  <span class="me-1">data from prop(airtime)</span>
  <span class="text-disabled">KES</span>
  </VListItemAction>
  </template>
  </VListItem>
  </VList>
  </VCardText>
  </VCard>
  </template>

  <style lang="scss" scoped>
  .card-list {
  --v-card-list-gap: 1.6rem;
  }
  </style> 
-->
