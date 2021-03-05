<template>
  <div>
    <div @click="selected(dataMov.movimenti)">
      <v-timeline-item class="day" :color="getDayColor(dataMov)">
        <v-img class="rounded" max-height="120px" max-width="500px" :src="getSeasonImage(dataMov.data)"
          gradient="to top, rgba(255,255,255,0.7), rgba(255,255,255,0.7)"> <!-- class="rounded" -->
            <v-container fill-height>
              <v-layout>
                <div>
                  <strong style="font-size: 15px;"> <!-- color="white" -->
                    <!-- <font color="white"> -->
                    {{ moment(dataMov.data).locale('it').format('dddd, DD MMMM YYYY').toUpperCase() }}
                    <!-- </font> -->
                  </strong>
                  <div v-if="dataMov.oraInizioMattino"> <!-- color="white" -->
                  <!-- <font color="white"> -->
                    {{ getOrariGiornata(dataMov) }}
                    {{ "(" + moment(getTotalHourDay(dataMov)).format("HH[h] mm[min]") + ")" }}
                  <!-- </font> -->
                  </div>
                  <div>
                  <!-- <font color="white"> -->
                    {{ moment(getTotalHourMovs(dataMov)).format("HH[h] mm[min]") }}
                  <!-- </font> -->
                  </div>
                </div>
              </v-layout>
            </v-container>
        </v-img>
      </v-timeline-item>
    </div>   
    <div v-for="(movimento, index) in dataMov.movimenti" :key="movimento.numeroMovimento + index">
      <movimento :movimento="movimento" :ultimo="isUltimo(dataMov.movimenti.length, index)"/>
    </div>
  </div>   
</template>

<script>
import Movimento from './Movimento.vue'
import moment from 'moment'
import utilities from "../../utilitiesMixin.js"

export default {
  created() {
    this.$store.dispatch("clearMovimentiSelezionati")
  },
  props: {
    dataMov: {
      type: Object
    }
  },
  components: {
    'movimento': Movimento
  },
  mixins: [utilities],
  methods: {
    selected(movimenti){
      const movimentiSelezionati = this.$store.getters.getMovimentiSelezionati
      movimenti.forEach(movimento => {
        if (!movimento.definitivo) {
          const index = movimentiSelezionati.indexOf(movimento.numeroMovimento)
          if (index === -1) 
            this.$store.dispatch("addToMovimentiSelezionati", movimento.numeroMovimento)
          else 
            this.$store.dispatch("removeToMovimentiSelezionati", index)
        }
      })
    },
    getTotalHourDay(data) {
      const t1 = moment(this.getTimeFromInteger(data.oraInizioMattino), "HH:mm")
      const t2 = moment(this.getTimeFromInteger(data.oraFineMattino), "HH:mm")
      const mattino = t2.diff(t1)
      const t3 = moment(this.getTimeFromInteger(data.oraInizioPomeriggio), "HH:mm")
      const t4 = moment(this.getTimeFromInteger(data.oraFinePomeriggio), "HH:mm")
      const pomeriggio = t4.diff(t3)
      let totale = moment(mattino).add(pomeriggio)
      totale = totale - 3600000 // Non so perché moment calcola un'ora in più. Comunque la tolgo.
      return totale 
    },
    getTotalHourMovs(dataBean) {
      const movs = dataBean.movimenti
      let totale = 0
      movs.forEach(mov => {
        totale = totale + moment.duration(mov.tempoMinuti,"m").asMilliseconds()
      })
      totale = totale - 3600000 // Non so perché moment calcola un'ora in più. Comunque la tolgo.
      return totale
    },
    getSeasonImage(data) {
      const date = new Date(data)
      const month = date.getMonth() + 1
      if (month == 1)
        return require('../../assets/img/1-January.jpg')
      if (month == 2)
        return require('../../assets/img/2-February.jpg')
      if (month == 3)
        return require('../../assets/img/3-March.jpg')
      if (month == 4)
        return require('../../assets/img/4-April.jpg')
      if (month == 5)
        return require('../../assets/img/5-May.jpg')
      if (month == 6)
        return require('../../assets/img/6-June.jpg')
      if (month == 7)
        return require('../../assets/img/7-July.jpg')
      if (month == 8)
        return require('../../assets/img/8-August.jpg')
      if (month == 9)
        return require('../../assets/img/9-September.jpg')
      if (month == 10)
        return require('../../assets/img/10-October.jpg')
      if (month == 11)
        return require('../../assets/img/11-November.jpg')
      if (month == 12)
        return require('../../assets/img/12-December.jpg')
    },
    getOrariGiornata(data) {
      const orarioInizioMattino = this.getTimeFromInteger(data.oraInizioMattino)
      const orarioInizioPomeriggio = this.getTimeFromInteger(data.oraInizioPomeriggio)
      let final = ""
      if (orarioInizioMattino) {
      final = final + orarioInizioMattino + " - " + this.getTimeFromInteger(data.oraFineMattino)
        if (orarioInizioPomeriggio)
          final = final + " | " + " - " + this.getTimeFromInteger(data.oraFinePomeriggio)
      }
      return final
    },
    getDayColor(dataMov) {
      // const totaleOreGiorno = moment.duration(this.getTotalHourDay(dataMov)).asMilliseconds()
      const totaleOreMovs = moment.duration(this.getTotalHourMovs(dataMov)).asMilliseconds()
      if (dataMov.movimenti && dataMov.movimenti.length > 0) {
        const movimento = dataMov.movimenti[0]
        if (movimento.definitivo)
          return "success"
      }
      const ms8h = 25200000 // manca 1h
      // TODO MOMENTANEO
      if (totaleOreMovs === ms8h) {
        return "primary"
      } else {
        return "warning"
      }

      /*
      if (totaleOreGiorno == totaleOreMovs) {
        this.removeToGiorniError(dataMov.data)
        this.removeToGiorniWarning(dataMov.data)
        return "primary"
      }
      if (totaleOreGiorno > totaleOreMovs || !totaleOreGiorno) {
        this.removeToGiorniError(dataMov.data)
        this.addToGiorniWarning(dataMov.data)
        return "warning"
      }
      
      if (totaleOreGiorno < totaleOreMovs) {
        this.removeToGiorniWarning(dataMov.data)
        this.addToGiorniError(dataMov.data)
        return "error"
      } */
    },
    addToGiorniWarning(data) {
      this.$store.dispatch("addToGiorniWarning", data)
    },
    removeToGiorniWarning(data) {
      this.$store.dispatch("removeToGiorniWarning", data)
    },
    addToGiorniError(data) {
      this.$store.dispatch("addToGiorniError", data)
    },
    removeToGiorniError(data) {
      this.$store.dispatch("removeToGiorniError", data)
    },
    isUltimo(len, index) {
      return (len - 1) == index
    }
  }
}
</script>

<style>
.fab-container {
  position: fixed;
  bottom: 30px;
  right: 10px;
}
.rounded {
  border-radius:5px;
}
.day {
  padding-bottom: 2px;
}
</style>