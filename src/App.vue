<script setup>
import SnackBar from "@/components/shared/SnackBar.vue"
import { hexToRgb } from '@layouts/utils'
import axios from "axios"
import { useTheme } from 'vuetify'

import { useStore } from 'vuex' // Import useStore from vuex

// Initialize store with useStore
const store = useStore()

const { global } = useTheme()

// Your logic here
onMounted(() => {
  const userString = localStorage.getItem("user")
  if (userString) {
    const userData = JSON.parse(userString)

    store.commit("SET_USER_DATA", userData)
  }

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        store.commit("CLEAR_USER_DATA_INTERCEPTOR")
      }
      
      return Promise.reject(error)
    },
  )
})
</script>

<template>
  <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
    <RouterView />
  </VApp>

  <VContainer>
    <SnackBar />
  </VContainer>
</template> 

<!--
  <script setup>
  import { onMounted, ref } from 'vue'

  const quote = ref('')

  const quotes = [
  "Good things take time. We’ll be right back.",
  "We’re fixing some wires and tightening the bolts.",
  "The system is stretching and meditating. Please bear with us.",
  "We’re making improvements for a smoother ride. Hang tight!",
  "We're tuning up the engines — thanks for your patience!",
  ]

  onMounted(() => {
  // Pick a random quote on mount
  quote.value = quotes[Math.floor(Math.random() * quotes.length)]
  })
  </script>

  <template>
  <VCard
  class="ma-auto my-12 pa-8"
  max-width="600"
  elevation="4"
  rounded="2xl"
  >
  <VRow
  justify="center"
  class="text-center"
  >
  <VCol cols="12">
  <VIcon
  size="64"
  color="warning"
  class="mb-4"
  >
  mdi-tools
  </VIcon>

  <h1 class="text-h5 font-weight-bold mb-2">
  System Under Maintenance
  </h1>
  <p class="text-subtitle-1 mb-4">
  We're currently making improvements to serve you better.
  </p>
  <VChip
  color="warning"
  text-color="black"
  class="ma-2"
  size="large"
  >
  {{ quote }}
  </VChip>

  <p class="text-body-2 mt-6">
  Thank you for your patience 🙏
  </p>
  </VCol>
  </VRow>
  </VCard>
  </template> 
-->
