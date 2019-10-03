const state = {
  waitDialogVisible: false
}

const mutations = {
  setWaitDialogVisible(state, value) {
    state.waitDialogVisible = value
  },
  // eslint-disable-next-line
  clearGeneralData(state) {
    // state.waitDialogVisible = false
  }
}

const actions = {
  showWaitDialog({
    commit
  }) {
    commit('setWaitDialogVisible', true)
  },
  hideWaitDialog({
    commit
  }) {
    commit('setWaitDialogVisible', false)
  }
}

const getters = {
  getWaitDialogVisible(state) {
    return state.waitDialogVisible
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}