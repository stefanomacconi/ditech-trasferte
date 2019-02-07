import router from '../../router'
import axios from 'axios'

const state = {
    token: null,
    utente: null,
    siglaDitta: null,
    ditta: null,
    dipendente: null
}

const mutations = {
    authUser(state, userData) {
        state.token = userData.token
        state.utente = userData.utente
        state.siglaDitta = userData.siglaDitta
        state.ditta = userData.ditta
    },
    clearAuthData(state) {
        state.token = null
        state.utente = null
        state.siglaDitta = null
        state.ditta = null
        state.dipendente = null
    },
    setDipendente(state, dipendente) {
        state.dipendente = dipendente
    }
}

const actions = {
    login({ commit, dispatch, state, rootState}, authData) {
        axios.post('/autenticazione', {
            }, { auth: {
                username: authData.utente,
                password: authData.password
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'   
            },
        }).then(res => {
            // eslint-disable-next-line
            console.log(res)
            const data = res.data
            commit('authUser', {
                token: data.diTechToken.token,
                utente: data.name,
                ditta: data.ditta,
                siglaDitta: data.siglaDitta
            })
            // init environment
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + state.token
            return dispatch('fetchDipendente').then(() => {
                dispatch('fetchMovimenti').then(() => {
                    router.push('/movimenti')
                    // altro fetch in background
                    dispatch('incrementOffset')
                    dispatch('fetchMovimenti', rootState.movimenti.offset).then(() => {
                      this.attendereDialog = false
                    })
                })
                // fill def nota spese, elenco causali, cdl and cdc (no need to be synchronous)
                dispatch('fetchDefinizioneNotaSpese')
                dispatch('fetchCausali')
                dispatch('fetchElencoCdl')
                dispatch('fetchElencoCdc')
            })
        }).catch(error => {
            // eslint-disable-next-line
            console.log(error)
            dispatch('handleError', error.response.data)
        })
    },
    logout({ commit }) {
        // TODO EFFETTUARE ANCHE IL LOGOUT CON I SERVIZI REST DITECH
        commit('clearAuthData')
        commit('clearMov')
        commit('clearMovimentiData')
        router.replace('/login')
    },
    // eslint-disable-next-line
    handleError({}, error) {
        const errorData = {
            message : error.message,
            developerMessage : error.developerMessage,
            code : error.code,
            status : error.status
        }
        // eslint-disable-next-line
        console.log(errorData)
        router.push({ name: 'error', params: {
            message : errorData.message,
            developerMessage : errorData.developerMessage,
            code : errorData.code,
            status : errorData.status 
        }})
    },
    fetchDipendente({ commit, dispatch, state }) {
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
                    developerMessage : "Impossibile recuperare il dipendente per l'utente " + state.utente
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
    isAuthenticated(state) {
        return state.token !== null
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}