<template>
    <div>
        <v-toolbar color='primary' dark scroll-off-screen app clipped-right>
        <v-icon dark @click="goBack">close</v-icon>
        &nbsp;&nbsp;&nbsp;
        <v-toolbar-title>Ricerca materiale</v-toolbar-title>            
        </v-toolbar>
    </div>
</template>
<script>
export default {
    methods: {
        goBack() {
            //window.history.back()
            //this.asyncClear()
          this.$router.push({ name: 'movimento', 
                          params: { id: this.$store.getters.getNumeroMovCorrente } 
                        });
        }
    }  
}
</script>