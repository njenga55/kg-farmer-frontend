<script setup>
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Date range handling
const startDate = ref(dayjs().startOf('month').format('YYYY-MM-DD'))
const endDate = ref(dayjs().endOf('month').format('YYYY-MM-DD'))
const dateMenu = ref(false)

// Generate dynamic headers from API response
const dynamicHeaders = ref([])

// Fetch report with current date parameters
function fetchReport() {
  const params = `startDate=${startDate.value}&endDate=${endDate.value}`

  store.dispatch('paymentReport/fetchReport', params)
}

// Initialize with current month data
onMounted(fetchReport)

// Watch for data changes to generate headers
watch(
  () => store.state.paymentReport.reportData,
  newData => {
    if (newData.length > 0) {
      const sampleItem = newData[0]

      dynamicHeaders.value = Object.keys(sampleItem).map(key => ({
        text: formatHeader(key),
        value: key,
        align: 'start',
        sortable: true,
      }))
    }
  },
  { immediate: true },
)

// Format header text from camelCase
function formatHeader(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(' Id', ' ID')
    .replace('Kg', '(kg)')
}

// Export to CSV with all fields
function exportToCSV() {
  if (reportData.value.length === 0) return
  
  const headers = dynamicHeaders.value.map(h => h.text)
  const rows = [headers.join(',')]
  
  reportData.value.forEach(item => {
    const row = dynamicHeaders.value.map(header => {
      let value = item[header.value]
      
      // Special formatting
      if (header.value === 'canBorrow') {
        return value ? 'Yes' : 'No'
      }
      if (typeof value === 'number') {
        return header.value.includes('Date') 
          ? dayjs(value).format('YYYY-MM-DD')
          : value
      }
      
      return `"${String(value).replace(/"/g, '""')}"`
    })
    
    rows.push(row.join(','))
  })
  
  const csvContent = rows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  saveAs(blob, `payment_report_${period.value.replace(/ /g, '_')}.csv`)
}

// Computed properties
const reportData = computed(() => store.state.paymentReport.reportData)
const period = computed(() => store.state.paymentReport.period)
const records = computed(() => store.state.paymentReport.records)
const loading = computed(() => store.state.paymentReport.loading)
</script>

<template>
  <VContainer>
    <VCard>
      <VCardTitle class="d-flex flex-wrap justify-space-between align-center py-4 gap-2">
        <div>
          <div class="text-h5">
            Payment Report
          </div>
          <div
            v-if="period"
            class="text-caption text-medium-emphasis"
          >
            {{ period }} • {{ records }} {{ records === 1 ? 'record' : 'records' }}
          </div>
        </div>
        
        <div class="d-flex flex-wrap align-center gap-2">
          <VMenu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template #activator="{ props }">
              <VBtn
                variant="outlined"
                color="primary"
                prepend-icon="mdi-calendar"
                v-bind="props"
              >
                {{ dayjs(startDate).format('MMM D') }} - {{ dayjs(endDate).format('MMM D, YYYY') }}
              </VBtn>
            </template>
            
            <VCard min-width="auto">
              <VCardText>
                <div class="d-flex justify-space-between mb-4">
                  <VTextField
                    v-model="startDate"
                    label="Start Date"
                    type="date"
                    density="compact"
                    hide-details
                    variant="outlined"
                    class="mr2"
                  />
                  <VTextField
                    v-model="endDate"
                    label="End Date"
                    type="date"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </div>
                <VBtn 
                  block 
                  color="primary"
                  @click="dateMenu = false; fetchReport()"
                >
                  Apply Dates
                </VBtn>
              </VCardText>
            </VCard>
          </VMenu>
          
          <VBtn
            color="primary"
            prepend-icon="mdi-microsoft-excel"
            :disabled="reportData.length === 0"
            @click="exportToCSV"
          >
            Export CSV
          </VBtn>
        </div>
      </VCardTitle>
      
      <VDivider />
      
      <VDataTable
        :headers="dynamicHeaders"
        :items="reportData"
        :loading="loading"
        :items-per-page="10"
        class="elevation-0"
        hover
      >
        <template #loading>
          <VProgressLinear
            indeterminate
            color="primary"
          />
        </template>
        
        <template #[`item.canBorrow`]="{ item }">
          <VChip
            :color="item.canBorrow ? 'green' : 'red'"
            size="small"
            label
          >
            {{ item.canBorrow ? 'Yes' : 'No' }}
          </VChip>
        </template>
        
        <template #[`item.netPay`]="{ item }">
          {{ new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KES'
          }).format(item.netPay) }}
        </template>
        
        <template #[`item.totalGrossPay`]="{ item }">
          {{ new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KES'
          }).format(item.totalGrossPay) }}
        </template>
        
        <template #[`item.totalDeductions`]="{ item }">
          {{ new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KES'
          }).format(item.totalDeductions) }}
        </template>
        
        <template #bottom>
          <div class="text-caption text-medium-emphasis pa-2">
            Showing {{ reportData.length }} of {{ records }} records
          </div>
        </template>
      </VDataTable>
    </VCard>
  </VContainer>
</template>
