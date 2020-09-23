<template>
  <div>
    <v-dialog v-model="this.visible" fullscreen hide-overlay 
      transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('onClose')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Ricerca Posizione</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="codiceArticolo" label="Codice" hint="Codice Articolo">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="descrizioneArticolo" label="Descrizione" 
                  hint="Descrizione Articolo">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="commessa" label="Commessa" readonly>
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat @click="clearFilterSearchPosizione">Pulisci</v-btn>
          <v-btn color="primary" flat @click="searchPosizione">Cerca</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    visible: {
      type: Boolean
    },
    commessa: {
      type: String
    }
  },
  data() {
    return {
      codiceArticolo: "",
      descrizioneArticolo: "",
    };
  },
  computed: {},
  methods: {
    searchPosizione() {
      this.$emit("onClose");
      this.$store.dispatch("showWaitDialog");
      axios
        .get("/commessa/posizioni", {
          params: {
            codiceArticolo: this.codiceArticolo,
            descrizioneArticolo: this.descrizioneArticolo,
            commessa: this.commessa,
            soloPrimiLivelli: this.$store.getters.getOpzioni.soloPrimiLivelli
          }
        })
        .then(res => {
          // eslint-disable-next-line
          console.log(res);
          this.$store.dispatch("hideWaitDialog");
          this.$emit("onItemsFound", res.data);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.$store.dispatch("handleError", error.response.data);
        });
    },
    clearFilterSearchPosizione() {
      this.codiceArticolo = "";
      this.descrizioneArticolo = "";
    }
  }
};
</script>