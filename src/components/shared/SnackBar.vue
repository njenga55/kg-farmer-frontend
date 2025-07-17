<template>
  <VSnackbar
    v-model="$store.state.snackbar.show"
    :color="$store.state.snackbar.color"
  >
    {{ $store.state.snackbar.text }}
    <template #action="{ attrs }">
      <VBtn
        text
        v-bind="attrs"
        @click="$store.commit('HIDE_SNACKBAR')"
      >
        Close
      </VBtn>
    </template>
  </VSnackbar>
</template>

<script>
export default {}
</script>
