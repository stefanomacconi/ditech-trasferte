<template>
    <!-- PRINT RAPPORTINO DIALOG --> 
    <div class="text-xs-center">
      <v-layout row justify-center>
      <v-dialog persistent max-width="600px" v-model="visibile">
        <v-card>
          <v-card-title>
            <span class="headline">Stampa rapportino</span>
          </v-card-title>
          <v-card-text>
            <v-checkbox :label="'Con Materiale'" v-model="conMateriale"></v-checkbox>
            <!--
            <v-btn-toggle v-model="tipoStampa">
              <v-btn value="1">(1) Senza nota spese</v-btn>
              <v-btn value="2">(2) Con nota spese</v-btn>
              <v-btn value="3">(3) Con nota spese ad uso interno</v-btn>
            </v-btn-toggle>
            -->
            <v-radio-group v-model="tipoStampa">
              <v-radio :key="1" :label="'Senza nota spese'" :value="1"></v-radio>
              <v-radio :key="2" :label="'Con nota spese'" :value="2"></v-radio>
              <v-radio :key="3" :label="'Con nota spese ad uso interno'" :value="3"></v-radio>
            </v-radio-group>            
            <!-- -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="$emit('chiudi')">Chiudi</v-btn>
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

import WaitDialogVue from '../WaitDialog.vue';

import axios from "axios"

export default {
  data() {
    return {
      printing : false,
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
  methods: {
    printMov() {
      //TODO this.attendereDialog = true
      this.$emit('chiudi');
      this.printing = true
      //StampaRapportinoInterventoParamsBean
      axios(
        '/stampe-movimenti/rapportoServizioMF',  
        {
          method: 'POST',
          responseType: 'blob',
          data: {
            numeriMovimento: this.movimenti, //Integer[]
            tipoStampa: this.tipoStampa, //Integer
            parcheggio: !this.definitivo, //Boolean
            conOrari: true, //Boolean //TODO opzione??? ma dovrebbe saperlo da solo ilserver leggendo le variabili
            conMateriale: this.conMateriale //Boolean
          }
        }
      ).then(res => {
          console.log(res);
          //this.attendereDialog = false
          /**/
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          var pdfName = "Rapportino.pdf" 
          //+ numeriMovimento + ".pdf" 
          link.setAttribute('download', pdfName);
          document.body.appendChild(link);
          link.click();

          this.printing = false

            /**/
        /** simile ma non siriesce a impostare il nome del pdf
        //Create a Blob from the PDF Stream
        const file = new Blob(
          [res.data], 
          {type: 'application/pdf'});

        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        console.log(fileURL);

        //Open the URL on new Window
        window.open(fileURL,"_self");
        /**/

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