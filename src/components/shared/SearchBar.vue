<!-- components/SearchBar.vue -->
<template>
  <VTextField
    v-model="search"
    label="Search Farmers"
    append-icon="mdi-magnify"
    clearable
    @input="onSearch"
  />
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: ['searchQuery'],
  emits: ['update:searchQuery'],
  setup(props, { emit }) {
    const search = ref(props.searchQuery)

    watch(search, newVal => {
      emit('update:searchQuery', newVal)
    })

    const onSearch = () => emit('update:searchQuery', search.value)

    return {
      search,
      onSearch,
    }
  },
}
</script>
