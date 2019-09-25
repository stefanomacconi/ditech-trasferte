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
    <!-- ATTENDERE DIALOG -->
    <wait-dialog :visibile="this.dialog"></wait-dialog>
  </div>
</template>

<script>
import WaitDialog from './WaitDialog.vue'

export default {
  data: () => ({
    utente: "",
    password: "",
    dialog: false
  }),
  components: {
    WaitDialog
  },
  methods: {
    clear() {
      this.$refs.form.reset()
    },
    login() {
      if (this.$refs.form.validate()) {
        this.dialog = true
        const formData = {
          utente: this.utente,
          password: this.password
        }
        // eslint-disable-next-line
        //console.log(formData)
        this.$store.dispatch('login', {
          utente: formData.utente,
          password: formData.password
        })
      }
    },
    changepwd() {
      //this.$store.dispatch('logout')
    }
  }
}
</script>