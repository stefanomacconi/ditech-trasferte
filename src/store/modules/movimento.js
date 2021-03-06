const state = {
  tab: 0,
  isNewMov: false,
  movimento: {
    numero: null,
    data: new Date().toISOString().substr(0, 10),
    commessa: "",
    tempo: null,
    tempi: {
      timeA1: null,
      timeA2: null,
      timeA3: null,
      timeA4: null,
      timeG1: null,
      timeG2: null,
      timeG3: null,
      timeG4: null
    },
    nota: "",
    notaSpese: [],
    materiale: [],
    notaLista: null,
    causale: null,
    cdl: null,
    cdc: null,
    buono: 0,
    posizione: null,
    keyRdARapportino: null,
    definitivo: false,
    qtaTot: null,
    qtaTotCons: null,
    dataCons: null
  }
}

const mutations = {
  setTab(state, tab) {
    state.tab = tab
  },
  setIsNewMov(state, value) {
    state.isNewMov = value
  },
  setDefinitivo(state, definitvo) {
    state.movimento.definitivo = definitvo
  },
  clearMov(state) {
    state.movimento.numero = null
    state.movimento.tempi.timeG1 = null
    state.movimento.tempi.timeG2 = null
    state.movimento.tempi.timeG3 = null
    state.movimento.tempi.timeG4 = null
    state.movimento.tempi.timeA1 = null
    state.movimento.tempi.timeA2 = null
    state.movimento.tempi.timeA3 = null
    state.movimento.tempi.timeA4 = null
    state.movimento.nota = ""
    state.movimento.causale = null
    state.movimento.posizione = null
    state.movimento.cdl = null
    state.movimento.cdc = null
    state.movimento.buono = 0
    state.movimento.data = new Date().toISOString().substr(0, 10)
    state.movimento.commessa = ""
    state.movimento.tempo = null
    state.movimento.notaSpese = []
    state.movimento.materiale = []
    state.movimento.notaLista = null
    state.movimento.definitivo = false
    state.movimento.keyRdARapportino = null
    state.movimento.qtaTot = null
    state.movimento.qtaTotCons = null
    state.movimento.dataCons = null
  },
  setMovimento(state, movimento) {
    state.movimento.numero = movimento.numeroMovimento
    //if (movimento.orari) {
    if (movimento.orari.oraInizioMattino && movimento.orari
      .oraInizioMattino != 0)
      state.movimento.tempi.timeG1 = getTimeFromInteger(movimento.orari
        .oraInizioMattino)
    if (movimento.orari.oraFineMattino && movimento.orari.oraFineMattino != 0)
      state.movimento.tempi.timeG2 = getTimeFromInteger(movimento.orari
        .oraFineMattino)
    if (movimento.orari.oraInizioPomeriggio && movimento.orari
      .oraInizioPomeriggio != 0)
      state.movimento.tempi.timeG3 = getTimeFromInteger(movimento.orari
        .oraInizioPomeriggio)
    if (movimento.orari.oraFinePomeriggio && movimento.orari
      .oraFinePomeriggio != 0)
      state.movimento.tempi.timeG4 = getTimeFromInteger(movimento.orari
        .oraFinePomeriggio)
    if (movimento.orari.oraInizioAttMattino && movimento.orari
      .oraInizioAttMattino != 0)
      state.movimento.tempi.timeA1 = getTimeFromInteger(movimento.orari
        .oraInizioAttMattino)
    if (movimento.orari.oraFineAttMattino && movimento.orari
      .oraFineAttMattino != 0)
      state.movimento.tempi.timeA2 = getTimeFromInteger(movimento.orari
        .oraFineAttMattino)
    if (movimento.orari.oraInizioAttPomeriggio && movimento.orari
      .oraInizioAttPomeriggio != 0)
      state.movimento.tempi.timeA3 = getTimeFromInteger(movimento.orari
        .oraInizioAttPomeriggio)
    if (movimento.orari.oraFineAttPomeriggio && movimento.orari
      .oraFineAttPomeriggio != 0)
      state.movimento.tempi.timeA4 = getTimeFromInteger(movimento.orari
        .oraFineAttPomeriggio)
    //}    
    state.movimento.nota = movimento.nota
    state.movimento.causale = movimento.causale
    state.movimento.posizione = movimento.posizione
    state.movimento.buono = movimento.buono
    if (movimento.cdl && movimento.cdl != 0)
      state.movimento.cdl = movimento.cdl + " - " + movimento.descrizioneCdl
    if (movimento.cdc && movimento.cdc != 0)
      state.movimento.cdc = movimento.cdc + " - " + movimento.descrizioneCdc
    var tzoffset = (new Date()).getTimezoneOffset() *
      60000 //offset in milliseconds
    const dataConvertita = (new Date(movimento.data - tzoffset)).toISOString()
      .substr(0, 10)
    state.movimento.data = dataConvertita
    state.movimento.commessa = movimento.commessa
    state.movimento.tempo = movimento.tempo
    state.movimento.notaSpese = movimento.notaSpese
    state.movimento.materiale = movimento.materiale
    state.movimento.notaLista = movimento.notaLista
    state.movimento.keyRdARapportino = movimento.keyRdARapportino
    //
    state.movimento.qtaTot = null
    state.movimento.qtaTotCons = null
    state.movimento.dataCons = null
    if (movimento.dt) {
      state.movimento.qtaTot = movimento.dt.qtaTot
      state.movimento.qtaTotCons = movimento.dt.qtaTotCons
      state.movimento.dataCons = movimento.dt.dataCons
    }
  },
  setData(state, value) {
    state.movimento.data = value
  },
  setCommessa(state, value) {
    state.movimento.commessa = value
  },
  setTempo(state, value) {
    // console.log("movimento->setTempo: ", value);
    state.movimento.tempo = value
  },
  setTimeG1(state, value) {
    state.movimento.tempi.timeG1 = value
  },
  setTimeG2(state, value) {
    state.movimento.tempi.timeG2 = value
  },
  setTimeG3(state, value) {
    state.movimento.tempi.timeG3 = value
  },
  setTimeG4(state, value) {
    state.movimento.tempi.timeG4 = value
  },
  setTimeA1(state, value) {
    state.movimento.tempi.timeA1 = value
  },
  setTimeA2(state, value) {
    state.movimento.tempi.timeA2 = value
  },
  setTimeA3(state, value) {
    state.movimento.tempi.timeA3 = value
  },
  setTimeA4(state, value) {
    state.movimento.tempi.timeA4 = value
  },
  setNota(state, value) {
    state.movimento.nota = value
  },
  setCausale(state, value) {
    state.movimento.causale = value
  },
  setPosizione(state, value) {
    state.movimento.posizione = value
  },
  setCdl(state, value) {
    state.movimento.cdl = value
  },
  setBuono(state, value) {
    state.movimento.buono = value
  },
  setCdc(state, value) {
    state.movimento.cdc = value
  },
  setQtaTot(state, value) {
    state.movimento.qtaTot = value
  },
  setQtaTotCons(state, value) {
    state.movimento.qtaTotCons = value
  },
  setDataCons(state, value) {
    state.movimento.dataCons = value
  },
  addInNotaSpese(state, nota) {
    state.movimento.notaSpese.push(nota)
  },
  updateInNotaSpese(state, nota) {
    var oldNota = state.movimento.notaSpese.find(n => n.codice === nota.codice)
    oldNota.value = nota.value
  },
  removeInNotaSpese(state, nota) {
    var oldNota = state.movimento.notaSpese.find(n => n.codice === nota.codice)
    if (oldNota) {
      const index = state.movimento.notaSpese.indexOf(oldNota)
      state.movimento.notaSpese.splice(index, 1)
    }
  },
  removeMateriale(state, index) {
    // console.log(index)
    // console.log(state.movimento.materiale)
    state.movimento.materiale.splice(index, 1)
  },
  setNrRapportino(state, nrRapportino) {
    state.keyRdARapportino = nrRapportino
  },
  setNotaLista(state, nota) {
    state.movimento.notaLista = nota
  }
}

