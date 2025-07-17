// store/modules/transactions.js
import { fetchFarmerTransactions } from '@/api/transactionService'

const state = {
  data: [],
  loading: false,
  totalPages: 1,
  totalRecords: 0,
  currentPage: 1,
  limit: 5,
}

const mutations = {
  SET_TRANSACTIONS(state, payload) {
    state.data = payload.data
    state.totalPages = payload.totalPages
    state.totalRecords = payload.totalRecords
    state.currentPage = payload.currentPage
    state.limit = payload.limit
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
}

const actions = {
  async fetchFarmerTransactions({ commit }, { farmerId, page, limit }) {
    commit('SET_LOADING', true)

    // Build query string with params
    const params = new URLSearchParams({
      page,
      limit,
    }).toString()

    try {
      
      const response = await fetchFarmerTransactions(farmerId, params)
        
      const data = response.data

      commit('SET_TRANSACTIONS', {
        data: data.data,
        totalPages: data.totalPages,
        totalRecords: data.totalRecords,
        currentPage: data.currentPage,
        limit: data.results,
      })
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
