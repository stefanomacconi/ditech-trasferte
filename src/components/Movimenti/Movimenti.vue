<template>
  <div>
    <v-timeline align-top dense>
      <div v-for="(dataMov, index) in dateMovFiltered" :key="dataMov.data + index">
        <giorno-movimenti :dataMov="dataMov"/>
      </div>
    </v-timeline>
    <v-layout column class="fab-container">
      <v-btn dark fab class="primary" to="/movimento">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
    <v-btn v-if="moreMovs" flat icon @click="more()" small color="white" class="primary" style="left:-3px"> <!-- @click="more" class="red" -->
      <v-icon>arrow_drop_down</v-icon>
    </v-btn>
    <v-btn v-else dark flat icon small class="green" style="left:-3px">
      <v-icon>check</v-icon>
    </v-btn>
  </div>
</template>

<script>
import GiornoMovimenti from './GiornoMovimenti.vue'
import moment from 'moment'

export default {
  mounted() {
    // this.$store.dispatch("clearMovimentiSelezionati")
  },
  data: () => ({
    moreMovs: true
  }),
  computed: {
    dateMovFiltered() {
      const msPicked = this.$store.getters.getPickedData
      const result = {}
      const values = Object.values(this.$store.getters.getDate)
      values.sort(this.compare)
      for (let index = 0; index < values.length; index++) {
        if (msPicked >= values[index].data) {
          const data = moment(values[index].data).format("YYYY-MM-DD");
          if (this.$store.getters.getDate[data])
            result[data] = this.$store.getters.getDate[data]
          else
            continue
        }
      }
      return result
    }
  },
  components: {
    GiornoMovimenti
  },
  methods: {
    compare(a,b) {
      if (a.data > b.data)
        return -1
      if (a.data < b.data)
        return 1
      return 0
    },
    more() {
      // commento perché le computed non vengono rinfrescate per il sidemenu
      /*this.$store.dispatch('showWaitDialog')
      this.$store.dispatch('incrementOffset')
      this.$store.dispatch('fetchMovimenti', this.$store.getters.getOffset).then(res => {
        if (Object.keys(res.data).length === 0) 
          this.moreMovs = false
        this.$store.dispatch('hideWaitDialog')
      }) */
      // TODO refresh view altrimenti si hanno problemi con i movimenti a metà della prima GET
      // questo non funziona
    // this.$forceUpdate()
    },
  }
}
</script>