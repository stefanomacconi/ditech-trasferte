import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// import 'vuetify/src/stylus/app.styl'
import 'vuetify/src/styles/main.sass'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: false,
  },
  themes: {
    light: {
      primary: '#009873',
    },
  },
});