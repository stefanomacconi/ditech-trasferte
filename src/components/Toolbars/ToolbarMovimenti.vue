<template>
  <div>
    <v-toolbar color='primary' dark scroll-off-screen app clipped-right>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title @click="scrollTop">
        DiTech - Movimenti
        <v-divider light vertical></v-divider>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- v-if="this.$store.getters.getMovimentiSelezionati.length >= 1" -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"
              @click="copyMovs">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </template>
          <span>Copia movimenti</span>
        </v-tooltip>        
        <!-- TODO 
        <v-btn icon 
          v-if="this.$store.getters.getMovimentiSelezionati.length > 1"
          @click="linkMovs()">
          <v-icon>link</v-icon>
        </v-btn>
        -->
        <!--<v-divider dark vertical></v-divider>-->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"
              @click="dateMenu = true">
            <v-icon>event</v-icon>
          </v-btn>
          </template>
          <span>Scegli data</span>
        </v-tooltip>        
        <!--<v-divider dark vertical></v-divider>-->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"
             @click="showSearchMov">
          <v-icon>search</v-icon>
          </v-btn>
          </template>
          <span>Cerca movimenti</span>
        </v-tooltip>        

      </v-toolbar-items>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-divider dark vertical></v-divider>
        <v-btn @click="logout" flat>
          <v-icon left>{{ menuLogout.icon }}</v-icon>
          {{ menuLogout.title }}
        </v-btn>
      </v-toolbar-items>
      <!-- <v-menu right bottom origin="bottom right" transition="v-scale-transition">
        <v-btn dark icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list dense class="pt-0">
          <v-list-tile v-for="menu in menus" :key="menu.title" :to="menu.to">
            <v-list-tile-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu> -->
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            {{ utente + " - " + siglaDitta + " - " +  dipendente }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <!-- Menu Link -->
      <v-list dense class="pt-0">
        <v-list-tile v-for="menu in menusLink" :key="menu.title" :to="menu.to">
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Menu Fun -->
        <v-list-tile @click="showSearchMov">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Cerca Movimento</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="more">
          <v-list-tile-action>
            <v-icon>get_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Scarica più Movimenti</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider dark></v-divider>
        <v-list-tile @click="about">
          <v-list-tile-action>
            <v-icon>star</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Informazioni</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider dark></v-divider>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>{{ menuLogout.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menuLogout.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- Date Menu -->
    <v-menu ref="dateMenu" :close-on-content-click="false" reactive v-model="dateMenu" :nudge-right="40"
      :return-value.sync="date" lazy transition="scale-transition" offset-y full-width
      max-width="290px" min-width="290px">
      <!--  -->
      <v-date-picker :event-color="functionEventsColor" :events="functionEvents" v-model="date" 
        :allowed-dates="allowedDates" no-title show-current locale="it-IT">
        <v-spacer></v-spacer>
        <!-- <v-btn flat color="secondary" @click="dateMenu = false">Chiudi</v-btn> -->
        <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn> <!-- ; scrollTop() -->
      </v-date-picker>
    </v-menu>
    <!-- MOV FILTER DIALOG --> 
    <v-layout row justify-center>
      <v-dialog v-model="movFilterDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="movFilterDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Ricerca Movimento</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6 md6 lg6>
                  <v-menu ref="menuDataDaPerMov" :close-on-content-click="true" v-model="menuDataDaPerMov" :nudge-right="40" 
                    lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                    <v-text-field slot="activator" v-model="dataDaPerMovFormatted" label="Da (Data)" 
                      prepend-icon="event" @blur="dataDaPerMov = parseDate(dataDaPerMovFormatted)" required>
                    </v-text-field>
                    <v-date-picker v-model="dataDaPerMov" :allowed-dates="allowedDates" no-title locale="it-IT">
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6 md6 lg6>
                  <v-menu ref="menuDataAPerMov" :close-on-content-click="true" v-model="menuDataAPerMov" :nudge-right="40" 
                    lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                    <v-text-field slot="activator" v-model="dataAPerMovFormatted" label="A (Data)" 
                      prepend-icon="event" @blur="dataAPerMov = parseDate(dataAPerMovFormatted)" required>
                    </v-text-field>
                    <v-date-picker v-model="dataAPerMov" :allowed-dates="allowedDatesA" no-title locale="it-IT">
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6 md6 lg6>
                  <v-text-field v-model="commessaPerMov" label="Commessa" hint="Codice Commessa">
                  </v-text-field>
                </v-flex>
                <v-flex xs6 md6 lg6>
                  <v-text-field v-model="posizionePerMov" label="Posizione" type="number" hint="Posizione">
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea rows="3" v-model="notaPerMov" prepend-icon="notes" label="Nota">
                  </v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="clearFilterSearchMov">Pulisci</v-btn>
            <v-btn color="primary" flat @click="searchMov">Cerca</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- MOV LIST DIALOG -->
    <v-layout row justify-center>
      <v-dialog v-model="listaMovsDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="listaMovsDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Movimenti Trovati</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title v-if="listaMovs.length > 29" slot="extension" class="yellow--text text--lighten-3">
              <small>* Risultato Incompleto</small>
            </v-toolbar-title>
            <v-toolbar-title v-if="listaMovs.length == 0" slot="extension" class="red--text text--lighten-3">
              <small>* Nessun Movimento Trovato</small>
            </v-toolbar-title>
          </v-toolbar>
          <v-list two-line>
            <template v-for="(movimento, index) in listaMovs">
              <v-list-tile :key="movimento.numeroMovimento" avatar ripple 
                @click="chooseMov(movimento.numeroMovimento, movimento.definitivo)">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <b>{{ movimento.commessa }}</b>
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">
                    {{ movimento.descrizioneCommessa }}
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{ movimento.nota }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>
                    &nbsp;&nbsp;
                    {{ moment(movimento.data).locale('it').format('DD/MM/YYYY').toUpperCase() }}
                  </v-list-tile-action-text>
                  <v-list-tile-action-text>
                    <strong>
                      {{ moment.utc(moment.duration(movimento.tempo,"h").asMilliseconds()).format("HH[h] mm[min]") }}
                    </strong>
                  </v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < listaMovs.length" :key="index"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- parametri copia movimenti -->
    <!-- -->
    <v-layout row justify-center>
      <copia-mov-param :visible="this.copiaMovDialog" @onClose="closeDialogCopiaMov"></copia-mov-param>
    </v-layout>
    <!-- -->
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import CopiaMovParam from "../Movimento/CopiaMovParam";

export default {
  components: {
    CopiaMovParam
  },  
  data: (vm) => ({
    copiaMovDialog: false,
    dateMenu: false,
    menuDataDaPerMov: false,
    dataDaPerMov: new Date().toISOString().substr(0, 10),
    dataDaPerMovFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dataDaPerMovFormattedDefault: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menuDataAPerMov: false,
    dataAPerMov: new Date().toISOString().substr(0, 10),
    dataAPerMovFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dataAPerMovFormattedDefault: vm.formatDate(new Date().toISOString().substr(0, 10)),
    drawer: false,
    menusLink: [{
      title: "Nuovo Movimento",
      to: "/movimento",
      icon: "add"
    }],
    menuLogout: {
      title: "Logout",
      icon: "lock"
    },
    movFilterDialog : false,
    listaMovsDialog : false,
    commessaPerMov: "",
    posizionePerMov: "",
    notaPerMov: "",
    listaMovs: [],
    tzoffset: (new Date()).getTimezoneOffset() * 60000 //offset in milliseconds
  }),
  computed: {
    utente() {
      return this.$store.getters.getUtente
    },
    siglaDitta() {
      return this.$store.getters.getSiglaDitta
    },
    dipendente() {
      return this.$store.getters.getDipendente
    },
    date: {
      get() {
        return new Date(this.$store.getters.getPickedData - this.tzoffset).toISOString().substr(0, 10)
      },
      set(value) {
        this.$store.dispatch('setPickedData', moment(value).valueOf())
      }
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    functionEvents(date) {
      const warningDate = this.$store.getters.getGiorniWarning
      const errorDate = this.$store.getters.getGiorniError
      const ms = moment(date).valueOf()
      if (warningDate.includes(ms) || errorDate.includes(ms))
        return true
      else
        return false
    },
    functionEventsColor(date) {
      const warningDate = this.$store.getters.getGiorniWarning
      const errorDate = this.$store.getters.getGiorniError
      const ms = moment(date).valueOf()
      if (warningDate.includes(ms))
        return "yellow" 
      if (errorDate.includes(ms))
        return "red"
    },
    allowedDates: val => val <= new Date().toISOString().substr(0, 10),
    allowedDatesA(val) {
      return (val >= this.dataDaPerMov) && (val <= new Date().toISOString().substr(0, 10))
    }, 
    showSearchMov() {
      this.drawer = false
      this.movFilterDialog = true
    },
    searchMov() {
      this.movFilterDialog = false
      this.$store.dispatch('showWaitDialog')
      const da = moment(this.dataDaPerMovFormatted, "DD/MM/YYYY").valueOf()
      const a = moment(this.dataAPerMovFormatted, "DD/MM/YYYY").valueOf()
      let posizione = null
      if (this.posizionePerMov)
        posizione = this.posizionePerMov
      axios.get('/movimento/lavorazione/ricerca/' + this.dipendente, {
        params: {
          commessa: this.commessaPerMov,
          posizione,
          da,
          a,
          nota: this.notaPerMov
        }
      }).then(res => {
        // eslint-disable-next-line
        console.log(res)
        this.$store.dispatch('hideWaitDialog')
        this.listaMovs = res.data
        this.listaMovsDialog = true
      }).catch(error => {
        // eslint-disable-next-line
        console.log(error)
        this.$store.dispatch('handleError', error.response.data)
      })
    },
    scrollTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    more() {
      this.drawer = false
      this.$store.dispatch('showWaitDialog')
      this.$store.dispatch('incrementOffset')
      this.$store.dispatch('fetchMovimenti', this.$store.getters.getOffset).then(() => {
        this.$store.dispatch('hideWaitDialog')
      })
      // TODO refresh view altrimenti si hanno problemi con i movimenti a metà della prima GET
      // questo non funziona
    },
    about() {
      this.$router.push({
        name: 'about'
      })
    },
    parseDate(date) {
      if (!date) 
        return null
      const [month, day, year] = date.split('/')
      return `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')}`
    },
    formatDate(date) {
      if (!date) 
        return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    chooseMov(numeroMov, definitivo) {
      this.$router.push({ name: 'movimento', params: { id: numeroMov, definitivo }})
    },
    clearFilterSearchMov() {
      this.menuDataDaPerMov = false
      this.dataDaPerMov = new Date().toISOString().substr(0, 10)
      this.dataDaPerMovFormatted = this.dataDaPerMovFormattedDefault
      this.menuDataAPerMov = false
      this.dataAPerMov = new Date().toISOString().substr(0, 10)
      this.dataAPerMovFormatted = this.dataAPerMovFormattedDefault
      this.commessaPerMov = ""
      this.posizionePerMov = ""
      this.notaPerMov = ""
    },
    linkMovs() {
      //gestire selezione più movimenti da mettere in un rapportino
      // eslint-disable-next-line
      console.log("TODO linkMovs()")
      // const selectedMovs = this.$store.getters.getMovimentiSelezionati
      // TODO chiamata rest
      // this.$store.dispatch("clearMovimentiSelezionati")
    },
    closeDialogCopiaMov() {
      this.copiaMovDialog = false;
    },
    copyMovs() {
      if (!this.$store.getters.getMovimentiSelezionati || this.$store.getters.getMovimentiSelezionati.length < 1) {
        alert("Selezionare dei movimenti con i pallini sulla sinistra");
        return;
      }
      this.copiaMovDialog = true;
    }
  },
  watch: {
    dataDaPerMov () {
      this.dataDaPerMovFormatted = this.formatDate(this.dataDaPerMov)
    },
    dataAPerMov () {
      this.dataAPerMovFormatted = this.formatDate(this.dataAPerMov)
    }
  }
}
</script>