<template>
  <!-- 
  <vaadin-upload capture="camera" accept="image/*" id="myUpload" ></vaadin-upload>  
  -->
  <div>
    <div>
      <vaadin-upload id="manualUpload" ref="manualUpload" no-auto
        accept="image/*"
        i18n='{"dropFiles":{"one":"Trascina qui","many":"Trascina qui"},"addFiles":{"one":"Sfoglia...","many":"Sfoglia..."},"cancel":"Annulla","error":{"tooManyFiles":"Too Many Files.","fileIsTooBig":"File is Too Big.","incorrectFileType":"Incorrect File Type."},"uploading":{"status":{"connecting":"Connecting...","stalled":"Bloccato.","processing":"Processing File...","held":"In coda"},"remainingTime":{"prefix":"remaining time: ","unknown":"unknown remaining time"},"error":{"serverUnavailable":"Server non raggiungibile","unexpectedServerError":"Errore nel caricamento","forbidden":"Permesso negato"}},"units":{"size":["B","kB","MB","GB","TB","PB","EB","ZB","YB"]}}'
        :target=getBaseURL()
        :headers=getCustomHeaders()
        @upload-before=handleUploadBefore($event)
        @upload-request=handleUploadRequest($event)
        @upload-start=handleUploadStart($event)>
      </vaadin-upload>
    </div>
    <div>
      <v-btn block id="uploadButton" ref="uploadButton" @click="save()">SALVA ALLEGATI</v-btn>
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
import '@vaadin/vaadin-upload/vaadin-upload.js';
import axios from "axios"

export default {
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
    /*
    handleUploadBefore(event) {    
    },
    */
    handleUploadRequest(event) {
      event.detail.formData.append('mov', this.$store.getters.getNumeroMovCorrente);          
      event.detail.formData.append('parcheggio', true);          
    },
    /*
    handleUploadStart(event) {
    },
    */
  }
}
</script>
