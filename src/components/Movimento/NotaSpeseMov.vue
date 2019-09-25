<template>
  <v-form>
    <v-container>
      <v-row  >
        <!-- <v-flex xs12>
          <v-subheader class="subtitle">Nota Spese</v-subheader>
        </v-flex> -->
        <v-col v-for="nota in notaSpese" :key="nota.codice" cols="12" md="6" lg="6">
          <v-text-field :rules="notaSpeseRules" :value="getNotaValue(nota.codice)" 
            @blur="updateNotaSpese($event, nota)" :label="nota.descrizione">
          </v-text-field>
        </v-col> 
      </v-row>  
    </v-container>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      notaSpeseRules: [
        v => {
          if (v && isNaN(v))
            return 'deve contenere solo numeri'
          else
            return true 
        }
      ]
    }
  },
  computed: {
    notaSpese() {
      return this.$store.getters.getDefinizioniNotaSpese
    },
    getNotaValue() {
      return codice => {
        const nota = this.$store.getters.getNotaInNotaSpese(codice)
        if (nota)
          return nota.value
        return null
      }
    },
  },
  methods: {
    updateNotaSpese(event, nota) {
      let value = event.target.value
      if (!value || isNaN(value)) {
        this.$store.dispatch('removeInNotaSpese', nota)
      }
      else {
        nota.value = Number(value)
        this.$store.dispatch('updateNotaSpese', nota)
      }
    }
  }
}
</script>

<style>
.subtitle {
  height:20px;
}
</style>
