<template>
  <v-dialog v-model="visible" fullscreen hide-overlay 
    transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="$emit('onClose')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Scelta {{ this.title }}</v-toolbar-title>
        <v-toolbar-title v-if="this.filteredItems.length == 0" slot="extension" 
          class="red--text text--lighten-3">
          <small>* 0 Elementi {{ this.title }} Trovati</small>
        </v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field v-model="filterText" :label="getFilterName()"></v-text-field>
        </v-flex>
      </v-layout>
        <v-list three-line>
          <template v-for="(item, index) in filteredItems">
            <v-list-tile :key="item.codice" avatar ripple @click="$emit('onItemSelected', item)">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.codice"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.descrizione"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider v-if="index + 1 < items.length" :key="item.codice + 'divider'"></v-divider>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    title: {
      type: String
    },
    items: {
      type: Array
    }
  },
  data() {
    return {
      filterText: ""
    }
  },
  computed: {
     filteredItems() {
      const smallMatch = this.filterText.toLowerCase()
      const collections = this.items.filter(item => {
        const lowerItem = item.codice.toString().toLowerCase() + item.descrizione.toLowerCase()
        return (
          lowerItem.match(smallMatch)
        )
      })
      return collections
    },
  },
  methods: {
    getFilterName() {
      return "Filtro " + this.title
    },
  }    
}
</script>