import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'

import store from './store/store'
import router from './router'
import axios from 'axios' /* REST */
import moment from 'moment' /* Date/Calendar */

axios.defaults.baseURL = 'http://localhost:8080/spweb/rest' 
// axios.defaults.baseURL = 'http://10.250.14.10:8080/spweb/rest'
// axios.defaults.baseURL = 'https://apps.molteniinformatica.com/spweb/rest'
// axios.defaults.baseURL = 'https://apps.melesi.it:8443/spweb/rest'
// axios.defaults.baseURL = 'http://192.168.0.105:8080/spweb/rest'

Vue.prototype.moment = moment

Vue.filter('truncate', function (value) {
    if (!value) return ''
    value = value.toString()
    if(value.length > 50)
      return value.substring(0, 49) + "..."
    return value
  }
)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')