<template>
  <div>
    <v-tabs-items v-model="tab">
      <v-tab-item :value="0">
        <descrizione-mov :definitivo="this.definitivo"></descrizione-mov>
      </v-tab-item>
      <v-tab-item :value="1" v-if="this.gestioneNoteSpese">
          <nota-spese-mov :definitivo="this.definitivo"></nota-spese-mov>
      </v-tab-item>
      <v-tab-item v-if="!isNewMov && this.gestioneMateriali" :value="2">
          <lista-articoli-mov :definitivo="this.definitivo"></lista-articoli-mov>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import descrizioneMov from './DescrizioneMov.vue'
import notaSpeseMov from './NotaSpeseMov.vue'
import listaArticoliMov from './ListaArticoliMov.vue'

export default {
  data() {
    return {
      isNewMov: this.$store.getters.isNewMov,
    }
  },
  props: {
    definitivo: {
      default: false
    }
  },
  computed: {
    tab() {
      return this.$store.getters.getTab           
    },
    gestioneNoteSpese() {
      const opzioni = this.$store.getters.getOpzioni
      return opzioni.gestioneNoteSpese ? opzioni.gestioneNoteSpese : false           
    },
    gestioneMateriali() {
      const opzioni = this.$store.getters.getOpzioni
      return opzioni.gestioneMateriali ? opzioni.gestioneMateriali : false           
    }
  },
  components: {
    'descrizione-mov': descrizioneMov,
    'nota-spese-mov': notaSpeseMov,
    'lista-articoli-mov': listaArticoliMov
  }
}
</script>
