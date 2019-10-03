<template>
  <div>
    <br>
    <v-form ref="form" @submit.prevent="login">
      <v-text-field v-model="utente" id="utente" 
        label="Utente" prepend-icon="person" required
        :rules="[v => !!v || 'Campo Utente obbligatorio']">
      </v-text-field>
      <v-text-field v-model="password" id="password" 
        label="Password" type="password" prepend-icon="vpn_key" required 
        :rules="[v => !!v || 'Campo Password obbligatorio']">
      </v-text-field>
      <br>
      <v-btn type='submit' color="primary">Login</v-btn>
      <v-btn color="secondary" @click.prevent="clear">Cancella</v-btn>
    </v-form>
    <br>
    <!-- CAMBIA PSW -->
    <v-btn to="/ChangePwd">Cambia password</v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    utente: "",
    password: "",
    dialog: false
  }),
  methods: {
    clear() {
      this.$refs.form.reset()
    },
    login() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('showWaitDialog')
        const formData = {
          utente: this.utente,
          password: this.password
        }
        this.$store.dispatch('login', {
          utente: formData.utente,
          password: formData.password
        }).then(() => {
          this.$store.dispatch('hideWaitDialog')
        })
      }
    }
  }
}
</script>