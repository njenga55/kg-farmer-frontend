import {
  forgotPassword,
  resetPassword,
  updateMe,
  updatePassword,
  updateUser,
  userLogin,
  userSignup,
} from "@/api/userService"

export default {
  //Sign up user
  async register({ state, commit }, credentials) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.registerBtn.load = true
      state.loading.registerBtn.disabled = true

      await userSignup(credentials)

      
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: "User created!",
        color: "success",
      })
      state.loading.registerBtn.load = false
      state.loading.registerBtn.disabled = false
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error.response.data.message,
        color: "error",
      })
      state.loading.registerBtn.load = false
      state.loading.registerBtn.disabled = false
    }
  },

  //Activate account
  async activate({ state, commit }, credentials) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.registerCompleteBtn.load = true
      state.loading.registerCompleteBtn.disabled = true

      const response = await activateAccount(credentials)

      commit("SET_USER_DATA", response.data)
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: "Account verified!",
        color: "success",
      })
      state.loading.registerCompleteBtn.load = false
      state.loading.registerCompleteBtn.disabled = false
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error.response.data.message,
        color: "error",
      })
      state.loading.registerCompleteBtn.load = false
      state.loading.registerCompleteBtn.disabled = false
    }
  },

  //Login user
  async login({ state, commit }, credentials) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.loginBtn.load = true
      state.loading.loginBtn.disabled = true

      const response = await userLogin(credentials)

      commit("SET_USER_DATA", response.data)
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: "Access granted!",
        color: "success",
      })
      state.loading.loginBtn.load = false
      state.loading.loginBtn.disabled = false
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error.response.data.message,
        color: "error",
      })
      state.loading.loginBtn.load = false
      state.loading.loginBtn.disabled = false
    }
  },

  // Forgot password
  async forgotPassword({ state, commit }, credentials) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.forgotBtn.load = true
      state.loading.forgotBtn.disabled = true

      const response = await forgotPassword(credentials)

      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: response.data.message,
        color: "success",
      })
      state.loading.forgotBtn.proceed = true
      state.loading.forgotBtn.load = false
      state.loading.forgotBtn.disabled = false
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error.response.data.message,
        color: "error",
      })
      state.loading.forgotBtn.proceed = false
      state.loading.forgotBtn.load = false
      state.loading.forgotBtn.disabled = false
    }
  },

  //Reset password
  async resetPassword({ state, commit }, credentials) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.resetBtn.load = true
      state.loading.resetBtn.disabled = true

      const response = await resetPassword(credentials)

      commit("SET_USER_DATA", response.data)
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: "Password changed.",
        color: "success",
      })
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error.response.data.message,
        color: "error",
      })
      state.loading.resetBtn.load = false
      state.loading.resetBtn.disabled = false
    }
  },

  //Update password
  async updateMe({ state, commit }, credentials) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.updateMeBtn.load = true
      state.loading.updateMeBtn.disabled = true

      const response = await updateMe(credentials)

      commit("SET_USER_DATA", response.data)
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: "Changes Saved.",
        color: "success",
      })
      state.loading.updateMeBtn.load = false
      state.loading.updateMeBtn.disabled = false
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error.response.data.message,
        color: "error",
      })
      state.loading.updateMeBtn.load = false
      state.loading.updateMeBtn.disabled = false
    }
  },

  //Update password
  async updatePassword({ state, commit }, credentials) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.updatePasswordBtn.load = true
      state.loading.updatePasswordBtn.disabled = true

      const response = await updatePassword(credentials)

      commit("SET_USER_DATA", response.data)
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: "Password changed.",
        color: "success",
      })
      state.loading.updatePasswordBtn.load = false
      state.loading.updatePasswordBtn.disabled = false
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error.response.data.message,
        color: "error",
      })
      state.loading.updatePasswordBtn.load = false
      state.loading.updatePasswordBtn.disabled = false
    }
  },

  async updateUser({ state, commit }, payload) {
    // eslint-disable-next-line no-useless-catch
    try {
      commit("SHOW_PROGRESSBAR", true)
      state.loading.registerBtn.load = true
      state.loading.registerBtn.disabled = true
      await updateUser(payload)
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: "User updated!",
        color: "success",
      })
      state.loading.registerBtn.load = false
      state.loading.registerBtn.disabled = false
    } catch (error) {
      commit("HIDE_PROGRESSBAR")
      commit("SHOW_SNACKBAR", {
        text: error,
        color: "error",
      })
      state.loading.registerBtn.load = false
      state.loading.registerBtn.disabled = false
    }
  },

  //Logout user
  async logout({ commit }) {
    commit("CLEAR_USER_DATA")
  },
}
