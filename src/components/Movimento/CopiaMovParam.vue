<template>
  <div>
    <v-dialog v-model="this.visible" fullscreen hide-overlay 
      transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark  @click="$emit('onClose')" >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Copia Movimenti</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                  <v-menu ref="menuDataDa" :close-on-content-click="true" v-model="menuDataDa" :nudge-right="40" 
                    lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                    <v-text-field slot="activator" v-model="computedDataDaFormatted" label="Da (Data)" 
                      prepend-icon="event" @blur="dataDa = parseDate(computedDataDaFormatted)" required>
                    </v-text-field>
                    <v-date-picker v-model="dataDa" :allowed-dates="allowedDates" no-title locale="it-IT">
                    </v-date-picker>
                  </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md4>
                  <v-menu ref="menuDataA" :close-on-content-click="true" v-model="menuDataA" :nudge-right="40" 
                    lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                    <v-text-field slot="activator" v-model="computedDataAFormatted" label="A (Data)" 
                      prepend-icon="event" @blur="dataA = parseDate(computedDataAFormatted)" required>
                    </v-text-field>
                    <v-date-picker v-model="dataA" :allowed-dates="allowedDates" no-title locale="it-IT">
                    </v-date-picker>
                  </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat @click="clearFilter">Pulisci</v-btn>
          <v-btn color="primary" flat @click="copia">Copia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import axios from "axios";
import moment from 'moment';

export default {
  props: {
    visible: {
      type: Boolean
    },
  },
  /*
  watch: {
    'visible': function (val, oldVal) {
      console.log(oldVal)
      if (val) {
        this.clearFilter();
      }
    },    
  },
  */  
  data() {
    return {
      dataDa: new Date().toISOString().substr(0, 10),
      dataA: new Date().toISOString().substr(0, 10),
      dataDaFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      dataAFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menuDataDa: false,
      menuDataA: false,
    };
  },
  computed: {
    computedDataDaFormatted() {
      return this.formatDate(this.dataDa);
    },
    computedDataAFormatted() {
      return this.formatDate(this.dataA);
    },
  },
  methods: {
    copia() {
      //var timeInMilliseconds = moment().valueOf()
      const dataDa_ms = moment(this.dataDa, "YYYY-MM-DD").valueOf()
      const dataA_ms = moment(this.dataA, "YYYY-MM-DD").valueOf()
      //console.log("dataFrom", dataFrom);
      /**/
     const movimenti = this.$store.getters.getMovimentiSelezionati;
     if (!movimenti || movimenti.lenght < 1) {
       return;
     }
     /*
     var movimentiKeys = [];
     movimenti.forEach(element => {
       movimentiKeys.push(element.numero);
     });
     console.log("movimenti+keys", movimenti, movimentiKeys);
     */
     const parametri = {
            parcheggio: true,
            //mov: this.$store.getters.getNumeroMovCorrente,
            movimenti: movimenti,
            dataDa: dataDa_ms,
            dataA: dataA_ms
          };
     console.log(parametri);

      this.$emit("onClose");
      this.$store.dispatch("showWaitDialog");
        axios.post('/movimento/copia', parametri)
        .then(res => {
          // eslint-disable-next-line
          console.log(res);
          this.$store.dispatch("clearMovimentiSelezionati");
          //this.$emit("onItemsFound", res.data);
          this.$store.dispatch('fetchMovimenti').then(() => {
            this.$store.dispatch('hideWaitDialog')
            this.$router.push({
              name: 'movimenti'
            })
          })          
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.$store.dispatch("hideWaitDialog");
          this.$store.dispatch("handleError", error.response.data);
        });
        /**/
    },
    clearFilter() {
      console.log("clearFilter");
      this.dataDa = new Date().toISOString().substr(0, 10);
      this.dataA = new Date().toISOString().substr(0, 10);
    },
    parseDate(date) {
      console.log("parseDate", date);
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
    },
    formatDate(date) {
      console.log("formatDate", date);
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    allowedDates: val => val <= new Date().toISOString().substr(0, 10),
  }
};
</script>