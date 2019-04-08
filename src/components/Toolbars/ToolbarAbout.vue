<template>
  <div>
    <v-toolbar color='primary' dark app clipped-right>
      <v-btn icon dark @click="goBack">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>
        DiTech Trasferte
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      window.history.back()
    }
  }
}
</script>