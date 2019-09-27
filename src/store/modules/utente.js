import router from '../../router'
import axios from 'axios'
const qs = require('querystring')

const state = {
  status: '',
  token: localStorage.getItem('dt_token') || '',
  utente: '',
  siglaDitta: null,
  ditta: null,
  dipendente: '',
  esterno: null,
  opzioni: {}
}

const mutations = {
  authUser(state, userData) {
    state.token = userData.token
    state.status = 'success'
    state.utente = userData.utente
    state.siglaDitta = userData.siglaDitta
    state.ditta = userData.ditta
    state.esterno = userData.esterno
  },
  clearAuthData(state) {
    state.token = ''
    state.status = ''
    state.utente = ''
    state.siglaDitta = null
    state.ditta = null
    state.dipendente = ''
    state.esterno = null
    state.opzioni = {}
  },
  setDipendente(state, dipendente) {
    state.dipendente = dipendente
  },
  setOpzioni(state, opzioni) {
    state.opzioni = opzioni
  }
}

const actions = {
  login({
    commit,
    dispatch,
  }, authData) {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: authData.utente,
        password: authData.password
      }
    }
    axios.post('/autenticazione', qs.stringify({
        esterni: true
      }), config)
      .then(res => {
        // eslint-disable-next-line
        console.log(res)
        dispatch('_authUser', res.data)
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        localStorage.removeItem('dt_token')
        commit('clearAuthData')
        dispatch('handleError', error.response.data)
      })
    },
    clearStoreData({ commit }) {
      commit('clearAuthData')
      commit('clearMov')
      commit('clearMovimentiData')
    },
    setUserInfo({ dispatch }) {
      axios.get('/utente')
      .then(res => {
        // eslint-disable-next-line
        console.log(res)
        dispatch('_authUser', res.data)
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        dispatch('handleError', error.response.data)
      })
    },
    _authUser({ commit, dispatch }, data) {
      const token = data.diTechToken.token
      localStorage.setItem('dt_token', token)
      commit('authUser', {
        token,
        utente: data.name,
        ditta: data.ditta,
        siglaDitta: data.siglaDitta,
        esterno: data.esterno
      })
      // init environment
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      return dispatch('initEnvironment')
    },
    initEnvironment({ dispatch, rootState }) {
      console.log("*** INIT ***")
      dispatch('fetchDipendente').then(() => {
        dispatch('fetchMovimenti').then(() => {
          router.push('/movimenti')
          dispatch('incrementOffset')
          dispatch('fetchMovimenti', rootState.movimenti.offset)
        })
        // fill options, def nota spese, elenco causali, cdl and cdc (no need to be asynchronous)
        dispatch('fetchOpzioni')
        dispatch('fetchDefinizioneNotaSpese')
        dispatch('fetchCausali')
        dispatch('fetchElencoCdl')
        // dispatch('fetchElencoCdc')
      })
    },
    logout({
      dispatch
    }) {
      axios.get('/logout')
      .then(res => {
        // eslint-disable-next-line
        console.log(res)
        dispatch('clearStoreData')
        localStorage.removeItem('dt_token')
        delete axios.defaults.headers.common['Authorization']
        router.replace('/login')
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        dispatch('handleError', error.response.data)
      })
    },
  // eslint-disable-next-line
  handleError({}, error) {
    const errorData = {
      message: error.message,
      developerMessage: error.developerMessage,
      code: error.code,
      status: error.status
    }
    // eslint-disable-next-line
    console.log(errorData)
    router.push({
      name: 'error',
      params: {
        message: errorData.message,
        developerMessage: errorData.developerMessage,
        code: errorData.code,
        status: errorData.status
      }
    })
  },
  fetchDipendente({
    commit,
    dispatch,
    state
  }) {
    return new Promise((resolve, reject) => {
      axios.get('/dipendente')
        .then(res => {
          // eslint-disable-next-line
          console.log(res)
          commit('setDipendente', res.data.dipendente)
          resolve()
        }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          dispatch('handleError', {
            developerMessage: "Impossibile recuperare il dipendente per l'utente " +
              state.utente
          })
          reject()
        })
    })
  },
  fetchOpzioni({
    commit,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      axios.get('/variabili/web/3')
        .then(res => {
          // eslint-disable-next-line
          console.log(res)
          commit('setOpzioni', res.data)
          resolve()
        }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          dispatch('handleError', {
            developerMessage: "Impossibile recuperare le opzioni "
          })
          reject()
        })
    })
  },
}

const getters = {
  getToken(state) {
    return state.token
  },
  getUtente(state) {
    return state.utente ? state.utente.toUpperCase() : state.utente
  },
  getDipendente(state) {
    return state.dipendente
  },
  getSiglaDitta(state) {
    return state.siglaDitta
  },
  getDitta(state) {
    return state.ditta
  },
  getOpzioni(state) {
    return state.opzioni
  },
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
}

export default {
  state,
  mutations,
  actions,
  getters
}