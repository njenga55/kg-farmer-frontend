import App from "@/App.vue"
import Vuex from "vuex"

import { activities } from './modules/activities'
import { airtimes } from './modules/airtimes'
import { dailyReports } from './modules/dailyReports'
import { stats } from './modules/dashboards'
import { farmers } from './modules/farmers'
import { kilos } from './modules/kilos'
import { loans } from './modules/loans'
import { profits } from './modules/profits'
import { monies } from './modules/sendMonies'
import transactions from './modules/transactions'
import { users } from './modules/users'
import paymentReport from "./modules/paymentReport"


import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

// Create vue app
const app = createApp(App)

app.use(Vuex)

export default new  Vuex.Store({
  modules: {
    farmers,
    kilos,
    users,
    airtimes,
    monies,
    loans,
    stats,
    transactions,
    profits,
    activities,
    dailyReports,
    paymentReport,
  },
  state: {
    user: null,
    snackbar: {
      show: false,
      text: "",
      color: "",
    },
    progressbar: {
      show: false,
      color: "#72C270",
    },
    loading: {
      //AUTH
      registerBtn: {
        disabled: false,
        load: false,
      },
      loginBtn: {
        disabled: false,
        load: false,
      },
      forgotBtn: {
        disabled: false,
        load: false,
        proceed: false,
      },
      resetBtn: {
        disabled: false,
        load: false,
      },
      updateMeBtn: {
        disabled: false,
        load: false,
      },
      updatePasswordBtn: {
        disabled: false,
        load: false,
      },
    },
  },
  getters,
  mutations,
  actions,
})
