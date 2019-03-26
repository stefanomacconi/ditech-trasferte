import axios from 'axios'
import moment from 'moment'

const state = {
    date: {},
    offset: 0,
    causali: [],
    elencoCdl: [],
    elencoCdc: [],
    definizioniNotaSpese: [],
    giorniWarning: [],
    giorniError: [],
    pickedData: new Date().getTime(),
    movimentiSelezionati: []
}

const mutations = {
    clearMovimentiData(state) {
        state.date = {},
        state.offset = 0,
        state.giorniError = [],
        state.giorniWarning = [],
        state.elencoCdc = [],
        state.elencoCdl = [],
        state.causali = [],
        state.definizioniNotaSpese = [],
        state.pickedData = new Date().getTime(),
        state.movimentiSelezionati = []
    },
    clearGiorniColor(state) {
        state.giorniError = [],
        state.giorniWarning = []
    },
    setDate(state, date) {
        state.date = date
    },
    addDate(state, dateAggiuntive) {
        if (dateAggiuntive.length == 0)
            return
        // unisci il primo coi rimasugli della get precedente (se esiste)
        const nuoveDate = Object.keys(dateAggiuntive)
        const firstDataAggiunta = nuoveDate[0]
        const chiaviDate = Object.keys(state.date)
        if (String(firstDataAggiunta) == chiaviDate[chiaviDate.length - 1])
            // aggiungi movimenti rimanenti alla data
            state.date[firstDataAggiunta].movimenti = 
                state.date[firstDataAggiunta].movimenti.concat(dateAggiuntive[firstDataAggiunta].movimenti)
        // aggiungi gli altri oggetti data
        const nuoviValori = Object.values(dateAggiuntive)
        for (let index = 1; index < nuoveDate.length; index++) {
            state.date[nuoveDate[index]] = nuoviValori[index]
        }
    },
    addNewDataBean(state, dataBean) {
        const stringDate = moment(dataBean.data).format('YYYY-MM-DD')
        state.date[stringDate] = dataBean
    },
    setCausali(state, causali) {
        causali.forEach(causale => {
           const data = {
               codice: causale.codice,
               descrizione: causale.descrizione
            } 
            state.causali.push(data)
        })
    },
    setElencoCdl(state, elencoCdl) {
        elencoCdl.forEach(cdl => {
            const data = {
                codice: cdl.codice,
                descrizione: cdl.descrizione
            } 
            state.elencoCdl.push(data)
        })
    },
    setElencoCdc(state, elencoCdc) {
        elencoCdc.forEach(cdc => {
            const data = {
                codice: cdc.codice,
                descrizione: cdc.descrizione
            } 
            state.elencoCdc.push(data)
        })
    },
    setDefinizioniNotaSpese(state, definizioni) {
        definizioni.forEach(definizione => {
            const data = {
                codice: definizione.codice,
                descrizione: definizione.descrizione,
                codiceTipoMovimento: definizione.codiceTipoMovimento
            }
            state.definizioniNotaSpese.push(data)
        })
    },
    addToGiorniWarning(state, data) {
        if (state.giorniWarning.indexOf(data) === -1) 
            state.giorniWarning.push(data)
    },
    addToGiorniError(state, data) {
        if (state.giorniError.indexOf(data) === -1) 
            state.giorniError.push(data)
    },
    removeToGiorniWarning(state, data) {
        const index = state.giorniWarning.indexOf(data)
        if (index != -1)
            state.giorniWarning.splice(index, 1)
        },
    removeToGiorniError(state, data) {
        const index = state.giorniError.indexOf(data)
        if (index != -1)
            state.giorniError.splice(index, 1)
    },
    setPickedData(state, data) {
        state.pickedData = data
    },
    setOffset(state, offset) {
        state.offset = offset
    },
    addToMovimentiSelezionati(state, movimento) {
        state.movimentiSelezionati.push(movimento)
    },
    removeToMovimentiSelezionati(state, index) {
        if (index > -1)
            state.movimentiSelezionati.splice(index, 1)
    },
    clearMovimentiSelezionati(state) {
        state.movimentiSelezionati = []
    },
    updateNrRapportino(state, payload) {
        const dataMovimento = payload.dataMovimento
        const numeroMovimento = payload.numeroMovimento
        const numeroRapportino = payload.nrRapportino
        var movimenti = state.date[dataMovimento].movimenti
        if (movimenti) {
            for (let index = 0; index < movimenti.length; index++) {
                const movimento = movimenti[index]
                if (movimento.numeroMovimento === numeroMovimento) {
                    state.date[dataMovimento].movimenti[index].keyRdARapportino = numeroRapportino
                    break
                }
            }
        }
    }
}

