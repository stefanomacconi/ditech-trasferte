import Login from './components/Login'
import Error from './components/Error'
import Movimenti from './components/Movimenti/Movimenti'
import DettaglioMov from './components/Movimento/DettaglioMov'
import ToolbarLogin from './components/Toolbars/ToolbarLogin'
import ToolbarMovimenti from './components/Toolbars/ToolbarMovimenti'
import ToolbarMovimento from './components/Toolbars/ToolbarMovimento'

import store from './store/store'

export const routes = [
    { name: "login", path: '/login', components: {
        default: Login,
        toolbar: ToolbarLogin
      } },
    { path: '/', beforeEnter(to, from, next) {
            if (store.getters.getToken) {
                next('/movimenti')
            } else {
                next('/login')
            }
        }
    },
    { name: "movimenti", path: '/movimenti',  components: {
        default: Movimenti,
        toolbar: ToolbarMovimenti
      }, beforeEnter(to, from, next) {
            if (store.getters.getToken) {
                next()
            } else {
                next('/login')
            }
        }
    },
    { name: "movimento", path: '/movimento/:id?',  
        components: {
            default: DettaglioMov,
            toolbar: ToolbarMovimento
        }, 
        props: {
            default: true, toolbar: true 
        }, 
        beforeEnter(to, from, next) {
            if (store.getters.getToken) {
                next()
            } else {
                next('/login')
            }
        }
    },
    {path: "/error", name:"error",  component: Error,  props: true}  
]