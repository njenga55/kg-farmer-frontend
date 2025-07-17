<!-- EditUserDialog.vue -->
<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  userItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])
const store = useStore()

// Refs
const form = ref(null)
const name = ref('')
const email = ref('')
const phone = ref('')
const role = ref('admin')
const active = ref(false)

// Form initialization watcher
watch(() => props.userItem, newUser => {
  name.value = newUser?.name || ''
  email.value = newUser?.email || ''
  phone.value = newUser?.phone || ''
  role.value = newUser?.role || 'admin'
  active.value = newUser?.active ?? true
}, { immediate: true, deep: true })

// Dialog control
const dialog = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Constants
const roles = ['admin', 'super-admin', 'factory-manager']

// Form actions
const updateUser = async () => {
  if (!name.value || !email.value || !phone.value || !role.value) {
    alert('All fields are required!')
    
    return
  }

  await store.dispatch('updateUser', {
    id: props.userItem._id,
    values: {
      name: name.value,
      email: email.value,
      phone: phone.value,
      role: role.value,
      active: active.value,
    },
  })
  
  store.dispatch('users/fetchUsers')
  closeDialog()
}

const resetForm = () => {
  name.value = props.userItem?.name || ''
  email.value = props.userItem?.email || ''
  phone.value = props.userItem?.phone || ''
  role.value = props.userItem?.role || 'admin'
  active.value = props.userItem?.active ?? true
}

const closeDialog = () => {
  resetForm()
  dialog.value = false
  emit('close')
}
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="600"
    scrollable
  >
    <VCard class="pa-4">
      <VForm @submit.prevent="updateUser">
        <VCardTitle>Edit User</VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="name"
                label="Full Name"
                outlined
                dense
                required
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="email"
                label="Email"
                type="email"
                outlined
                dense
                required
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="phone"
                label="Phone Number"
                type="tel"
                outlined
                dense
                required
              />
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="role"
                :items="roles"
                label="Role"
                outlined
                dense
                required
              />
            </VCol>

            <VCol cols="12">
              <div class="d-flex align-center justify-space-between">
                <span class="text-body-1">Account Status</span>
                <VSwitch
                  v-model="active"
                  inset
                  color="success"
                  class="status-switch"
                >
                  <template #label>
                    <span :class="active ? 'text-success' : 'text-error'">
                      {{ active ? 'Active' : 'Inactive' }}
                    </span>
                  </template>
                </VSwitch>
              </div>
            </VCol>
          </VRow>
          
          <VBtn
            class="mt-2 success white--text"
            block
            plain
            type="submit"
            :loading="$store.state.loading.registerBtn.load"
            :disabled="$store.state.loading.registerBtn.disabled"
          >
            Update User
          </VBtn>
        </VCardText>
      </VForm>
      <VCardActions>
        <VSpacer />
        <VBtn
          text
          @click="closeDialog"
        >
          CLOSE
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.status-switch {
  transform: scale(1.1);
}

.status-switch :deep(.v-switch__track) {
  height: 24px;
  width: 48px;
  border-radius: 12px;
}

.status-switch :deep(.v-switch__thumb) {
  height: 20px;
  width: 20px;
}
</style>
