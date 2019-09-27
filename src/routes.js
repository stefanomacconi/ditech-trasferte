import Login from './components/Login'
import Error from './components/Error'
import About from './components/About'
import ChangePwd from './components/ChangePwd'
import Waiting from './components/Waiting'
import Movimenti from './components/Movimenti/Movimenti'
import DettaglioMov from './components/Movimento/DettaglioMov'
import CercaMateriale from './components/Materiale/CercaMateriale'
import InsertQtaMateriale from './components/Materiale/InsertQtaMateriale'
import AllegatiMov from './components/Allegati/AllegatiMov'
import ToolbarLogin from './components/Toolbars/ToolbarLogin'
import ToolbarMovimenti from './components/Toolbars/ToolbarMovimenti'
import ToolbarMovimento from './components/Toolbars/ToolbarMovimento'
import ToolbarPopUp from './components/Toolbars/ToolbarPopUp'
import ToolbarAbout from './components/Toolbars/ToolbarAbout'

export const routes = [{
    name: "login",
    path: '/login',
    components: {
      default: Login,
      toolbar: ToolbarLogin
    }
  },
  {
    path: '/',
    components: {
      default: Login,
      toolbar: ToolbarLogin
    }
  },
  {
    name: "movimenti",
    path: '/movimenti',
    components: {
      default: Movimenti,
      toolbar: ToolbarMovimenti
    },
    meta: { 
      requiresAuth: true
    }
  },
  {
    name: "movimento",
    path: '/movimento/:id?',
    components: {
      default: DettaglioMov,
      toolbar: ToolbarMovimento
    },
    props: {
      default: true,
      toolbar: true
    },
    meta: { 
      requiresAuth: true
    }
  },
  {
    name: "cercaMateriale",
    path: '/cercaMateriale',
    components: {
      default: CercaMateriale,
      toolbar: ToolbarPopUp
    },
    props: {
      default: false,
      toolbar: true
    },
    meta: { 
      requiresAuth: true
    }
  },
  {
    name: "insertQtaMateriale",
    path: '/insertQtaMateriale',
    components: {
      default: InsertQtaMateriale,
      toolbar: ToolbarPopUp
    },
    props: {
      default: true,
      toolbar: true
    },
    meta: { 
      requiresAuth: true
    }
  },
  {
    name: "allegati",
    path: '/allegati',
    components: {
      default: AllegatiMov,
      toolbar: ToolbarPopUp
    },
    props: {
      default: true,
      toolbar: true
    },
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: "/error",
    name: "error",
    component: Error,
    props: true
  },
  {
    path: "/about",
    name: "about",
    components: {
      default: About,
      toolbar: ToolbarAbout
    },
    meta: { 
      requiresAuth: true
    },
    props: false
  },
  {
    path: "/changepwd",
    name: "changepwd",
    components: {
      default: ChangePwd,
      toolbar: ToolbarLogin
    }
  },  
  {
    path: "/waiting",
    name: "waiting",
    components: {
      default: Waiting,
      toolbar: ToolbarLogin
    }
  }  
]