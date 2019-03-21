<template>
  <div>
    <v-form v-model="valid">
      <v-text-field v-model="codice" label="Articolo / Barcode"></v-text-field>          
      <v-text-field v-model="descrizione" label="Descrizione"></v-text-field>          
      <v-btn block @click="refreshMateriali()">Cerca</v-btn>
    </v-form>   
    <v-flex v-if="materiali.length > 0" xs12 sm6 offset-sm3>
      <v-list>
        <template v-for="(item, index) in materiali">
          <v-list-tile :key="item.codice + index">
            <v-list-tile-content @click="sceltoArticolo(item.codice, item.descrizione)">
              <v-list-tile-title>{{ item.codice }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ item.descrizione }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider
            v-if="index + 1 < materiali.length"
            :key="index"
          ></v-divider>
        </template>
      </v-list>
    </v-flex>  
    <!-- wait -->
    <wait-dialog :visibile=this.wait></wait-dialog>
  </div>
</template>

<script>
import WaitDialogVue from '../WaitDialog.vue';
import axios from "axios"
const qs = require('querystring');

export default {
  data() {
    return {
      valid: false,
      codice: "",
      descrizione: "",
      materiali: [],
      wait: false
    }
  },
  components: {
    'wait-dialog': WaitDialogVue
  },   
  methods: {
    refreshMateriali() {
      this.wait = true
      axios.post('/articoli', qs.stringify({
          codice: this.codice,
          descrizione: this.descrizione
        })
      ).then(res => {
        console.log(res);
        this.wait = false
        if (res.data && res.data.length > 0) {
          if (res.data.length > 1) {
            this.materiali = res.data;
          } else {    
            this.sceltoArticolo(res.data[0].codice, res.data[0].descrizione);
          }
        } else {
          this.materiali = [
            {
              "codice": "",
              "descrizione": "Nessun articolo trovato"
            }
          ]
        }
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.wait = false
        this.$store.dispatch('handleError', error.response.data)
      })
    },
    sceltoArticolo(codiceArticolo, descrizioneArticolo) {
      this.$router.push({
        name: 'insertQtaMateriale', 
        params: {
          codice: codiceArticolo,
          descrizione: descrizioneArticolo,
          title:"Conferma materiale" 
        } 
      })
    }
  }    
}
</script>