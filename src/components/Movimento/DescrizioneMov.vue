<template>
  <div>
    <v-form ref="form">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs6 md6 lg3>
            <!-- *** DATA, COMMESSA e NOTA *** -->
            <v-menu ref="menuDate" :close-on-content-click="true" v-model="menuDate" :nudge-right="40" 
              lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
              <v-text-field slot="activator" v-model="computedDateFormatted" label="Data Movimento" 
                prepend-icon="event" @blur="date = parseDate(computedDateFormatted)" required>
              </v-text-field>
              <v-date-picker v-model="date" :allowed-dates="allowedDates" no-title locale="it-IT">
              <!-- :readonly="!isNewMov" -->
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6 md6 lg3>
            <!-- TODO Autocomplete -->
            <v-text-field v-model="commessa" :rules="commessaRules" 
              label="Commessa" append-icon="search" @click:append="showDialogSearchCommessa()" required>
              <!-- :counter="8" -->
              <!-- :readonly="!isNewMov" -->
              <!-- :box="!isNewMov"  -->
              <!-- :class="{'myreadonly':!isNewMov}" -->
              <!-- @click="showDialogSearchCommessa()" readonly> -->
              <!-- :readonly="this.$store.getters.isNewMov ? false : true" -->
            </v-text-field>
          </v-flex>
          <v-flex xs6 md6 lg3 v-if="this.mostrareBuono">
            <v-text-field v-model="buono" :rules="this.buonoRules" label="Buono"
              @blur="checkBuono">
              <!-- :readonly="!isNewMov" -->
              </v-text-field>
          </v-flex>
          <v-flex xs6 md6 lg3 v-if="this.mostrarePosizione">
            <v-text-field v-model="posizione" :rules="this.posizioneRules" label="Posiz. (Attività)"
             append-icon="search" @click:append="showDialogSearchPosizione()" 
              ></v-text-field> <!-- :readonly="this.$store.getters.isNewMov ? false : true" -->
          </v-flex>
          <v-flex xs12>
            <v-textarea rows="3" v-model="nota" prepend-icon="notes" label="Nota"> <!-- required :rules="this.notaRules" -->
            </v-textarea>
          </v-flex>
          <!-- *** ATTIVITA' *** -->
          <template v-if="this.gestioneOrariMovimento">
            <v-flex xs12>
              <v-subheader class="subtitle">Attività</v-subheader>
            </v-flex>  
            <v-flex xs6 sm3 lg3>
              <v-dialog ref="menuTimeA1" v-model="menuTimeA1" :return-value.sync="timeA1" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="timeA1" label="Inizio" prepend-icon="alarm_on" readonly v-on="on"></v-text-field>
                </template>
                <v-time-picker format="24hr" v-if="menuTimeA1" v-model="timeA1" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTimeA1 = false">Annulla</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA1.save(timeA1)">OK</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA1.save('')">Azzera</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs6 sm2 lg2>
              <v-dialog ref="menuTimeA2" v-model="menuTimeA2" :return-value.sync="timeA2" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="timeA2" label="Fine" readonly v-on="on"></v-text-field>
                </template>
                <v-time-picker format="24hr" v-if="menuTimeA2" v-model="timeA2" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTimeA2 = false">Annulla</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA2.save(timeA2)">OK</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA2.save('')">Azzera</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs6 sm3 lg3>
              <v-dialog ref="menuTimeA3" v-model="menuTimeA3" :return-value.sync="timeA3" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="timeA3" label="Inizio" prepend-icon="local_dining" readonly v-on="on"></v-text-field>
                </template>
                <v-time-picker format="24hr" v-if="menuTimeA3" v-model="timeA3" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTimeA3 = false">Annulla</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA3.save(timeA3)">OK</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA3.save('')">Azzera</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs6 sm2 lg2>
              <v-dialog ref="menuTimeA4" v-model="menuTimeA4" :return-value.sync="timeA4" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="timeA4" label="Fine" readonly v-on="on"></v-text-field>
                </template>
                <v-time-picker format="24hr" v-if="menuTimeA4" v-model="timeA4" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTimeA4 = false">Annulla</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA4.save(timeA4)">OK</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeA4.save('')">Azzera</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs12 sm2 lg2>
              <v-dialog ref="menuTimeTot" v-model="menuTimeTot" :return-value.sync="tempo" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="tempo" label="Totale" v-on="on" append-icon="cancel" @click:append="clearTempi()"></v-text-field>
                </template>
                <v-time-picker format="24hr" v-if="menuTimeTot" v-model="tempo" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTimeTot = false">Annulla</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeTot.save(tempo)">OK</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeTot.save('')">Azzera</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
          </template>
          <!-- *** DETTAGLIO *** -->
          <v-flex xs12>
            <v-subheader class="subtitle">Dettaglio</v-subheader>
          </v-flex>  
          <v-flex xs12 md6 lg3>
            <v-text-field :value="this.nrRapportino" v-if="this.nrRapportino" 
              label="Nr. Rapportino" readonly>
            </v-text-field>
          </v-flex>
          <v-flex xs12 md6 lg3 v-if="this.mostrareCausali">
            <v-select :items="causali" v-model="causale" label="Causale" >
              <!-- :readonly="this.$store.getters.isNewMov ? false : true" -->
              </v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg3 v-if="this.mostrareCdL">
            <!-- <v-select :items="filteredElencoCdL" item-value="codice" :item-text="(cdl) => cdl.codice + ' - ' + cdl.descrizione" v-model="cdl" label="CdL"
              append-icon="search" @click:append="showDialogCdL()"
              :readonly="this.$store.getters.isNewMov ? false : true"></v-select> -->
            <v-text-field v-model="cdl" label="CdL" append-icon="search" @click:append="showDialogCdL()" @click="showDialogCdL()"> 
            </v-text-field>
          </v-flex>
          <!--
          <v-flex xs12 sm6  md6 lg3>
            <v-select :items="elencoCdc" v-model="cdc" label="CdC"
              :readonly="this.$store.getters.isNewMov ? false : true"></v-select>
          </v-flex>
          -->
        </v-layout>  
      </v-container>
    </v-form>
    <!-- LISTA RICERCA COMMESSE DIALOG -->
    <v-layout row justify-center>
      <ricerca-commessa :visible="this.commessaSearchDialog" @onClose="closeDialogSearchCommesse" @onItemsFound="commesseFound"></ricerca-commessa>
    </v-layout>
    <!-- COMMESSA FILTER DIALOG -->
    <v-layout row justify-center>
      <filtered-dialog :visible="this.listaCommesseDialog" :items="this.listaCommesseCercate" 
        title="Commessa" @onClose="closeDialogCommesse" @onItemSelected="chooseCommessa"></filtered-dialog>
    </v-layout>
    <!-- LISTA CDL DIALOG -->
    <v-layout row justify-center>
      <filtered-dialog :visible="this.listaCdLDialog" :items="this.elencoCdL" 
        title="CdL" @onClose="closeDialogCdL" @onItemSelected="chooseCdL"></filtered-dialog>
    </v-layout>
    <!-- RICERCA POSIZIONI DIALOG -->
    <v-layout row justify-center>
      <ricerca-posizione :visible="this.posizioneSearchDialog" :commessa="commessa" @onClose="closeDialogSearchPosizione" @onItemsFound="posizioneFound"></ricerca-posizione>
    </v-layout>
    <!-- POSIZIONI FILTER DIALOG -->
    <v-layout row justify-center>
      <filtered-dialog :visible="this.listaPosizioniDialog" :items="this.listaPosizioniCercate" 
        title="Posizioni" @onClose="closeDialogPosizioni" @onItemSelected="choosePosizione"></filtered-dialog>
    </v-layout>
  </div> 
