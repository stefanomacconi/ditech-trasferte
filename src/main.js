import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import "./registerServiceWorker";

import store from "./store/store";
import router from "./router";
import axios from "axios"; /* REST */
import moment from "moment"; /* Date/Calendar */

const token = localStorage.getItem("dt_token");
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// LOCAL
//axios.defaults.baseURL = "http://localhost:8080/spweb/rest";
// FARM
axios.defaults.baseURL = 'https://ditech1.smeup.com/spweb/rest'
// FARM2
// axios.defaults.baseURL = 'https://ditech2.smeup.com/spweb/rest'
// MELESI
// axios.defaults.baseURL = 'https://apps.melesi.it:8443/spweb/rest'
// axios.defaults.baseURL = 'http://192.168.0.105:8080/spweb/rest'
// axios.defaults.baseURL = 'http://192.168.0.108:8080/spweb/rest'
// axios.defaults.baseURL = 'http://192.168.0.109:8080/spweb/rest'

/* NON FUNZIONA PERCHE' GESTISCE PRIMA L'HANDLE ERROR
axios.interceptors.response.use(response => {
  console.log("the response is", response);
  if (response.status === 401) {
    console.log("Ho intercettato un 401")
    // if you ever get an unauthorized, logout the user
    this.$store.dispatch('logout')
    // redirect to Login
    this.$router.push('/login')
  } else {
    return response
  }
});
*/

Vue.prototype.moment = moment;

Vue.filter("truncate", function(value) {
  if (!value) return "";
  value = value.toString();
  if (value.length > 50) return value.substring(0, 49) + "...";
  return value;
});

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
