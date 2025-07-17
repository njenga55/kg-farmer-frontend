<script setup>
import logo from '@images/logo.svg?raw'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const state = reactive({
  email: "",
  emailRules: [
    v => !!v || "Email is required",
    v => /.+@.+\..+/.test(v) || "Email must be valid",
  ],
  loading: false,
  snackbar: false,
  snackbarColor: "default",
  text: "",
})

const formRef = ref(null)

const submitForgotPassword = async () => {
  if (formRef.value.validate()) {
    state.loading = true
    try {
      await store.dispatch("forgotPassword", {
        email: state.email,
      })
      state.snackbar = true
      state.snackbarColor = "success"
      state.text = "Password reset instructions sent to your email"
      
    } catch (error) {
      console.error("Error during password reset:", error)
      state.snackbar = true
      state.snackbarColor = "error"
      state.text = error.message || "Failed to send reset instructions"
    } finally {
      state.loading = false
    }
  }
}

const backToLogin = () => {
  router.push({ name: "login" })
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
          Forgot Password? 🔒
        </h5>
        <p class="mb-0">
          Enter your email to reset your password
        </p>
      </VCardText>

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="submitForgotPassword"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="state.email"
                autofocus
                placeholder="johndoe@email.com"
                label="Email"
                type="email"
                :rules="state.emailRules"
              />
            </VCol>

            <!-- submit button -->
            <VCol cols="12">
              <VBtn
                block
                type="submit"
                :loading="state.loading"
              >
                Send Reset Link
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
