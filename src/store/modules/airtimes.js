// store/modules/airtimes.js
import { getTransactions } from '@/api/transactionService'

export const airtimes = {
  namespaced: true,
  state: {
    airtimes: [],
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    limit: 10,
    loading: false,
  },
  mutations: {
    SET_AIRTIMES(state, payload) {
      state.airtimes = payload
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
    async fetchAirtimes({ commit, state }) {
      const {  currentPage, limit } = state

      // Build query string with params
      const params = new URLSearchParams({
        type: 'airtime_purchase',
        page: currentPage,
        limit,
      }).toString()

      commit('SET_LOADING', true) 

      try {
        const response = await getTransactions(params)

        const data = response.data

        // Commit data to state
        commit('SET_AIRTIMES', data.data.data)
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
      dispatch('fetchAirtimes')
    },
    setSearchQuery({ commit, dispatch }, query) {
      commit('SET_SEARCH_QUERY', query)
      commit('SET_CURRENT_PAGE', 1) // Reset to first page on new search
      dispatch('fetchAirtimes')
    },
    setLimit({ commit, dispatch }, limit) {
      commit('SET_LIMIT', limit)
      dispatch('fetchAirtimes')
    },
  },
}
