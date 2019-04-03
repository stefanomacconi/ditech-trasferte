<template>
  <v-layout row wrap>
    <!-- Show this only if there's a material list, so i'm sure that RdA key exists  -->
    <v-flex xs12 sm12 v-if="materiali.length > 0"> 
      <v-textarea rows="2" v-model="notaLista" label="Titolo Lista" :readonly="this.$store.getters.isDefinitivo"/>
    </v-flex>
    <v-flex xs12 sm10 md8 lg6>
      <v-list two-line v-if="materiali.length > 0">
        <template v-for="(materiale, index) in materiali">
          <v-list-tile :key="materiale.articolo + index">
            <v-list-tile-content>
              <v-list-tile-title>{{ materiale.articolo }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ materiale.descrizione }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ materiale.nota }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              {{ materiale.qta }}
              <v-icon @click="deleteMateriale(materiale, index)">delete_outline</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < materiali.length" :key="index"/>
        </template>
      </v-list>
    </v-flex>
    <v-layout column class="fab-container" v-if="!this.$store.getters.isDefinitivo">
      <v-btn dark fab class="primary" @click="addMateriale()">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
    <!-- wait -->
    <wait-dialog :visibile=this.waitDialog></wait-dialog>  
  </v-layout>
</template>

<script>
import axios from "axios"
import WaitDialog from '../WaitDialog.vue'

export default {
  data() {
    return {
      waitDialog: false
    }
  },
  components: {
    WaitDialog
  }, 
  computed: {
    materiali() {
      return this.$store.getters.getMateriale
    },
    notaLista: {
      get() {
        return this.$store.getters.getNotaLista
      },
      set(value) {
        this.$store.commit('setNotaLista', value)
      }
    }
  },
  methods: {
    addMateriale() {
      this.$router.push({
        name:"cercaMateriale",
        params: {
          title: "Cerca materiale" 
        } 
      })
    },
    deleteMateriale(materiale, index) {
      if (this.$store.getters.isDefinitivo) 
        return
      this.waitDialog = true
      axios.delete('/materiale', {
        data: materiale 
      }).then(res => {
        // eslint-disable-next-line
        console.log(res)
        this.waitDialog = false
        this.$store.dispatch('removeMateriale', index)
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.waitDialog = false
        this.$store.dispatch('handleError', error.response.data)
      })
    }
  }  
}
</script>