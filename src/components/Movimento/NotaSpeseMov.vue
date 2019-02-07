<template>
  <v-form v-model="valid">
    <v-container grid-list-md>
      <v-layout row wrap>
        <!-- <v-flex xs12>
          <v-subheader class="subtitle">Nota Spese</v-subheader>
        </v-flex> -->
        <v-flex v-for="nota in notaSpese" :key="nota.codice" xs12 md6 lg6>
          <v-text-field :rules="notaSpeseRules" :value="getNotaValue(nota.codice)" 
            @input="updateNotaSpese($event, nota)" :label="nota.descrizione">
          </v-text-field>
        </v-flex> 
      </v-layout>  
    </v-container>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      notaSpeseRules: [
        v => {
          if (v && isNaN(v))
            return 'deve contenere solo numeri'
          else
            return true 
        }
    ],
    }
  },
  computed: {
    notaSpese() {
      return this.$store.getters.getDefinizioniNotaSpese
    },
    getNotaValue() {
      return codice => {
        const nota = this.$store.getters.getNotaInNotaSpese(codice)
        // capire perché torna un array
        if (nota[0]) {
          return nota[0].value
        }
        return nota.value
      }
    },
  },
  methods: {
    updateNotaSpese (event, nota) {
      nota.value = event
      this.$store.dispatch('updateNotaSpese', nota)
    }
  }
}
</script>

<style>
.subtitle {
  height:20px;
}
</style>
