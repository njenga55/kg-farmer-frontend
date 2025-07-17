// store/modules/dashboards.js
import { getDashboardStats } from '@/api/dashboardService'

export const stats = {
  namespaced: true,
  state: {
    stats: {
      transactions: [],
      revenueBreakDown: [],
      payBillAvailableAmount: 0,
      kilos: [],
      farmers: 0,
      users: 0,
    },
    loading: false,
  },
  mutations: {
    SET_STATS(state, payload) {
      // Update the state with the transformed payload
      state.stats = {
        ...payload,

        // Transform the transactions and revenueBreakDown into a more usable format
        transactions: payload.transactions.reduce((acc, transaction) => {
          // Map transaction data into an easily accessible format
          acc[transaction._id] = transaction.totalAmount
          
          return acc
        }, {}),
        revenueBreakDown: payload.revenueBreakDown.reduce((acc, item) => {
          // Transform revenueBreakDown to an easier structure for the template
          acc[item.type] = {
            totalAmount: item.totalAmount,
            percentageAmount: item.percentageAmount.toFixed(2),
          }
          
          return acc
        }, {}),
      }
    },
    SET_LOADING(state, payload) {
      state.loading = payload
    },
  },
  actions: {
    async getDashboardStats({ commit }) {
      commit('SET_LOADING', true)

      try {
        const response = await getDashboardStats()
        const data = response.data

        // Commit the transformed data to the store
        commit('SET_STATS', data)

      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}
