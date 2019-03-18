<template>
  <div>
    <v-toolbar :color="this.definitivo ? 'secondary' : 'primary'" dark fixed app clipped-right>
      <v-icon dark @click="goBack">arrow_back</v-icon>
      &nbsp;&nbsp;&nbsp;
      <v-toolbar-title v-if="this.isNewMov">
        Nuovo Movimento
      </v-toolbar-title>
      <v-toolbar-title v-else>
        Movimento {{ id }}
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
            <v-icon color="red lighten-2">delete_forever</v-icon>
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

import moment from 'moment'

import axios from "axios"

import PrintRappDialogVue from '../Movimento/PrintRappDialog.vue';

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
      var items = [];
      const opzioni = this.$store.getters.getOpzioni
      items.push({index: 0, icon: "work", desr: "Descrizione"})
      if (opzioni.gestioneNoteSpese)
        items.push({index: 1, icon: "receipt", descr: "Nota Spese"})
      if (opzioni.gestioneMateriali && !this.$store.getters.isNewMov)
        items.push({index: 2, icon: "shopping_cart", descr: "Lista Articoli"})
      return items
    } 
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "movimenti"
      });
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
      // check obligatory fields
      if (!this.$store.getters.getCommessa || !this.$store.getters.getTempo) {
        // TODO mettere qui un qualcosa che faccia comparire rossi i campi non immessi
        return
      }
      this.attendereDialog = true
      // save movement
      const data = moment(this.$store.getters.getData, "YYYY-MM-DD").valueOf()
      const oraInizioMattino = this.$store.getters.getTimeG1 ? this.$store.getters.getTimeG1.replace(":", "") : this.$store.getters.getTimeG1
      const oraFineMattino = this.$store.getters.getTimeG2 ? this.$store.getters.getTimeG2.replace(":", "") : this.$store.getters.getTimeG2
      const oraInizioPomeriggio = this.$store.getters.getTimeG3 ? this.$store.getters.getTimeG3.replace(":", "") : this.$store.getters.getTimeG3
      const oraFinePomeriggio = this.$store.getters.getTimeG4 ? this.$store.getters.getTimeG4.replace(":", "") : this.$store.getters.getTimeG4
      const oraInizioAttMattino = this.$store.getters.getTimeA1 ? this.$store.getters.getTimeA1.replace(":", "") : this.$store.getters.getTimeA1
      const oraFineAttMattino = this.$store.getters.getTimeA2 ? this.$store.getters.getTimeA2.replace(":", "") : this.$store.getters.getTimeA2
      const oraInizioAttPomeriggio = this.$store.getters.getTimeA3 ? this.$store.getters.getTimeA3.replace(":", "") : this.$store.getters.getTimeA3
      const oraFineAttPomeriggio = this.$store.getters.getTimeA4 ? this.$store.getters.getTimeA4.replace(":", "") : this.$store.getters.getTimeA4
      const cau = this.$store.getters.getCausale
      const causale = cau ? (cau.substr(0, cau.indexOf('-'))).trim() : cau
      const cl = this.$store.getters.getCdl
      const cdl = cl ? (cl.substr(0, cl.indexOf('-'))).trim() : cl
      const cc = this.$store.getters.getCdc
      const cdc = cc ? (cc.substr(0, cc.indexOf('-'))).trim() : cc
      const orari = {
        oraInizioMattino,
        oraFineMattino,
        oraInizioPomeriggio,
        oraFinePomeriggio,
        oraInizioAttMattino,
        oraFineAttMattino,
        oraInizioAttPomeriggio,
        oraFineAttPomeriggio
      }
      axios.post('/movimento/lavorazione/'  + this.$store.getters.getDipendente, 
        {
          numeroMovimento,
          commessa: this.$store.getters.getCommessa,
          nota: this.$store.getters.getNota,
          causale,
          cdl,
          cdc,
          data,
          posizione: this.$store.getters.getPosizione,
          tempo: this.$store.getters.getTempo,
          orari,
          notaSpese: this.$store.getters.getNotaSpese
        }).then(res => {
          // eslint-disable-next-line
          console.log(res)
          // Update lista mov
          // TODO: ELIMINARE QUESTO
          // APPENA SI CAPISCE PERCHE' NON FUNZIONANO LE COMPUTED DEI MOVIMENTI
          // LO STORE CAMBIA MA NON VIENE VISTO IL CAMBIAMENTO
          // PROBABILMENTE C'E' QUALCOSA CHE NON VA NEL METODO dateMovFiltered() in Movimenti.vue
          /*
          this.$store.dispatch('fetchMovimenti').then(() => {
            // manipolo l'history per evitare che il back faccia tornare su "nuovo movimento"
            history.replaceState({}, "movimenti", "movimenti")
            const numMov = res.data.numeroMovimento
            this.attendereDialog = false
            this.$router.push({ name: 'movimento', params: { id: numMov }})
          })
          */

          const newDatabean = res.data
          this.$store.dispatch("addNewDataBean", newDatabean)
          // manipolo l'history per evitare che il back faccia tornare su "nuovo movimento"
          history.replaceState({}, "movimenti", "movimenti")
          if (!numeroMovimento)
            // se è un'aggiunta prendo l'ultimo numero movimento
            numeroMovimento = newDatabean.movimenti[newDatabean.movimenti.length - 1].numeroMovimento
          this.attendereDialog = false
          this.$router.push({ name: 'movimento', params: { id: numeroMovimento }})
          // TODO Magari mettere qui un messaggio di success
        }).catch(error => {
          this.attendereDialog = false
          // eslint-disable-next-line
          console.log(error)
          this.$store.dispatch('handleError', error.response.data)
        })
    },
    deleteMov(numeroMovimento) {
      this.dialogConfirm = false
      this.attendereDialog = true
      axios.delete(
        '/movimento/lavorazione/'  + numeroMovimento
      ).then(res => {
        // eslint-disable-next-line
        console.log(res)
        // Update lista mov
        // TODO non conviene ritornare tutto ma usare la GET sul metodo che ritorna solo la data
        this.$store.dispatch('fetchMovimenti').then(() => {
          this.attendereDialog = false
          this.$router.push({ name: 'movimenti'})
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
      this.$router.push({ name: 'allegati', params: { title: "Carica allegati" } });      
    },
    printMov() {
      this.dialogConfirm = false
      this.printDialog = true
    }
  }
}
</script>