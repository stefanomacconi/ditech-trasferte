import Vue from 'vue'
import Vuex from 'vuex'

import utente from './modules/utente'
import movimenti from './modules/movimenti'
import movimento from './modules/movimento'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    utente,
    movimenti,
    movimento
  }
})