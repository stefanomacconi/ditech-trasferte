<template>
  <div>
    <v-form ref="form">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs6 md6 lg6>
            <!-- *** DATA, COMMESSA e NOTA *** -->
            <v-menu ref="menuDate" :close-on-content-click="true" v-model="menuDate" :nudge-right="40" 
              lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
              <v-text-field slot="activator" v-model="computedDateFormatted" label="Data Movimento" 
                prepend-icon="event" @blur="date = parseDate(computedDateFormatted)" required>
              </v-text-field>
              <v-date-picker v-model="date" :allowed-dates="allowedDates" no-title locale="it-IT"
                :readonly="this.$store.getters.isNewMov ? false : true">
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6 md6 lg6>
            <!-- TODO Autocomplete -->
            <v-text-field v-model="commessa" :rules="commessaRules" :counter="8" 
              label="Commessa" append-icon="search" @click:append="showDialogCommessa()" required 
              @click="showDialogCommessa()" readonly> <!-- :readonly="this.$store.getters.isNewMov ? false : true" -->
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-textarea rows="3" v-model="nota" prepend-icon="notes" label="Nota" 
              :rules="this.notaRules" required>
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
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs12 sm2 lg2>
              <v-dialog ref="menuTimeTot" v-model="menuTimeTot" :return-value.sync="tempo" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="tempo" label="Totale" readonly v-on="on"></v-text-field>
                </template>
                <v-time-picker format="24hr" v-if="menuTimeTot" v-model="tempo" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTimeTot = false">Annulla</v-btn>
                  <v-btn flat color="primary" @click="$refs.menuTimeTot.save(tempo)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
          </template>
          <!-- *** GIORNATA *** 
          <template v-if="this.gestioneOrariGiornata">
            <v-flex xs12>
              <v-subheader class="subtitle">Giornata</v-subheader>
            </v-flex>  
            <v-flex xs6 sm3 lg3>
              <v-menu ref="menuTimeG1" :close-on-content-click="false" v-model="menuTimeG1" :nudge-right="40"
                :return-value.sync="timeG1" lazy transition="scale-transition" offset-y full-width
                max-width="290px" min-width="290px">
                <v-text-field slot="activator" v-model="timeG1" label="Inizio" prepend-icon="wb_sunny" readonly>
                </v-text-field>
                <v-time-picker no-title format="24hr" :allowed-minutes="allowedStep" 
                  v-if="menuTimeG1" v-model="timeG1" 
                  full-width @change="$refs.menuTimeG1.save(timeG1)">
                </v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6 sm2 lg2>
              <v-menu ref="menuTimeG2" :close-on-content-click="false" v-model="menuTimeG2" :nudge-right="40"
                :return-value.sync="timeG2" lazy transition="scale-transition" offset-y full-width
                max-width="290px" min-width="290px">
                <v-text-field slot="activator" v-model="timeG2" label="Fine" readonly>
                </v-text-field>
                <v-time-picker no-title format="24hr" :allowed-minutes="allowedStep" 
                  v-if="menuTimeG2" v-model="timeG2" 
                  full-width @change="$refs.menuTimeG2.save(timeG2)">
                </v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6 sm3 lg3>
              <v-menu ref="menuTimeG3" :close-on-content-click="false" v-model="menuTimeG3" :nudge-right="40"
                :return-value.sync="timeG3" lazy transition="scale-transition" offset-y full-width
                max-width="290px" min-width="290px">
                <v-text-field slot="activator" v-model="timeG3" label="Inizio" prepend-icon="wb_cloudy" readonly>
                </v-text-field>
                <v-time-picker no-title format="24hr" :allowed-minutes="allowedStep" 
                  v-if="menuTimeG3" v-model="timeG3" 
                  full-width @change="$refs.menuTimeG3.save(timeG3)">
                </v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6 sm2 lg2>
              <v-menu ref="menuTimeG4" :close-on-content-click="false" v-model="menuTimeG4" :nudge-right="40"
                :return-value.sync="timeG4" lazy transition="scale-transition" offset-y full-width
                max-width="290px" min-width="290px">
                <v-text-field slot="activator" v-model="timeG4" label="Fine" readonly>
                </v-text-field>
                <v-time-picker no-title format="24hr" :allowed-minutes="allowedStep" 
                  v-if="menuTimeG4" v-model="timeG4" 
                  full-width @change="$refs.menuTimeG4.save(timeG4)">
                </v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm2 lg2>
              <v-text-field :value="totTimeG" label="Totale" hint="Tempo" single-line readonly 
                prepend-icon="trip_origin"/>
            </v-flex>
          </template> -->
          <!-- *** DETTAGLIO *** -->
          <v-flex xs12>
            <v-subheader class="subtitle">Dettaglio</v-subheader>
          </v-flex>  
          <v-flex xs12 md6 lg3>
            <v-text-field :value="this.nrRapportino" v-if="this.nrRapportino" 
              label="Nr. Rapportino" readonly>
            </v-text-field>
          </v-flex>
          <v-flex xs12 md6 lg3 v-if="this.mostrareBuono">
            <v-text-field v-model="buono" :rules="this.buonoRules" label="Buono"
              @blur="checkBuono"
              :readonly="this.$store.getters.isNewMov ? false : true"></v-text-field>
          </v-flex>
          <v-flex xs12 md6 lg3 v-if="this.mostrareBuono"> <!-- TODO farlo staccato dal buono e con ricerca a parte -->
            <v-text-field v-model="posizione" :rules="this.posizioneRules" label="Posizione"
              readonly></v-text-field> <!-- :readonly="this.$store.getters.isNewMov ? false : true" -->
          </v-flex>
          <v-flex xs12 md6 lg3 v-if="this.mostrareCausali">
            <v-select :items="causali" v-model="causale" label="Causale" 
              :readonly="this.$store.getters.isNewMov ? false : true"></v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg3 v-if="this.mostrareCdL">
            <!-- <v-select :items="filteredElencoCdL" item-value="codice" :item-text="(cdl) => cdl.codice + ' - ' + cdl.descrizione" v-model="cdl" label="CdL"
              append-icon="search" @click:append="showDialogCdL()"
              :readonly="this.$store.getters.isNewMov ? false : true"></v-select> -->
            <v-text-field v-model="cdl" label="CdL" append-icon="search" @click:append="showDialogCdL()" @click="showDialogCdL()" readonly> 
              <!-- :readonly="this.$store.getters.isNewMov ? false : true" -->
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
    <!-- COMMESSA FILTER DIALOG --> 
      <v-layout row justify-center>
      <v-dialog v-model="commessaFilterDialog" fullscreen hide-overlay 
        transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="commessaFilterDialog = false">
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
    </v-layout>
    <!-- LISTA RICERCA COMMESSE DIALOG -->
    <v-layout row justify-center>
      <v-dialog v-model="listaCommesseDialog" fullscreen hide-overlay 
        transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="listaCommesseDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Scelta Commessa</v-toolbar-title>
            <v-toolbar-title v-if="listaCommesseCercate.length > 29" slot="extension" 
                class="red--text text--lighten-3">
              <small>* Risultato Incompleto</small>
            </v-toolbar-title>
            <v-toolbar-title v-if="listaCommesseCercate.length == 0" slot="extension" 
              class="red--text text--lighten-3">
              <small>* Nessuna Commessa Trovata</small>
            </v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <v-list two-line>
              <template v-for="(commessa, index) in listaCommesseCercate">
                <v-list-tile :key="commessa.codice" avatar ripple @click="chooseCommessa(commessa.codice)">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <b>{{ commessa.codice }}</b>
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary">
                      {{ commessa.ragioneSociale }}
                    </v-list-tile-sub-title>
                    <v-list-tile-sub-title>
                      {{ commessa.descrizione }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-list-tile-action-text>
                      &nbsp;&nbsp;
                      {{ moment(commessa.data).locale('it').format('DD/MM/YYYY').toUpperCase() }}
                    </v-list-tile-action-text>
                    <v-icon>
                      keyboard_return
                    </v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider v-if="index + 1 < listaCommesseCercate.length" :key="index"></v-divider>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- LISTA CDL DIALOG -->
    <v-layout row justify-center>
      <filtered-dialog :visible="this.listaCdLDialog" :items="this.elencoCdL" 
        title="CdL" @onClose="closeDialogCdL" @onItemSelected="chooseCdL"></filtered-dialog>
    </v-layout>
    <!-- ATTENDERE DIALOG -->
    <div class="text-xs-center">
      <v-dialog v-model="attendereDialog" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Attendere...
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div> 
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import utilities from "../../utilitiesMixin.js"
// import DurataInOre from "../../utils/DurataInOre.js"

import FilteredDialog from "../FilteredDialog"

const campoObbligatorio = "Campo obbligatorio"

export default {
  mounted() {
    // Register siblings events
    this.$root.$on('saveMovimento', data => {
      this.saveMovimento(data)
    })
    this.$root.$on('setNrRapportino', data => {
      this.setNrRapportino(data)
    })
    if (this.$store.getters.isNewMov)
      return
    this.fetchMovimento()
  },
  props: {
    definitivo: {
      default: false
    }
  },
  components: {
    FilteredDialog
  }, 
  data: () => ({
    commessaRules: [
      v => !!v || campoObbligatorio,
      v => v.length <= 8 || "commessa dev'essere < 8 caratteri"
    ],
    tempoRules: [
      v => !!v || "Tempo"
    ],
    notaRules: [
      v => !!v || campoObbligatorio
    ],
    posizioneRules: [
      v => !isNaN(v) || 'posizione deve contenere numeri'
    ],
    buonoRules: [
      v => !isNaN(v) || 'buono non valido'
    ],
    commessaFilterDialog: false,
    codicePerCommessa: "",
    descrizionePerCommessa: "",
    RagioneSocialePerCommessa: "",
    statoPerCommessa: "Aperte",
    attendereDialog: false,
    listaCommesseCercate: [],
    listaCommesseDialog: false,
    listaCdLDialog: false,
    filterCdLText: "",
    menuDate: false,
    menuTimeG1: false,
    menuTimeG2: false,
    menuTimeG3: false,
    menuTimeG4: false,
    menuTimeA1: false,
    menuTimeA2: false,
    menuTimeA3: false,
    menuTimeA4: false,
    menuTimeTot: false
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
    totTimeG() {
      return this.calcTotTime(true)
    },
    totTimeA() {
      // if (!this.$store.getters.getTimeA1 && this.$store.getters.getTempo)
      //  return this.$store.getters.getTempo
      const value = this.calcTotTime(false)
      this.$store.commit('setTempo', Number(value))
      return value 
    },
    timeA1: {
      get() {
        return this.$store.getters.getTimeA1
      },
      set(value) {
        //console.log(this.calcTotTime(false))
        const tot = this.calcTotTime(false)
        if (tot) {
          this.tempo = tot
        }
        this.$store.commit('setTimeA1', value)
      }
    },
    timeA2: {
      get() {
        return this.$store.getters.getTimeA2
      },
      set(value) {
        const tot = this.calcTotTime(false)
        if (tot) {
          this.tempo = tot
        }
        this.$store.commit('setTimeA2', value)
      }
    },
    timeA3: {
      get() {
        return this.$store.getters.getTimeA3
      },
      set(value) {
        const tot = this.calcTotTime(false)
        if (tot) {
          this.tempo = tot
        }        
        this.$store.commit('setTimeA3', value)
      }
    },
    timeA4: {
      get() {
        return this.$store.getters.getTimeA4
      },
      set(value) {
        const tot = this.calcTotTime(false)
        if (tot) {
          this.tempo = tot
        }        
        this.$store.commit('setTimeA4', value)
      }
    },
    tempo: {
      get() {
        var oremin = this.$store.getters.getTempo
        if (oremin) {
          var t = moment(oremin, "HH.mm")
          return t.format("HH:mm")
        } else {
          return ""
        }
      },
      set(value) {
        var t = moment(value, "HH:mm").format("HH.mm");
        this.$store.commit('setTempo', Number(t));
      }
    },    
    timeG1: {
      get() {
        return this.$store.getters.getTimeG1
      },
      set(value) {
        this.$store.commit('setTimeG1', value)
      }
    },
    timeG2: {
      get() {
        return this.$store.getters.getTimeG2
      },
      set(value) {
        this.$store.commit('setTimeG2', value)
      }
    },
    timeG3: {
      get() {
        return this.$store.getters.getTimeG3
      },
      set(value) {
        this.$store.commit('setTimeG3', value)
      }
    },
    timeG4: {
      get() {
        return this.$store.getters.getTimeG4
      },
      set(value) {
        this.$store.commit('setTimeG4', value)
      }
    },
    commessa: {
      get() {
        var commessa = this.$store.getters.getCommessa
        if (commessa)
          commessa = commessa.toUpperCase()
        return commessa
      },
      set(value) {
        if (value)
          value = value.toUpperCase()
        this.$store.commit('setCommessa', value)
      }
    },
    date: {
      get() {
        return this.$store.getters.getData
      },
      set(value) {
        this.$store.commit('setData', value)
      }
    },
    nota: {
      get() {
        return this.$store.getters.getNota
      },
      set(value) {
        this.$store.commit('setNota', value)
      }
    },
    causale: {
      get() {
        return this.$store.getters.getCausale
      },
      set(value) {
        this.$store.commit('setCausale', value)
      }
    },
    cdl: {
      get() {
        return this.$store.getters.getCdl
      },
      set(value) {
        this.$store.commit('setCdl', value)
      }
    },
    cdc: {
      get() {
        return this.$store.getters.getCdc
      },
      set(value) {
        this.$store.commit('setCdc', value)
      }
    },
    buono: {
      get() {
        return this.$store.getters.getBuono
      },
      set(value) {
        this.$store.commit('setBuono', value)
      }
    },
    causali() {
      const causali = this.$store.getters.getCausali
      var elencoCausali = [""]
      causali.forEach(causale => {
        elencoCausali.push(causale.codice + " - " + causale.descrizione)
      })
      return elencoCausali
    },
    elencoCdL() {
      return this.$store.getters.getElencoCdl
    },
    elencoCdc() {
      const cdc = this.$store.getters.getElencoCdc
      var elencoCdc = [""]
      cdc.forEach(centro => {
        elencoCdc.push(centro.codice + " - " + centro.descrizione)
      })
      return elencoCdc
    },
    posizione: {
      get () {
        return this.$store.getters.getPosizione
      },
      set (value) {
        this.$store.commit('setPosizione', value)
      }
    },
    opzioni() {
      return this.$store.getters.getOpzioni
    },
    gestioneOrariGiornata() {
      return this.opzioni.gestioneOrariGiornata ? this.opzioni.gestioneOrariGiornata : false           
    },
    gestioneOrariMovimento() {
      return this.opzioni.gestioneOrariMovimento ? this.opzioni.gestioneOrariMovimento : false           
    },
    mostrareCausali() {
      return this.opzioni.causali ? this.opzioni.causali : false           
    },
    mostrareCdL() {
      return this.opzioni.cdL ? this.opzioni.cdL : false           
    },
    mostrareBuono() {
      if (this.$store.getters.getSiglaDitta === 'MF')
        return true
      return this.opzioni.callbackPosizione ? this.opzioni.callbackPosizione : false           
    },
    nrRapportino() {
      return this.$store.getters.getNrRapportino
    }
  },
  mixins: [utilities],
  methods: {
    fetchMovimento() {
      this.attendereDialog = true
      var pre = '/movimento/lavorazione/singolo/'
      if (!this.definitivo)
        pre = pre + 'parcheggio/'
      const path = pre + this.$store.getters.getDipendente + "/"
        + this.$route.params.id
      axios.get(path)
      .then(res => {
          // eslint-disable-next-line
          console.log(res)
          // fix causale description
          if (res.data && res.data.causale) {
            const causali = this.$store.getters.getCausali
            causali.forEach(causale => {
              if (res.data.causale == causale.codice)
                res.data.causale = res.data.causale + " - " + causale.descrizione
            })
          } 
          //__ tempo h.cent -> h.min
          //state.movimento.tempo = movimento.tempo
          this.$store.commit('setMovimento', res.data)
          this.attendereDialog = false
      }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          this.$store.dispatch('handleError', error.response.data)
      })
    },
    formatDate(date) {
      if (!date) 
        return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate(date) {
      if (!date) 
        return null
      const [month, day, year] = date.split('/')
      return `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')}`
    },
    allowedDates: val => val <= new Date().toISOString().substr(0, 10),
    allowedStep: m => m % 5 === 0,
    showDialogCommessa() {
      if (!this.$store.getters.isNewMov)
        return
      this.commessaFilterDialog = true
    },
    showDialogCdL() {
      if (!this.$store.getters.isNewMov)
        return
      this.listaCdLDialog = true
    },
    closeDialogCdL() {
      this.listaCdLDialog = false
    },
    chooseCdL(cdl) {
      this.cdl = cdl.codice + " - " + cdl.descrizione
      this.closeDialogCdL()
    },
    searchCommessa() {
      this.commessaFilterDialog = false
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
        this.listaCommesseCercate = res.data
        this.listaCommesseDialog = true
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    },
    chooseCommessa(codice) {
      this.$store.commit('setCommessa', codice)
      this.listaCommesseDialog = false
    },
    calcTotTime(giornata) {
      var times
      if (giornata) {
        times = [
          this.$store.getters.getTimeG1,
          this.$store.getters.getTimeG2,
          this.$store.getters.getTimeG3,
          this.$store.getters.getTimeG4
        ]
      } else {
        times = [
          this.$store.getters.getTimeA1,
          this.$store.getters.getTimeA2,
          this.$store.getters.getTimeA3,
          this.$store.getters.getTimeA4
        ]
      }
      var t1 = moment(this.getTimeFromInteger(times[0]), "HH:mm")
      var t2 = moment(this.getTimeFromInteger(times[1]), "HH:mm")
      var mattino = t2.diff(t1)
      var t3 = moment(this.getTimeFromInteger(times[2]), "HH:mm")
      var t4 = moment(this.getTimeFromInteger(times[3]), "HH:mm")
      var pomeriggio = t4.diff(t3)
      var totale = moment(mattino).add(pomeriggio)
      totale = totale - 3600000 // Non so perché moment calcola un'ora in più. Comunque la tolgo.
      // console.log("calcTotTime => ", totale);
      if (!isNaN(totale))
        var x = moment(totale).format("HH:mm")
        // console.log("calcTotTime - formatted => ", x);
        return x
    },
    clearFilterSearchCommessa() {
      this.codicePerCommessa = ""
      this.descrizionePerCommessa = ""
      this.RagioneSocialePerCommessa = ""
      this.statoPerCommessa = "Aperte"
    },
    saveMovimento(numeroMovimento) {
      if (!this.$refs.form)
        return
      if (this.$refs.form.validate()) {
        this.attendereDialog = true
        // save movement
        const data = moment(this.$store.getters.getData, "YYYY-MM-DD").valueOf()
        const oraInizioMattino = this.$store.getters.getTimeG1 ? this.$store.getters.getTimeG1.replace(":", "") : this.$store.getters.getTimeG1
        const oraFineMattino = this.$store.getters.getTimeG2 ? this.$store.getters.getTimeG2.replace(":", "") : this.$store.getters.getTimeG2
        const oraInizioPomeriggio = this.$store.getters.getTimeG3 ? this.$store.getters.getTimeG3.replace(":", "") : this.$store.getters.getTimeG3
        const oraFinePomeriggio = this.$store.getters.getTimeG4 ? this.$store.getters.getTimeG4.replace(":", "") : this.$store.getters.getTimeG4
        const oraInizioAttMattino = this.$store.getters.getTimeA1 ? this.$store.getters.getTimeA1.replace(":", "") : this.$store.getters.getTimeA1
        const oraFineAttMattino = this.$store.getters.getTimeA2 ? this.$store.getters.getTimeA2.replace(":", "") : this.$store.getters.getTimeA2
        const oraInizioAttPomeriggio = this.$store.getters.getTimeA3 ? this.$store.getters.getTimeA3.replace(":", "") : this.$store.getters.getTimeA3
        const oraFineAttPomeriggio = this.$store.getters.getTimeA4 ? this.$store.getters.getTimeA4.replace(":", "") : this.$store.getters.getTimeA4
        const cau = this.$store.getters.getCausale
        const causale = cau ? (cau.substr(0, cau.indexOf('-'))).trim() : cau
        const cl = this.$store.getters.getCdl
        const cdl = cl ? (cl.substr(0, cl.indexOf('-'))).trim() : cl
        const cc = this.$store.getters.getCdc
        const cdc = cc ? (cc.substr(0, cc.indexOf('-'))).trim() : cc
        const orari = {
          oraInizioMattino,
          oraFineMattino,
          oraInizioPomeriggio,
          oraFinePomeriggio,
          oraInizioAttMattino,
          oraFineAttMattino,
          oraInizioAttPomeriggio,
          oraFineAttPomeriggio
        }
        axios.post('/movimento/lavorazione/'  + this.$store.getters.getDipendente, {
          numeroMovimento,
          commessa: this.$store.getters.getCommessa,
          nota: this.$store.getters.getNota,
          causale,
          cdl,
          cdc,
          data,
          posizione: this.$store.getters.getPosizione,
          buono: this.$store.getters.getBuono,
          tempo: this.$store.getters.getTempo,
          orari,
          notaSpese: this.$store.getters.getNotaSpese,
          notaLista: this.$store.getters.getNotaLista,
          keyRdARapportino: this.$store.getters.getNrRapportino
        }).then(res => {
          // eslint-disable-next-line
          console.log(res)
          // Update lista mov
          const newDatabean = res.data
          this.$store.dispatch("addNewDataBean", newDatabean)
          // manipolo l'history per evitare che il back faccia tornare su "nuovo movimento"
          history.replaceState({}, "movimenti", "movimenti")
          if (!numeroMovimento)
            // se è un'aggiunta prendo l'ultimo numero movimento
            numeroMovimento = newDatabean.movimenti[newDatabean.movimenti.length - 1].numeroMovimento
          this.attendereDialog = false
          this.$router.push({
            name: 'movimento',
            params: {
              id: numeroMovimento 
            }
          })
        }).catch(error => {
          this.attendereDialog = false
          // eslint-disable-next-line
          console.log(error)
          this.$store.dispatch('handleError', error.response.data)
        })
      }
    },
    setNrRapportino(payload) {
      this.$store.dispatch("setNrRapportino", {
        dataMovimento: this.$store.getters.getData,
        numeroMovimento: payload.numeroMovimento,
        nrRapportino: payload.numeroRapportino
      })
      // TODO understand how to avoid this
      // I was forced to reload the data otherwise the nrRapportino input field does not update
      this.fetchMovimento()
    },
    checkBuono() {
      if (!this.$store.getters.isNewMov || !this.buono)
        return
      this.attendereDialog = true
      axios.get('/distinta/tecnica/nodo/buono/' + this.buono).then(res => {
        // eslint-disable-next-line
        console.log(res)
        this.attendereDialog = false
        this.$store.commit('setCommessa', res.data.codiceCommessa)
        this.$store.commit('setPosizione', res.data.posizione)
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.attendereDialog = false
        this.buono = this.buono + " !"
      })
    }
  }
}
</script>

<style>
.subtitle {
  height:10px;
}
</style>