const actions = {
  setTab({
    commit
  }, tab) {
    commit('setTab', tab)
  },
  setIsNewMov({
    commit
  }, value) {
    commit('setIsNewMov', value)
  },
  clearMov({
    commit
  }) {
    commit('clearMov')
  },
  setData({
    commit
  }, value) {
    commit('setData', value)
  },
  setCommessa({
    commit
  }, value) {
    commit('setCommessa', value)
  },
  setTempo({
    commit
  }, value) {
    commit('setTempo', value)
  },
  setTimeG1({
    commit
  }, value) {
    commit('setTimeG1', value)
  },
  setTimeG2({
    commit
  }, value) {
    commit('setTimeG2', value)
  },
  setTimeG3({
    commit
  }, value) {
    commit('setTimeG3', value)
  },
  setTimeG4({
    commit
  }, value) {
    commit('setTimeG4', value)
  },
  setTimeA1({
    commit
  }, value) {
    commit('setTimeA1', value)
  },
  setTimeA2({
    commit
  }, value) {
    commit('setTimeA2', value)
  },
  setTimeA3({
    commit
  }, value) {
    commit('setTimeA3', value)
  },
  setTimeA4({
    commit
  }, value) {
    commit('setTimeA4', value)
  },
  setNota({
    commit
  }, value) {
    commit('setNota', value)
  },
  setCausale({
    commit
  }, value) {
    commit('setCausale', value)
  },
  setPosizione({
    commit
  }, value) {
    commit('setPosizione', value)
  },
  setCdl({
    commit
  }, value) {
    commit('setCdl', value)
  },
  setCdc({
    commit
  }, value) {
    commit('setCdc', value)
  },
  setBuono({
    commit
  }, value) {
    commit('setBuono', value)
  },
  setQtaTot({
    commit
  }, value) {
    commit('setQtaTot', value)
  },
  setQtaTotCons({
    commit
  }, value) {
    commit('setQtaTotCons', value)
  },
  setDataCons({
    commit
  }, value) {
    commit('setDataCons', value)
  },
  updateNotaSpese({
    commit
  }, nota) {
    if (state.movimento.notaSpese.find(n => n.codice === nota.codice)) {
      if (nota.value) {
        // update nota    
        commit('updateInNotaSpese', nota)
      } else {
        // remove nota 
        commit("removeInNotaSpese", nota)
      }
    } else {
      // new nota
      commit('addInNotaSpese', nota)
    }
  },
  removeInNotaSpese({
    commit
  }, nota) {
    commit('removeInNotaSpese', nota)
  },
  setMovimento({
    commit
  }, movimento) {
    commit('setMovimento', movimento)
  },
  setDefinitivo({
    commit
  }, definitivo) {
    commit('setDefinitivo', definitivo)
  },
  removeMateriale({
    commit
  }, index) {
    commit('removeMateriale', index)
  },
  setNrRapportino({
    commit
  }, movInfo) {
    commit("setNrRapportino", movInfo.nrRapportino)
    commit('updateNrRapportino', movInfo, {
      root: true
    })
  },
  setNotaLista({
    commit
  }, nota) {
    commit("setNotaLista", nota)
  }
}

