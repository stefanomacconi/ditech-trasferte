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
              <v-list-tile-sub-title>{{ allegato.note }}</v-list-tile-sub-title>
            </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ allegato.size }}</v-list-tile-action-text>
                <v-icon
                  color="grey lighten-1"
                  star_border
                />
             </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < allegati.length" :key="index"/>
        </template>
      </v-list>
              <!-- -->
    </div>
  </div>
</template>

<script>
import axios from "axios"

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
      allegati: []
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
      }).catch(error => {
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })      
    },
  }
}
</script>
