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
      <v-menu bottom left class="hidden-md-and-up">
        <v-btn slot="activator" dark icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list dense class="pt-0 bg-white">
          <v-list-tile :to="menuLogin.to">
            <v-list-tile-action>
              <v-icon>{{ menuLogin.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ menuLogin.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    menuLogin: {
      title: "Sign In",
      to: "/login",
      icon: "person"
    }
  })
}
</script>