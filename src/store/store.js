import Vue from 'vue'
import Vuex from 'vuex'

import utente from './modules/utente'
import movimenti from './modules/movimenti'
import movimento from './modules/movimento'
import generale from './modules/generale'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    generale,
    utente,
    movimenti,
    movimento
  }
})