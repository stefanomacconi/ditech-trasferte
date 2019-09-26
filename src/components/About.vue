<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-img :src="getSmeUPLogo()" max-width="200px"></v-img>
        <v-card-title primary-title>
          <div>
            <span>08/04/2019</span>
            <br>
            <div class="headline">DiTech Trasferte 1.0.0</div>
            <span>Versione: 1.0.0</span>
            <br>
            <span>SmeUP SPA https://www.smeup.com/</span>
            <br>
            <span>Via della Pergola, 73</span>
            <br>
            <span>23900 Lecco (LC)</span>
            <br>
            <span>+39 0341 496 864</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="show">
            Il modulo DiTech Trasferte consente la gestione del lavoro dei dipendenti in trasferta.
            <br>
            Permette di raccogliere ed inserire immediatamente tutti i dati relativi 
            a rapportini di intervento e note spese da dispositivi mobile 
            o via web in modo semplice, efficace e veloce.
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    show: false
  }),
  methods: {
    getSmeUPLogo() {
      return require('../assets/img/smeup.png')
    }
  }
}
</script>

