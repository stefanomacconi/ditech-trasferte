<template>
<div @click="selected(movimento)">
  <v-timeline-item small :color="getMovColor(movimento)">
    <router-link :to="toMovimento(movimento)" tag="div">
      <v-layout pt-3>
        <v-flex xs4 md2>
          <div v-if="movimento.orari.oraInizioAttMattino">
            <strong>{{ getOrariMovimentoMattina(movimento) }}</strong>
            <br>
          </div>
          <div v-if="movimento.orari.oraInizioAttPomeriggio">
            <strong>{{ getOrariMovimentoPomeriggio(movimento) }}</strong>
            <br>
          </div>
          <div>
            {{ moment.utc(moment.duration(movimento.tempo,"h").asMilliseconds()).format("HH[h] mm[min]") }}
          </div>
        </v-flex>
        <v-flex xs8 md10> <!--offset-xs1 -->
          <strong>&nbsp;{{ movimento.commessa }}</strong>
          <div class="caption hidden-sm-and-up">
            {{ movimento.descrizioneCommessa | truncate }}
          </div>
          <div class="hidden-sm-and-up">
            <template v-if="movimento.keyRdARapportino">
              Nr. Rapportino: {{ movimento.keyRdARapportino }}
            </template>
            <div>
            {{ movimento.nota | truncate }}
            </div>
          </div>
          <div class="caption hidden-xs-only">
            {{ movimento.descrizioneCommessa }}
          </div>
          <div class="hidden-xs-only">
            <template v-if="movimento.keyRdARapportino">
              Nr. Rapportino: {{ movimento.keyRdARapportino }}
            </template>
            <div>
              {{ movimento.nota }}
            </div>
          </div>
        </v-flex>
      </v-layout>
    </router-link>
  </v-timeline-item>
  <v-divider v-if="!ultimo" inset></v-divider>
</div>
</template>

<script>

import utilities from "../../utilitiesMixin.js"

export default {
  props: {
    movimento: {
      type: Object
    },
    ultimo: {
      type: Boolean
    }
  },
  beforeDestroy() {
    this.$store.dispatch("clearMovimentiSelezionati")
  },
  methods: {
    selected(movimento){
      if (movimento.definitivo)
        return
      const numeroMovimento = movimento.numeroMovimento
      var movimenti = this.$store.getters.getMovimentiSelezionati
      var index = movimenti.indexOf(numeroMovimento)
      if (index === -1) 
        this.$store.dispatch("addToMovimentiSelezionati", numeroMovimento)
      else 
        this.$store.dispatch("removeToMovimentiSelezionati", index)
    },
    getOrariMovimentoMattina(movimento) {
      var orariMovimentoMattina = this.getTimeFromInteger(movimento.orari.oraInizioAttMattino)
      if (orariMovimentoMattina) {
        return orariMovimentoMattina + " - " +
          this.getTimeFromInteger(movimento.orari.oraFineAttMattino)
      }
    },
    getOrariMovimentoPomeriggio(movimento) {
      var orariMovimentoPomeriggio = this.getTimeFromInteger(movimento.orari.oraInizioAttPomeriggio)
      if (orariMovimentoPomeriggio) {
        return orariMovimentoPomeriggio + " - " +
          this.getTimeFromInteger(movimento.orari.oraFineAttPomeriggio)
      }
    },
    toMovimento(movimento) {
      return { name: 'movimento', params: { id: movimento.numeroMovimento, definitivo: movimento.definitivo }}
    },
    getMovColor(movimento) {
      var movimenti = this.$store.getters.getMovimentiSelezionati
      if (movimenti.indexOf(movimento.numeroMovimento) != -1)
        // selected
        return "white"
      if (movimento.definitivo)
        // definitive
        return "secondary"
      // TODO
      if (movimento.colore)
        // TODO
        return movimento.colore
      // default
      return "primary"
    },
  },
  mixins: [utilities]
}
</script>