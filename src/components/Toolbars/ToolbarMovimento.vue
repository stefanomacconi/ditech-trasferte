<template>
  <div>
    <v-toolbar :color="this.definitivo ? 'secondary' : 'primary'" dark fixed app clipped-right>
      <v-icon dark @click="goBack">arrow_back</v-icon>
      &nbsp;&nbsp;&nbsp;
      <v-toolbar-title>
        {{ titolo }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <!-- TODO passarli con props -->
        <v-toolbar-items v-if="this.isNewMov">
          <v-btn icon color="green lighten-2" @click="saveMov(id)">
            <v-icon>check</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-else>
          <template v-if="!this.definitivo">
            <template v-for="menu in menus">
              <v-btn icon :key="menu.title" @click="menu.click" class="hidden-xs-only">
                <v-icon>{{ menu.icon }}</v-icon>
              </v-btn>
            </template>
          </template>
          <template v-else>
            <v-btn icon @click="this.printMov">
              <v-icon>print</v-icon>
            </v-btn>
          </template>
          <v-btn icon @click="saveMov(id)" v-if="!this.definitivo">
            <v-icon color="green lighten-2">check_circle</v-icon>
          </v-btn>
          <v-divider dark vertical v-if="!this.definitivo"></v-divider>
          <v-btn icon @click="dialogConfirm = true" v-if="!this.definitivo">
            <v-icon color="red lighten-3">delete_forever</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-menu bottom left v-if="!this.definitivo && !this.isNewMov">
          <v-btn slot="activator" dark icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list dense class="pt-0 bg-white">
            <v-list-tile v-for="menu in menus" :key="menu.title" @click="menu.click">
              <v-list-tile-action>
                <v-icon>{{ menu.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-tabs slot="extension" v-model="tab" fixed-tabs color="transparent">
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="item in tabItems" :key="item.index" @click="selectTab(item.index)" class="primary--text">
            <v-icon>{{ item.icon }}</v-icon>
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
    <!-- PRINT DIALOG  
    <div v-if="printDialog" >
      conMateriale tipoStampa="1"
    </div>
    -->
    <print-rapp-dialog 
      :visibile=printDialog 
      :movimenti=[id]
      :definitivo=definitivo
      v-on:chiudi="printDialog=false">
    </print-rapp-dialog>

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
    <!-- Link Nr. Rapportino Dialog -->
    <v-layout row justify-center>
      <v-dialog v-model="linkNrRapportinoDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="linkNrRapportinoDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Aggiunta Nr. Rapportino</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-alert value="true" color="warning" icon="priority_high" outline v-if="this.nrRapportino">
              Questa operazione sovrascriverà il precedente numero rapportino {{ this.nrRapportino }}
            </v-alert>
            <br>
            Inserire il numero rapportino a cui associare il movimento {{ id }} e confermare
            <v-form ref="formLinkNrRapportinoDialog">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 md12 lg6>
                    <v-text-field v-model="nuovoNrRapportino" label="Nr. Rapportino" 
                      hint="Numero Rapportino" :rules="nrRapportinoRules">
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="linkNrRapportino">Conferma</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios"
const qs = require('querystring')
import PrintRappDialogVue from '../Movimento/PrintRappDialog.vue'

export default {
  created() {
    // TODO mettere non il primo tab ma l'ultimo scelto

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
    //https://material.io/resources/icons/?style=baseline
    return {
      menus: [
        {
          title: "Stampa Rapportino",
          click: this.printMov,
          icon: "print"
        },
        {
          title: "Allega Files",
          click: this.attach2Mov,
          icon: "attach_file"
        },
        {
          title: "Mostra allegati",
          click: this.showAttachments,
          icon: "collections"
        },
        {
          title: "Aggiungi a Nr. Rapportino",
          click: this.showNrRapportinoDialog,
          icon: "library_add"
        }
      ],
      tab : 0,
      isNewMov : false,
      dialogConfirm : false,
      printDialog : false,
      linkNrRapportinoDialog: false,
      nuovoNrRapportino: null,
      nrRapportinoRules: [
        v => {
          if (!v)
            return "campo obbligatorio"
          if (v && (v.length != 7 || isNaN(v)))
            return "Il Nr. Rapportino deve essere lungo 7 numeri"
          else 
            return true 
        }
      ]
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
    'print-rapp-dialog': PrintRappDialogVue,
  },
  computed: {
    tabItems() {
      const items = []
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
    },
    nrRapportino() {
      return this.$store.getters.getNrRapportino
    },
    titolo() {
      if (this.isNewMov) {
        return "Nuovo";
      } else if (this.definitivo) {
        return "Movimento " + this.id;
      }
      return "Aggiornamento " + this.id;
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
      this.$store.dispatch('showWaitDialog')
      axios.delete(
        '/movimento/lavorazione/' + numeroMovimento
      ).then(res => {
        // eslint-disable-next-line
        console.log(res)
        // Update lista mov
        // TODO non conviene ritornare tutto ma usare la GET sul metodo che ritorna solo la data
        this.$store.dispatch('fetchMovimenti').then(() => {
          this.$store.dispatch('hideWaitDialog')
          this.$router.push({
            name: 'movimenti'
          })
          this.asyncClear()
        })
      }).catch(error => {
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
    showAttachments() {
      //TODO
      this.dialogConfirm = false
      this.$router.push({
        name: 'listallegati',
        params: {
          title: "Mostra allegati" 
        } 
      })      
    },
    printMov() {
      this.dialogConfirm = false
      this.printDialog = true
    },
    showNrRapportinoDialog() {
      this.linkNrRapportinoDialog = true
    },
    linkNrRapportino() {
      if (this.$refs.formLinkNrRapportinoDialog.validate()) {
        this.linkNrRapportinoDialog = false
        this.$store.dispatch('showWaitDialog')
        axios.post('/movimento/agganciarapportino', qs.stringify({
            parcheggio: true,
            mov: this.id,
            rapportino: this.nuovoNrRapportino
          })
        ).then(res => {
          // eslint-disable-next-line
          console.log(res)
          this.$root.$emit('setNrRapportino', {
            numeroMovimento: this.id,
            numeroRapportino: this.nuovoNrRapportino
          })
          this.$store.dispatch('hideWaitDialog')
        }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          this.$store.dispatch('handleError', error.response.data)
        })
      }
    }
  }
}
</script>

<style>
.bg-white {
  background-color: white !important
}
</style>
