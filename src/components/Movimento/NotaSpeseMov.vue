<template>
  <v-form>
    <v-container grid-list-md>
      <v-layout row wrap>
        <!-- <v-flex xs12>
          <v-subheader class="subtitle">Nota Spese</v-subheader>
        </v-flex> -->
        <v-flex v-for="nota in notaSpese" :key="nota.codice" xs12 md6 lg6>
          <v-text-field :clearable="!definitivo"
            :rules="notaSpeseRules" :value="getNotaValue(nota.codice)" 
            @blur="updateNotaSpese($event, nota)" :label="nota.descrizione"
            :readonly="definitivo">
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
  props: {
    definitivo: {
      default: false
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
      if (this.definitivo) return;
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
