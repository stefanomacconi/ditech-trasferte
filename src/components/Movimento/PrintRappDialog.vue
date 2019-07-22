<template>
  <!-- PRINT RAPPORTINO DIALOG --> 
  <div class="text-xs-center">
    <v-layout row justify-center>
      <v-dialog persistent fullscreen hide-overlay transition="dialog-bottom-transition" v-model="visibile">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="$emit('chiudi')">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Stampa rapportino</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-checkbox :label="'Con Materiale'" v-model="conMateriale" v-if="this.gestioneMateriali"></v-checkbox>
            <!--
            <v-btn-toggle v-model="tipoStampa">
              <v-btn value="1">(1) Senza nota spese</v-btn>
              <v-btn value="2">(2) Con nota spese</v-btn>
              <v-btn value="3">(3) Con nota spese ad uso interno</v-btn>
            </v-btn-toggle>
            -->
            <v-radio-group v-model="tipoStampa" v-if="this.gestioneNoteSpese">
              <v-radio :key="1" :label="'Senza nota spese'" :value="1"></v-radio>
              <v-radio :key="2" :label="'Con nota spese'" :value="2"></v-radio>
              <v-radio :key="3" :label="'Con nota spese ad uso interno'" :value="3"></v-radio>
            </v-radio-group>            
            <!-- -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="printMov()">Stampa</v-btn>
            <!--
            <v-btn color="primary" flat @click="printMov(movimenti)">Senza nota spese</v-btn>
            <v-btn color="primary" flat @click="printMov(movimenti)">Con nota spese</v-btn>
            <v-btn color="primary" flat @click="printMov(movimenti)">Con nota spese a uso interno</v-btn>
            -->
          </v-card-actions>          
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- wait -->
    <wait-dialog :visibile=this.printing></wait-dialog>
  </div>
</template>

<script>
import WaitDialogVue from '../WaitDialog.vue'
import axios from "axios"

export default {
  data() {
    return {
      printing: false,
      conMateriale: false,
      tipoStampa: 1
    }
  },    
  props: {
    visibile: {
      type: Boolean
    },
    movimenti: {
      type: Array
    },
    definitivo: {
      type: Boolean
    }
  },
  components: {
    'wait-dialog': WaitDialogVue
  },
  computed: {
    gestioneNoteSpese() {
      const opzioni = this.$store.getters.getOpzioni
      return opzioni.gestioneNoteSpese ? opzioni.gestioneNoteSpese : false           
    },
    gestioneMateriali() {
      const opzioni = this.$store.getters.getOpzioni
      return opzioni.gestioneMateriali ? opzioni.gestioneMateriali : false           
    }
  },  
  methods: {
    printMov() {
      this.$emit('chiudi')
      this.printing = true
      //StampaRapportinoInterventoParamsBean
      axios('/stampe-movimenti/rapportoServizioMF', {
        method: 'POST',
        responseType: 'blob',
        data: {
          numeriMovimento: this.movimenti, //Integer[]
          tipoStampa: this.tipoStampa, //Integer
          parcheggio: !this.definitivo, //Boolean
          conOrari: true, //Boolean //TODO opzione??? ma dovrebbe saperlo da solo il server leggendo le variabili
          conMateriale: this.conMateriale //Boolean
        }
      }).then(res => {
        // eslint-disable-next-line
        console.log(res)
        /*
        // Method 1
        // Works on Chrome only once

        const url = window.URL.createObjectURL(new Blob([
          res.data
        ]))
        const link = document.createElement('a')
        link.href = url
        var pdfName = "Rapportino" + this.$store.getters.getNumeroMovCorrente + ".pdf" 
        link.setAttribute('download', pdfName)
        document.body.appendChild(link)
        link.click()
        this.printing = false */

        // Method 2
        // Works but can't set the pdf name
        // Create a Blob from the PDF Stream
        const file = new Blob(
          [
            res.data
          ], 
          {
            type: 'application/pdf'
          }
        )
        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        // eslint-disable-next-line
        console.log(fileURL);
        // Open the URL on new Window
        // window.open(fileURL,"_self");
        // Attenzione, con _blank gli adBlocker non permettono la visualizzazione
        window.open(fileURL,"_blank");
        /*
        TODO da valutare
        let pdfWindow = window.open("")
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' src='data:application/pdf;base64, " + 
          encodeURI(yourDocumentBase64VarHere)+
          "'></iframe>"
          )
        */
        this.printing = false
      }).catch(error => {
        this.printing = false
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    }    
  }  
}
</script>