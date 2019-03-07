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
    <v-btn @click="addMateriale()">Conferma</v-btn>
  </v-form>   
  </div>
  <!-- -->
</template>

<script>

import axios from "axios"
const qs = require('querystring');

export default {
  data() {
    return {
      valid : false,
      qta : "",
      note : ""
    }
  },
  props : {
    codice: {
            type: String
        },
    descrizione: {
            type: String
        }
  },
  methods: {
    addMateriale() {
      axios.post('/movimento/addMateriale', qs.stringify({
            parcheggio : true,
            mov : this.$store.getters.getNumeroMovCorrente,
            codiceArticolo : this.codice,
            descrizione : this.descrizione,
            note : this.note,
            qta : this.qta,
            /*
            //utente : this.$store.getters.getUtente
            */
        })
      ).then(res => {
          console.log(res);
          //
          this.$router.push({ name: 'movimento', 
                          params: { id: this.$store.getters.getNumeroMovCorrente } 
                        });

          /*
          if (res.data && res.data.length > 0) {
          } else {
          }
          */

      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    }
  }
}
</script>  
