<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['close'])
const store = useStore()

const dialog = ref(true)
const form = ref(null)

const name = ref('')
const emailField = ref('')
const phone = ref('')
const role = ref('admin')

const createUser = async () => {
  if (!name.value || !emailField.value || !phone.value || !role.value) {
    alert('All fields are required!')
    
    return
  }

  await store.dispatch('register', {
    name: name.value,
    email: emailField.value,
    phone: phone.value,
    role: role.value,
  })
  store.dispatch('users/fetchUsers')
  closeDialog()
}

const resetFormFields = () => {
  name.value = ''
  emailField.value = ''
  phone.value = ''
  role.value = 'admin'
}

const closeDialog = () => {
  dialog.value = false
  resetFormFields()
  emit('close')
}
</script>

<template>
  <VContainer>
    <VDialog
      v-if="dialog"
      v-model="dialog"
      max-width="600"
    >
      <VCard
        class="pa-4"
        flat
      >
        <VForm
          ref="form"
          @submit.prevent="createUser"
        >
          <VCardTitle>Add User</VCardTitle>
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
                  v-model="emailField"
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
                  :items="['admin', 'super-admin', 'factory-manager']"
                  label="Role"
                  outlined
                  dense
                  required
                />
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
              Add User
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
  </VContainer>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
