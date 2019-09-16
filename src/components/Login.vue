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
    <!-- @click="changepwd" -->
    <v-btn to="/ChangePwd">Cambia password</v-btn>
    <div class="text-xs-center">
      <v-dialog v-model="dialog" persistent width="300" >
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