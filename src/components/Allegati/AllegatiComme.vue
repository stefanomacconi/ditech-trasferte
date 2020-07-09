<template>
  <div>
    <div>
      <!--
  <v-carousel>
    <v-carousel-item
      v-for="(allegato,i) in allegati"
      :key="i"
      :src="'data:image/jpg;base64,' + allegato.blob"
    ></v-carousel-item>
  </v-carousel>
  -->
            <!-- -->
      <v-list two-line v-if="allegati.length > 0">
        <template v-for="(allegato, index) in allegati">
          <v-list-tile :key="'aaa'+index">
              <v-list-tile-avatar>
                <img :src="'data:image/jpg;base64,' + allegato.anteprima">
              </v-list-tile-avatar>            
            <v-list-tile-content>
              <v-list-tile-title>{{ allegato.nome }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ allegato.note }} {{ formatTimeStamp(allegato.dataOra) }} </v-list-tile-sub-title>
            </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ allegato.size }} KB</v-list-tile-action-text>
                <a   @click="confirmDeleteFile(allegato)"><v-icon>delete</v-icon></a>
                <a  @click="showFile(allegato)"><v-icon>visibility</v-icon></a>
             </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < allegati.length" :key="index"/>
        </template>
      </v-list>
              <!-- -->
    </div>

    <v-layout row justify-center>
      <v-dialog v-model="dialogConfirm" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Confermi l'eliminazione dell'allegato?</v-card-title>
          <v-card-text>Il file verr&agrave; cancellato definitivamente</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="secondary" flat @click="dialogConfirm = false">Indietro</v-btn>
            <v-btn class="error" flat @click="deleteFile()">Elimina</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>
</template>

<script>
import axios from "axios"
const qs = require('querystring')

const mime = require('mime-types'); //npm install mime-types
/*
function mimeFromExtension(fileName) {
    var re = /(?:\.([^.]+))?$/;
    var extension = re.exec(fileName)[1];
    var type = 'application/octet-stream';
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    switch(extension) {
      case "pdf":
        type = 'application/pdf';
        break;
      case "gif":
        type = 'image/gif';
        break;
      case "png":
        type = 'image/png';
        break;
      case "jpg":
      case "jpeg":
        type = 'image/jpeg';
        break;
      case "xls":
        type = 'application/vnd.ms-excel';
        break;
      case "xlsx":
        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case "doc":
        type = 'application/msword';
        break;
      case "docx":
        type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case "zip":
        type = 'application/zip';
        break;
      //default:
    }        
    return type;
}
*/

export default {
  props: {
    refresh: {
      type: Boolean
    }
  },
  watch: {
    'refresh': function (val, oldVal) {
      console.log(oldVal)
      if (val) {
        this.refreshAllegati();
      }
    },    
  },
  data() {
    return {
      allegati: [],
      dialogConfirm : false,
      candidateForDeletion: null
    }
  },
  mounted() {
    this.refreshAllegati();
  },  
  methods: {
    refreshAllegati() {
      console.log("REFRESH ALLEGATI");
      axios.get('/movimento/allegati/' 
      + (this.$store.getters.isDefinitivo ? '' : 'parcheggio/')
      + this.$store.getters.getNumeroMovCorrente , {
        params: {
        }
      }).then(res => {
        console.log(res)
        this.allegati = res.data;
        this.$store.dispatch('hideWaitDialog')
      }).catch(error => {
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
        this.$store.dispatch('hideWaitDialog')
      })      
    },
    formatTimeStamp(tempo) {
      if (!tempo) {
        return '';
      }
      var newDate = new Date(tempo);
      //newDate.setTime(tempo*1000);
      return newDate.toLocaleString();      
    },
    confirmDeleteFile(allegato) {
      if (allegato) {
        this.candidateForDeletion = allegato;
        this.dialogConfirm = true;
      }
    },
    /**/
    deleteFile() {
      var allegato = this.candidateForDeletion;
      if (!allegato) {
        return;
      }
      console.log(allegato);
      //
      this.dialogConfirm = false;

      //if (confirm("cancellare l'allegato")) {

      this.$store.dispatch('showWaitDialog')
      axios.post('/allegatidt/remove', 
        qs.stringify({
          tipo: allegato.tipoAllegato,
          commessa: allegato.codiceCommessa,
          posizione: allegato.posizione,
          progressivo: allegato.progressivoAllegato
        }),      
      ).then(res => {
        // eslint-disable-next-line
        console.log(res)
        this.candidateForDeletion = null;
        // Update lista allegati
        this.refreshAllegati();
        this.$store.dispatch('hideWaitDialog')
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.candidateForDeletion = null;
        this.$store.dispatch('hideWaitDialog')
        this.$store.dispatch('handleError', error.response.data)
      })
      //

      //}

    },
    /**/
    showFile(allegato) {
      this.$store.dispatch('showWaitDialog')
      //StampaRapportinoInterventoParamsBean
      //axios('/allegatidt/bykey', {
      //  method: 'POST',
      //  responseType: 'blob',
      axios.post('/allegatidt/bykey', 
        qs.stringify({
          tipo: allegato.tipoAllegato,
          commessa: allegato.codiceCommessa,
          posizione: allegato.posizione,
          progressivo: allegato.progressivoAllegato
        }),
        {
          responseType: 'blob'
        }
      //}
      ).then(res => {
        // eslint-disable-next-line
        //console.log(res)

        var fileName = res.headers['content-disposition'].split("filename=")[1];
        //var type = mimeFromExtension(fileName);
        var type = mime.lookup(fileName);
        console.log('fileName', fileName);
        console.log('mime type', type);

        // Create a Blob from the PDF Stream
        //https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
        const blob = new Blob(
          [
            res.data
          ], 
          {
            //type: 'application/pdf' //'application/octet-stream'
            type: type
          }
        )
        /**/
        // Build a URL from the file
        const fileURL = URL.createObjectURL(blob);
        // eslint-disable-next-line
        console.log(fileURL)
        // Open the URL on new Window
        // window.open(fileURL,"_self");
        // Attenzione, con _blank gli adBlocker non permettono la visualizzazione
        window.open(fileURL,"_blank")
        /**/

        /**
        //xhr.getResponseHeader('Content-Disposition').split("filename=")[1];        
        //let file = new File([res.data], fileName, {type: "application/octet-stream"});
        var file = new File([blob], fileName, {lastModified: 1534584790000});        
        let fileURL = URL.createObjectURL(file);
        window.location.assign(fileURL);
        URL.revokeObjectURL(fileURL);        
        //window.open(fileURL,"_blank")
        /**/

        //
        this.$store.dispatch('hideWaitDialog')
      }).catch(error => {
        //
        this.$store.dispatch('hideWaitDialog')
        // eslint-disable-next-line
        console.log(error)
        if (error && error.response && error.response.data) {
          this.$store.dispatch('handleError', error.response.data);
        }
      })
    }        
  }
}
</script>
