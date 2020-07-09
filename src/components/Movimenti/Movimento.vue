<template>
<div> 
  <!-- gestire -->
  <!-- @click="selected(movimento)" TODO Manca la funzione di unione dei movimenti per rapportino -->
  <v-timeline-item small :color="getMovColor(movimento)">
    <router-link :to="toMovimento(movimento)" tag="div">
      <v-layout pt-2>
        <v-flex xs3 md2 :class="{'v-timeline-left-part': $vuetify.breakpoint.xs}">
          <div v-if="movimento.orari.oraInizioAttMattino" :class="{'caption-small': $vuetify.breakpoint.xs}">
            <strong>{{ getOrariMovimentoMattina(movimento) }}</strong>
            <br>
          </div>
          <div v-if="movimento.orari.oraInizioAttPomeriggio" :class="{'caption-small': $vuetify.breakpoint.xs}">
            <strong>{{ getOrariMovimentoPomeriggio(movimento) }}</strong>
            <br>
          </div>
          <div :class="{'caption caption-normal': $vuetify.breakpoint.xs}">
            <!-- tecnica interessante, tenere 
            {{ moment.utc(moment.duration(movimento.tempo,"h").asMilliseconds()).format("HH[h] mm[min]") }} 
            -->
            {{ moment(movimento.tempo.toFixed(2), "HH.mm").format("HH:mm") }} 
          </div>
          <div>
            <v-icon v-if="movimento.conMateriale" >shopping_cart</v-icon>
            <v-icon v-if="movimento.conSpese">receipt</v-icon>
            <!-- TODO icon allegati -->
          </div>
        </v-flex>
        <v-flex xs9 md10 :class="{'v-timeline-right-part': $vuetify.breakpoint.xs}"> <!--offset-xs1 -->
          <strong>{{ movimento.commessa }}</strong>
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
    // TODO questo non va assolutamente bene,
    // Mi crea una mutation ad ogni distruzione dei componenti Movimento
    // this.$store.dispatch("clearMovimentiSelezionati")
  },
  methods: {
    selected(movimento){
      if (movimento.definitivo)
        return
      const numeroMovimento = movimento.numeroMovimento
      const movimenti = this.$store.getters.getMovimentiSelezionati
      const index = movimenti.indexOf(numeroMovimento)
      if (index === -1) 
        this.$store.dispatch("addToMovimentiSelezionati", numeroMovimento)
      else 
        this.$store.dispatch("removeToMovimentiSelezionati", index)
    },
    getOrariMovimentoMattina(movimento) {
      const orariMovimentoMattina = this.getTimeFromInteger(movimento.orari.oraInizioAttMattino)
      if (orariMovimentoMattina) {
        return orariMovimentoMattina + " - " +
          this.getTimeFromInteger(movimento.orari.oraFineAttMattino)
      }
    },
    getOrariMovimentoPomeriggio(movimento) {
      const orariMovimentoPomeriggio = this.getTimeFromInteger(movimento.orari.oraInizioAttPomeriggio)
      if (orariMovimentoPomeriggio) {
        return orariMovimentoPomeriggio + " - " +
          this.getTimeFromInteger(movimento.orari.oraFineAttPomeriggio)
      }
    },
    toMovimento(movimento) {
      return {
        name: 'movimento', 
        params: {
          id: movimento.numeroMovimento, 
          definitivo: movimento.definitivo 
        }
      }
    },
    getMovColor(movimento) {
      const movimenti = this.$store.getters.getMovimentiSelezionati
      if (movimenti.indexOf(movimento.numeroMovimento) != -1)
        // selected
        return "yellow"
      if (movimento.definitivo)
        // definitive
        return "secondary"
      // TODO
      if (movimento.colore)
        // TODO
        return movimento.colore
      // default
      return "primary"
    }
  },
  mixins: [utilities]
}
</script>

<style>
.caption-small {
  font-size: 11px !important;
  padding-top: 3px;
}
.caption-normal {
  padding-top: 1.5px;
}
.v-timeline-item {
  display: block;
  padding-left: 44px;
}
.v-timeline--dense .v-timeline-item__body {
  max-width: calc(100% - 0px) !important;
}
.v-timeline-left-part {
  padding-right: 5px;
}
.v-timeline-right-part {
  padding-left: 5px;
}
.container {
  padding: 10px !important;
}
</style>
