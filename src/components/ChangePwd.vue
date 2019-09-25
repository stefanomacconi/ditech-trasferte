<template>
  <div>
    <br>
    <v-form ref="form" @submit.prevent="changePwd">
      <v-card>
        <!-- <span class="headline">Modifica Password</span> 
        <v-card-title></v-card-title>
        -->
        <v-card-text>
          <p class="headline">Modifica Password</p>
          <p>La password deve iniziare con una lettera, seguita da una combinazione di questi caratteri: 0-9, A-Z, §, $, £, _<br>
          La lunghezza deve essere compresa tra 8 e 10 caratteri e non deve essere uguale a una delle ultime utilizzate.</p>
        </v-card-text>
      </v-card>
      <v-text-field v-model="utente" id="utente" 
        label="Utente" prepend-icon="person" required
        :rules="[v => !!v || 'Campo Utente obbligatorio']">
      </v-text-field>
      <v-text-field v-model="oldpassword" id="oldpassword" 
        label="Vecchia Password" type="password" prepend-icon="vpn_key" required 
        :rules="[v => !!v || 'Campo Vecchia Password obbligatorio']">
      </v-text-field>
      <v-text-field v-model="newpassword" id="newpassword" 
        label="Nuova Password" type="password" prepend-icon="vpn_key" required 
        :rules="this.pswRules">
      </v-text-field>
      <v-text-field v-model="newpasswordretyped" id="newpasswordretyped" 
        label="Ripeti Nuova Password" type="password" prepend-icon="vpn_key" required 
        :rules="[
        v => !!v || 'Campo Nuova Password obbligatorio',
        () => (this.newpassword === this.newpasswordretyped) || 'Le password non coincidono'
        ]">
      </v-text-field>
      <br>
      <v-btn type='submit' color="primary">Conferma</v-btn>
      <v-btn color="secondary" @click.prevent="clear">Cancella</v-btn>
    </v-form>
    <br>
    <div class="text-center">
      <v-dialog v-model="attendereDialog" persistent width="300" >
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
import axios from "axios"
import router from '../router'
const qs = require('querystring')

export default {
  data: () => ({
    utente: "",
    oldpassword: "",
    newpassword: "",
    newpasswordretyped: "",
    dialog: false,
    attendereDialog : false,
    pswRules: [
      (v) => {
        if (!v)
          return "Campo Nuova Password obbligatorio"
        else {
          if (v.length < 8)
            return "Minimo 8 caratteri"
          else 
            return true
        }
      }    
    ]
  }),
  methods: {
    clear() {
      this.$refs.form.reset()
    },
    changePwd() {
      if (this.$refs.form.validate()) {
        this.attendereDialog = true
        const formData = {
          utente: this.utente,
          oldpassword: this.oldpassword,
          newpassword: this.newpassword,
          newpasswordretyped: this.newpasswordretyped
        }
        //
        axios.post('/changePassword', qs.stringify(formData)
        ).then(res => {
          // eslint-disable-next-line
          console.log(res)
          this.attendereDialog = false
          router.replace('/login')
          //this.$store.dispatch('logout')

        }).catch(error => {
          // eslint-disable-next-line
          console.log(error)
          this.attendereDialog = false
          this.$store.dispatch('handleError', error.response.data)
        })
      }
    }
  },
  computed: {
    passwordConfirmationRule() {
      return () => (this.password === this.rePassword) || 'Le password non coincidono'
    }
  }
}
</script>