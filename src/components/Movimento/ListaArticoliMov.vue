<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
        <v-list two-line>
          <template v-for="(item, index) in materiali">
            <v-list-tile
              :key="item.articolo + index"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.articolo }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{ item.descrizione }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{ item.nota }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.qta }}</v-list-tile-action-text>
                <v-icon>delete</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider
              v-if="index + 1 < materiali.length"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      valid: false
    }
  },
  computed: {
    materiali() {
      return this.$store.getters.getMateriale
    }
  }  
}
</script>