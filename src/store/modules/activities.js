import { getAllActivities } from '@/api/activityService'

export const activities = {
  namespaced: true,
  state: {
    activities: [],
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    limit: 10,
    loading: false,
  },
  mutations: {
    SET_ACTIVITIES(state, payload) {
      state.activities = payload
    },
    SET_TOTAL_RECORDS(state, payload) {
      state.totalRecords = payload
    },
    SET_TOTAL_PAGES(state, payload) {
      state.totalPages = payload
    },
    SET_CURRENT_PAGE(state, payload) {
      state.currentPage = payload
    },
    SET_SEARCH_QUERY(state, payload) {
      state.searchQuery = payload
    },
    SET_LIMIT(state, payload) {
      state.limit = payload
    },
    SET_LOADING(state, payload) {
      state.loading = payload
    },
  },
  actions: {
    async fetchActivities({ commit, state }) {
      const { searchQuery, currentPage, limit } = state

      const params = new URLSearchParams({
        search: searchQuery,
        searchFields: 'farmer.name,farmer.farmerCode,action,status,ipAddress',
        page: currentPage,
        limit,
      }).toString()

      commit('SET_LOADING', true) 

      try {
        const response = await getAllActivities(params)
        const data = response.data

        commit('SET_ACTIVITIES', data.data.data)
        commit('SET_TOTAL_RECORDS', data.totalRecords)
        commit('SET_TOTAL_PAGES', data.totalPages)
      
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    setPage({ commit, dispatch }, page) {
      commit('SET_CURRENT_PAGE', page)
      dispatch('fetchActivities')
    },
    setSearchQuery({ commit, dispatch }, query) {
      commit('SET_SEARCH_QUERY', query)
      commit('SET_CURRENT_PAGE', 1)
      dispatch('fetchActivities')
    },
    setLimit({ commit, dispatch }, limit) {
      commit('SET_LIMIT', limit)
      dispatch('fetchActivities')
    },
  },
}
