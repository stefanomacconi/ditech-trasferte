<template>
  <div>
    <v-dialog v-model="this.visible" fullscreen hide-overlay 
      transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('onClose')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Ricerca Commessa</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="codicePerCommessa" label="Codice" hint="Codice Commessa">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="descrizionePerCommessa" label="Descrizione" 
                  hint="Descrizione Commessa">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="RagioneSocialePerCommessa" label="Ragione Sociale" 
                  hint="Ragione Sociale del Cliente">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select v-model="statoPerCommessa" :items="['Aperte', 'Bloccate', 'Chiuse']" label="Stato">
                </v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat @click="clearFilterSearchCommessa">Pulisci</v-btn>
          <v-btn color="primary" flat @click="searchCommessa">Cerca</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ATTENDERE DIALOG -->
    <wait-dialog :visibile="this.attendereDialog"></wait-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import WaitDialog from '../WaitDialog.vue'

export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      attendereDialog: false,
      codicePerCommessa: "",
      descrizionePerCommessa: "",
      RagioneSocialePerCommessa: "",
      statoPerCommessa: "Aperte",
    }
  },
  components: {
    WaitDialog
  },
  computed: {
  },
  methods: {
    searchCommessa() {
      this.$emit('onClose')
      this.attendereDialog = true
      axios.get('/commessa/', {
        params: {
          codice: this.codicePerCommessa,
          descrizione: this.descrizionePerCommessa,
          ragioneSociale: this.RagioneSocialePerCommessa,
          stato: this.statoPerCommessa
        }
      }).then(res => {
        // eslint-disable-next-line
        console.log(res)
        this.attendereDialog = false
        this.$emit('onItemsFound', res.data)
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    },
    clearFilterSearchCommessa() {
      this.codicePerCommessa = ""
      this.descrizionePerCommessa = ""
      this.RagioneSocialePerCommessa = ""
      this.statoPerCommessa = "Aperte"
    }
  }    
}
</script>