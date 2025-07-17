<script setup>
import logo from '@images/logo.svg?raw'
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter from vue-router
import { useStore } from 'vuex' // Import useStore from vuex

// Initialize store with useStore
const store = useStore()

// Initialize router with useRouter
const router = useRouter()

// Reactive state
const state = reactive({
  email: "",
  password: "",
  remember: false,
  ShowFirmForm: false,
  ShowFarmerForm: false,
  showPassword: false,
  isFormValid: false,
  emailRules: [
    v => !!v || "Email is required",
    v => /.+@.+\..+/.test(v) || "Email must be valid",
  ],
  passwordFieldType: "password",
  passwordRules: [
    v => !!v || "Password is required",
  ],
  loading: false,
  snackbar: false,
  snackbarColor: "default",
  otp: "12345",
  text: "",
  expectedOtp: "133707",
  phone: "254710122947",
})

const isPasswordVisible = ref(false)
const formRef = ref(null) // Create a ref for the form

// Destructure for easier access
const {
  email,
  password,
} = toRefs(state)

const login = async () => {
  // Validate form using the ref
  if (formRef.value.validate()) {
    // Form is valid, perform form submission or other actions
    try {
      await store.dispatch("login", {
        email: email.value,
        password: password.value,
      })
      if (store.state.user) {
        // Navigate to dashboard after successful login
        router.push({ name: "dashboard" })  // Use router.push() here
      }
    } catch (error) {
      console.error("Error during login:", error)
    }
  } else {
    console.log('Form is invalid')
  }
}

const forgotPassword = () => {
  router.push({ name: "forgot-password" })  // Use router.push() here
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
          Welcome to dashboard! 👋🏻
        </h5>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="login"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                autofocus
                placeholder="johndoe@email.com"
                label="Email"
                type="email"
                :rules="state.emailRules"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                :rules="state.passwordRules"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="remember"
                  label="Remember me"
                />

                <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="/forgot-password"
                >
                  Forgot Password?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                :loading="$store.state.loading.loginBtn.load"
                :disabled="$store.state.loading.loginBtn.disabled"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Contact admin
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