</template>

<script>
import moment from "moment";
import axios from "axios";
import utilities from "../../utilitiesMixin.js";

import FilteredDialog from "../FilteredDialog";
import RicercaCommessa from "./RicercaCommessa";
import RicercaPosizione from "./RicercaPosizione";

const campoObbligatorio = "Campo obbligatorio";

export default {
  mounted() {
    // Register siblings events
    this.$root.$on("saveMovimento", data => {
      this.saveMovimento(data);
    });
    this.$root.$on("setNrRapportino", data => {
      this.setNrRapportino(data);
    });
    if (this.$store.getters.isNewMov) return;
    this.fetchMovimento();
  },
  props: {
    definitivo: {
      default: false
    }
  },
  components: {
    FilteredDialog,
    RicercaCommessa,
    RicercaPosizione
  },
  data: () => ({
    commessaRules: [
      v => !!v || campoObbligatorio,
      v => v.length <= 8 || "commessa dev'essere < 8 caratteri"
    ],
    tempoRules: [v => !!v || "Tempo"],
    // notaRules: [v => !!v || campoObbligatorio], NO MORE REQUIRED
    posizioneRules: [v => !isNaN(v) || "posizione deve contenere numeri"],
    buonoRules: [v => !isNaN(v) || "buono non valido"],
    commessaSearchDialog: false,
    posizioneSearchDialog: false,
    listaCommesseDialog: false,
    listaCommesseCercate: [],
    listaPosizioniDialog: false,
    listaPosizioniCercate: [],
    listaCdLDialog: false,
    filterCdLText: "",
    menuDate: false,
    menuTimeA1: false,
    menuTimeA2: false,
    menuTimeA3: false,
    menuTimeA4: false,
    menuTimeTot: false
  }),
  computed: {
    isNewMov() {
      return this.$store.getters.isNewMov;
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    totTimeA() {
      // if (!this.$store.getters.getTimeA1 && this.$store.getters.getTempo)
      //  return this.$store.getters.getTempo
      const value = this.calcTotTime();
      this.$store.commit("setTempo", Number(value));
      return value;
    },
    timeA1: {
      get() {
        return this.$store.getters.getTimeA1;
      },
      set(value) {
        //console.log(this.calcTotTime(false))
        const tot = this.calcTotTime();
        if (tot) {
          this.tempo = tot;
        }
        this.$store.commit("setTimeA1", value);
      }
    },
    timeA2: {
      get() {
        return this.$store.getters.getTimeA2;
      },
      set(value) {
        const tot = this.calcTotTime();
        if (tot) {
          this.tempo = tot;
        }
        this.$store.commit("setTimeA2", value);
      }
    },
    timeA3: {
      get() {
        return this.$store.getters.getTimeA3;
      },
      set(value) {
        const tot = this.calcTotTime();
        if (tot) {
          this.tempo = tot;
        }
        this.$store.commit("setTimeA3", value);
      }
    },
    timeA4: {
      get() {
        return this.$store.getters.getTimeA4;
      },
      set(value) {
        const tot = this.calcTotTime();
        if (tot) {
          this.tempo = tot;
        }
        this.$store.commit("setTimeA4", value);
      }
    },
    tempo: {
      get() {
        const oremin = this.$store.getters.getTempo;
        if (oremin) {
          const t = moment(oremin, "HH.mm");
          return t.format("HH:mm");
        } else {
          return "";
        }
      },
      set(value) {
        console.log("TEMPO TOT: " + value);
        const t = moment(value, "HH:mm").format("HH.mm");
        this.$store.commit("setTempo", Nu+mber(t));
      }
    },
    commessa: {
      get() {
        let commessa = this.$store.getters.getCommessa;
        if (commessa) commessa = commessa.toUpperCase();
        return commessa;
      },
      set(value) {
        if (value) value = value.toUpperCase();
        this.$store.commit("setCommessa", value);
      }
    },
    date: {
      get() {
        return this.$store.getters.getData;
      },
      set(value) {
        this.$store.commit("setData", value);
      }
    },
    nota: {
      get() {
        return this.$store.getters.getNota;
      },
      set(value) {
        this.$store.commit("setNota", value);
      }
    },
    causale: {
      get() {
        return this.$store.getters.getCausale;
      },
      set(value) {
        this.$store.commit("setCausale", value);
      }
    },
    cdl: {
      get() {
        return this.$store.getters.getCdl;
      },
      set(value) {
        this.$store.commit("setCdl", value);
      }
    },
    /*
    cdc: {
      get() {
        return this.$store.getters.getCdc
      },
      set(value) {
        this.$store.commit('setCdc', value)
      }
    }, */
    buono: {
      get() {
        return this.$store.getters.getBuono;
      },
      set(value) {
        this.$store.commit("setBuono", value);
      }
    },
    causali() {
      const causali = this.$store.getters.getCausali;
      let elencoCausali = [""];
      causali.forEach(causale => {
        elencoCausali.push(causale.codice + " - " + causale.descrizione);
      });
      return elencoCausali;
    },
    elencoCdL() {
      return this.$store.getters.getElencoCdl;
    } /*
    elencoCdc() {
      const cdc = this.$store.getters.getElencoCdc
      let elencoCdc = [""]
      cdc.forEach(centro => {
        elencoCdc.push(centro.codice + " - " + centro.descrizione)
      })
      return elencoCdc
    }, */,
    posizione: {
      get() {
        return this.$store.getters.getPosizione;
      },
      set(value) {
        this.$store.commit("setPosizione", value);
      }
    },
    opzioni() {
      return this.$store.getters.getOpzioni;
    },
    gestioneOrariGiornata() {
      return false;
      // return this.opzioni.gestioneOrariGiornata ? this.opzioni.gestioneOrariGiornata : false
    },
    gestioneOrariMovimento() {
      return this.opzioni.gestioneOrariMovimento
        ? this.opzioni.gestioneOrariMovimento
        : false;
    },
    mostrareCausali() {
      return this.opzioni.causali ? this.opzioni.causali : false;
    },
    mostrareCdL() {
      return this.opzioni.cdL ? this.opzioni.cdL : false;
    },
    mostrareBuono() {
      if (this.$store.getters.getSiglaDitta === "MF") return true;
      else return this.opzioni.callbackPosizione ? this.opzioni.callbackPosizione : false;
    },
    mostrarePosizione() {
      return this.opzioni.ricercaPosizione ? this.opzioni.ricercaPosizione : false;
    },
    nrRapportino() {
      return this.$store.getters.getNrRapportino;
    }
  },
  mixins: [utilities],
  methods: {
    fetchMovimento() {
      this.$store.dispatch("showWaitDialog");
      let pre = "/movimento/lavorazione/singolo/";
      if (!this.definitivo) pre = pre + "parcheggio/";
      const path =
        pre + this.$store.getters.getDipendente + "/" + this.$route.params.id;
      axios
        .get(path)
        .then(res => {
          // eslint-disable-next-line
          console.log(res);
          // fix causale description
          if (res.data && res.data.causale) {
            const causali = this.$store.getters.getCausali;
            causali.forEach(causale => {
              if (res.data.causale == causale.codice)
                res.data.causale =
                  res.data.causale + " - " + causale.descrizione;
            });
          }
          //__ tempo h.cent -> h.min
          //state.movimento.tempo = movimento.tempo
          this.$store.commit("setMovimento", res.data);
          this.$store.dispatch("hideWaitDialog");
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.$store.dispatch("handleError", error.response.data);
        });
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
    },
    allowedDates: val => val <= new Date().toISOString().substr(0, 10),
    allowedStep: m => m % 5 === 0,
    showDialogSearchCommessa() {
      //if (!this.$store.getters.isNewMov) return;
      this.commessaSearchDialog = true;
    },
    showDialogSearchPosizione() {
      //if (!this.$store.getters.isNewMov) return;
      //this.posizioneSearchDialog = true;
      this.cercaPosizioneRPC(); //saltiamo i filtri
    },
    showListaCommesseDialog() {
      //if (!this.$store.getters.isNewMov) return;
      this.listaCommesseDialog = true;
    },
    showListaPosizioniDialog() {
      //if (!this.$store.getters.isNewMov) return;
      this.listaPosizioniDialog = true;
    },
    showDialogCdL() {
      //if (!this.$store.getters.isNewMov) return;
      this.listaCdLDialog = true;
    },
    closeDialogCdL() {
      this.listaCdLDialog = false;
    },
    closeDialogCommesse() {
      this.listaCommesseDialog = false;
    },
    closeDialogSearchCommesse() {
      this.commessaSearchDialog = false;
    },
    closeDialogSearchPosizione() {
      this.posizioneSearchDialog = false;
    },
    closeDialogPosizioni() {
      this.listaPosizioniDialog = false;
    },
    chooseCdL(cdl) {
      this.cdl = cdl.codice + " - " + cdl.descrizione;
      this.closeDialogCdL();
    },
    chooseCommessa(commessa) {
      this.$store.commit("setCommessa", commessa.codice);
      this.listaCommesseDialog = false;
    },
    commesseFound(listaCommesse) {
      this.listaCommesseCercate = listaCommesse;
      this.showListaCommesseDialog();
    },
    choosePosizione(posizione) {
      this.$store.commit("setPosizione", posizione.codice);
      this.listaPosizioniDialog = false;
    },
    posizioneFound(listaPosizioni) {
      this.listaPosizioniCercate = listaPosizioni;
      this.showListaPosizioniDialog();
    },
    calcTotTime() {
      const times = [
        this.$store.getters.getTimeA1,
        this.$store.getters.getTimeA2,
        this.$store.getters.getTimeA3,
        this.$store.getters.getTimeA4
      ];
      const t1 = moment(this.getTimeFromInteger(times[0]), "HH:mm");
      const t2 = moment(this.getTimeFromInteger(times[1]), "HH:mm");
      const mattino = t2.diff(t1);
      //console.log("calcTotTime:mattino => ", t1,t2, mattino);
      const t3 = moment(this.getTimeFromInteger(times[2]), "HH:mm");
      const t4 = moment(this.getTimeFromInteger(times[3]), "HH:mm");
      const pomeriggio = t4.diff(t3);
      //console.log("calcTotTime:pomeriggio => ", t3, t4, pomeriggio);
      let totale = moment(mattino).add(pomeriggio);
      totale = totale - 3600000; // Non so perché moment calcola un'ora in più. Comunque la tolgo.
      //console.log("calcTotTime => ", totale);
      if (!isNaN(totale)) return moment(totale).format("HH:mm");
    },
    saveMovimento(numeroMovimento) {
      if (!this.$refs.form) return;
      if (this.$refs.form.validate()) {
        this.$store.dispatch("showWaitDialog");
        // save movement
        const data = moment(
          this.$store.getters.getData,
          "YYYY-MM-DD"
        ).valueOf();
        const oraInizioAttMattino = this.$store.getters.getTimeA1
          ? this.$store.getters.getTimeA1.replace(":", "")
          : this.$store.getters.getTimeA1;
        const oraFineAttMattino = this.$store.getters.getTimeA2
          ? this.$store.getters.getTimeA2.replace(":", "")
          : this.$store.getters.getTimeA2;
        const oraInizioAttPomeriggio = this.$store.getters.getTimeA3
          ? this.$store.getters.getTimeA3.replace(":", "")
          : this.$store.getters.getTimeA3;
        const oraFineAttPomeriggio = this.$store.getters.getTimeA4
          ? this.$store.getters.getTimeA4.replace(":", "")
          : this.$store.getters.getTimeA4;
        const cau = this.$store.getters.getCausale;
        const causale = cau ? cau.substr(0, cau.indexOf("-")).trim() : cau;
        const cl = this.$store.getters.getCdl;
        const cdl = cl ? cl.substr(0, cl.indexOf("-")).trim() : cl;
        // const cc = this.$store.getters.getCdc
        // const cdc = cc ? (cc.substr(0, cc.indexOf('-'))).trim() : cc
        const orari = {
          oraInizioAttMattino,
          oraFineAttMattino,
          oraInizioAttPomeriggio,
          oraFineAttPomeriggio
        };
        axios
          .post("/movimento/lavorazione/" + this.$store.getters.getDipendente, {
            numeroMovimento,
            commessa: this.$store.getters.getCommessa,
            nota: this.$store.getters.getNota,
            causale,
            cdl,
            // cdc,
            data,
            posizione: this.$store.getters.getPosizione,
            buono: this.$store.getters.getBuono,
            tempo: this.$store.getters.getTempo,
            orari,
            notaSpese: this.$store.getters.getNotaSpese,
            notaLista: this.$store.getters.getNotaLista,
            keyRdARapportino: this.$store.getters.getNrRapportino
          })
          .then(res => {
            // eslint-disable-next-line
            console.log(res);
            // Update lista mov
            const newDatabean = res.data;
            this.$store.dispatch("addNewDataBean", newDatabean);
            // manipolo l'history per evitare che il back faccia tornare su "nuovo movimento"
            // Non va bene così. Ho poi problemi di path nelle routes
            // history.replaceState({}, "movimenti", "movimenti")
            if (!numeroMovimento) {
              // se è un'aggiunta prendo l'ultimo numero movimento (non definitivo)
              //numeroMovimento = newDatabean.movimenti[newDatabean.movimenti.length - 1].numeroMovimento;
                  var j = newDatabean.movimenti.length - 1;
                  while (j >= 0) {
                    if (!newDatabean.movimenti[j].definitivo) {
                      numeroMovimento = newDatabean.movimenti[j].numeroMovimento;
                      break;
                    }
                    j--;
                  }
            }
            this.$store.dispatch("hideWaitDialog");
            this.$router.push({
              name: "movimento",
              params: {
                id: numeroMovimento
              }
            });
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error);
            this.$store.dispatch("handleError", error.response.data);
          });
      }
    },
    setNrRapportino(payload) {
      this.$store.dispatch("setNrRapportino", {
        dataMovimento: this.$store.getters.getData,
        numeroMovimento: payload.numeroMovimento,
        nrRapportino: payload.numeroRapportino
      });
      // TODO understand how to avoid this
      // I was forced to reload the data otherwise the nrRapportino input field does not update
      this.fetchMovimento();
    },
    checkBuono() {
      if (!this.$store.getters.isNewMov || !this.buono) return;
      this.$store.dispatch("showWaitDialog");
      axios
        .get("/distinta/tecnica/nodo/buono/" + this.buono)
        .then(res => {
          // eslint-disable-next-line
          console.log(res);
          this.$store.dispatch("hideWaitDialog");
          this.$store.commit("setCommessa", res.data.codiceCommessa);
          this.$store.commit("setPosizione", res.data.posizione);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.$store.dispatch("hideWaitDialog");
          this.buono = this.buono + " !";
        });
    },
    cercaPosizioneRPC() {
      this.$store.dispatch("showWaitDialog");
      axios
        .get("/commessa/posizioni", {
          params: {
            //codiceArticolo: this.codiceArticolo,
            //descrizioneArticolo: this.descrizioneArticolo,
            commessa: this.commessa,
            soloPrimiLivelli: this.$store.getters.getOpzioni.soloPrimiLivelli
          }
        })
        .then(res => {
          // eslint-disable-next-line
          console.log(res);
          this.$store.dispatch("hideWaitDialog");
          //this.$emit("onItemsFound", res.data);
          this.posizioneFound(res.data);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.$store.dispatch("handleError", error.response.data);
        });      
    },
    clearTempi() {
      this.timeA1 = '';
      this.timeA2 = '';
      this.timeA3 = '';
      this.timeA4 = '';
      //this.calcTotTime();
      this.totTimeA;
      //this.$refs.menuTimeA1.save('');
    }
  }
};
</script>

<style>
.subtitle {
  height: 10px;
}
/* .v-text-field input[readonly="readonly"] { */
.myreadonly {
    /*  brutto, va trovato qualcosa di meglio
    background-color: lightgrey 
    */
}
</style>