<!-- components/Pagination.vue -->
<template>
  <VPagination
    v-model="page"
    :length="totalPages"
    @input="onPageChange"
  />
</template>

<script>
export default {
  props: ['currentPage', 'totalPages'],
  emits: ['update:page'],
  setup(props, { emit }) {
    const page = ref(props.currentPage)

    const onPageChange = newPage => {
      emit('update:page', newPage)
    }

    return {
      page,
      onPageChange,
    }
  },
}
</script>
