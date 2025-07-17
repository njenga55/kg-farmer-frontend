<script setup>
import CreateUser from "@/Dialogs/CreateUser.vue"
import EditUser from '@/Dialogs/EditUser.vue'
import { format } from "date-fns"
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

// Access Vuex store
const store = useStore()

const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = false // Force a reset
  setTimeout(() => {
    dialogVisible.value = true // Reopen after reset
  }, 100)
}

const closeDialog = () => {
  dialogVisible.value = false
}

// Reactive data for the search input
const search = ref('')

let debounceTimeout = null // Declare a variable for debounce timeout

// Add these refs
const editDialogVisible = ref(false)
const selectedUser = ref(null)

// Add these methods
const openEditDialog = item => {
  if (!item) {
    console.error("No item selected for editing.")
    
    return
  }
  selectedUser.value = toRaw(item)
  editDialogVisible.value = true
}

const closeEditDialog = () => {
  editDialogVisible.value = false
  selectedUser.value = null
}

// Table headers for Users
const headers = [
  { title: 'Full Name', key: 'name' },
  { title: 'Email Address', key: 'email' },
  { title: 'Phone Number', key: 'phone' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'active', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Computed properties for users data and pagination
const users = computed(() => store.state.users.users)
const loading = computed(() => store.state.users.loading)
const currentPage = computed(() => store.state.users.currentPage)
const totalPages = computed(() => store.state.users.totalPages)
const totalRecords = computed(() => store.state.users.totalRecords)
const limit = computed(() => store.state.users.limit)

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
    store.dispatch('users/setSearchQuery', newValue) // Dispatch the search query after delay
  }, 300) // Debounce delay (300ms)
})

// Watch pagination options to trigger updates
watch(
  options,
  newOptions => {
    if (newOptions.page !== currentPage.value) {
      store.dispatch('users/setPage', newOptions.page)
    }
  },
  { deep: true },
)

const niceDate = value => {
  return format(new Date(value), "yyyy-MM-dd h:mm a")
}

// Fetch users on component mount
onMounted(() => {
  store.dispatch('users/fetchUsers')
})

const resolveStatusVariant = status => {
  if (status === 'admin')
    return { color: 'primary', text: 'Admin' }
  else if (status === 'super-admin') {
    return { color: 'info', text: 'Super Admin' }
  } else {
    return { color: 'warning', text: 'Factory Manager' }
  }
}

// const resolveStatusVariant = status => {
//   if (status === 'super-admin')
//     return { color: 'primary', text: 'Super Admin' }
//   else
//     return { color: 'info', text: 'Admin' }
// }

const avatarText = name => {
  if (!name) return ''
  const nameParts = name.split(' ')
  
  return nameParts.map(part => part.charAt(0).toUpperCase()).join('')
}
</script>

<template>
  <VCard class="elevation-4">
    <VCardText>
      <!-- Search Input and Add User Button -->
      <VRow align="center">
        <!-- Total Users -->
        <VCol
          cols="12"
          md="4"
        >
          <h2 class="text-h6 font-weight-medium">
            Total Users: <span class="text-primary">{{ totalRecords }}</span>
          </h2>
        </VCol>

        <!-- Search Field -->
        <VCol
          cols="12"
          md="4"
          class="mt-4 mt-md-0"
        >
          <VTextField
            v-model="search"
            placeholder="Search ..."
            append-inner-icon="mdi-magnify"
            single-line
            dense
            outlined
            hide-details
            aria-label="Search users"
          />
        </VCol>

        <!-- Add User Button -->
        <VCol
          cols="12"
          md="4"
          class="text-md-end mt-4 mt-md-0"
        >
          <VBtn
            color="primary"
            class="text-none"
            width="200"
            aria-label="Add new user"
            @click="openDialog"
          >
            <VIcon left>
              mdi-plus
            </VIcon>
            Add User
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <!-- Data Table -->
    <VDataTable
      v-model:options="options"
      :headers="headers"
      :items="users"
      :loading="loading"
      loading-text="Loading users... Please wait"
      class="elevation-1"
    >
      <!-- Full Name Column -->
      <template #[`item.name`]="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="32"
            :color="item.photo ? '' : 'primary'"
            :class="item.photo ? '' : 'v-avatar-light-bg primary--text'"
            :variant="!item.photo ? 'tonal' : undefined"
            aria-label="User avatar"
          >
            <VImg
              v-if="item.photo"
              :src="item.photo"
            />
            <span v-else>{{ avatarText(item.name) }}</span>
          </VAvatar>
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.name }}</span>
            <small class="text-caption">{{ item.role }}</small>
          </div>
        </div>
      </template>

      <!-- Role Column -->
      <template #[`item.role`]="{ item }">
        <VChip
          :color="resolveStatusVariant(item.role).color"
          class="font-weight-medium"
          size="small"
          aria-label="User role"
        >
          {{ resolveStatusVariant(item.role).text }}
        </VChip>
      </template>

      <!-- Active Status Column -->
      <template #[`item.active`]="{ item }">
        <div class="d-flex justify-center">
          <div
            class="status-indicator"
            :class="item.active ? 'active' : 'inactive'"
          >
            <span class="status-dot" />
            <span class="status-text">
              {{ item.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </template>

      <template #[`item.actions`]="{ item }">
        <VBtn
          color="primary"
          icon
          small
          aria-label="Edit user"
          @click="openEditDialog(item)"
        >
          <VIcon>mdi-pencil</VIcon>
        </VBtn>
      </template>

      <!-- Pagination and Rows Per Page -->
      <template #bottom>
        <VCardText class="d-flex flex-wrap justify-center justify-sm-space-between align-center">
          <!-- Rows Per Page Selector -->
          <VSelect
            v-model="options.itemsPerPage"
            :items="[5, 10, 25, 50]"
            label="Rows per page"
            variant="underlined"
            mr-4
            style="max-width: 120px;"
            aria-label="Select rows per page"
          />

          <!-- Pagination -->
          <VPagination
            v-model="options.page"
            :total-visible="$vuetify.display.smAndDown ? 2 : 5"
            :length="totalPages"
            aria-label="Pagination"
          />
        </VCardText>
      </template>
    </VDataTable>
  </VCard>

  <CreateUser
    v-if="dialogVisible"
    @close="closeDialog"
  />

  <EditUser
    v-if="selectedUser"
    v-model="editDialogVisible"
    :user-item="selectedUser"
    @close="closeEditDialog"
  />
</template>
