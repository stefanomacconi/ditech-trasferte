<template>
  <v-app> <!-- dark -->
    <!-- Aggiungo :key per rinfrescare il componente quando pusho sulla stessa route -->
    <router-view :key="$route.fullPath" name="toolbar"></router-view>
      <v-content> <!-- style="background-color: #E3F2FD;" #f2f2f2 -->
        <v-container fluid>
         <router-view :key="$route.fullPath"></router-view>
        </v-container>
      </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
}
</script>