import Login from './components/Login'
import Error from './components/Error'
import Movimenti from './components/Movimenti/Movimenti'
import DettaglioMov from './components/Movimento/DettaglioMov'
import CercaMateriale from './components/Materiale/CercaMateriale'
import InsertQtaMateriale from './components/Materiale/InsertQtaMateriale'
import AllegatiMov from './components/Allegati/AllegatiMov'
import ToolbarLogin from './components/Toolbars/ToolbarLogin'
import ToolbarMovimenti from './components/Toolbars/ToolbarMovimenti'
import ToolbarMovimento from './components/Toolbars/ToolbarMovimento'
import ToolbarPopUp from './components/Toolbars/ToolbarPopUp'

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
    { name: "cercaMateriale", path: '/cercaMateriale',  
        components: {
            default: CercaMateriale,
            toolbar: ToolbarPopUp
        }, 
        props: {
            default: false,
            toolbar: true
        }, 
        beforeEnter(to, from, next) {
            if (store.getters.getToken) {
                next()
            } else {
                next('/login')
            }
        }
    },
    { name: "insertQtaMateriale", path: '/insertQtaMateriale',  
        components: {
            default: InsertQtaMateriale,
            toolbar: ToolbarPopUp
        }, 
        props: {
            default: true,
            toolbar: true
        }, 
        beforeEnter(to, from, next) {
            if (store.getters.getToken) {
                next()
            } else {
                next('/login')
            }
        }
    },
    { name: "allegati", path: '/allegati',  
        components: {
            default: AllegatiMov,
            toolbar: ToolbarPopUp
        }, 
        props: {
            default: true,
            toolbar: true
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