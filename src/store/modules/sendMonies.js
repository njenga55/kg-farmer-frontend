// store/modules/monies.js
import { getTransactions } from '@/api/transactionService'

export const monies = {
  namespaced: true,
  state: {
    monies: [],
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    limit: 10,
    loading: false,
  },
  mutations: {
    SET_MONIES(state, payload) {
      state.monies = payload
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
    async fetchMonies({ commit, state }) {
      const { searchQuery, currentPage, limit } = state

      // Build query string with params
      const params = new URLSearchParams({
        search: searchQuery,
        searchFields: 'transactionId,status',
        type: 'money_transfer',
        page: currentPage,
        limit,
      }).toString()

      commit('SET_LOADING', true) 

      try {
        const response = await getTransactions(params)

        const data = response.data

        // Commit data to state
        commit('SET_MONIES', data.data.data)
        commit('SET_TOTAL_RECORDS', data.totalRecords)
        commit('SET_TOTAL_PAGES', data.totalPages)
      
      } catch (error) {
        console.error('Error fetching airtimes:', error)
    
      } finally {
        commit('SET_LOADING', false)
      }
    },
    setPage({ commit, dispatch }, page) {
      commit('SET_CURRENT_PAGE', page)
      dispatch('fetchMonies')
    },
    setSearchQuery({ commit, dispatch }, query) {
      commit('SET_SEARCH_QUERY', query)
      commit('SET_CURRENT_PAGE', 1) // Reset to first page on new search
      dispatch('fetchMonies')
    },
    setLimit({ commit, dispatch }, limit) {
      commit('SET_LIMIT', limit)
      dispatch('fetchMonies')
    },
  },
}
