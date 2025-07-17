<script setup>
import { reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'

// Initialize store with useStore
const store = useStore()

const accountData = reactive({
  avatarSrc: store.state.user.data.user.photo,
  photo: null,
  name: store.state.user.data.user.name,
  email: store.state.user.data.user.email,
  phone: store.state.user.data.user.phone,
  nameRules: [
    v => !!v || "Name is required",
    v => (v && v.length >= 3) || "Name must be at least 3 characters",
  ],
  emailRules: [
    v => !!v || "Email is required",
    v => /.+@.+\..+/.test(v) || "Email must be valid",
  ],
  phoneNumberRules: [
    v => !!v || "Phone number is required",
    v => /^[0-9]{10}$/.test(v) || "Phone number must be 10 digits",
  ],
})

const formRef = ref(null) // This is no longer needed for file input
const fileInput = ref(null) // File input ref

// Destructure for easier access
const {
  avatarSrc,
  photo,
  name,
  email,
  phone,
  nameRules,
  emailRules,
  phoneNumberRules,
} = toRefs(accountData)

const isAccountDeactivated = ref(false)

const updateMe = async () => {
  if (formRef.value.validate()) {
    // Form is valid, perform form submission or other actions
    const formData = new FormData()

    formData.append("name", name.value)
    formData.append("email", email.value)
    formData.append("phone", phone.value)
    formData.append("photo", photo.value)

    // Send formData to your server or perform desired actions
    store.dispatch("updateMe", formData)
  }
}

// Method to trigger file input (updated)
const openFileInput = () => {
  fileInput.value.click() // Directly trigger file input
}

const handleFileChange = event => {
  const file = event.target.files[0]

  photo.value = event.target.files[0]
  if (file) {
    const reader = new FileReader()

    reader.onload = e => {
      avatarSrc.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script> 

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="avatarSrc"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="openFileInput"
              >
                <VIcon
                  icon="bx-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="fileInput"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="handleFileChange"
              >
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="formRef"
            class="mt-6"
            @submit.prevent="updateMe"
          >
            <VRow>
              <!-- 👉 Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="name"
                  placeholder="John Doe"
                  label="Name"
                  :rules="nameRules"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="email"
                  label="E-mail"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  :rules="emailRules"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="phone"
                  label="Phone Number"
                  placeholder="0725431276"
                  :rules="phoneNumberRules"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn
                  type="submit"
                  :loading="$store.state.loading.updateMeBtn.load"
                  :disabled="$store.state.loading.updateMeBtn.disabled"
                >
                  Save changes
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <VCard title="Deactivate Account">
        <VCardText>
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              label="I confirm my account deactivation"
            />
          </div>

          <VBtn
            :disabled="!isAccountDeactivated"
            color="error"
            class="mt-3"
          >
            Deactivate Account
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
