<template>
  <VProgressLinear
    v-if="$store.state.progressbar.show"
    :color="$store.state.progressbar.color"
    indeterminate
  />
</template>

<script>
export default {}
</script>
