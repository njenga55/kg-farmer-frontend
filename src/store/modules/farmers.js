// store/modules/farmers.js
import { getFarmers, updateFarmer } from '@/api/farmerService'

export const farmers = {
  namespaced: true,
  state: {
    farmers: [],
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    limit: 10,
    loading: false,
  },
  mutations: {
    SET_FARMERS(state, payload) {
      console.log('SET_FARMERS:', payload)
      state.farmers = payload
    },
    SET_TOTAL_RECORDS(state, payload) {
      state.totalRecords = payload
    },
    SET_TOTAL_PAGES(state, payload) {
      state.totalPages = payload
    },
    SET_CURRENT_PAGE(state, payload) {
      console.log('SET_CURRENT_PAGE:', payload)
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
    async fetchFarmers({ commit, state }) {
      const { searchQuery, currentPage, limit } = state

      // Build query string with params
      const params = new URLSearchParams({
        search: searchQuery,
        searchFields: 'name,idNumber,farmerCode,phoneNumber',
        page: currentPage,
        limit,
      }).toString()

      commit('SET_LOADING', true) 

      try {
        const response = await getFarmers(params)

        const data = response.data

        // Commit data to state
        commit('SET_FARMERS', data.data.data)
        commit('SET_TOTAL_RECORDS', data.totalRecords)
        commit('SET_TOTAL_PAGES', data.totalPages)
      
      } catch (error) {
        console.error('Error fetching farmers:', error)
    
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateFarmer({ commit, state }, payload) {
      // eslint-disable-next-line no-useless-catch
      try { 
        await updateFarmer(payload)
      } catch (error) {
        console.log(error)
      }
    },
    setPage({ commit, dispatch }, page) {
      commit('SET_CURRENT_PAGE', page)
      dispatch('fetchFarmers')
    },
    setSearchQuery({ commit, dispatch }, query) {
      commit('SET_SEARCH_QUERY', query)
      commit('SET_CURRENT_PAGE', 1) // Reset to first page on new search
      dispatch('fetchFarmers')
    },
    setLimit({ commit, dispatch }, limit) {
      commit('SET_LIMIT', limit)
      dispatch('fetchFarmers')
    },
  },
}
