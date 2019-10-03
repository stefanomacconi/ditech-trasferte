<template>
  <div>
    <v-form ref="form">
      <v-text-field v-model="codice" label="Articolo / Barcode" :rules="this.formRules">
      </v-text-field>          
      <v-text-field v-model="descrizione" label="Descrizione" :rules="this.formRules">
      </v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="secondary" flat @click="clearFilterSearchMov()">Pulisci</v-btn>
      <v-btn color="primary" flat @click="refreshMateriali()">Cerca</v-btn>          
    </v-form>   
    <v-flex xs12 sm6 offset-sm3>
      <v-subheader v-if="this.noErr && materiali.length > 0" class="subtitle">
        Selezionare l'articolo desiderato dalla lista
      </v-subheader>
      <v-subheader v-if="!this.noErr" class="subtitle">
        Nessun articolo trovato
      </v-subheader>
      <v-list v-if="materiali.length > 0" light>
        <template v-for="(item, index) in materiali">
          <v-list-tile :key="item.codice + index">
            <v-list-tile-content @click="sceltoArticolo(item.codice, item.descrizione)">
              <v-list-tile-title>{{ item.codice }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ item.descrizione }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < materiali.length" :key="index"/>
        </template>
      </v-list>
    </v-flex>  
  </div>
</template>

<script>
import axios from "axios"
const qs = require('querystring')

export default {
  data() {
    return {
      codice: "",
      descrizione: "",
      materiali: [],
      noErr: true,
      formRules: [
        () => {
          if (!this.codice && !this.descrizione)
            return "Compilare almeno un campo"
          return true
        }    
      ]
    }
  },
  methods: {
    refreshMateriali() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('showWaitDialog')
        axios.post('/articoli', qs.stringify({
            codice: this.codice,
            descrizione: this.descrizione
          })
        ).then(res => {
          // eslint-disable-next-line
          console.log(res)
          this.$store.dispatch('hideWaitDialog')
          if (res.data && res.data.length > 0) {
            this.noErr = true
            if (res.data.length > 1) {
              this.materiali = res.data
            } else {    
              this.sceltoArticolo(res.data[0].codice, res.data[0].descrizione)
            }
          } else {
            this.noErr = false
            this.materiali = []
          }
        }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          this.$store.dispatch('handleError', error.response.data)
        })
      }
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
    },
    clearFilterSearchMov() {
      this.$refs.form.reset()
      this.noErr = true
      this.materiali = []
    }
  }    
}
</script>

<style>
.theme--light.v-list {
  background-color: transparent;
}
</style>
