<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  modelValue: Boolean,
  farmerId: String,
})

const emit = defineEmits(['update:modelValue'])

const store = useStore()
const search = ref('')

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
})

const transactions = computed(() => store.state.transactions.data)
const loading = computed(() => store.state.transactions.loading)
const totalPages = computed(() => store.state.transactions.totalPages)
const totalRecords = computed(() => store.state.transactions.totalRecords)

watch(() => props.farmerId, newVal => {
  if (newVal) {
    fetchTransactions()
  }
})

watch(options, newVal => {
  fetchTransactions()
}, { deep: true })

const fetchTransactions = () => {
  store.dispatch('transactions/fetchFarmerTransactions', {
    farmerId: props.farmerId,
    page: options.value.page,
    limit: options.value.itemsPerPage,
  })
}

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const headers = [
  { title: 'Date', key: 'createdAt', align: 'start' },
  { title: 'Type', key: 'type', align: 'start' },
  { title: 'Amount', key: 'amount', align: 'start' },
  { title: 'Status', key: 'status', align: 'start' },
  { title: 'Description', key: 'description', align: 'start' },
]
</script>


<template>
  <VDialog
    v-model="dialog"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <VCard class="dialog-card">
      <VToolbar
        color="surface"
        density="compact"
        class="px-4 border-b"
      >
        <VToolbarTitle class="text-h6 font-weight-bold">
          Transaction History
        </VToolbarTitle>
        
        <VSpacer />

        <VBtn
          icon
          variant="text"
          size="small"
          color="grey-darken-1"
          @click="dialog = false"
        >
          <VIcon size="24">
            mdi-close
          </VIcon>
        </VBtn>
      </VToolbar>

      <VCardText class="pa-6">
        <div class="mb-6 d-flex align-center justify-space-between">
          <VTextField
            v-model="search"
            placeholder="Search transactions..."
            density="comfortable"
            variant="outlined"
            single-line
            hide-details
            style="max-width: 400px"
            class="rounded-lg"
          >
            <template #append-inner>
              <VIcon
                icon="mdi-magnify"
                size="20"
              />
            </template>
          </VTextField>

          <div class="text-caption text-medium-emphasis">
            Total records: {{ totalRecords }}
          </div>
        </div>

        <VDataTable
          :headers="headers"
          :items="transactions"
          :loading="loading"
          loading-text="Loading transactions..."
          :options="options"
          class="elevation-0 rounded-lg fixed-header"
        >
          <template #[`item.createdAt`]="{ item }">
            <div>
              {{ new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              <div class="text-caption text-medium-emphasis">
                {{ new Date(item.createdAt).toLocaleTimeString() }}
              </div>
            </div>
          </template>

          <template #[`item.type`]="{ item }">
            <VChip
              size="small"
              :color="item.type === 'loan' ? 'primary' : 'success'"
              class="text-capitalize"
            >
              {{ item.type.replace('_', ' ') }}
            </VChip>
          </template>

          <template #[`item.amount`]="{ item }">
            <div class="font-weight-medium">
              KSh {{ item.amount.toLocaleString() }}
            </div>
          </template>

          <template #[`item.status`]="{ item }">
            <VChip
              size="small"
              :color="item.status === 'completed' ? 'success' : 'warning'"
            >
              {{ item.status }}
            </VChip>
          </template>

          <template #bottom>
            <div class="d-flex flex-wrap align-center justify-space-between pa-4 bg-surface">
              <div class="d-flex align-center gap-4">
                <span class="text-sm text-medium-emphasis">Rows per page:</span>
                <VSelect
                  v-model="options.itemsPerPage"
                  :items="[10, 25, 50]"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="width: 100px"
                  class="rounded-pill"
                />
              </div>

              <VPagination
                v-model="options.page"
                :length="totalPages"
                :total-visible="7"
                density="comfortable"
                active-color="primary"
                variant="flat"
              />
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </VDialog>
</template>

  <style scoped>
  .dialog-card {
  border-radius: 12px !important;
  }

  .fixed-header :deep(thead tr th) {
  background: rgb(var(--v-theme-surface));
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.12);
  }

  :deep(.v-table__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  }

  :deep(.v-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
  }


/* Add these styles */
:deep(table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.v-data-table__td),
:deep(.v-data-table-header__content) {
  width: 20%; /* Equal width for all 5 columns */
  white-space: normal;
  padding: 12px 16px;
}

:deep(.v-data-table-header__content) {
  justify-content: start;
}

/* Keep existing styles below */
.dialog-card {
  border-radius: 12px !important;
}

.fixed-header :deep(thead tr th) {
  background: rgb(var(--v-theme-surface));
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.12);
}

:deep(.v-table__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
