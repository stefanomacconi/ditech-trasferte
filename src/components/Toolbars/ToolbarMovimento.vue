<template>
  <div>
    <v-toolbar :color="this.definitivo ? 'secondary' : 'primary'" dark fixed app clipped-right>
      <v-icon dark @click="goBack">arrow_back</v-icon>
      &nbsp;&nbsp;&nbsp;
      <v-toolbar-title v-if="this.isNewMov">
        Nuovo Movimento
      </v-toolbar-title>
      <v-toolbar-title v-else>
        {{ id }} - Movimento
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <!-- TODO passarli con props -->
        <v-toolbar-items v-if="this.isNewMov">
          <v-btn icon color="green lighten-2" @click="saveMov(id)">
            <v-icon>check</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-else>
          <v-btn icon @click="printMov()">
            <v-icon>print</v-icon>
          </v-btn>
          <v-btn icon @click="attach2Mov()" :disabled="this.definitivo">
            <v-icon>attach_file</v-icon>
          </v-btn>
          <v-divider dark vertical></v-divider>
          <v-btn icon @click="saveMov(id)" :disabled="this.definitivo">
            <v-icon color="green lighten-2">check_circle</v-icon>
          </v-btn>
          <v-divider dark vertical></v-divider>
          <v-btn icon @click="dialogConfirm = true" :disabled="this.definitivo">
            <v-icon color="red lighten-3">delete_forever</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-tabs slot="extension" v-model="tab" fixed-tabs color="transparent">
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="item in tabItems" :key="item.index" @click="selectTab(item.index)" class="primary--text">
            <v-icon>{{item.icon}}</v-icon>
          </v-tab>
        </v-tabs>
    </v-toolbar>
    <v-layout row justify-center>
      <v-dialog v-model="dialogConfirm" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Confermi l'eliminazione?</v-card-title>
          <v-card-text>Le informazioni del movimento {{ id }} verranno cancellate definitivamente</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="secondary" flat @click="dialogConfirm = false">Indietro</v-btn>
            <v-btn class="error" flat @click="deleteMov(id)">Elimina</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- ATTENDERE DIALOG -->
    <div class="text-xs-center">
      <v-dialog v-model="attendereDialog" persistent width="300" >
        <v-card color="primary" dark>
          <v-card-text>
            Attendere...
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <!-- PRINT DIALOG  
    <div v-if="printDialog" >
      conMateriale tipoStampa="1"
    </div>
    -->
    <print-rapp-dialog 
      :visibile=printDialog 
      :movimenti=[id]
      :definitivo=definitivo
      v-on:chiudi="printDialog=false" 
      ></print-rapp-dialog>

    <!-- PRINT RAPPORTINO DIALOG 
    <div class="text-xs-center">
      <v-layout row justify-center>
      <v-dialog persistent max-width="600px" v-model="printDialog">
        <v-card>
          <v-card-title>
            <span class="headline">Stampa rapportino</span>
          </v-card-title>
          <v-card-text>
            <v-checkbox>Con Materiale</v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="printDialog=false">Chiudi</v-btn>
            <v-btn color="primary" flat @click="printMovCall(id)">Stampa</v-btn>
          </v-card-actions>          
        </v-card>
      </v-dialog>
      </v-layout>
    </div>
    -->
  </div>
</template>

<script>
import axios from "axios"
import PrintRappDialogVue from '../Movimento/PrintRappDialog.vue'

export default {
  created() {
    // set current tab to the first one
    this.$store.dispatch('setTab', 0)
    // set in store if is a new mov or not
    if (this.$route.params.id) {
      // edit
      this.$store.dispatch('setIsNewMov', false)
      this.isNewMov = false
    }
    else {
      // new
      this.$store.dispatch('setIsNewMov', true) 
      this.isNewMov = true
    }
    this.$store.dispatch('setDefinitivo', this.definitivo)
  },
  data() {
    return {
      tab : 0,
      isNewMov : false,
      dialogConfirm : false,
      attendereDialog : false,
      printDialog : false
    }
  },
  props: {
    id: {
      default: ""
    },
    definitivo: {
      default: false
    }
  },
  components: {
    'print-rapp-dialog': PrintRappDialogVue
  },
  computed: {
    tabItems() {
      var items = []
      const opzioni = this.$store.getters.getOpzioni
      items.push({
        index: 0,
        icon: "work",
        desr: "Descrizione"
      })
      if (opzioni.gestioneNoteSpese)
        items.push({
          index: 1,
          icon: "receipt",
          descr: "Nota Spese"
        })
      if (opzioni.gestioneMateriali && !this.$store.getters.isNewMov)
        items.push({
          index: 2,
          icon: "shopping_cart",
          descr: "Lista Articoli"
        })
      return items
    } 
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "movimenti"
      })
      this.asyncClear()
    },
    async asyncClear() {
      await this.sleep(500)
      this.$store.dispatch('clearMov')
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    selectTab(index) {
      this.$store.dispatch('setTab', index)
    },
    saveMov(numeroMovimento) {
      this.$root.$emit('saveMovimento', numeroMovimento)
    },
    deleteMov(numeroMovimento) {
      this.dialogConfirm = false
      this.attendereDialog = true
      axios.delete(
        '/movimento/lavorazione/' + numeroMovimento
      ).then(res => {
        // eslint-disable-next-line
        console.log(res)
        // Update lista mov
        // TODO non conviene ritornare tutto ma usare la GET sul metodo che ritorna solo la data
        this.$store.dispatch('fetchMovimenti').then(() => {
          this.attendereDialog = false
          this.$router.push({
            name: 'movimenti'
          })
          this.asyncClear()
        })
      }).catch(error => {
        this.attendereDialog = false
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    },
    attach2Mov() {
      this.dialogConfirm = false
      this.$router.push({
        name: 'allegati',
        params: {
          title: "Carica allegati" 
        } 
      })      
    },
    printMov() {
      this.dialogConfirm = false
      this.printDialog = true
    }
  }
}
</script>