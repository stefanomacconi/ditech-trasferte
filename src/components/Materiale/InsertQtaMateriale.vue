<template>
  <div>
    <v-form v-model="valid">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm4>
            <v-text-field v-model="codice" label="Articolo" disabled></v-text-field>          
          </v-flex>
          <v-flex xs12 sm8>
            <v-text-field v-model="descrizione" label="Descrizione" disabled></v-text-field>          
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="qta" label="Quantità"></v-text-field>          
          </v-flex>
          <v-flex xs12>
            <v-textarea v-model="note" label="Note"></v-textarea>          
          </v-flex>
        </v-layout>
      </v-container>
      <v-btn block @click="addMateriale()">Conferma</v-btn>
    </v-form>   
    <!-- wait -->
    <wait-dialog :visibile=this.wait></wait-dialog>
  </div>
</template>

<script>
import WaitDialogVue from '../WaitDialog.vue'
import axios from "axios"
const qs = require('querystring')

export default {
  data() {
    return {
      valid: false,
      qta: "",
      note: "",
      wait: false
    }
  },
  props: {
    codice: {
      type: String
    },
    descrizione: {
      type: String
    }
  },
  components: {
    'wait-dialog': WaitDialogVue
  },   
  methods: {
    addMateriale() {
      this.wait = true
      axios.post('/movimento/addMateriale', 
        qs.stringify({
          parcheggio: true,
          mov: this.$store.getters.getNumeroMovCorrente,
          codiceArticolo: this.codice,
          descrizione: this.descrizione,
          note: this.note,
          qta: this.qta,
          /*
          //utente : this.$store.getters.getUtente
          */
        })
      ).then(res => {
        // eslint-disable-next-line
        console.log(res)
        this.wait = false
        this.$router.push({
          name: 'movimento', 
          params: {
            id: this.$store.getters.getNumeroMovCorrente 
          } 
        })
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.wait = false
        this.$store.dispatch('handleError', error.response.data)
      })
    }
  }
}
</script>  
