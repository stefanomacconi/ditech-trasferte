<template>
  <v-app> <!-- dark -->
    <!-- Aggiungo :key per rinfrescare il componente quando pusho sulla stessa route -->
    <router-view :key="$route.fullPath" name="toolbar"></router-view>
      <v-content> <!-- style="background-color: #E3F2FD;" #f2f2f2 -->
        <v-container fluid>
         <router-view :key="$route.fullPath"></router-view>
        </v-container>
      </v-content>
    <wait-dialog v-if="waitDialogVisible"></wait-dialog>
  </v-app>
</template>

<script>
const WaitDialog = () => import ('./components/WaitDialog')

export default {
  name: "App",
  components: {
    WaitDialog
  },
  computed: {
    waitDialogVisible() {
      return this.$store.getters.getWaitDialogVisible
    }
  }
}
</script>