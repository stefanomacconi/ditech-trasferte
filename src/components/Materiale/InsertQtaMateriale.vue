<template>
  <div>
    <v-form ref="form">
      <v-container>
        <v-row  >
          <v-col cols="12" sm="4">
            <v-text-field v-model="codice" label="Articolo" readonly></v-text-field>          
          </v-col>
          <v-col cols="12" sm="8">
            <v-textarea rows="3" v-model="descrizione" label="Descrizione" readonly/>          
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="qta" label="Quantità" required :rules="this.qtaRules">
            </v-text-field>          
          </v-col>
          <v-col cols="12">
            <v-textarea rows="3" v-model="note" label="Note"></v-textarea>          
          </v-col>
        </v-row>
      </v-container>
      <v-spacer></v-spacer>
      <v-btn color="secondary" flat @click="clearFilterSearchMov()">Pulisci</v-btn>
      <v-btn color="primary" flat @click="addMateriale()">Conferma</v-btn> 
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
      qta: "",
      note: "",
      wait: false,
      qtaRules: [
        v => {
          if (!v || isNaN(v))
            return "Inserire la quantità"
          return true
        }    
      ]
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
      if (this.$refs.form.validate()) {
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
          this.goToMov()
        }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          // TODO Check if the double push comport any kind of issue 
          // Otherwise manipolate the history to go back
          this.goToMov()
          this.$store.dispatch('handleError', error.response.data)
        })
      }
    },
    goToMov() {
      this.wait = false
      this.$router.push({
        name: 'movimento', 
        params: {
          id: this.$store.getters.getNumeroMovCorrente 
        } 
      })
    },
    clearFilterSearchMov() {
      this.qta = ""
      this.note = ""
    }
  }
}
</script>  