const actions = {
    fetchMovimenti({ commit, dispatch, rootState }, offset) {
        return new Promise((resolve, reject) => {
            var path = '/movimento/lavorazione/' 
            + rootState.utente.dipendente + "/"
            + 50 + "/" //fixed limit //se viene toccato questo occorre toccare anche l'offset nell'increment
            if (offset) {
               path = path + offset 
            }
            axios.get(path)
            .then(res => {
                // eslint-disable-next-line
                console.log(res)
                if (offset) {
                    commit('addDate', res.data)
                } else {
                    commit('setDate', res.data)
                }
                resolve(res)
            }).catch(error => {
                // eslint-disable-next-line
                console.log(error)
                dispatch('handleError', error.response.data)
                reject()
            })
        })
    },
    fetchCausali({ commit, dispatch }) {
        axios.get("/causale/lavorazione")
            .then(res => {
                // eslint-disable-next-line
                console.log(res)
                commit('setCausali', res.data)
            }).catch(error => {
                // eslint-disable-next-line
                console.log(error)
                dispatch('handleError', error.response.data)
        })
    },
    fetchElencoCdl({ commit, dispatch }) {
        axios.get("/cdl")
            .then(res => {
                // eslint-disable-next-line
                console.log(res)
                commit('setElencoCdl', res.data)
            }).catch(error => {
                // eslint-disable-next-line
                console.log(error)
                dispatch('handleError', error.response.data)
        })
    },
    fetchElencoCdc({ commit, dispatch }) {
        axios.get("/cdc")
            .then(res => {
                // eslint-disable-next-line
                console.log(res)
                commit('setElencoCdc', res.data)
            }).catch(error => {
                // eslint-disable-next-line
                console.log(error)
                dispatch('handleError', error.response.data)
        })

    },
    fetchDefinizioneNotaSpese({ commit, dispatch }) {
        axios.get("/movimento/supplementare")
            .then(res => {
                // eslint-disable-next-line
                console.log(res)
                commit('setDefinizioniNotaSpese', res.data)
            }).catch(error => {
                // eslint-disable-next-line
                console.log(error)
                dispatch('handleError', error.response.data)
        })

    },
    clearGiorniColor({commit}) {
        commit('clearGiorniColor')
    },
    addToGiorniWarning({commit}, data) {
        commit('addToGiorniWarning', data)
    },
    addToGiorniError({commit}, data) {
        commit('addToGiorniError', data)
    },
    removeToGiorniWarning({commit}, data) {
        commit('removeToGiorniWarning', data)
    },
    removeToGiorniError({commit}, data) {
        commit('removeToGiorniError', data)
    },
    setPickedData({commit}, data) {
        commit('setPickedData', data)
    },
    setOffset({commit}, offset) {
        commit('setOffset', offset)
    },
    incrementOffset({dispatch, state}) {
      var offset = state.offset + 50 // fixed offset 
      // se si tocca l'offset occorre modificare anche la chiamata login
      dispatch('setOffset', offset)
    },
    addToMovimentiSelezionati({commit}, movimento) {
        commit('addToMovimentiSelezionati', movimento)
    },
    removeToMovimentiSelezionati({commit}, movimento) {
        commit('removeToMovimentiSelezionati', movimento)
    },
    clearMovimentiSelezionati({commit}) {
        commit('clearMovimentiSelezionati')
    },
    addNewDataBean({commit}, dataBean) {
        commit('addNewDataBean', dataBean)
    }
}

const getters = {
    getMovimenti(state) {
        return state.date.movimenti
    },
    getDate(state) {
        return state.date
    },
    getCausali(state) {
        return state.causali
    },
    getElencoCdl(state) {
        return state.elencoCdl
    },
    getElencoCdc(state) {
        return state.elencoCdc
    },
    getDefinizioniNotaSpese(state) {
        return state.definizioniNotaSpese
    },
    getGiorniWarning(state) {
        return state.giorniWarning
    },
    getGiorniError(state) {
        return state.giorniError
    },
    getPickedData(state) {
        return state.pickedData
    },
    getOffset(state) {
        return state.offset
    },
    getMovimentiSelezionati(state) {
        return state.movimentiSelezionati
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}