<script setup>
import logo from '@images/logo.svg?raw'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()

const state = reactive({
  token: '',
  newPassword: '',
  confirmPassword: '',
  loading: false,
  snackbar: false,
  snackbarColor: 'default',
  text: '',
  showNewPassword: false,
  showConfirmPassword: false,
  newPasswordRules: [
    v => !!v || 'Password is required',
    v => (v && v.length >= 8) || 'Password must be at least 8 characters',
  ],
  confirmPasswordRules: [
    v => !!v || 'Password confirmation is required',
    v => v === state.newPassword || 'Passwords do not match',
  ],
})

const formRef = ref(null)

onMounted(() => {
  state.token = route.params.token
})

const submitResetPassword = async () => {
  if (formRef.value.validate()) {
    state.loading = true
    try {
      await store.dispatch('resetPassword', {
        token: state.token,
        values: {
          password: state.newPassword,
          passwordConfirm: state.confirmPassword,
        },
      })
      
      state.snackbar = true
      state.snackbarColor = 'success'
      state.text = 'Your password has been reset successfully'
      
      // Redirect to login after success
      setTimeout(() => router.push({ name: 'login' }), 3000)
    } catch (error) {
      console.error('Error during password reset:', error)
      state.snackbar = true
      state.snackbarColor = 'error'
      state.text = error.response?.data?.message || 'Failed to reset password'
    } finally {
      state.loading = false
    }
  }
}

const backToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div
              class="d-flex text-primary"
              v-html="logo"
            />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          kg farmers
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Reset Password 🔒
        </h5>
        <p class="mb-0">
          Enter your new password below
        </p>
      </VCardText>

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="submitResetPassword"
        >
          <VRow>
            <!-- New Password -->
            <VCol cols="12">
              <VTextField
                v-model="state.newPassword"
                autofocus
                label="New Password"
                placeholder="············"
                :type="state.showNewPassword ? 'text' : 'password'"
                :append-inner-icon="state.showNewPassword ? 'bx-hide' : 'bx-show'"
                :rules="state.newPasswordRules"
                @click:append-inner="state.showNewPassword = !state.showNewPassword"
              />
            </VCol>

            <!-- Confirm Password -->
            <VCol cols="12">
              <VTextField
                v-model="state.confirmPassword"
                label="Confirm Password"
                placeholder="············"
                :type="state.showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="state.showConfirmPassword ? 'bx-hide' : 'bx-show'"
                :rules="state.confirmPasswordRules"
                @click:append-inner="state.showConfirmPassword = !state.showConfirmPassword"
              />
            </VCol>

            <!-- Submit button -->
            <VCol cols="12">
              <VBtn
                block
                type="submit"
                :loading="state.loading"
              >
                Reset Password
              </VBtn>
              
              <div class="text-center mt-4">
                <VBtn
                  variant="text"
                  color="primary"
                  @click="backToLogin"
                >
                  <VIcon icon="bx-chevron-left" />
                  Back to login
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <!-- Snackbar for messages -->
      <VSnackbar
        v-model="state.snackbar"
        :color="state.snackbarColor"
        timeout="3000"
      >
        {{ state.text }}
      </VSnackbar>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
