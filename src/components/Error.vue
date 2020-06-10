<template>
  <div>
    <toolbar></toolbar>
    <v-container fluid grid-list-md>
      <v-alert type="warning" :value="true">{{ developerMessage }}</v-alert>
      <!--  color="red lighten-5" "#f2d4ff" 
      <span class="grey--text">Messaggio</span>
        <v-card-title>Messaggio</v-card-title>
        <v-card-text class="headline font-weight-bold">{{ message }}</v-card-text>
      -->
      <v-card flat color="#f2dfce">
        <v-card-text>
          <p class="grey--text">Messaggio</p>
          <p class="title font-weight-bold">{{ message }}</p>
        </v-card-text>
      </v-card>
      <!--
          <div class="grey--text">Messaggio</div>
          <br>
      <br>
      <v-expansion-panel>
        <v-expansion-panel-content>
        <div slot="header">Dettagli aggiuntivi</div>
        <v-card>
          <v-card-text>ERROR {{ code }} : {{ status }}</v-card-text>
        </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      -->
    </v-container>
    <br>
    <v-btn color="primary" @click="goBack()">Indietro</v-btn>
    <v-btn color="secondary" @click="goHome()">Home</v-btn>
  </div>
</template>

<script>

import Toolbar from './Toolbars/ToolbarLogin'

export default {
  props: {
    message: {
      type: String
    },
    developerMessage: {
      type: String,
      default: "Risorsa non trovata"
    },
    code: {
      type: Number,
      default: 404
    },
    status: {
      type: String,
      default: "Not Found"
    }
  },
  components: {
    Toolbar
  },
  methods: {
    goBack() {
      window.history.back()
    },
    goHome() {
      this.$router.push('/movimenti')
    }
  }
}
</script>

