<template>
    <div>
      <v-toolbar color='primary' fixed dark app clipped-right>
        <v-icon dark @click="goBack">close</v-icon>
        &nbsp;&nbsp;&nbsp;
        <v-toolbar-title>{{ this.title }}</v-toolbar-title>            
      </v-toolbar>
    </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'movimento', 
        params: {
          id: this.$store.getters.getNumeroMovCorrente,
          definitivo: this.$store.getters.isDefinitivo
        } 
      })
    }
  }
}
</script>