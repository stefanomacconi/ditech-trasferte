<template>
    <div>
        <toolbar></toolbar>
        <v-alert type="error" :value="true">ERROR {{ code }} : {{ status }}</v-alert>
        <v-container fluid grid-list-md>
            <v-card color="red lighten-5">
                <v-card-title><span class="grey--text">Messaggio di Errore</span></v-card-title>
                <v-card-text>{{ developerMessage }}</v-card-text>
            </v-card>
        </v-container>
        <v-expansion-panel>
            <v-expansion-panel-content>
            <div slot="header">Dettagli aggiuntivi</div>
            <v-card>
                <v-card-text>{{ message }}</v-card-text>
            </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
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

