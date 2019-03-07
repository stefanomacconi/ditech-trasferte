<template>
    <div>
  <v-form v-model="valid">
    <h1>RICERCA MATERIALE</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-text-field v-model="codice" label="Articolo / Barcode"></v-text-field>          
        <v-text-field v-model="descrizione" label="Descrizione"></v-text-field>          
      </v-layout>
    </v-container>
    <v-btn @click="refreshMateriali()">Cerca</v-btn>
  </v-form>   
  <!-- -->
    <v-flex xs12 sm6 offset-sm3>
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
    </div>
</template>
<script>

import axios from "axios"

export default {
  data() {
    return {
      valid : false,
      codice : "",
      descrizione : "",
      materiali : []
    }
  },
  methods: {
    refreshMateriali() {
      axios(
        '/articoli',  
        {
          method: 'POST',
          data: {
            codice: this.codice,
            descrizione: this.descrizione
          }
        }
      ).then(res => {
          console.log(res);
          if (res.data && res.data.length > 0) {
          this.materiali = res.data;
          } else {
          this.materiali = [{"codice":"", "descrizione":"Nessun articolo trovato"}];
          }

      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    },
    sceltoArticolo(codiceArticolo, descrizioneArticolo) {
      this.$router.push({ name: 'insertQtaMateriale', 
                          params: { codice: codiceArticolo, descrizione : descrizioneArticolo } 
                        });
    }
  }    
}
</script>