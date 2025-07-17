<script setup>
import { useStore } from 'vuex' // Import useStore from vuex

// Initialize store with useStore
const store = useStore()

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  newPasswordRules: [
    v => !!v || "Password is required",
    v => v.length >= 8 || "Password must be at least 8 characters",
    v =>
      /[A-Z]/.test(v) ||
          "Password must contain at least one uppercase letter",
    v =>
      /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
          "Password must contain at least one special character",
  ],
  passwordConfirmRules: [
    v => !!v || "Password confirmation is required",
    v => v === newPassword.value || "Passwords do not match",
  ],
})

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const formRef = ref(null) // Create a ref for the form

// Destructure for easier access
const {
  currentPassword,
  newPassword,
  confirmPassword,
  newPasswordRules,
  passwordConfirmRules,
} = toRefs(passwordData)

const updatePassword = async () => {
  if (formRef.value.validate()) {
    // Form is valid, perform form submission or other actions
    await store.dispatch("updatePassword", {
      passwordCurrent: currentPassword.value,
      password: newPassword.value,
      passwordConfirm: confirmPassword.value,
    })
  }
}

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm
          ref="formRef"
          @submit.prevent="updatePassword"
        >
          <VCardText>
            <!-- 👉 Current Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                <VTextField
                  v-model="currentPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'bx-hide' : 'bx-show'"
                  label="Current Password"
                  placeholder="············"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'bx-hide' : 'bx-show'"
                  label="New Password"
                  placeholder="············"
                  :rules="newPasswordRules"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
                  label="Confirm New Password"
                  placeholder="············"
                  :rules="passwordConfirmRules"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              Password Requirements:
            </p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="bxs-circle"
                    class="me-3"
                  />
                </div>
                <span class="font-weight-medium">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              type="submit"
              :loading="$store.state.loading.updatePasswordBtn.load"
              :disabled="$store.state.loading.updatePasswordBtn.disabled"
            >
              Save changes
            </VBtn>

            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
            >
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