const getters = {
  getTab(state) {
    return state.tab
  },
  isNewMov(state) {
    return state.isNewMov
  },
  isDefinitivo(state) {
    return state.movimento.definitivo
  },
  getTimeG1(state) {
    return state.movimento.tempi.timeG1
  },
  getTimeG2(state) {
    return state.movimento.tempi.timeG2
  },
  getTimeG3(state) {
    return state.movimento.tempi.timeG3
  },
  getTimeG4(state) {
    return state.movimento.tempi.timeG4
  },
  getTimeA1(state) {
    return state.movimento.tempi.timeA1
  },
  getTimeA2(state) {
    return state.movimento.tempi.timeA2
  },
  getTimeA3(state) {
    return state.movimento.tempi.timeA3
  },
  getTimeA4(state) {
    return state.movimento.tempi.timeA4
  },
  getNota(state) {
    return state.movimento.nota
  },
  getCausale(state) {
    return state.movimento.causale
  },
  getCommessa(state) {
    return state.movimento.commessa
  },
  getData(state) {
    return state.movimento.data
  },
  getTempo(state) {
    // console.log("movimento->getTempo: ", state.movimento.tempo);
    return state.movimento.tempo ? state.movimento.tempo.toFixed(2) : null
  },
  getPosizione(state) {
    return state.movimento.posizione
  },
  getCdl(state) {
    return state.movimento.cdl
  },
  getCdc(state) {
    return state.movimento.cdc
  },
  getBuono(state) {
    return state.movimento.buono
  },
  getNotaSpese(state) {
    return state.movimento.notaSpese
  },
  getNotaInNotaSpese: (state) => (codice) => {
    var notaSpese = state.movimento.notaSpese
    return notaSpese.find(nota => nota.codice === codice);
  },
  getMateriale(state) {
    return state.movimento.materiale
  },
  getNotaLista(state) {
    return state.movimento.notaLista
  },
  getNumeroMovCorrente(state) {
    return state.movimento.numero
  },
  getNrRapportino(state) {
    return state.movimento.keyRdARapportino
  },
  getQtaTot(state) {
    return state.movimento.qtaTot
  },
  getQtaTotCons(state) {
    return state.movimento.qtaTotCons
  },
  getDataCons(state) {
    return state.movimento.dataCons
  }
}

import moment from 'moment'

// TODO gestire meglio questa utility
// con un'unica export default != ai mixin
const getTimeFromInteger = function(time) {
  if (!time)
    return null
  var min = (time).toString().slice(-2)
  var hour = (time).toString().substring(0, (time).toString().length - 2)
  if (min && hour)
    return moment({
      hour: hour,
      minute: min
    }).format('HH:mm')
  return null
}

export default {
  state,
  mutations,
  actions,
  getters
}