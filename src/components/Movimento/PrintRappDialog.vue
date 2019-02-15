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
            <v-checkbox >Con Materiale</v-checkbox><!-- v-model="conMateriale" -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="$emit('chiudi')">Chiudi</v-btn>
            <v-btn color="primary" flat @click="printMov(movimenti)">Stampa</v-btn>
          </v-card-actions>          
        </v-card>
      </v-dialog>
      </v-layout>
    </div>
</template>
<script>

import axios from "axios"

export default {
  props: {
    visibile: {
        type: Boolean
    },
    conMateriale: {
        type: Boolean
    },
    tipoStampa: {
        type: String
    },
    movimenti: {
        type: Array
    }
  },
  methods: {
    printMov(movimenti) {
      //TODO this.attendereDialog = true
      //StampaRapportinoInterventoParamsBean
      axios(
        '/stampe-movimenti/rapportoServizioMF',  
        {
          method: 'POST',
          responseType: 'blob',
          data: {
            numeriMovimento: movimenti,
            tipoStampa: 2,
            parcheggio: true,
            conOrari: true,
            conMateriale: true
          }
          }
      ).then(res => {
          //console.log(res);
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
        //this.attendereDialog = false
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    }    
  }  
}
</script>