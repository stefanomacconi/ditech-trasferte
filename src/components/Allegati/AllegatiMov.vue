<template>
  <!-- 
  <vaadin-upload capture="camera" accept="image/*" id="myUpload" ></vaadin-upload>  
  -->
  <div>
    <div>
      <!-- TODO Prio1 Gestire gli errori (per es. se non è configurata la variabile WEB 10) -->
      <!-- TODO Prio2 Gestire il pulsante in base se ci sono o meno file da fare upload -->
      <vaadin-upload id="manualUpload" ref="manualUpload" no-auto
        i18n='{"dropFiles":{"one":"Trascina qui","many":"Trascina qui"},"addFiles":{"one":"Sfoglia...","many":"Sfoglia..."},"cancel":"Annulla","error":{"tooManyFiles":"Too Many Files.","fileIsTooBig":"File is Too Big.","incorrectFileType":"Incorrect File Type."},"uploading":{"status":{"connecting":"Connecting...","stalled":"Bloccato.","processing":"Processing File...","held":"In coda"},"remainingTime":{"prefix":"remaining time: ","unknown":"unknown remaining time"},"error":{"serverUnavailable":"Server non raggiungibile","unexpectedServerError":"Errore nel caricamento","forbidden":"Permesso negato"}},"units":{"size":["B","kB","MB","GB","TB","PB","EB","ZB","YB"]}}'
        :target=getBaseURL()
        :headers=getCustomHeaders()
        @upload-request=handleUploadRequest($event)
        @upload-success=handleUploadSuccess()
        >
      </vaadin-upload>
    </div>
    <div>
      <v-btn flat color="primary" id="uploadButton" ref="uploadButton" @click="save()">SALVA ALLEGATI</v-btn>
    </div>
    <v-divider />
    <div>
      <allegati-comme :refresh="messageResfreshAllegati" />
    </div>
  </div>
</template>

<script>
/* https://cdn.vaadin.com/vaadin-upload/2.0.0-alpha1/demo/index.html
  https://cdn.vaadin.com/vaadin-upload/2.0.0-alpha1/demo/advanced.html
  youtube Sending files with vaadin-upload - Elementary School #13
  https://vaadin.com/tutorials/lit-element/starting-a-lit-element-project
  https://gitlab.existsolutions.com/eXistdbElements/existdb-dashboard/blob/6d0a287b37f97f66c3a1b55673f995cf79bfa39e/bower_components/vaadin-upload/vaadin-upload.html
*/
import '@vaadin/vaadin-upload/vaadin-upload.js'
import axios from "axios"
import AllegatiComme from './AllegatiComme';

export default {
  data() {
   return {
     messageResfreshAllegati : false
   }
  },
  methods: {
    getCustomHeaders() {
      return '{"Authorization": "Bearer ' + this.$store.getters.getToken + '"}'
    },
    getBaseURL() {
      return axios.defaults.baseURL + "/movimento/allegato"
    },
    save() {
      this.$refs.manualUpload.uploadFiles()
    },
    handleUploadRequest(event) {
      this.messageResfreshAllegati = false
      event.detail.formData.append('mov', this.$store.getters.getNumeroMovCorrente)         
      event.detail.formData.append('parcheggio', true)          
    },
    handleUploadSuccess() {
      this.messageResfreshAllegati = true
    }
  },
  components : {
    AllegatiComme
  }
}
</script>
