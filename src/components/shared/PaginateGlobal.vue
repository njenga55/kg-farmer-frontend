<template>
  <VPagination
    v-model="currentPage"
    :length="lastPage"
    :total-visible="5"
    color="primary"
  />
</template>

<script>
import { computed, toRefs, watch } from 'vue'

export default {
  props: ["store", "collection", "action"],
  setup(props) {
    const { store, collection, action } = toRefs(props) // To access props in Composition API

    // Reactive state
    const currentPage = computed({
      get() {
        return store.value && store.value.state[store.value][collection.value].currentPage
      },
      set(value) {
        store.value.commit(store.value + "/SET_CURRENT_PAGE", value)
      },
    })

    const lastPage = computed(() => {
      return store.value.state[store.value][collection.value].totalPages
    })

    // Method to handle pagination
    const paginatePage = pageNumber => {
      scrollToTop()
      store.value.dispatch(store.value + "/" + action.value, pageNumber)
    }

    // Scroll to top utility
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    // Watch for currentPage changes
    watch(currentPage, (newVal, oldVal) => {
      paginatePage(newVal)
    })

    return {
      currentPage,
      lastPage,
    }
  },
}
</script>
