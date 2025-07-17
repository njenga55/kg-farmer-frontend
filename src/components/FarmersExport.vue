<script setup> 
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedPeriod = ref('all')

const periods = [
  { text: 'All Time', value: 'all' },
  { text: 'Today', value: 'today' },
  { text: 'Last 7 Days', value: 'week' },
  { text: 'This Month', value: 'month' },
]

const handleExport = async () => {
  try {
    const response = await store.dispatch(
      'profits/exportFarmersReport', 
      selectedPeriod.value === 'all' ? null : selectedPeriod.value,
    )
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', 'farmers-report.csv')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (error) {
    console.error('Export failed:', error)
  }
}
</script>

<template>
  <VCard class="elevation-3 mt-4">
    <VCardTitle class="primary white--text pa-4">
      <VIcon left>
        mdi-file-export
      </VIcon>
      Export Farmers Data
    </VCardTitle>
    
    <VCardText>
      <VRow align="center">
        <VCol
          cols="12"
          md="4"
        >
          <VSelect
            v-model="selectedPeriod"
            :items="periods"
            item-title="text"
            item-value="value"
            label="Date Range"
            outlined
            hide-details
          />
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <VBtn
            color="success"
            large
            @click="handleExport"
          >
            <VIcon left>
              mdi-download
            </VIcon>
            Export CSV
          </VBtn>
        </VCol>
      </VRow>
      
      <VAlert
        type="info"
        class="mt-4"
      >
        Exported columns: Name, ID NO, Mobile Number, Kgs loaded, 
        Limit, Borrowed, Available Limit, Payable Amount
      </VAlert>
    </VCardText>
  </VCard>
</template>

<style scoped>
.v-card__title.primary {
  border-radius: 4px 4px 0 0;
}

.v-btn {
  min-width: 200px;
}
</style>

