import { exportFarmersReport, getProfitData } from '@/api/profitService'

export const profits = {
  namespaced: true,
  state: {
    dailyProfit: {
      totalCharges: 0,
      totalAmount: 0,
      breakdown: {},
    },
    weeklyProfit: {
      totalCharges: 0,
      totalAmount: 0,
      breakdown: {},
    },
    monthlyProfit: {
      totalCharges: 0,
      totalAmount: 0,
      breakdown: {},
    },
    topFarmers: [],
    totalBorrowers: 0,
    allTimeTotal: 0,
    loading: false,
  },
  mutations: {
    SET_DAILY_PROFIT(state, payload) {
      state.dailyProfit = payload
    },
    SET_WEEKLY_PROFIT(state, payload) {
      state.weeklyProfit = payload
    },
    SET_MONTHLY_PROFIT(state, payload) {
      state.monthlyProfit = payload
    },
    SET_TOP_FARMERS(state, payload) {
      state.topFarmers = payload
    },
    SET_TOTAL_BORROWERS(state, payload) {
      state.totalBorrowers = payload
    },
    SET_ALL_TIME_TOTAL(state, payload) {
      state.allTimeTotal = payload
    },
    SET_LOADING(state, payload) {
      state.loading = payload
    },
  },
  actions: {
    async fetchProfitData({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await getProfitData()
        const data = response.data

        if (data.status === 'success') {
          commit('SET_DAILY_PROFIT', data.data.dailyProfit)
          commit('SET_WEEKLY_PROFIT', data.data.weeklyProfit)
          commit('SET_MONTHLY_PROFIT', data.data.monthlyProfit)
          commit('SET_TOP_FARMERS', data.data.topFarmers)
          commit('SET_TOTAL_BORROWERS', data.data.totalBorrowers)
          commit('SET_ALL_TIME_TOTAL', data.data.allTimeTotal)
        }
      } catch (error) {
        console.error('Error fetching profit data:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // In actions
    async exportFarmersReport({ commit }, period) {
      try {
        return await exportFarmersReport(period)
      } catch (error) {
        console.error('Export failed:', error)
        throw error
      }
    },
  },
  getters: {
    dailyProfit: state => state.dailyProfit,
    weeklyProfit: state => state.weeklyProfit,
    monthlyProfit: state => state.monthlyProfit,
    topFarmers: state => state.topFarmers,
    totalBorrowers: state => state.totalBorrowers,
    allTimeTotal: state => state.allTimeTotal,
    loading: state => state.loading,
  },
}
