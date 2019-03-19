<template>
  <div>
    <v-toolbar color='primary' dark app clipped-right>
      <v-icon dark>work_outline</v-icon>
      &nbsp;&nbsp;&nbsp;
      <v-toolbar-title>
        DiTech Trasferte
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn :to="menuLogin.to" flat>
          <v-icon left>{{ menuLogin.icon }}</v-icon>
          {{ menuLogin.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    menuLogin : {title: "Sign In", to: "/login", icon: "person"},
  })
}
</script>